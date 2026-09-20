// 무엇으로 만들지. 같은 대본을 형식만 달리해 보여 준다.
export const FORMATS = [
  { id: "narration", name: "나레이션" },
  { id: "sign", name: "수어" },
  { id: "webtoon", name: "웹툰" },
  { id: "short", name: "숏폼" },
] as const;

export type FormatId = (typeof FORMATS)[number]["id"];

export const DEFAULT_FORMAT: FormatId = "narration";

export const isFormatId = (value: unknown): value is FormatId => FORMATS.some((f) => f.id === value);
