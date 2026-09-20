import { ShareCard } from "@/features/share/ShareCard";
import { shareImage } from "@/features/share/shareImage";

// 첫 화면 링크 미리보기 이미지
export const alt = "또박 — 글을 붙여넣으면 나레이션이 시작돼요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage(
    <ShareCard
      title="글을 붙여넣으면 나레이션이 시작돼요"
      author="AI로 문제를 해결한 이야기를 나레이션 나레이션으로"
      cover={{ kind: "gradient", background: "linear-gradient(160deg, #3182F6, #7B92E6)" }}
    />,
  );
}
