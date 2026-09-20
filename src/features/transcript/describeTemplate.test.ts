import { describe, expect, it } from "vitest";
import { describeTemplate } from "./describeTemplate";

const author = { name: "김스테이지", role: "디자이너" };

describe("describeTemplate", () => {
  it("제목의 줄바꿈은 한 문장으로 잇는다", () => {
    expect(describeTemplate({ type: "title", title: "읽히지 않는 글을\n보고 싶은 나레이션으로" }, author)).toEqual({
      kind: "제목",
      lines: ["읽히지 않는 글을 보고 싶은 나레이션으로"],
    });
  });

  it("숫자는 쉼표와 단위를 붙이고 설명을 덧붙인다", () => {
    const d = describeTemplate({ type: "rollingNumber", to: 2000, suffix: "자", caption: "읽지 않은 설명" }, author);
    expect(d.lines).toEqual(["2,000자", "읽지 않은 설명"]);
  });

  it("대화는 '이름: 말' 로 옮긴다", () => {
    const d = describeTemplate({ type: "chat", messages: [{ name: "심사위원", text: "첫 줄만 볼게요" }] }, author);
    expect(d.lines).toEqual(["심사위원: 첫 줄만 볼게요"]);
  });

  it("발표자 사진은 이름과 역할로 설명한다", () => {
    expect(describeTemplate({ type: "speaker" }, author)).toEqual({
      kind: "발표자 사진",
      lines: ["김스테이지 · 디자이너"],
    });
  });

  it("설명 없는 이미지는 종류만 남긴다", () => {
    expect(describeTemplate({ type: "image", src: "/a.png" }, author).lines).toEqual([]);
  });
});
