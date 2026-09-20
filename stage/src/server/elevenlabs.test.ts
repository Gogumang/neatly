import { describe, expect, it } from "vitest";
import { toWords } from "./elevenlabs";

const align = (text: string, step = 0.1) => ({
  characters: [...text],
  character_start_times_seconds: [...text].map((_, i) => i * step),
  character_end_times_seconds: [...text].map((_, i) => (i + 1) * step),
});

describe("toWords", () => {
  it("공백에서 끊어 단어별 시각을 만든다", () => {
    const words = toWords(align("가나 다"));
    expect(words).toEqual([
      { text: "가나", start: 0, end: 0.2 },
      { text: "다", start: 0.30000000000000004, end: 0.4 },
    ]);
  });

  it("공백이 없으면 한 단어", () => {
    expect(toWords(align("안녕"))).toHaveLength(1);
  });

  it("빈 정렬이면 빈 목록", () => {
    expect(toWords({ characters: [], character_start_times_seconds: [], character_end_times_seconds: [] })).toEqual([]);
  });
});
