import { describe, expect, it } from "vitest";
import type { Segment } from "./model";
import { SCENE_GAP, segmentStarts } from "./timeline";

const seg = (patch: Partial<Segment>): Segment => ({
  id: "s",
  text: "가".repeat(20),
  template: { type: "keywords", keywords: [] },
  ...patch,
});

describe("segmentStarts", () => {
  it("나레이션 길이 + 장면 사이 간격을 쌓는다", () => {
    const starts = segmentStarts([seg({ duration: 2 }), seg({ duration: 3 }), seg({ duration: 1 })]);
    expect(starts).toEqual([0, 2 + SCENE_GAP, 5 + 2 * SCENE_GAP]);
  });

  it("길이가 없으면 마지막 단어 끝, 그것도 없으면 글자 수로 어림", () => {
    const starts = segmentStarts([seg({ words: [{ text: "a", start: 0, end: 1.5 }] }), seg({}), seg({})]);
    expect(starts[1]).toBeCloseTo(1.5 + SCENE_GAP);
    expect(starts[2]).toBeCloseTo(1.5 + SCENE_GAP + (20 * 0.11 + 0.8) + SCENE_GAP);
  });
});
