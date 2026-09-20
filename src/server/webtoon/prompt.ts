import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import type { WebtoonLook, WebtoonPlan } from "./scene";

// 무엇을 그릴지는 scene.ts 가 정하고, 어떻게 그릴지는 아래 화풍으로 고정한다.
// 표지(cover/prompt.ts)와 같은 결로 맞춰, 한 사람이 그린 한 작품처럼 보이게 한다.
const STYLE = [
  "화풍: 단정한 3D 일러스트. 사진이 아니라 그림임이 한눈에 보이게 한다.",
  "매끈하게 단순화된 형태, 부드러운 그림자, 은은한 광택. 자잘한 질감과 디테일은 덜어낸다.",
  "인물은 단순하게 양식화한 얼굴로 그린다. 칸이 바뀌어도 같은 사람으로 보이게 나이대·머리모양·옷차림·피부색을 그대로 둔다.",
  "빛의 방향과 색 보정은 칸마다 똑같이 두고 구도와 동작만 바꾼다. 한 사람이 그린 한 작품처럼 보이게 한다.",
  "그림은 화면 네 귀퉁이까지 꽉 채운다. 위아래 흰 띠·검은 띠, 액자, 테두리, 여백을 절대 남기지 않는다.",
  "글자·숫자·로고·간판·말풍선·워터마크는 절대 넣지 않는다. 자막은 그림 밖에 따로 얹는다.",
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
    cast: plan?.cast || "이야기를 이끄는 주인공 한 사람. 칸마다 같은 머리모양과 옷차림을 유지한다.",
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
