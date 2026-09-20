import { notFound } from "next/navigation";
import { findTalk } from "@/features/share/findTalk";
import { talkShareImage } from "@/features/share/shareImage";

// 나레이션 링크를 공유할 때 보일 미리보기 이미지 (트위터 카드도 이걸 쓴다)
export const alt = "또박 나레이션";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const talk = await findTalk(id);
  if (!talk) notFound();
  return talkShareImage(talk);
}
