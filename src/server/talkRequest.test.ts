import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputError, readTalkRequest } from "./talkRequest";

const mocks = vi.hoisted(() => ({ importLink: vi.fn() }));
// 링크 가져오기는 네트워크를 타므로 막는다
vi.mock("./link/importLink", () => ({ importLink: mocks.importLink }));
// 업로드 주소 판정을 로컬 저장소 기준으로 고정한다 (Supabase 키가 있어도 결과가 같게)
vi.mock("./supabase", () => ({
  supabaseEnabled: false,
  publicPrefix: () => "https://sb.test/storage/v1/object/public/media/",
  signedUploadUrl: vi.fn(),
  putObject: vi.fn(),
}));

const STORY = "가".repeat(100);
const upload = (name: string) => `/api/media/uploads/${name}`;
const body = (extra: Record<string, unknown> = {}) => ({ text: STORY, subject: "제목", ...extra });
const read = (extra: Record<string, unknown> = {}) => readTalkRequest(body(extra));

beforeEach(() => {
  mocks.importLink.mockReset();
});

describe("readTalkRequest 글·제목 검증", () => {
  it("글이 80자 미만이면 거절한다", async () => {
    await expect(read({ text: "가".repeat(79) })).rejects.toBeInstanceOf(InputError);
  });

  it("딱 80자면 통과한다", async () => {
    const { input } = await read({ text: "가".repeat(80) });
    expect(input.text).toHaveLength(80);
  });

  it("글이 8000자를 넘으면 거절한다", async () => {
    await expect(read({ text: "가".repeat(8001) })).rejects.toBeInstanceOf(InputError);
  });

  it("본문이 아예 없으면 거절한다", async () => {
    await expect(readTalkRequest(null)).rejects.toBeInstanceOf(InputError);
  });

  it("제목이 2자 미만이면 거절한다", async () => {
    await expect(read({ subject: "가" })).rejects.toBeInstanceOf(InputError);
    await expect(read({ subject: "   " })).rejects.toBeInstanceOf(InputError);
  });

  it("제목은 40자, 발표자 이름은 30자까지만 쓴다", async () => {
    const { input } = await read({ subject: `  ${"제".repeat(50)}  `, authorName: `  ${"이".repeat(40)}  ` });
    expect(input.subject).toHaveLength(40);
    expect(input.authorName).toHaveLength(30);
  });
});

describe("readTalkRequest 공개 범위", () => {
  it("비공개인데 비밀번호가 4~20자가 아니면 거절한다", async () => {
    await expect(read({ visibility: "private", password: "123" })).rejects.toBeInstanceOf(InputError);
    await expect(read({ visibility: "private", password: "1".repeat(21) })).rejects.toBeInstanceOf(InputError);
    await expect(read({ visibility: "private" })).rejects.toBeInstanceOf(InputError);
  });

  it("비밀번호는 평문이 아니라 소금 섞은 해시로 들어간다", async () => {
    const { input } = await read({ visibility: "private", password: "hunter2!" });
    expect(input.visibility).toBe("private");
    expect(input.pass?.salt).toBeTruthy();
    expect(input.pass?.hash).toBeTruthy();
    expect(JSON.stringify(input)).not.toContain("hunter2!");
  });

  it("공개면 비밀번호를 담지 않는다", async () => {
    const { input } = await read({ password: "hunter2!" });
    expect(input.visibility).toBe("public");
    expect(input.pass).toBeUndefined();
  });

  it("엉뚱한 공개 범위는 공개로 떨어진다", async () => {
    const { input } = await read({ visibility: "secret" });
    expect(input.visibility).toBe("public");
  });

  it("비밀번호가 틀리면 링크를 읽기 전에 돌려보낸다", async () => {
    const request = read({ text: "https://example.test/a", visibility: "private", password: "1" });
    await expect(request).rejects.toBeInstanceOf(InputError);
    expect(mocks.importLink).not.toHaveBeenCalled();
  });
});

describe("readTalkRequest 선택지", () => {
  it("형식·장르·길이·목소리에 엉뚱한 값이 오면 기본값으로 떨어진다", async () => {
    const { input, voice } = await read({ format: "movie", genre: 1, length: null, voice: "nobody" });
    expect(input.format).toBe("narration");
    expect(input.genre).toBe("case");
    expect(input.length).toBe("normal");
    expect(voice).toBeUndefined();
  });

  it("제대로 된 값은 그대로 쓴다", async () => {
    const { input, voice } = await read({ format: "webtoon", genre: "retro", length: "long", voice: "kai" });
    expect(input).toMatchObject({ format: "webtoon", genre: "retro", length: "long" });
    expect(voice).toBe("kai");
  });
});

describe("readTalkRequest 이미지", () => {
  it("우리 저장소 주소가 아닌 이미지는 버린다", async () => {
    const { input } = await read({
      imageUrls: [upload("ab12cd34.png"), "https://evil.test/a.png", upload("ab12cd34.mp4"), 42],
      avatarUrl: "https://evil.test/me.png",
    });
    expect(input.imageUrls).toEqual([upload("ab12cd34.png")]);
    expect(input.avatarUrl).toBeUndefined();
  });

  it("이미지는 6장까지만 남는다", async () => {
    const many = Array.from({ length: 9 }, (_, i) => upload(`ab12cd3${i}.png`));
    const { input } = await read({ imageUrls: many, avatarUrl: upload("ffffffff.webp") });
    expect(input.imageUrls).toEqual(many.slice(0, 6));
    expect(input.avatarUrl).toBe(upload("ffffffff.webp"));
  });

  it("imageUrls 가 배열이 아니면 빈 배열이 된다", async () => {
    const { input } = await read({ imageUrls: upload("ab12cd34.png") });
    expect(input.imageUrls).toEqual([]);
  });
});

describe("readTalkRequest 링크 입력", () => {
  it("링크 하나만 넣으면 그 페이지의 글과 이미지를 쓰고 올린 이미지가 먼저 온다", async () => {
    mocks.importLink.mockResolvedValue({ text: "나".repeat(200), imageUrls: [upload("cd340000.png")] });
    const { input } = await read({ text: " https://example.test/a ", imageUrls: [upload("ab12cd34.png")] });
    expect(mocks.importLink).toHaveBeenCalledWith("https://example.test/a");
    expect(input.text).toBe("나".repeat(200));
    expect(input.imageUrls).toEqual([upload("ab12cd34.png"), upload("cd340000.png")]);
  });

  it("가져온 글이 너무 짧으면 링크여도 거절한다", async () => {
    mocks.importLink.mockResolvedValue({ text: "짧다", imageUrls: [] });
    await expect(read({ text: "https://example.test/a" })).rejects.toBeInstanceOf(InputError);
  });

  it("평범한 글이면 링크를 읽지 않는다", async () => {
    await read();
    expect(mocks.importLink).not.toHaveBeenCalled();
  });
});
