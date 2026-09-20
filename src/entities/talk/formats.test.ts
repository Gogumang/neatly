import { describe, expect, it } from "vitest";
import { DEFAULT_FORMAT, FORMATS, isFormatId } from "./formats";

describe("FORMATS", () => {
  it("형식 목록은 비어 있지 않다", () => {
    expect(FORMATS.length).toBeGreaterThan(0);
  });

  it("형식 id 는 겹치지 않는다", () => {
    const ids = FORMATS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 형식은 이름이 있다", () => {
    for (const format of FORMATS) {
      expect(format.name.trim()).not.toBe("");
    }
  });

  it("기본 형식은 목록에 있다", () => {
    expect(FORMATS.some((f) => f.id === DEFAULT_FORMAT)).toBe(true);
  });
});

describe("isFormatId", () => {
  it.each(FORMATS.map((f) => f.id))("목록에 있는 %s 는 형식 id 다", (id) => {
    expect(isFormatId(id)).toBe(true);
  });

  it.each([
    ["없는 id", "podcast"],
    ["빈 문자열", ""],
    ["대문자", "NARRATION"],
    ["앞뒤 공백", " narration "],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 0],
    ["객체", { id: "narration" }],
  ])("%s 는 형식 id 가 아니다", (_label, value) => {
    expect(isFormatId(value)).toBe(false);
  });
});
