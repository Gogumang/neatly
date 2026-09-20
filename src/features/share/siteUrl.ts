// 공유 미리보기에 쓸 절대 주소의 기준.
// NEXT_PUBLIC_SITE_URL 이 먼저고, 없으면 Vercel 이 넣어 주는 배포 주소를 쓴다.
const fromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || fromVercel || "http://localhost:3000");
