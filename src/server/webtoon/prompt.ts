import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import type { WebtoonLook, WebtoonPlan } from "./scene";

// 무엇을 그릴지는 scene.ts 가 정하고, 어떻게 그릴지는 아래 화풍으로 고정한다.
// 표지(cover/prompt.ts)와 같은 결로 맞춰, 한 사람이 그린 한 작품처럼 보이게 한다.
const STYLE = [
  "화풍: 한국 생활툰(대학일기 같은 일상 웹툰) 그림체. 둥글둥글하고 단순한 선,",
  "납작한 채색, 그림자는 거의 없이 밝고 가볍게. 과장된 표정과 몸짓으로 웃기게 그린다.",
  "주인공은 사람이 아니라 옷을 입고 두 발로 선 동물 캐릭터다. 머리가 크고 몸이 작은 귀여운 비율로 그린다.",
  "칸이 바뀌어도 같은 캐릭터로 보이게 동물 종류·털색·옷차림을 그대로 둔다.",
  "배경은 꼭 필요한 소품만 두고 단순하게 비운다. 캐릭터가 화면에서 크게 보이게 한다.",
  "말풍선을 얹을 자리를 남긴다: 캐릭터를 한쪽으로 치우쳐 두고 반대쪽 위는 배경만 둔다.",
  "그림은 화면 네 귀퉁이까지 꽉 채운다. 위아래 흰 띠·검은 띠, 액자, 테두리는 남기지 않는다.",
  "사실적인 그림·3D 렌더·사진 같은 질감은 쓰지 않는다.",
  "글자·숫자·로고·간판·말풍선·워터마크는 절대 그려 넣지 않는다. 대사는 그림 위에 따로 얹는다.",
].join(" ");

/** 장르마다 색을 달리해서 작품끼리 단조롭지 않게 한다 */
const TONES: Record<string, string> = {
  case: "파랑과 청록",
  project: "보라와 남색",
  retro: "노을빛 주황과 분홍",
  explain: "짙은 초록과 민트",
  tutorial: "따뜻한 황금빛과 베이지",
};

type LookTalk = Pick<Talk, "title" | "summary" | "genre">;

/** LLM 이 정해 준 공통 설정. 실패했으면 제목·요약을 그대로 설정으로 쓴다 */
export function webtoonLook(talk: LookTalk, plan: WebtoonPlan | null): WebtoonLook {
  const tone = TONES[genreOf(talk.genre).id] ?? "파랑과 청록";
  return {
    setting: plan?.setting || `${talk.title}. ${talk.summary}`,
    cast: plan?.cast || "이야기를 이끄는 동물 캐릭터 한 마리. 칸마다 같은 동물·털색·옷차림을 유지한다.",
    palette: [plan?.palette, `${tone} 계열`].filter(Boolean).join(", "),
  };
}

/** 칸 하나를 그릴 때 쓰는 말. 공통 설정을 매 칸에 다시 붙여 그림체가 이어지게 한다 */
export function panelPrompt(look: WebtoonLook, panel: { index: number; total: number; scene: string }): string {
  return [
    `가로로 긴 웹툰 칸 그림 한 장. 같은 작품의 연속된 칸 중 ${panel.index}번째 (전체 ${panel.total}칸).`,
    `이 칸의 장면: ${panel.scene}`,
    `작품 공통 무대: ${look.setting}`,
    `작품 공통 인물: ${look.cast}`,
    `작품 공통 색: ${look.palette}`,
    STYLE,
  ].join("\n");
}
