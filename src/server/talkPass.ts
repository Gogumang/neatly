import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// 나레이션 비밀번호. 평문은 저장하지 않고 소금(salt) + scrypt 해시만 남긴다.

export type TalkPass = { salt: string; hash: string };

const KEY_LENGTH = 32;
const WEEK = 60 * 60 * 24 * 7;

/** 쿠키 서명 열쇠. 서버에만 있고, 없으면 개발용 기본값을 쓴다 */
const secret = () => process.env.TALK_PASS_SECRET ?? "stage-talk-pass";

export function hashPassword(password: string): TalkPass {
  const salt = randomBytes(16).toString("base64url");
  return { salt, hash: scryptSync(password, salt, KEY_LENGTH).toString("base64url") };
}

/** 비밀번호가 맞는지. 비교는 항상 같은 시간이 걸리게 timingSafeEqual 로 한다 */
export function checkPassword(pass: TalkPass | undefined, password: string): boolean {
  if (!pass) return false;
  const want = Buffer.from(pass.hash, "base64url");
  if (want.length !== KEY_LENGTH) return false;
  return timingSafeEqual(want, scryptSync(password, pass.salt, KEY_LENGTH));
}

/** 이 나레이션 하나에만 맞는 쿠키 값. 해시 자체가 아니라 그것을 서명한 값을 넣는다 */
export function passToken(id: string, pass: TalkPass): string {
  return createHmac("sha256", secret()).update(`${id}:${pass.hash}`).digest("base64url");
}

export const passCookieName = (id: string) => `talk-${id}`;

/** 쿠키가 이 나레이션의 것이 맞는지 */
export function isUnlocked(id: string, pass: TalkPass | undefined, cookie: string | undefined): boolean {
  if (!pass || !cookie) return false;
  const want = Buffer.from(passToken(id, pass));
  const got = Buffer.from(cookie);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** 그 나레이션 주소에서만 보내지는 httpOnly 쿠키 */
export function passCookie(id: string, pass: TalkPass): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${passCookieName(id)}=${passToken(id, pass)}; Path=/talks/${id}; Max-Age=${WEEK}; HttpOnly; SameSite=Lax${secure}`;
}
