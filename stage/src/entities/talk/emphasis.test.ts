import { describe, expect, it } from "vitest";
import { keyPhrase, parseEmphasis, plainText } from "./emphasis";

describe("parseEmphasis", () => {
  it("⭐ 한 쌍 사이를 강조로 나눈다", () => {
    expect(parseEmphasis("정확도가 ⭐92%⭐로 올랐어요")).toEqual([
      { text: "정확도가 ", em: false },
      { text: "92%", em: true },
      { text: "로 올랐어요", em: false },
    ]);
  });

  it("이모지 변형 선택자(⭐️)도 같은 기호로 본다", () => {
    expect(parseEmphasis("⭐️핵심⭐️")).toEqual([{ text: "핵심", em: true }]);
  });

  it("강조가 없으면 문장 하나", () => {
    expect(parseEmphasis("그냥 문장")).toEqual([{ text: "그냥 문장", em: false }]);
  });
});

describe("plainText", () => {
  it("나레이션용으로 ⭐ 를 모두 지운다", () => {
    expect(plainText("⭐3시간⭐이 ⭐️10분⭐️으로")).toBe("3시간이 10분으로");
  });
});

describe("keyPhrase", () => {
  it("강조 구절이 있으면 그것", () => expect(keyPhrase("오늘은 ⭐핵심⭐ 이야기")).toBe("핵심"));
  it("없으면 앞부분을 단어 단위로 자른다", () =>
    expect(keyPhrase("담당자 두 명이 오전 내내 엑셀에 옮겨 적었어요.")).toBe("담당자 두 명이 오전…"));
  it("짧으면 그대로", () => expect(keyPhrase("짧은 문장.")).toBe("짧은 문장"));
});
