import "server-only";
import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import { chatJSON } from "../llm";

// 칸을 그리기 전에 "무엇을 그릴지" 를 먼저 한 번에 정한다.
// 작품 전체의 공통 설정(장소·인물·색)을 같이 받아 두어야 칸마다 그림이 따로 놀지 않는다.

const SYSTEM = [
  "너는 웹툰 콘티 작가다. 글의 제목·요약과 장면 자막들을 읽고, 한 편의 웹툰으로 그릴 준비를 한다.",
  "",
  "먼저 작품 전체에서 변하지 않는 공통 설정을 정한다.",
  "- setting: 이야기가 벌어지는 장소와 시간대를 한국어 한 문장으로 (60자 이하).",
  "- cast: 주인공 한두 명의 생김새를 나이대·머리모양·옷차림까지 콕 집어 한국어 한 문장으로 (80자 이하). 이름은 쓰지 않는다.",
  "- palette: 작품 전체를 감싸는 색 서너 가지를 한국어로 (30자 이하).",
  "",
  "그다음 장면마다 그 칸에 그릴 그림을 정한다.",
  "- scene: 누가 무엇을 하고 있는지 눈에 보이는 대로 한국어 한 문장 (30자 이상 80자 이하).",
  "- 자막을 그대로 옮기지 말고, 겉으로 드러나는 행동·사물·표정·자세로 바꾼다.",
  "- 앞 칸에서 이어지는 동작이나 시선을 넣어 칸과 칸이 이어져 읽히게 한다.",
  "- 공통 설정에 적은 인물과 장소를 벗어나지 않는다.",
  "- 글자·숫자·간판·말풍선은 그림에 넣지 않는다. 자막은 그림 밖에 따로 붙는다.",
  "- 받은 장면의 id 를 그대로 돌려주고, 장면 수와 순서를 바꾸지 않는다.",
].join("\n");

const schema = {
  type: "object",
  properties: {
    setting: { type: "string", description: "장소와 시간대" },
    cast: { type: "string", description: "주인공 생김새" },
    palette: { type: "string", description: "작품 전체 색" },
    panels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          scene: { type: "string", description: "이 칸에 그릴 장면 한 문장" },
        },
        required: ["id", "scene"],
        additionalProperties: false,
      },
    },
  },
  required: ["setting", "cast", "palette", "panels"],
  additionalProperties: false,
} as const;

/** 작품 전체에 걸쳐 고정할 설정 */
export type WebtoonLook = { setting: string; cast: string; palette: string };

export type WebtoonPlan = WebtoonLook & { panels: { id: string; scene: string }[] };

type PlanTalk = Pick<Talk, "title" | "summary" | "genre">;

/**
 * 제목·요약·자막 → 공통 설정과 칸별 그림 지시.
 * 실패하면 null (그때는 자막을 그대로 소재로 쓴다).
 */
export async function webtoonPlan(talk: PlanTalk, scenes: { id: string; text: string }[]): Promise<WebtoonPlan | null> {
  const genre = genreOf(talk.genre);
  const user = [
    `종류: ${genre.name}`,
    `제목: ${talk.title}`,
    `요약: ${talk.summary}`,
    "",
    `장면 ${scenes.length}개:`,
    ...scenes.map((scene, i) => `${i + 1}. id=${scene.id}\n자막: ${scene.text}`),
  ].join("\n");
  const plan = await chatJSON<WebtoonPlan>({ system: SYSTEM, user, schemaName: "webtoon_plan", schema }).catch(
    () => null,
  );
  return plan && Array.isArray(plan.panels) ? plan : null;
}
