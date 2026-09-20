import { describe, expect, it } from "vitest";
import { isLink } from "./isLink";

describe("isLink", () => {
  it.each(["https://velog.io/@me/post", " http://example.com/a?b=1 \n"])("%s 는 링크", (v) => {
    expect(isLink(v)).toBe(true);
  });

  it.each(["그냥 글 https://a.com 포함", "https://", "ftp://a.com", "https://localhost"])("%s 는 링크가 아님", (v) => {
    expect(isLink(v)).toBe(false);
  });
});
