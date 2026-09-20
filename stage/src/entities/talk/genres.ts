// 나레이션 장르. 장르마다 이야기 흐름과 입력 안내가 다르다.
export const GENRES = [
  {
    id: "case",
    color: "#64A8FF",
    name: "문제 해결 사례",
    flow: "문제 → 시도 → 해결 → 성과",
    question: "AI로 어떤 문제를 해결했나요?",
    placeholder: "어떤 문제가 있었고, 어떻게 풀었고, 무엇이 달라졌나요?\n숫자로 된 성과가 있으면 꼭 넣어주세요.",
  },
  {
    id: "project",
    color: "#7AEA8F",
    name: "프로젝트 소개",
    flow: "왜 만들었나 → 핵심 기능 → 데모 → 앞으로",
    question: "어떤 프로젝트를 소개할까요?",
    placeholder: "누구를 위해, 왜 만들었고, 어떤 기능이 있나요?\nREADME 링크를 넣어도 좋아요.",
  },
  {
    id: "retro",
    color: "#FF8FAA",
    name: "회고·후기",
    flow: "있었던 일 → 배운 것 → 아쉬운 점 → 다음에는",
    question: "어떤 경험을 돌아볼까요?",
    placeholder: "무엇을 했고, 무엇을 배웠고, 다음엔 어떻게 하고 싶나요?",
  },
  {
    id: "explain",
    color: "#FFD66B",
    name: "기술 설명",
    flow: "왜 알아야 하나 → 개념 → 원리 → 예시 → 정리",
    question: "어떤 기술을 설명할까요?",
    placeholder: "설명하고 싶은 개념과 원리, 예시를 적어주세요.",
  },
  {
    id: "tutorial",
    color: "#C9A7FF",
    name: "튜토리얼",
    flow: "무엇을 만드나 → 준비 → 단계별 따라하기 → 결과",
    question: "무엇을 따라 하게 할까요?",
    placeholder: "준비물과 단계별 방법, 최종 결과를 적어주세요.",
  },
] as const;

export type Genre = (typeof GENRES)[number];
export type GenreId = Genre["id"];

export const DEFAULT_GENRE: GenreId = "case";

export const isGenreId = (v: unknown): v is GenreId => GENRES.some((g) => g.id === v);

export const genreOf = (id: unknown): Genre => GENRES.find((g) => g.id === id) ?? GENRES[0];
