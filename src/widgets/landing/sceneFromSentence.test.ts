import { describe, expect, it } from "vitest";
import { sceneFromSentence } from "./sceneFromSentence";

describe("sceneFromSentence", () => {
  it("단위가 붙은 숫자가 있으면 롤링넘버", () => {
    const scene = sceneFromSentence("정확도가 92%까지 올랐어요");
    expect(scene.template).toEqual({ type: "rollingNumber", to: 92, suffix: "%", caption: "92%" });
    expect(scene.subtitle).toBe("정확도가 ⭐92%⭐까지 올랐어요");
  });

  it("숫자가 둘이면 마지막을 결과로, 변화는 설명에", () => {
    const scene = sceneFromSentence("응답 시간이 3초에서 400ms로 줄었어요");
    expect(scene.template).toEqual({
      type: "rollingNumber",
      to: 400,
      suffix: "ms",
      caption: "3초 → 400ms",
    });
    expect(scene.subtitle).toContain("⭐400ms⭐");
  });

  it("같은 단위면 이전 값부터 굴린다", () => {
    expect(sceneFromSentence("3시간이 10시간으로")).toMatchObject({ template: { from: 3, to: 10, suffix: "시간" } });
  });

  it("따옴표 안의 말은 대화 장면", () => {
    const scene = sceneFromSentence('팀장님이 "이거 언제 끝나요?" 라고 물었어요');
    expect(scene.template).toMatchObject({ type: "chat", messages: [{ text: "이거 언제 끝나요?" }] });
  });

  it("그 외에는 핵심 낱말로 키워드 장면", () => {
    const scene = sceneFromSentence("반복되는 문서 정리를 자동화했어요");
    expect(scene.template.type).toBe("keywords");
    expect(scene.subtitle).toContain("⭐");
  });

  it("너무 긴 문장은 잘라서 쓴다", () => {
    const scene = sceneFromSentence("가".repeat(100));
    expect(scene.subtitle.replace(/⭐/g, "").length).toBeLessThanOrEqual(60);
  });
});
