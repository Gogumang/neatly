import { plainText } from "@/entities/talk/emphasis";
import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { signGloss } from "@/server/sign/gloss";
import { getTalk, updateTalk } from "@/server/store";

export const maxDuration = 60;

/**
 * 장면마다 자막을 한국수어 어순 단어로 옮겨 붙인다. (수어 통역 영상이 아니라 어순 자막)
 * 목소리·표지와 함께 병렬로 불리므로, 저장할 때는 최신 장면에 sign 만 얹는다.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/talks/[id]/sign">) {
  const { id } = await ctx.params;
  const talk = await getTalk(id);
  if (!talk) return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });
  // ?force=1 은 수어 자막을 다시 만든다 (예전 나레이션에 채워 넣을 때 쓴다)
  const again = new URL(request.url).searchParams.get("force") === "1";
  const done = talk.segments.every((seg) => seg.sign?.length);
  if (done && !again) return Response.json({ ok: true });
  if (!allow(`sign:${clientIp(request)}`, 10, 10 * 60_000)) return tooMany();

  const gloss = await signGloss(talk.segments.map((seg) => ({ id: seg.id, text: plainText(seg.text) })));
  await updateTalk(id, (latest) => ({
    segments: latest.segments.map((seg) => ({ ...seg, sign: gloss.get(seg.id) ?? seg.sign })),
  }));
  return Response.json({ ok: true, signed: gloss.size, total: talk.segments.length });
}
