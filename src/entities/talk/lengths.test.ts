import { describe, expect, it } from "vitest";
import { DEFAULT_LENGTH, isLengthId, LENGTHS, lengthOf } from "./lengths";

describe("LENGTHS", () => {
  it("길이 목록은 비어 있지 않다", () => {
    expect(LENGTHS.length).toBeGreaterThan(0);
  });

  it("길이 id 는 겹치지 않는다", () => {
    const ids = LENGTHS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("기본 길이는 목록에 있다", () => {
    expect(LENGTHS.some((l) => l.id === DEFAULT_LENGTH)).toBe(true);
  });

  it.each(LENGTHS.map((l) => [l.id, l] as const))("%s 는 이름·장면수·설명이 비어 있지 않다", (_id, length) => {
    expect(length.name.trim()).not.toBe("");
    expect(length.scenes.trim()).not.toBe("");
    expect(length.description.trim()).not.toBe("");
  });

  it.each(LENGTHS.map((l) => [l.id, l] as const))("%s 는 min <= max 다", (_id, length) => {
    expect(length.min).toBeLessThanOrEqual(length.max);
    expect(length.min).toBeGreaterThan(0);
  });

  it.each(LENGTHS.map((l) => [l.id, l] as const))("%s 의 장면수 문구는 min~max 와 맞는다", (_id, length) => {
    expect(length.scenes).toContain(`${length.min}~${length.max}`);
  });

  it("짧게 < 보통 < 자세히 순으로 장면 수가 늘어난다", () => {
    const [short, normal, long] = LENGTHS;
    expect(short.id).toBe("short");
    expect(normal.id).toBe("normal");
    expect(long.id).toBe("long");
    expect(short.max).toBeLessThan(normal.min);
    expect(normal.max).toBeLessThan(long.min);
  });
});

describe("isLengthId", () => {
  it.each(LENGTHS.map((l) => l.id))("목록에 있는 %s 는 길이 id 다", (id) => {
    expect(isLengthId(id)).toBe(true);
  });

  it.each([
    ["없는 id", "medium"],
    ["빈 문자열", ""],
    ["대문자", "SHORT"],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 9],
  ])("%s 는 길이 id 가 아니다", (_label, value) => {
    expect(isLengthId(value)).toBe(false);
  });
});

describe("lengthOf", () => {
  it.each(LENGTHS.map((l) => l.id))("%s 를 주면 그 길이를 돌려준다", (id) => {
    expect(lengthOf(id).id).toBe(id);
  });

  it.each([
    ["없는 id", "medium"],
    ["빈 문자열", ""],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 9],
  ])("%s 를 주면 기본 길이를 돌려준다", (_label, value) => {
    expect(lengthOf(value).id).toBe(DEFAULT_LENGTH);
  });
});
