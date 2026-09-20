// 나레이션을 여는 방식. LLM 이 한 가지만 고집하지 않도록 코드가 정해서 알려준다.

const OPENINGS = {
  speaker: "발표자로 열기: 첫 장면은 speaker 로 발표자가 자기소개를 한다.",
  question: "질문으로 열기: 첫 장면 자막은 청중에게 던지는 질문이고, 화면은 keywords 로 한다.",
  number:
    "숫자로 열기: 첫 장면은 가장 놀라운 성과 숫자를 rollingNumber 로 먼저 보여주고, 다음 장면에서 어떻게 가능했는지 묻는다.",
  scene: "장면으로 열기: 첫 장면은 문제 상황을 chat 으로 바로 재현한다.",
} as const;

export type Opening = keyof typeof OPENINGS;

const ROTATION: Opening[] = ["question", "number", "scene"];

// "3시간", "92%", "2배", "400건" 처럼 단위가 붙은 성과 숫자 (버전 번호·날짜는 제외)
const METRIC = /\d[\d,.]*\s?(%|배|분|시간|초|일|주|개월|건|명|개|원|만|천|점|위|x|ms)(?![a-z])/i;

/** 사진이 있으면 발표자로, 없으면 글마다 돌아가며. 성과 숫자가 없는 글은 숫자로 열 수 없다 */
export function chooseOpening(input: { text: string; hasAvatar: boolean }): Opening {
  if (input.hasAvatar) return "speaker";
  const hash = [...input.text].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const pick = ROTATION[hash % ROTATION.length] ?? "question";
  return pick === "number" && !METRIC.test(input.text) ? "question" : pick;
}

export const openingInstruction = (opening: Opening) => `이번 나레이션의 여는 방식: ${OPENINGS[opening]}`;
