import { beforeEach, describe, expect, it, vi } from "vitest";
import { condense } from "./condense";

const mocks = vi.hoisted(() => ({ chatJSON: vi.fn() }));
// LLM 호출은 전부 가짜로 (실제 네트워크를 타면 안 된다)
vi.mock("../llm", () => ({ chatJSON: mocks.chatJSON }));

const SUMMARY = `요약 ${"핵".repeat(100)}`;
const text = (length: number) => "가".repeat(length);

beforeEach(() => {
  mocks.chatJSON.mockReset();
  mocks.chatJSON.mockResolvedValue({ summary: SUMMARY });
});

describe("condense", () => {
  it("2500자 이하면 원문 그대로 돌려주고 LLM 을 부르지 않는다", async () => {
    expect(await condense(text(2500))).toBe(text(2500));
    expect(await condense("짧은 글")).toBe("짧은 글");
    expect(mocks.chatJSON).not.toHaveBeenCalled();
  });

  it("2500자를 넘으면 줄인 글로 바꾼다", async () => {
    const long = text(2501);
    expect(await condense(long)).toBe(SUMMARY);
    expect(mocks.chatJSON).toHaveBeenCalledTimes(1);
  });

  it("줄일 때 원문을 그대로 넣고 정해진 스키마로 묻는다", async () => {
    const long = `${text(2501)} 성과는 10분`;
    await condense(long);
    const [call] = mocks.chatJSON.mock.calls;
    expect(call?.[0].user).toContain(long);
    expect(call?.[0]).toMatchObject({ schemaName: "summary" });
    expect(call?.[0].system).toContain("숫자로 된 성과");
  });

  it("줄인 글이 80자 미만이면 원문을 지킨다", async () => {
    mocks.chatJSON.mockResolvedValue({ summary: "너무 짧은 요약" });
    expect(await condense(text(3000))).toBe(text(3000));
  });

  it("앞뒤 공백을 뺀 길이로 80자를 따진다", async () => {
    mocks.chatJSON.mockResolvedValue({ summary: `${" ".repeat(200)}짧다${" ".repeat(200)}` });
    expect(await condense(text(3000))).toBe(text(3000));
  });
});
