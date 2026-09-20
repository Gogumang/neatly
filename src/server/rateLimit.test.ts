import { describe, expect, it } from "vitest";
import { allow } from "./rateLimit";

describe("allow", () => {
  it("창 안에서 limit 번까지만 허용하고, 창이 지나면 다시 허용", () => {
    const key = `t-${Math.random()}`;
    expect([allow(key, 2, 1000, 0), allow(key, 2, 1000, 10), allow(key, 2, 1000, 20)]).toEqual([true, true, false]);
    expect(allow(key, 2, 1000, 1001)).toBe(true);
  });
});
