import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import type { WebtoonLook, WebtoonPlan } from "./scene";

// 무엇을 그릴지는 scene.ts 가 정하고, 어떻게 그릴지는 아래 화풍으로 고정한다.
// 표지(cover/prompt.ts)와 같은 결로 맞춰, 한 사람이 그린 한 작품처럼 보이게 한다.
const STYLE = [
  "화풍: 한국 웹툰(네이버웹툰·카카오웹툰) 그림체. 깔끔한 선화에 평면적인 셀 채색,",
  "부드러운 파스텔 색감, 간결한 그림자. 3D 렌더나 사진 같은 질감은 쓰지 않는다.",
  "인물이 화면의 주인공이다. 표정과 몸짓이 보이게 상반신 위주로 크게 그린다.",
  "칸이 바뀌어도 같은 사람으로 보이게 머리모양·옷차림·나이대·피부색을 그대로 둔다.",
  "말풍선을 얹을 자리를 남긴다: 인물을 한쪽으로 치우쳐 두고 반대쪽 위는 배경만 둔다.",
  "그림은 화면 네 귀퉁이까지 꽉 채운다. 위아래 흰 띠·검은 띠, 액자, 테두리는 남기지 않는다.",
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
