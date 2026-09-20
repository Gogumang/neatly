import type { NextRequest } from "next/server";
import { findTalk } from "@/features/share/findTalk";
import { isThumbnailSize, talkThumbnailImage } from "@/features/share/thumbnailImage";

// 목록에 쓰는 나레이션 썸네일. ?size=card(4:5, 제목 포함) | row(정사각) | art(세로, 글자 없음)
export async function GET(request: NextRequest, ctx: RouteContext<"/talks/[id]/thumbnail">) {
  const size = request.nextUrl.searchParams.get("size") ?? "card";
  if (!isThumbnailSize(size)) return new Response("size 는 card, row, art 중 하나", { status: 400 });

  const { id } = await ctx.params;
  const talk = await findTalk(id);
  if (!talk) return new Response("없는 나레이션", { status: 404 });
  return talkThumbnailImage(talk, size);
}
