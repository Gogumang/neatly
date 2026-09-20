import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import type { CoverScene } from "./scene";

// 무엇을 그릴지는 제목에서 오고(scene), 어떻게 그릴지는 아래 화풍으로 고정한다.
// 그래야 여러 표지를 한 화면에 모아 놔도 같은 전시처럼 보인다.
const STYLE = [
  "화풍: 사진이 아니라 그림이다. 실제 사물을 그대로 베끼지 말고 단순한 도형으로 줄여서 그린다.",
  "매끈한 면과 둥근 모서리, 부드러운 그림자, 은은한 광택. 질감·주름·잔 디테일·글씨는 모두 덜어낸다.",
  "장난감처럼 단정한 형태로, 실제보다 과장되게 단순하게 만든다.",
  "배경은 단색에 가까운 그라데이션. 주인공 사물 한두 개만 큼직하게 둔다.",
  "사물은 화면 가운데에 두고 아래 4분의 1 은 배경만 남겨 제목이 얹힐 자리를 만든다.",
  "사람 얼굴은 넣지 않는다. 글자·숫자·로고·간판·워터마크는 절대 넣지 않는다.",
].join(" ");

/** 장르마다 색을 달리해서 목록이 단조롭지 않게 한다 */
const TONES: Record<string, string> = {
  case: "파랑과 청록",
  project: "보라와 남색",
  retro: "노을빛 주황과 분홍",
  explain: "짙은 초록과 민트",
  tutorial: "따뜻한 황금빛과 베이지",
};

/** 표지 그림을 그릴 때 쓰는 말. 그릴 장면은 제목에서 미리 정해 온다 */
export function coverPrompt(talk: Pick<Talk, "title" | "summary" | "genre">, scene: CoverScene | null): string {
  const genre = genreOf(talk.genre);
  const tone = TONES[genre.id] ?? "파랑과 청록";
  return [
    "세로로 긴 포스터 표지 그림 한 장.",
    `장면: ${scene?.scene ?? `${talk.title}. ${talk.summary}`}`,
    `빛과 색: ${scene?.light ?? ""} ${tone} 계열을 주로 쓴다.`.trim(),
    STYLE,
  ].join("\n");
}
