import "server-only";
import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import { chatJSON } from "../llm";

// 제목만 보고 무엇을 그릴지 먼저 정한다. 추상 무늬 대신 그 이야기가 실제로 벌어지는 장면을 그리게 하려는 것이다.

const SYSTEM = [
  "너는 전시 포스터를 만드는 아트 디렉터다. 글의 제목과 요약을 읽고, 표지에 그릴 장면 하나를 정한다.",
  "",
  "규칙:",
  "- 제목에 나오는 구체적인 사물·장소·행동을 반드시 화면에 담는다. (예: 빵집이면 새벽 빵집 진열대, 논문이면 쌓인 종이 뭉치, 배포면 서버 불빛과 밤의 사무실)",
  "- 제목을 못 읽어도 무슨 이야기인지 짐작되게 한다. 뜻 없는 기하학 무늬만 그리지 않는다.",
  "- 사람 얼굴은 넣지 않는다. 손, 뒷모습, 실루엣은 괜찮다.",
  "- 글자·숫자·로고·상표는 절대 넣지 않는다. 화면 안 간판이나 자막도 안 된다.",
  "- 한 장면에 주인공 사물은 하나나 둘까지. 복잡하게 늘어놓지 않는다.",
  "",
  "scene: 무엇이 어디에 어떻게 놓였는지 한국어 한 문장 (40자 이상 90자 이하).",
  "light: 빛과 색을 한국어로 짧게 (20자 이하).",
].join("\n");

const schema = {
  type: "object",
  properties: {
    scene: { type: "string", description: "그릴 장면 한 문장" },
    light: { type: "string", description: "빛과 색" },
  },
  required: ["scene", "light"],
  additionalProperties: false,
} as const;

export type CoverScene = { scene: string; light: string };

/** 제목·요약 → 표지에 그릴 장면. 실패하면 null (그때는 제목을 그대로 소재로 쓴다) */
export async function coverScene(talk: Pick<Talk, "title" | "summary" | "genre">): Promise<CoverScene | null> {
  const genre = genreOf(talk.genre);
  const user = [`종류: ${genre.name}`, `제목: ${talk.title}`, `요약: ${talk.summary}`].join("\n");
  return chatJSON<CoverScene>({ system: SYSTEM, user, schemaName: "cover_scene", schema }).catch(() => null);
}
