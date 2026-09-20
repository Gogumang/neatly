import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { getTalk } from "@/server/store";
import { checkPassword, passCookie } from "@/server/talkPass";

// 비밀번호로 잠긴 나레이션 열기. 맞으면 그 나레이션에만 쓰이는 httpOnly 쿠키를 굽는다

export async function POST(request: Request, ctx: RouteContext<"/api/talks/[id]/unlock">) {
  const { id } = await ctx.params;
  // 무차별 대입 막기
  if (!allow(`unlock:${id}:${clientIp(request)}`, 10, 10 * 60_000)) return tooMany();

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const talk = await getTalk(id);
  if (!talk?.pass) return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });
  if (!checkPassword(talk.pass, password)) return Response.json({ error: "비밀번호가 달라요" }, { status: 401 });

  return Response.json({ ok: true }, { headers: { "set-cookie": passCookie(id, talk.pass) } });
}
