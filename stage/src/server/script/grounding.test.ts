import { describe, expect, it } from "vitest";
import { groundRollingNumber, numbersIn } from "./grounding";

const source = numbersIn("정확도가 60%에서 92%로, 오전 3시간이 10분으로. 기부금 2억 7천만 원, 3,300,000명 참여");

describe("numbersIn", () => {
  it("쉼표·한국어 단위를 값으로 푼다", () => {
    expect(source.has(3_300_000)).toBe(true);
    expect(source.has(20_000)).toBe(false);
    expect(source.has(70_000_000)).toBe(true); // 7천만
    expect(source.has(270_000_000)).toBe(true); // 2억 7천만
  });
});

describe("groundRollingNumber", () => {
  it("원문에 있는 숫자는 그대로", () => {
    const t = { type: "rollingNumber" as const, from: 60, to: 92, suffix: "%" };
    expect(groundRollingNumber(t, source)).toEqual(t);
  });

  it("시간 단위를 바꾼 값(3시간 → 180분)도 근거로 인정", () => {
    const t = { type: "rollingNumber" as const, from: 180, to: 10, suffix: "분" };
    expect(groundRollingNumber(t, source)).toEqual(t);
  });

  it("원문에 없는 숫자면 null", () => {
    expect(groundRollingNumber({ type: "rollingNumber", to: 97, suffix: "%" }, source)).toBeNull();
  });

  it("from 만 근거가 없으면 from 을 뺀다", () => {
    expect(groundRollingNumber({ type: "rollingNumber", from: 45, to: 92, suffix: "%" }, source)).toEqual({
      type: "rollingNumber",
      to: 92,
      suffix: "%",
    });
  });
});
