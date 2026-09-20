import { describe, expect, it } from "vitest";
import { panelPrompt, webtoonLook } from "./prompt";
import type { WebtoonPlan } from "./scene";

const talk = { title: "빵집 답글 자동화", summary: "리뷰 답글을 10분으로 줄였어요", genre: "case" };
const plan: WebtoonPlan = {
  setting: "새벽 빵집 주방",
  cast: "앞치마를 두른 곰",
  palette: "우유빛과 갈색",
  panels: [],
};
const panel = { index: 2, total: 5, scene: "곰이 진열대 앞에서 휴대폰을 본다" };

describe("webtoonLook", () => {
  it("LLM 이 정해 준 공통 설정을 그대로 쓴다", () => {
    const look = webtoonLook(talk, plan);
    expect(look.setting).toBe(plan.setting);
    expect(look.cast).toBe(plan.cast);
    expect(look.palette).toContain(plan.palette);
  });

  it("설정을 못 정했으면 제목과 요약을 무대로 쓰고 동물 주인공을 세운다", () => {
    const look = webtoonLook(talk, null);
    expect(look.setting).toContain(talk.title);
    expect(look.setting).toContain(talk.summary);
    expect(look.cast).toContain("동물");
  });

  it("장르마다 색이 다르다", () => {
    const color = (genre: string) => webtoonLook({ ...talk, genre }, null).palette;
    expect(color("retro")).not.toBe(color("explain"));
    expect(new Set(["case", "project", "retro", "explain", "tutorial"].map(color)).size).toBe(5);
  });

  it("모르는 장르는 기본 색으로 떨어진다", () => {
    expect(webtoonLook({ ...talk, genre: "없는장르" }, null).palette).toBe(webtoonLook(talk, null).palette);
  });
});

describe("panelPrompt", () => {
  const prompt = panelPrompt(webtoonLook(talk, plan), panel);

  it("이 칸에 그릴 장면과 몇 번째 칸인지를 알려 준다", () => {
    expect(prompt).toContain(panel.scene);
    expect(prompt).toContain("2번째");
    expect(prompt).toContain("전체 5칸");
  });

  it("칸마다 공통 무대·인물·색을 다시 붙여 그림체가 이어지게 한다", () => {
    expect(prompt).toContain(plan.setting);
    expect(prompt).toContain(plan.cast);
    expect(prompt).toContain(plan.palette);
  });

  it("글자·말풍선·워터마크를 그려 넣지 말라고 못 박는다", () => {
    expect(prompt).toContain("글자·숫자·로고·간판·말풍선·워터마크는 절대 그려 넣지 않는다");
  });

  it("사진 같은 그림 대신 생활툰 화풍으로 그리게 한다", () => {
    expect(prompt).toContain("한국 생활툰");
    expect(prompt).toContain("사실적인 그림·3D 렌더·사진 같은 질감은 쓰지 않는다");
  });

  it("칸이 바뀌어도 같은 캐릭터로 보이게 한다", () => {
    expect(prompt).toContain("칸이 바뀌어도 같은 캐릭터로 보이게");
  });

  it("같은 입력이면 같은 문장이 나온다", () => {
    expect(panelPrompt(webtoonLook(talk, plan), panel)).toBe(prompt);
  });

  it("칸이 다르면 문장도 다르다", () => {
    expect(panelPrompt(webtoonLook(talk, plan), { ...panel, index: 3 })).not.toBe(prompt);
  });
});
