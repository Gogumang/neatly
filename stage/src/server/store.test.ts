import { readFile } from "node:fs/promises";
import path from "node:path";
import { Fixture } from "@fixture-kit/core";
import { afterEach, describe, expect, it } from "vitest";
import { getTalk, likeTalk, listTalks, readAudio, type StoredTalk, saveAudio } from "./store";

const talk = (id: string): StoredTalk => ({
  id,
  title: `나레이션 ${id}`,
  summary: "요약",
  author: { name: "테스터" },
  segments: [],
  createdAt: "2026-09-19T00:00:00Z",
  likes: 0,
  voiced: true,
});

// 저장소 폴더를 임시 fixture 로 바꿔 끼운다
async function useStore(files: Record<string, string> = {}) {
  const fixture = await Fixture.create({ talks: files, audio: {} });
  process.env.STAGE_DATA_DIR = fixture.root;
  return fixture;
}

afterEach(() => {
  delete process.env.STAGE_DATA_DIR;
});

describe("store", () => {
  it("저장된 나레이션 목록을 읽는다", async () => {
    await using _ = await useStore({ "a1.json": JSON.stringify(talk("a1")), "b2.json": JSON.stringify(talk("b2")) });
    expect((await listTalks()).map((t) => t.id).sort()).toEqual(["a1", "b2"]);
  });

  it("좋아요를 누르면 파일에 반영된다", async () => {
    await using fixture = await useStore({ "a1.json": JSON.stringify(talk("a1")) });
    await likeTalk("a1");
    expect(await likeTalk("a1")).toBe(2);
    const saved = JSON.parse(await readFile(path.join(fixture.root, "talks", "a1.json"), "utf8"));
    expect(saved.likes).toBe(2);
  });

  it("음성을 저장하고 재생 URL 을 돌려준다", async () => {
    await using _ = await useStore();
    const url = await saveAudio("a1", "s1", Buffer.from("mp3"));
    expect(url).toBe("/api/media/audio/a1/s1.mp3");
    expect((await readAudio("a1", "s1"))?.toString()).toBe("mp3");
  });

  it("경로를 벗어나는 id 는 거부한다", async () => {
    await using _ = await useStore();
    expect(await getTalk("../secret")).toBeNull();
    expect(await readAudio("a1", "../../etc")).toBeNull();
    await expect(saveAudio("../x", "s1", Buffer.from(""))).rejects.toThrow();
  });
});
