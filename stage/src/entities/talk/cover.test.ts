import { describe, expect, it } from "vitest";
import { talkCover } from "./cover";
import type { Talk } from "./model";

const talk = (patch: Partial<Talk> = {}): Talk => ({
  id: "abc",
  title: "t",
  summary: "s",
  author: { name: "a" },
  segments: [],
  ...patch,
});

describe("talkCover", () => {
  it("올린 이미지가 있으면 그 이미지", () => {
    const cover = talkCover(
      talk({
        author: { name: "a", avatarUrl: "/avatar.png" },
        segments: [{ id: "s1", text: "", template: { type: "image", src: "/shot.png" } }],
      }),
    );
    expect(cover).toEqual({ kind: "image", src: "/shot.png" });
  });

  it("이미지가 없으면 프로필 사진", () => {
    expect(talkCover(talk({ author: { name: "a", avatarUrl: "/avatar.png" } }))).toEqual({
      kind: "image",
      src: "/avatar.png",
    });
  });

  it("둘 다 없으면 id 로 정해지는 그라데이션", () => {
    const cover = talkCover(talk());
    expect(cover.kind).toBe("gradient");
    expect(talkCover(talk())).toEqual(cover);
  });
});
