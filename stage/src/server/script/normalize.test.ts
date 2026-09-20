import { describe, expect, it } from "vitest";
import { toSegments } from "./normalize";
import type { RawTalk } from "./schema";

const raw = (segments: RawTalk["segments"]): RawTalk => ({ title: "t", summary: "s", segments });
const assets = { images: [], hasAvatar: false, source: "정확도가 92%로 올랐어요" };

describe("toSegments", () => {
  it("null 속성을 지우고 장면 id 를 붙인다", () => {
    const [seg] = toSegments(
      raw([
        {
          text: "⭐문제⭐가 있었어요",
          theme: "light",
          size: "small",
          template: { type: "title", eyebrow: null, title: "문제", subtitle: null },
        },
      ]),
      assets,
    );
    expect(seg.id).toBe("s1");
    expect(seg.template).toEqual({ type: "title", title: "문제" });
  });

  it("타이틀 장면은 항상 다크·큰 자막", () => {
    const [seg] = toSegments(
      raw([
        {
          text: "x",
          theme: "light",
          size: "small",
          template: { type: "title", eyebrow: null, title: "x", subtitle: null },
        },
      ]),
      assets,
    );
    expect(seg).toMatchObject({ theme: "dark", size: "large" });
  });

  it("원문에 없는 숫자로 만든 롤링넘버는 키워드 장면으로 바꾼다", () => {
    const [seg] = toSegments(
      raw([
        {
          text: "⭐정확도⭐가 올랐어요",
          theme: "light",
          size: "large",
          template: { type: "rollingNumber", from: null, to: 99, prefix: null, suffix: "%", caption: "정확도 99%" },
        },
      ]),
      assets,
    );
    expect(seg?.template).toEqual({ type: "keywords", keywords: ["정확도 99%"] });
  });

  it("롤링넘버의 from 이 to 와 같으면 from 을 뺀다", () => {
    const [seg] = toSegments(
      raw([
        {
          text: "x",
          theme: "dark",
          size: "large",
          template: { type: "rollingNumber", from: 92, to: 92, prefix: null, suffix: "%", caption: null },
        },
      ]),
      assets,
    );
    expect(seg.template).toEqual({ type: "rollingNumber", to: 92, suffix: "%" });
    expect(seg.theme).toBe("light");
  });
});
