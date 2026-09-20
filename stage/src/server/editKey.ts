import "server-only";
import { randomBytes, timingSafeEqual } from "node:crypto";

export const newEditKey = () => randomBytes(24).toString("base64url");

/** 수정 키가 맞는지. 길이·내용 비교에 걸리는 시간으로 키를 추측할 수 없게 한다 */
export function matchesEditKey(expected: string | undefined, given: string | null): boolean {
  if (!expected || !given) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}
