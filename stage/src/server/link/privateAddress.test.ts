import { describe, expect, it } from "vitest";
import { isPrivateAddress } from "./privateAddress";

// URL 파서가 실제로 만들어 내는 호스트 형태로 검사한다 ([::ffff:127.0.0.1] → ::ffff:7f00:1 처럼 바뀐다)
const hostOf = (url: string) => new URL(url).hostname.replace(/^\[|\]$/g, "");

describe("isPrivateAddress", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.0.10",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "198.18.0.1",
    "255.255.255.255",
    "::",
    "::1",
    "fd00::1",
    "fe80::1",
    "ff02::1",
    "::ffff:127.0.0.1",
    "not-an-ip",
  ])("%s 는 막는다", (ip) => {
    expect(isPrivateAddress(ip)).toBe(true);
  });

  it.each([
    "http://[::ffff:127.0.0.1]/",
    "http://[::ffff:169.254.169.254]/",
    "http://[::ffff:10.0.0.1]/",
    "http://[::127.0.0.1]/",
    "http://[64:ff9b::127.0.0.1]/",
    "http://[0:0:0:0:0:ffff:7f00:1]/",
    "http://[::1]/",
  ])("URL %s 의 호스트는 막는다", (url) => {
    expect(isPrivateAddress(hostOf(url))).toBe(true);
  });

  it.each(["8.8.8.8", "172.32.0.1", "104.18.2.3", "2606:4700::1111", "::ffff:8.8.8.8", "64:ff9b::8.8.8.8"])(
    "%s 는 허용한다",
    (ip) => {
      expect(isPrivateAddress(ip)).toBe(false);
    },
  );
});
