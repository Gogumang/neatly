import { loadCoverImage } from "@/features/share/loadCoverImage";
import { ShareCard } from "@/features/share/ShareCard";
import { shareImage } from "@/features/share/shareImage";

// 첫 화면 링크 미리보기 이미지
export const alt = "또박 — 글을 붙여넣으면 나레이션이 시작돼요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRADIENT = { kind: "gradient", background: "linear-gradient(160deg, #3182F6, #7B92E6)" } as const;

export default async function Image() {
  // 오른쪽 자리는 예시 나레이션의 표지 그림으로 채운다 (못 읽으면 색면)
  const src = await loadCoverImage("/sample-cover.jpg");
  return shareImage(
    <ShareCard
      title="글을 붙여넣으면 나레이션이 시작돼요"
      author="읽히지 않던 글을, 보고 듣는 나레이션으로"
      cover={src ? { kind: "image", src } : GRADIENT}
    />,
  );
}
