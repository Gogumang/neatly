import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("클래스 이름을 공백 하나로 잇는다", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("false·null·undefined·빈 문자열은 버린다", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("아무것도 없으면 빈 문자열이다", () => {
    expect(cx()).toBe("");
    expect(cx(false, null, undefined)).toBe("");
  });

  it("조건부 클래스만 남긴다", () => {
    const active = true;
    const disabled = false;
    expect(cx("btn", active && "on", disabled && "off")).toBe("btn on");
  });

  it("순서를 지킨다", () => {
    expect(cx("z", "a")).toBe("z a");
  });
});
