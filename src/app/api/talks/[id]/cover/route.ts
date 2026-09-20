import { facePrompt } from "@/server/cover/face";
import { generateImage } from "@/server/cover/image";
import { coverPrompt } from "@/server/cover/prompt";
import { coverScene } from "@/server/cover/scene";
import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { getTalk, type StoredTalk, saveCover, saveFace, updateTalk } from "@/server/store";

export const maxDuration = 120;

type Drawn = { coverUrl?: string; avatarUrl?: string };

/** 표지와 화자 얼굴 중 없는 것만 그려서 저장한다 */
async function draw(talk: StoredTalk, needs: { cover: boolean; face: boolean }): Promise<Drawn | null> {
  const scene = needs.cover ? await coverScene(talk) : null;
  const [poster, face] = await Promise.all([
    needs.cover ? generateImage(coverPrompt(talk, scene)) : null,
    needs.face ? generateImage(facePrompt(talk), "face") : null,
  ]);
  if (needs.cover && !poster) return null;
  return {
    coverUrl: poster ? await saveCover(talk.id, poster) : undefined,
    avatarUrl: face ? await saveFace(talk.id, face) : undefined,
  };
}

/**
 * 나레이션에 어울리는 표지 그림과, 사진을 올리지 않은 사람의 화자 얼굴을 AI 가 그려 붙인다.
 * 둘 다 없어도 나레이션은 그대로 재생된다. ?force=1 이면 이미 있어도 다시 그린다.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/talks/[id]/cover">) {
  const { id } = await ctx.params;
  const talk = await getTalk(id);
  if (!talk) return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });

  const again = new URL(request.url).searchParams.get("force") === "1";
  const needs = { cover: again || !talk.coverUrl, face: again || !talk.author.avatarUrl };
  const has = { coverUrl: talk.coverUrl, avatarUrl: talk.author.avatarUrl };
  if (!needs.cover && !needs.face) return Response.json(has);
  // 예전 나레이션 그림을 한 번에 채워 넣을 때가 있어 조금 넉넉하게 둔다
  if (!allow(`cover:${clientIp(request)}`, 30, 10 * 60_000)) return tooMany();

  const drawn = await draw(talk, needs);
  if (!drawn) return Response.json({ error: "표지를 그리지 못했어요" }, { status: 502 });

  const coverUrl = drawn.coverUrl ?? has.coverUrl;
  const avatarUrl = drawn.avatarUrl ?? has.avatarUrl;
  await updateTalk(id, (latest) => ({
    coverUrl,
    ...(drawn.avatarUrl ? { author: { ...latest.author, avatarUrl } } : {}),
  }));
  return Response.json({ coverUrl, avatarUrl });
}
