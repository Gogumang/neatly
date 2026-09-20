import "server-only";
import type { Talk } from "@/entities/talk/model";
import { sampleTalk } from "@/entities/talk/sample";
import { getTalk, toPublicTalk } from "@/server/store";

/** 공유 미리보기용 나레이션 조회. 예시 나레이션 포함, 없으면 null */
export async function findTalk(id: string): Promise<Talk | null> {
  if (id === sampleTalk.id) return sampleTalk;
  const stored = await getTalk(id);
  return stored && toPublicTalk(stored);
}
