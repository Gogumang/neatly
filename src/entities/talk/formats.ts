// 무엇으로 만들지. 같은 대본을 형식만 달리해 보여 준다.
export const FORMATS = [
  {
    id: "narration",
    name: "나레이션",
    lower: "장면이 넘어가며 목소리가 읽어 줘요",
  },
  {
    id: "sign",
    name: "수어",
    lower: "한국수어 어순 자막을 처음부터 켜 둬요",
  },
  {
    id: "webtoon",
    name: "웹툰",
    lower: "장면마다 그림을 그려 말풍선과 함께 이어 봐요",
  },
  {
    id: "short",
    name: "숏폼",
    lower: "세로 화면에 큰 자막으로 짧게 넘겨요",
  },
] as const;

export type FormatId = (typeof FORMATS)[number]["id"];

export const DEFAULT_FORMAT: FormatId = "narration";

export const isFormatId = (value: unknown): value is FormatId => FORMATS.some((f) => f.id === value);
