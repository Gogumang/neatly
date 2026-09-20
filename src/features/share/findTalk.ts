import "server-only";
import type { Talk } from "@/entities/talk/model";
import { sampleTalk } from "@/entities/talk/sample";
import { isLocked } from "@/entities/talk/visibility";
import { getTalk, toPublicTalk } from "@/server/store";

/**
 * 공유 미리보기용 나레이션 조회. 예시 나레이션 포함, 없으면 null.
 * 비공개(비밀번호) 나레이션은 제목만 알려 준다 — 내용 요약은 빼고.
 */
export async function findTalk(id: string): Promise<Talk | null> {
  if (id === sampleTalk.id) return sampleTalk;
  const stored = await getTalk(id);
  if (!stored) return null;
  const talk = toPublicTalk(stored);
  // 비공개 나레이션은 링크 미리보기에 제목만 나온다
  return isLocked(stored) ? { ...talk, summary: "" } : talk;
}
