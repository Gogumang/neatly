import type { Talk } from "./model";

const GRADIENTS = [
  "linear-gradient(160deg, #3182F6, #7B92E6)",
  "linear-gradient(160deg, #F04452, #FF8FAA)",
  "linear-gradient(160deg, #03B26C, #64A8FF)",
  "linear-gradient(160deg, #7B5CFA, #C770E4)",
  "linear-gradient(160deg, #191F28, #4E5968)",
];

/** 표지가 바뀌면 달라지는 짧은 값. 썸네일 주소에 붙여 캐시를 새로 받게 한다 */
export function coverVersion(talk: Pick<Talk, "id" | "coverUrl">): string {
  const name =
    talk.coverUrl
      ?.split("/")
      .pop()
      ?.replace(/\.\w+$/, "") ?? "";
  return name.split("-")[1] ?? "0";
}

export type TalkCover = { kind: "image"; src: string } | { kind: "gradient"; background: string };

/** 목록에 쓸 대표 이미지: AI 표지 → 올린 이미지 → 프로필 사진 → 색 그라데이션 */
export function talkCover(talk: Talk): TalkCover {
  if (talk.coverUrl) return { kind: "image", src: talk.coverUrl };
  for (const { template } of talk.segments) {
    if (template.type === "image") return { kind: "image", src: template.src };
    if (template.type === "mockup" && template.media?.kind === "image")
      return { kind: "image", src: template.media.src };
  }
  if (talk.author.avatarUrl) return { kind: "image", src: talk.author.avatarUrl };
  const hash = [...talk.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return { kind: "gradient", background: GRADIENTS[hash % GRADIENTS.length] ?? "" };
}
