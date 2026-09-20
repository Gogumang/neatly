import type { Metadata } from "next";

/** 제목·설명을 링크 미리보기(OG·트위터 카드)에도 똑같이 쓴다. 이미지는 opengraph-image 파일이 채운다 */
export function shareMetadata({ title, description }: { title: string; description: string }): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, siteName: "또박", locale: "ko_KR", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
