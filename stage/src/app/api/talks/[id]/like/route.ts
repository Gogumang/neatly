import { likeTalk } from "@/server/store";

export async function POST(_req: Request, ctx: RouteContext<"/api/talks/[id]/like">) {
  const { id } = await ctx.params;
  try {
    return Response.json({ likes: await likeTalk(id) });
  } catch {
    return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });
  }
}
