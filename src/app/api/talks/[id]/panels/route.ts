import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { getTalk, updateTalk } from "@/server/store";
import { drawPanels } from "@/server/webtoon/panels";

// 칸 수만큼 그림을 그리므로 표지보다 훨씬 오래 걸린다
export const maxDuration = 300;

/**
 * 장면마다 웹툰 칸 그림을 그려 붙인다. 한 칸이 실패해도 나머지는 그대로 저장한다.
 * ?force=1 이면 이미 그린 칸도 다시 그린다.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/talks/[id]/panels">) {
  const { id } = await ctx.params;
  const talk = await getTalk(id);
  if (!talk) return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });

  const again = new URL(request.url).searchParams.get("force") === "1";
  const targets = again ? talk.segments : talk.segments.filter((seg) => !seg.panelUrl);
  if (targets.length === 0) return Response.json({ ok: true });
  // 예전 나레이션에 칸을 한 번에 채워 넣을 때가 있어 조금 넉넉하게 둔다
  if (!allow(`panels:${clientIp(request)}`, 30, 10 * 60_000)) return tooMany();

  const drawn = await drawPanels(talk, targets);
  if (drawn.size === 0) return Response.json({ error: "웹툰 칸을 그리지 못했어요" }, { status: 502 });

  // 그리는 동안 목소리·수어가 먼저 저장됐을 수 있다. 최신 장면에 그림 주소만 얹는다
  await updateTalk(id, (latest) => ({
    segments: latest.segments.map((seg) => {
      const panelUrl = drawn.get(seg.id);
      return panelUrl ? { ...seg, panelUrl } : seg;
    }),
  }));
  return Response.json({ ok: true, drawn: drawn.size, total: targets.length });
}
