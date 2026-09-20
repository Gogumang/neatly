import { describe, expect, it } from "vitest";
import { genreOf } from "@/entities/talk/genres";
import { facePrompt } from "./face";

const GENRES = ["case", "project", "retro", "explain", "tutorial"];

describe("facePrompt", () => {
  const prompt = facePrompt({ genre: "case" });

  it("말하는 중인 상반신 한 장을 그리게 한다", () => {
    expect(prompt).toContain("정사각형 인물 그림 한 장.");
    expect(prompt).toContain("상반신");
    expect(prompt).toContain("입을 살짝 벌려 말하는 중");
  });

  it("사진이 아니라 그림임이 한눈에 보이게 한다", () => {
    expect(prompt).toContain("사진이 아니라 그림임이 한눈에 보이게 한다");
  });

  it("실존 인물을 닮지 않게 하고 성별·나이를 특정하지 않는다", () => {
    expect(prompt).toContain("실존 인물을 닮게 하지 않는다");
    expect(prompt).toContain("성별과 나이를 특정하기 어려운 인물");
  });

  it("글자·숫자·로고를 넣지 말라고 못 박는다", () => {
    expect(prompt).toContain("글자·숫자·로고는 절대 넣지 않는다");
  });

  it("장르 이름을 분위기로 알려 준다", () => {
    expect(facePrompt({ genre: "retro" })).toContain(genreOf("retro").name);
  });

  it("장르마다 색이 다르다", () => {
    expect(new Set(GENRES.map((genre) => facePrompt({ genre }))).size).toBe(GENRES.length);
  });

  it("모르는 장르는 기본 장르와 같은 문장이 된다", () => {
    expect(facePrompt({ genre: "없는장르" })).toBe(prompt);
    expect(facePrompt({})).toBe(prompt);
  });

  it("같은 입력이면 같은 문장이 나온다", () => {
    expect(facePrompt({ genre: "case" })).toBe(prompt);
  });
});
