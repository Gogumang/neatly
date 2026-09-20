import { describe, expect, it } from "vitest";
import { DEFAULT_GENRE, GENRES, genreOf, isGenreId } from "./genres";

describe("GENRES", () => {
  it("장르 목록은 비어 있지 않다", () => {
    expect(GENRES.length).toBeGreaterThan(0);
  });

  it("장르 id 는 겹치지 않는다", () => {
    const ids = GENRES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("기본 장르는 목록에 있다", () => {
    expect(GENRES.some((g) => g.id === DEFAULT_GENRE)).toBe(true);
  });

  it.each(GENRES.map((g) => [g.id, g] as const))("%s 장르는 이름·흐름·질문·안내가 비어 있지 않다", (_id, genre) => {
    expect(genre.name.trim()).not.toBe("");
    expect(genre.flow.trim()).not.toBe("");
    expect(genre.question.trim()).not.toBe("");
    expect(genre.placeholder.trim()).not.toBe("");
  });

  it.each(GENRES.map((g) => [g.id, g.color] as const))("%s 장르 색은 6자리 hex 다", (_id, color) => {
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("장르마다 색이 다르다", () => {
    const colors = GENRES.map((g) => g.color);
    expect(new Set(colors).size).toBe(colors.length);
  });
});

describe("isGenreId", () => {
  it.each(GENRES.map((g) => g.id))("목록에 있는 %s 는 장르 id 다", (id) => {
    expect(isGenreId(id)).toBe(true);
  });

  it.each([
    ["없는 id", "essay"],
    ["빈 문자열", ""],
    ["대문자", "CASE"],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 1],
    ["객체", { id: "case" }],
  ])("%s 는 장르 id 가 아니다", (_label, value) => {
    expect(isGenreId(value)).toBe(false);
  });
});

describe("genreOf", () => {
  it.each(GENRES.map((g) => g.id))("%s 를 주면 그 장르를 돌려준다", (id) => {
    expect(genreOf(id).id).toBe(id);
  });

  it.each([
    ["없는 id", "essay"],
    ["빈 문자열", ""],
    ["null", null],
    ["undefined", undefined],
    ["숫자", 1],
  ])("%s 를 주면 기본 장르를 돌려준다", (_label, value) => {
    expect(genreOf(value).id).toBe(DEFAULT_GENRE);
  });
});
