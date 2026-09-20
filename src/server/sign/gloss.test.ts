import { beforeEach, describe, expect, it, vi } from "vitest";
import { type GlossScene, signGloss } from "./gloss";
import { SIGN_SYSTEM_PROMPT } from "./prompt";

const mocks = vi.hoisted(() => ({ chatJSON: vi.fn() }));
// LLM 호출은 전부 가짜로 (실제 네트워크를 타면 안 된다)
vi.mock("../llm", () => ({ chatJSON: mocks.chatJSON }));

const scene = (id: string, text: string): GlossScene => ({ id, text });
const answer = (scenes: unknown) => mocks.chatJSON.mockResolvedValue({ scenes });
const gloss1 = (map: Map<string, string[]>) => map.get("s1");

beforeEach(() => {
  mocks.chatJSON.mockReset();
});

describe("signGloss 단어 다듬기", () => {
  it("이모지와 문장부호는 단어에서 지운다", async () => {
    answer([{ id: "s1", words: ["안녕!", "👍좋다", "가-나", "(끝)"] }]);
    const gloss = await signGloss([scene("s1", "안녕하세요")]);
    expect(gloss.get("s1")).toEqual(["안녕", "좋다", "가나", "끝"]);
  });

  it("지우고 나면 아무것도 안 남는 단어는 버린다", async () => {
    answer([{ id: "s1", words: ["!!!", "좋다", "😀", 42, null] }]);
    expect(await signGloss([scene("s1", "안녕하세요")])).toEqual(new Map([["s1", ["좋다"]]]));
  });

  it("한 단어는 12자까지만 남긴다", async () => {
    answer([{ id: "s1", words: ["가".repeat(30)] }]);
    expect(gloss1(await signGloss([scene("s1", "안녕하세요")]))).toEqual(["가".repeat(12)]);
  });

  it("단어 사이 띄어쓰기는 붙여서 한 단어로 만든다", async () => {
    answer([{ id: "s1", words: ["고객 센터"] }]);
    expect(gloss1(await signGloss([scene("s1", "안녕하세요")]))).toEqual(["고객센터"]);
  });

  it("한 장면은 8단어까지만 남긴다", async () => {
    answer([{ id: "s1", words: Array.from({ length: 12 }, (_, i) => `단어${i}`) }]);
    expect(gloss1(await signGloss([scene("s1", "안녕하세요")]))).toHaveLength(8);
  });
});

describe("signGloss 대비책", () => {
  it("모델이 빠뜨린 장면은 문장에서 조사를 떼어 채운다", async () => {
    answer([{ id: "s1", words: ["나", "일하다"] }]);
    const gloss = await signGloss([scene("s1", "나는 일했다"), scene("s2", "나는 학교에서 공부를 했다")]);
    expect(gloss.get("s2")).toEqual(["나", "학교", "공부", "했다"]);
  });

  it("모르는 id 로 답하면 그 장면도 대비책으로 채운다", async () => {
    answer([{ id: "없는id", words: ["엉뚱"] }]);
    expect(gloss1(await signGloss([scene("s1", "나는 갔다")]))).toEqual(["나", "갔다"]);
  });

  it("단어가 하나도 안 남은 장면도 대비책으로 채운다", async () => {
    answer([{ id: "s1", words: ["!!!"] }]);
    expect(gloss1(await signGloss([scene("s1", "나는 갔다")]))).toEqual(["나", "갔다"]);
  });

  it("조사만으로 된 낱말은 통째로 남긴다 (빈 단어를 만들지 않는다)", async () => {
    answer([]);
    expect(gloss1(await signGloss([scene("s1", "를 우리")]))).toEqual(["를", "우리"]);
  });

  it("대비책도 이모지·문장부호를 지우고 8단어까지만 쓴다", async () => {
    answer([]);
    const long = `😀 ${Array.from({ length: 12 }, (_, i) => `낱말${i}`).join(" ")}`;
    expect(gloss1(await signGloss([scene("s1", long)]))).toEqual(Array.from({ length: 8 }, (_, i) => `낱말${i}`));
  });

  it("응답이 이상하면(scenes 가 배열이 아님) 전부 대비책으로 채운다", async () => {
    mocks.chatJSON.mockResolvedValue({ scenes: "nope" });
    expect(gloss1(await signGloss([scene("s1", "나는 갔다")]))).toEqual(["나", "갔다"]);
  });
});

describe("signGloss 대상 장면", () => {
  it("빈 자막 장면은 옮기지 않는다", async () => {
    answer([{ id: "s1", words: ["나"] }]);
    const gloss = await signGloss([scene("s1", "나는 갔다"), scene("s2", "   ")]);
    expect(gloss.has("s2")).toBe(false);
    expect(gloss.size).toBe(1);
  });

  it("옮길 장면이 없으면 LLM 을 부르지 않는다", async () => {
    expect(await signGloss([scene("s1", " ")])).toEqual(new Map());
    expect(mocks.chatJSON).not.toHaveBeenCalled();
  });

  it("수어 시스템 프롬프트와 정해진 스키마로 한 번만 묻는다", async () => {
    answer([]);
    await signGloss([scene("s1", "나는 갔다"), scene("s2", "학교 갔다")]);
    expect(mocks.chatJSON).toHaveBeenCalledTimes(1);
    const [call] = mocks.chatJSON.mock.calls;
    expect(call?.[0]).toMatchObject({ system: SIGN_SYSTEM_PROMPT, schemaName: "sign_gloss" });
    expect(call?.[0].user).toContain("id=s1");
    expect(call?.[0].user).toContain("id=s2");
  });
});

describe("signGloss 실패", () => {
  it("LLM 이 실패해도 던지지 않고 대비책 단어로 채운다", async () => {
    mocks.chatJSON.mockRejectedValueOnce(new Error("모델이 응답하지 않았어요"));
    const gloss = await signGloss([{ id: "s1", text: "우리는 수작업 분류를 계속 했어요." }]);
    expect(gloss.get("s1")?.length).toBeGreaterThan(0);
  });
});
