// 나레이션 길이. 장면 수가 달라진다.
export const LENGTHS = [
  { id: "short", name: "짧게", scenes: "6~8개 장면", description: "핵심만 30초 안팎", min: 6, max: 8 },
  { id: "normal", name: "보통", scenes: "9~13개 장면", description: "흐름이 살아 있는 1분", min: 9, max: 13 },
  { id: "long", name: "자세히", scenes: "14~18개 장면", description: "과정까지 담은 2분", min: 14, max: 18 },
] as const;

export type Length = (typeof LENGTHS)[number];
export type LengthId = Length["id"];

export const DEFAULT_LENGTH: LengthId = "normal";

export const isLengthId = (v: unknown): v is LengthId => LENGTHS.some((l) => l.id === v);

export const lengthOf = (id: unknown): Length => LENGTHS.find((l) => l.id === id) ?? LENGTHS[1];
