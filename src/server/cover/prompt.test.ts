import { describe, expect, it } from "vitest";
import { coverPrompt } from "./prompt";

const talk = { title: "빵집 답글 자동화", summary: "리뷰 답글을 10분으로 줄였어요", genre: "case" };
const scene = { scene: "새벽 빵집 진열대 위로 답글 말풍선이 떠오른다", light: "창으로 드는 아침 햇살" };

describe("coverPrompt", () => {
  it("정해진 장면을 그대로 그리게 한다", () => {
    expect(coverPrompt(talk, scene)).toContain(scene.scene);
    expect(coverPrompt(talk, scene)).toContain(scene.light);
  });

  it("장면을 못 정했으면 제목과 요약을 소재로 쓴다", () => {
    const prompt = coverPrompt(talk, null);
    expect(prompt).toContain(talk.title);
    expect(prompt).toContain(talk.summary);
  });

  it("글자를 넣지 말라고 못 박는다", () => {
    expect(coverPrompt(talk, scene)).toContain("글자·숫자·로고·간판·워터마크는 절대 넣지 않는다");
  });

  it("사진이 아니라 그림으로 그리게 한다", () => {
    expect(coverPrompt(talk, scene)).toContain("사진이 아니라 그림이다");
  });

  it("장르마다 색이 다르다", () => {
    expect(coverPrompt({ ...talk, genre: "retro" }, null)).not.toBe(coverPrompt({ ...talk, genre: "explain" }, null));
  });
});
