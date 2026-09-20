import { orderBy } from "es-toolkit";

type Sortable = { likes: number; createdAt: string };

/** 좋아요 많은 순, 같으면 최신 순 */
export function sortTalks<T extends Sortable>(talks: T[]): T[] {
  return orderBy(talks, ["likes", "createdAt"], ["desc", "desc"]);
}
