import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { assertId, dataDir, isSafeId, newId } from "./dataDir";

afterEach(() => {
  delete process.env.STAGE_DATA_DIR;
});

describe("isSafeId", () => {
  it.each(["talk1", "AB12cd", "a-b-c", "8f3c2a1e"])("%s 는 쓸 수 있는 id", (id) => {
    expect(isSafeId(id)).toBe(true);
  });

  it.each([
    "..",
    "../etc",
    "a/b",
    "a\\b",
    "",
    " ",
    "talk 1",
    "talk.json",
    "talk_1",
    "한글",
    "a%2e%2e",
    "talk\n",
    "talk\u0000",
  ])("%s 는 막는다", (id) => {
    expect(isSafeId(id)).toBe(false);
  });

  it("길이는 따지지 않는다 (아주 긴 id 도 지금은 통과한다)", () => {
    expect(isSafeId("a".repeat(300))).toBe(true);
  });
});

describe("assertId", () => {
  it("여러 id 중 하나라도 이상하면 던진다", () => {
    expect(() => assertId("talk1", "s1")).not.toThrow();
    expect(() => assertId("talk1", "../etc")).toThrow("잘못된 id");
    expect(() => assertId("")).toThrow();
  });

  it("id 가 없으면 아무것도 막지 않는다", () => {
    expect(() => assertId()).not.toThrow();
  });
});

describe("dataDir", () => {
  it("STAGE_DATA_DIR 가 있으면 그 폴더 아래를 가리킨다", () => {
    process.env.STAGE_DATA_DIR = "/tmp/stage-test";
    expect(dataDir("talks", "talk1.json")).toBe(path.join("/tmp/stage-test", "talks", "talk1.json"));
  });

  it("없으면 .data 폴더를 쓴다", () => {
    expect(dataDir("talks")).toBe(path.join(path.resolve(".data"), "talks"));
  });

  it("폴더 이름 자체는 걸러 주지 않는다 — 경로 탈출은 assertId 로 먼저 막아야 한다", () => {
    process.env.STAGE_DATA_DIR = "/tmp/stage-test";
    expect(dataDir("..", "etc")).toBe("/tmp/etc");
  });
});

describe("newId", () => {
  it("8자짜리 안전한 id 를 만든다", () => {
    const id = newId();
    expect(id).toHaveLength(8);
    expect(isSafeId(id)).toBe(true);
  });

  it("부를 때마다 다른 id 가 나온다", () => {
    expect(new Set(Array.from({ length: 50 }, newId)).size).toBe(50);
  });
});
