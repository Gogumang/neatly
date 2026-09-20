import { describe, expect, it } from "vitest";
import { charTimes, filledCount } from "./karaoke";

describe("charTimes", () => {
  it("단어 시간이 있으면 단어 안에서 글자를 균등하게 나눈다", () => {
    const times = charTimes("안녕 세상", {
      duration: 99,
      words: [
        { text: "안녕", start: 0, end: 1 },
        { text: "세상", start: 2, end: 3 },
      ],
    });
    // 안 녕 ' ' 세 상
    expect(times).toEqual([0, 0.5, 0.5, 2, 2.5]);
  });

  it("쉬는 구간(단어 사이 공백)은 건너뛴다", () => {
    const times = charTimes("가나", {
      duration: 10,
      words: [
        { text: "가", start: 0, end: 0.5 },
        { text: "나", start: 3, end: 3.5 },
      ],
    });
    expect(times[1]).toBe(3);
  });

  it("표기와 발음 길이가 달라도 비율로 맞춘다", () => {
    const times = charTimes("92%", { duration: 0, words: [{ text: "구십이퍼센트", start: 0, end: 3 }] });
    expect(times).toEqual([0, 1, 2]);
  });

  it("단어 시간이 없으면 전체 길이에 비례", () => {
    expect(charTimes("가나다라", { duration: 4 })).toEqual([0, 1, 2, 3]);
  });
});

describe("filledCount", () => {
  it("지금 시각까지 채워진 글자 수", () => {
    expect(filledCount([0, 1, 2, 3], 1.5)).toBe(2);
    expect(filledCount([0, 1, 2, 3], 10)).toBe(4);
    expect(filledCount([0.2], 0)).toBe(0);
  });
});
