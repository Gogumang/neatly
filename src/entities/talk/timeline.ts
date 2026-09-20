import type { Segment } from "./model";

/** 장면 사이 숨 고르기 (초). 플레이어와 수어 영상 동기화가 같은 값을 쓴다 */
export const SCENE_GAP = 0.45;

/** 글자 수로 어림한 나레이션 길이 (초) */
export const estimateSeconds = (text: string) => Math.max(2.2, text.length * 0.11 + 0.8);

function segmentLength(seg: Segment) {
  return seg.duration ?? seg.words?.at(-1)?.end ?? estimateSeconds(seg.text);
}

/** 나레이션 시작부터 각 장면이 시작되는 시각 (초). 수어 영상을 이 시각에 맞춘다 */
export function segmentStarts(segments: Segment[]): number[] {
  let t = 0;
  return segments.map((seg) => {
    const start = t;
    t += segmentLength(seg) + SCENE_GAP;
    return start;
  });
}
