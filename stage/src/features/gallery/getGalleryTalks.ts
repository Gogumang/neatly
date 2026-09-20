import "server-only";
import { connection } from "next/server";
import { sampleTalk } from "@/entities/talk/sample";
import { listTalks, toPublicTalk } from "@/server/store";
import { sortTalks } from "./sortTalks";

/** 갤러리에 보일 나레이션: 목소리까지 완성된 것만 좋아요 순, 맨 끝에 예시 나레이션 */
export async function getGalleryTalks() {
  // 빌드 때 고정되지 않게: 새로 만든 나레이션이 바로 보여야 한다
  await connection();
  const talks = sortTalks((await listTalks()).filter((t) => t.voiced)).map(toPublicTalk);
  return [...talks, sampleTalk];
}
