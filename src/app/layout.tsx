import type { Metadata } from "next";
import "./fonts.css"; // scripts/download-fonts.mjs 가 만든다
import "./globals.css";
import { shareMetadata } from "@/features/share/shareMetadata";
import { siteUrl } from "@/features/share/siteUrl";

export const metadata: Metadata = {
  // 미리보기 이미지 등 상대 주소를 절대 주소로 바꿀 기준
  metadataBase: siteUrl,
  ...shareMetadata({
    title: "또박 — 글을 붙여넣으면 나레이션이 시작돼요",
    description: "AI로 문제를 해결한 이야기를 나레이션 나레이션으로 바꿔드려요",
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
