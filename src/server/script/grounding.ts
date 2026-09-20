import type { Template } from "@/entities/talk/model";

// 화면에 크게 뜨는 숫자가 원문에 실제로 있는지 코드로 확인한다 (프롬프트만 믿지 않는다)

const KOREAN_UNITS: Record<string, number> = { 천: 1_000, 만: 10_000, 천만: 10_000_000, 억: 100_000_000 };

/** 원문에 나오는 숫자들. "7천만"·"2억 7천만"·"3,300,000"·"4.7" 모두 값으로 모은다 */
export function numbersIn(text: string): Set<number> {
  const values = new Set<number>();
  let compound = 0; // "2억 7천만" 처럼 이어지는 한국어 단위 숫자의 합
  let lastEnd = -1;
  for (const m of text.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(천만|천|만|억)?/g)) {
    const n = Number((m[1] ?? "").replace(/,/g, ""));
    if (!Number.isFinite(n)) continue;
    values.add(n);
    const unit = m[2] ? KOREAN_UNITS[m[2]] : undefined;
    if (!unit) continue;
    values.add(n * unit);
    const start = m.index ?? 0;
    compound = start - lastEnd <= 1 ? compound + n * unit : n * unit;
    lastEnd = start + m[0].length;
    values.add(compound);
  }
  return values;
}

/** 원문 숫자와 같거나, 시간 단위를 바꾼 값(3시간 → 180분)이면 근거가 있다고 본다 */
function grounded(value: number, source: Set<number>) {
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;
  return [...source].some((n) => near(n, value) || near(n * 60, value) || near(n / 60, value));
}

/**
 * 롤링넘버의 숫자가 원문에 없으면 쓰지 않는다.
 * - to 가 근거 없음 → null (호출한 쪽에서 다른 장면으로 바꾼다)
 * - from 만 근거 없음 → from 을 빼고 0부터 굴린다
 */
export function groundRollingNumber(
  template: Extract<Template, { type: "rollingNumber" }>,
  source: Set<number>,
): Extract<Template, { type: "rollingNumber" }> | null {
  if (!grounded(template.to, source)) return null;
  if (template.from !== undefined && !grounded(template.from, source)) {
    const { from: _dropped, ...rest } = template;
    return rest;
  }
  return template;
}
