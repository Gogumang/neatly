import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";

// 사진을 올리지 않은 사람에게는 AI 가 화자 얼굴을 그려 준다.
// 실제 사람 사진처럼 보이면 안 되므로 일부러 일러스트로 그린다.
const STYLE = [
  "스타일: 부드러운 3D 캐릭터 일러스트. 사진이 아니라 그림임이 한눈에 보이게 한다.",
  "실존 인물을 닮게 하지 않는다. 성별과 나이를 특정하기 어려운 인물로 그린다.",
  "배경은 단색에 가깝게, 조명은 부드럽게. 글자·숫자·로고는 절대 넣지 않는다.",
].join(" ");

/** 장르마다 옷과 배경 색을 달리해 표지와 같은 계열로 맞춘다 */
const TONES: Record<string, string> = {
  case: "차분한 파랑",
  project: "은은한 보라",
  retro: "따뜻한 주황",
  explain: "깊은 초록",
  tutorial: "부드러운 베이지",
};

/** 화자 얼굴을 그릴 때 쓰는 말 */
export function facePrompt(talk: Pick<Talk, "genre">): string {
  const genre = genreOf(talk.genre);
  const tone = TONES[genre.id] ?? "차분한 파랑";
  return [
    "정사각형 인물 그림 한 장.",
    "한 사람이 정면을 보며 이야기하는 상반신. 입을 살짝 벌려 말하는 중이고, 표정은 편안하다.",
    `분위기: ${genre.name}를 들려주는 사람. ${tone} 계열을 주로 쓴다.`,
    STYLE,
  ].join("\n");
}
