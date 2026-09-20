import { describe, expect, it } from "vitest";
import { chooseOpening } from "./opening";

describe("chooseOpening", () => {
  it("사진이 있으면 발표자로 연다", () => {
    expect(chooseOpening({ text: "아무 글 123", hasAvatar: true })).toBe("speaker");
  });

  it("버전 번호처럼 단위 없는 숫자만 있으면 숫자로 열지 않는다", () => {
    const texts = Array.from({ length: 30 }, (_, i) => `v1.2.${i} 릴리스 노트 ${"가".repeat(i)}`);
    for (const text of texts) expect(chooseOpening({ text, hasAvatar: false })).not.toBe("number");
  });

  it("숫자가 없는 글은 숫자로 열지 않는다", () => {
    const texts = Array.from({ length: 30 }, (_, i) => `숫자 없는 글 ${"가".repeat(i)}`.replace(/\d/g, ""));
    for (const text of texts) expect(chooseOpening({ text, hasAvatar: false })).not.toBe("number");
  });

  it("글이 달라지면 여는 방식도 여러 가지가 나온다", () => {
    const picks = new Set(
      Array.from({ length: 30 }, (_, i) =>
        chooseOpening({ text: `성과 ${i}건 개선 ${"나".repeat(i)}`, hasAvatar: false }),
      ),
    );
    expect(picks.size).toBe(3);
  });

  it("같은 글은 항상 같은 방식", () => {
    const input = { text: "같은 글 10분", hasAvatar: false };
    expect(chooseOpening(input)).toBe(chooseOpening(input));
  });
});
