import "server-only";
import { connection } from "next/server";
import { sampleTalk } from "@/entities/talk/sample";
import { isListed } from "@/entities/talk/visibility";
import { listTalks, toPublicTalk } from "@/server/store";
import { sortTalks } from "./sortTalks";

/** 갤러리에 보일 나레이션: 공개로 만든 것 중 목소리까지 완성된 것만 좋아요 순 */
export async function getGalleryTalks() {
  // 빌드 때 고정되지 않게: 새로 만든 나레이션이 바로 보여야 한다
  await connection();
  // 웹툰은 목소리를 만들지 않으니 그림 칸이 있으면 완성으로 본다
  const ready = (t: { voiced: boolean; format?: string }) => t.voiced || t.format === "webtoon";
  const listable = (await listTalks()).filter((t) => ready(t) && isListed(t));
  const talks = sortTalks(listable).map((t) => toPublicTalk(t));
  if (talks.length > 0) return talks;
  // 아직 아무도 만들지 않았을 때만 예시 나레이션을 보여준다 (예시는 녹음된 목소리가 없다)
  return [{ ...sampleTalk, likes: 0, voiced: true, createdAt: new Date(0).toISOString() }];
}
