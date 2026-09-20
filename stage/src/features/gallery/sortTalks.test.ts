import { describe, expect, it } from "vitest";
import { sortTalks } from "./sortTalks";

const talks = [
  { id: "a", likes: 3, createdAt: "2026-09-19T10:00:00Z" },
  { id: "b", likes: 10, createdAt: "2026-09-19T09:00:00Z" },
  { id: "c", likes: 3, createdAt: "2026-09-19T11:00:00Z" },
];

describe("sortTalks", () => {
  it("좋아요 많은 순, 같으면 최신이 먼저", () => {
    expect(sortTalks(talks).map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("원본 배열은 건드리지 않는다", () => {
    sortTalks(talks);
    expect(talks.map((t) => t.id)).toEqual(["a", "b", "c"]);
  });
});
