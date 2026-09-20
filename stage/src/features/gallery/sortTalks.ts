type Sortable = { likes: number; createdAt: string };

/** 좋아요 많은 순, 같으면 최신 순 */
export function sortTalks<T extends Sortable>(talks: T[]): T[] {
  return [...talks].sort((a, b) => b.likes - a.likes || b.createdAt.localeCompare(a.createdAt));
}
