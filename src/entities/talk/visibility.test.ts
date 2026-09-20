import { describe, expect, it } from "vitest";
import {
  DEFAULT_VISIBILITY,
  isListed,
  isLocked,
  isPassword,
  isVisibilityId,
  MAX_PASSWORD,
  VISIBILITIES,
} from "./visibility";

describe("VISIBILITIES", () => {
  it("공개 범위 id 는 겹치지 않는다", () => {
    const ids = VISIBILITIES.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("공개·비공개 두 가지가 있고 이름이 비어 있지 않다", () => {
    expect(VISIBILITIES.map((v) => v.id)).toEqual(["public", "private"]);
    for (const v of VISIBILITIES) expect(v.name.trim()).not.toBe("");
  });

  it("기본 공개 범위는 목록에 있고 공개다", () => {
    expect(VISIBILITIES.some((v) => v.id === DEFAULT_VISIBILITY)).toBe(true);
    expect(DEFAULT_VISIBILITY).toBe("public");
  });
});

describe("isVisibilityId", () => {
  it.each(VISIBILITIES.map((v) => v.id))("목록에 있는 %s 는 공개 범위 id 다", (id) => {
    expect(isVisibilityId(id)).toBe(true);
  });

  it.each([
    ["없는 id", "unlisted"],
    ["빈 문자열", ""],
    ["대문자", "PUBLIC"],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 0],
  ])("%s 는 공개 범위 id 가 아니다", (_label, value) => {
    expect(isVisibilityId(value)).toBe(false);
  });
});

describe("isLocked", () => {
  it("비공개이면서 비밀번호가 있을 때만 잠긴다", () => {
    expect(isLocked({ visibility: "private", pass: "1234" })).toBe(true);
  });

  it.each([
    ["공개", { visibility: "public", pass: "1234" }],
    ["값이 없는 예전 나레이션", {}],
    ["비공개인데 비밀번호가 없음", { visibility: "private" }],
    ["비공개인데 비밀번호가 빈 문자열", { visibility: "private", pass: "" }],
    ["비공개인데 비밀번호가 null", { visibility: "private", pass: null }],
    ["모르는 공개 범위", { visibility: "unlisted", pass: "1234" }],
  ])("%s 이면 잠기지 않는다", (_label, talk) => {
    expect(isLocked(talk)).toBe(false);
  });
});

describe("isListed", () => {
  it.each([
    ["공개", { visibility: "public" }],
    ["값이 없는 예전 나레이션", {}],
  ])("%s 는 목록에 들어간다", (_label, talk) => {
    expect(isListed(talk)).toBe(true);
  });

  it.each([
    ["잠긴 나레이션", { visibility: "private", pass: "1234" }],
    ["비밀번호가 없는 비공개", { visibility: "private" }],
  ])("%s 는 목록에서 빠진다", (_label, talk) => {
    expect(isListed(talk)).toBe(false);
  });

  it("잠기지 않았어도 비공개면 목록에 넣지 않는다", () => {
    const talk = { visibility: "private" };
    expect(isLocked(talk)).toBe(false);
    expect(isListed(talk)).toBe(false);
  });
});

describe("isPassword", () => {
  const 길이 = (n: number) => "a".repeat(n);

  it.each([4, 5, MAX_PASSWORD])("%i 자 비밀번호는 쓸 수 있다", (n) => {
    expect(isPassword(길이(n))).toBe(true);
  });

  it.each([0, 1, 3, MAX_PASSWORD + 1, 100])("%i 자 비밀번호는 쓸 수 없다", (n) => {
    expect(isPassword(길이(n))).toBe(false);
  });

  it("최대 길이는 20자다", () => {
    expect(MAX_PASSWORD).toBe(20);
  });

  it("공백도 글자로 세어 길이만 본다", () => {
    expect(isPassword("    ")).toBe(true);
  });
});
