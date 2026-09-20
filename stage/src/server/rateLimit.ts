import "server-only";

// 아주 단순한 요청 제한 (IP 별, 서버 인스턴스 메모리). 여러 인스턴스 사이에서는 공유되지 않으므로
// 비용 폭주를 막는 최후의 방어선은 OpenAI 프로젝트 예산 상한이다.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

/** 허용되면 true. key 마다 windowMs 동안 limit 번까지 */
export function allow(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export const tooMany = () =>
  Response.json({ error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." }, { status: 429 });
