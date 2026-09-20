import { connection } from "next/server";
import { dbEnabled } from "@/server/db";
import { elevenLabsEnabled } from "@/server/elevenlabs";
import { listTalks } from "@/server/store";
import { supabaseEnabled } from "@/server/supabase";

/**
 * 배포가 제대로 됐는지 한눈에 보는 곳. 키 값은 절대 내보내지 않고 "있다/없다"만 알린다.
 * 예: { "저장소": "postgres", "나레이션": 7 } 이면 DB 까지 잘 붙은 것이다.
 */
export async function GET() {
  await connection();
  const store = supabaseEnabled ? "supabase" : dbEnabled ? "postgres" : "local";
  const talks = await listTalks()
    .then((list) => list.length)
    .catch((e) => `읽지 못함: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);

  return Response.json({
    저장소: store,
    나레이션: talks,
    글쓰기: Boolean(process.env.OPENAI_API_KEY),
    목소리: elevenLabsEnabled ? "elevenlabs" : "openai",
    표지그림: Boolean(process.env.OPENAI_API_KEY) && process.env.COVER_IMAGE !== "off",
    주소: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  });
}
