import { describe, expect, it } from "vitest";
import { parseByteRange } from "./byteRange";

describe("parseByteRange", () => {
  it("시작-끝", () => expect(parseByteRange("bytes=0-99", 1000)).toEqual({ start: 0, end: 99 }));
  it("시작부터 끝까지", () => expect(parseByteRange("bytes=500-", 1000)).toEqual({ start: 500, end: 999 }));
  it("끝에서 N바이트", () => expect(parseByteRange("bytes=-100", 1000)).toEqual({ start: 900, end: 999 }));
  it("끝이 크기를 넘으면 자른다", () =>
    expect(parseByteRange("bytes=900-5000", 1000)).toEqual({ start: 900, end: 999 }));
  it.each(["bytes=1000-", "bytes=5-2", "items=0-1", "bytes=-", null])("%s 는 무시", (h) => {
    expect(parseByteRange(h, 1000)).toBeNull();
  });
});
