// 공유 미리보기에 쓸 절대 주소의 기준. 배포할 땐 NEXT_PUBLIC_SITE_URL 로 정한다
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
