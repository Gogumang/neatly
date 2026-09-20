import { describe, expect, it } from "vitest";
import { isUploadUrl } from "./uploads";

// 업로드 파일 주소만 통과해야 한다 (사진이 조용히 버려지는 일을 막기 위한 회귀 테스트)
describe("isUploadUrl", () => {
  it.each(["/api/media/uploads/ab12cd34.png", "/api/media/uploads/ab12cd34.mp4"])("%s 는 우리 파일", (url) => {
    expect(isUploadUrl(url)).toBe(true);
  });

  it.each([
    "/api/media/audio/talk1/s1.mp3",
    "/api/uploads/ab12cd34.png",
    "https://example.com/a.png",
    "/api/media/uploads/../../etc/passwd",
    42,
  ])("%s 는 아님", (url) => {
    expect(isUploadUrl(url)).toBe(false);
  });
});
