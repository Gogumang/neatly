import type { SpokenWord } from "./model";

const SILENT = /[\s.,!?·…~"'“”‘’()[\]]/;

const spokenLength = (word: string) => [...word].filter((ch) => !SILENT.test(ch)).length;

/**
 * 자막 글자마다 "이 시각(초)이 되면 채워진다"를 계산한다.
 * - words 가 있으면: 자막 글자 순서를 발화된 글자 순서에 비례로 맞추고, 단어 안에서는 균등하게 나눈다.
 *   숫자처럼 읽는 길이가 다른 표기("92%" ↔ "구십이 퍼센트")도 비율로 맞춰진다.
 * - 없으면: 전체 길이(duration)에 글자 수 비례로 나눈다.
 * 공백·문장부호는 앞 글자와 같은 시각에 채워진다.
 */
export function charTimes(text: string, timing: { words?: SpokenWord[]; duration: number }): number[] {
  const chars = [...text];
  const voiced = chars.filter((ch) => !SILENT.test(ch)).length || 1;
  const timeAt = timing.words?.length ? wordClock(timing.words) : (r: number) => r * timing.duration;

  let k = 0;
  let last = 0;
  return chars.map((ch) => {
    if (SILENT.test(ch)) return last;
    last = timeAt(k++ / voiced);
    return last;
  });
}

/** 0~1 비율 → 발화 시각 */
function wordClock(words: SpokenWord[]) {
  const lengths = words.map((w) => Math.max(1, spokenLength(w.text)));
  const total = lengths.reduce((a, b) => a + b, 0);
  return (ratio: number) => {
    let pos = ratio * total;
    for (const [i, w] of words.entries()) {
      const len = lengths[i] ?? 1;
      if (pos < len) return w.start + (pos / len) * (w.end - w.start);
      pos -= len;
    }
    return words.at(-1)?.end ?? 0;
  };
}

/** 지금 시각까지 채워진 글자 수 */
export function filledCount(times: number[], elapsed: number): number {
  let n = 0;
  while (n < times.length && (times[n] ?? 0) <= elapsed) n++;
  return n;
}
