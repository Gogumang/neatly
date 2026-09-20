import { describe, expect, it } from "vitest";
import { checkPassword, hashPassword, isUnlocked, passToken } from "./talkPass";

describe("talkPass", () => {
  it("평문 대신 소금과 해시만 남기고, 맞는 비밀번호만 통과시킨다", () => {
    const pass = hashPassword("비밀1234");
    expect(JSON.stringify(pass)).not.toContain("비밀1234");
    expect(checkPassword(pass, "비밀1234")).toBe(true);
    expect(checkPassword(pass, "비밀12345")).toBe(false);
    expect(checkPassword(undefined, "비밀1234")).toBe(false);
  });

  it("같은 비밀번호라도 소금이 달라 해시가 겹치지 않는다", () => {
    expect(hashPassword("열려라참깨").hash).not.toBe(hashPassword("열려라참깨").hash);
  });

  it("쿠키는 그 나레이션에만 맞는다", () => {
    const pass = hashPassword("열려라참깨");
    const token = passToken("abc123", pass);
    expect(isUnlocked("abc123", pass, token)).toBe(true);
    expect(isUnlocked("other1", pass, token)).toBe(false);
    expect(isUnlocked("abc123", hashPassword("열려라참깨"), token)).toBe(false);
    expect(isUnlocked("abc123", pass, undefined)).toBe(false);
  });
});
