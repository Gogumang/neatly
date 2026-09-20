// 썸네일 배경색. 토스 심플리시티 세션 카드처럼 나레이션마다 2색 그라데이션 한 쌍을 고정으로 쓴다
const PAIRS = [
  ["#1675FF", "#7B92E6"],
  ["#F7576E", "#FFA5A5"],
  ["#3182F6", "#6BB5FF"],
  ["#8B5CF6", "#C770E4"],
  ["#03B26C", "#64A8FF"],
  ["#191F28", "#4E5968"],
];

/** id 만 같으면 늘 같은 색이 나온다 (목록 자리표시자와 썸네일 이미지를 맞추려고) */
export function thumbGradient(id: string): string {
  const hash = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const [from, to] = PAIRS[hash % PAIRS.length] ?? PAIRS[0];
  return `linear-gradient(160deg, ${from}, ${to})`;
}
