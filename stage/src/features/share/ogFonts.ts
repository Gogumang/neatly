import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Pretendard v1.3.9 (SIL OFL 1.1, public/fonts/og/LICENSE.txt)
// 출처: https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/
// 앱 폰트(Toss Product Sans)는 woff2 조각뿐이라 이미지 생성기(Satori)가 읽지 못한다
const dir = join(process.cwd(), "public/fonts/og");
const [bold, medium] = await Promise.all([
  readFile(join(dir, "Pretendard-Bold.otf")),
  readFile(join(dir, "Pretendard-Medium.otf")),
]);

export const ogFonts = [
  { name: "Pretendard", data: bold, weight: 700, style: "normal" },
  { name: "Pretendard", data: medium, weight: 500, style: "normal" },
] as const;
