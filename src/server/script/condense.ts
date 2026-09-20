import "server-only";
import { chatJSON } from "../llm";

// 긴 글은 바로 대본으로 만들면 뒷부분(보통 성과가 있는 곳)이 흐려진다.
// 그래서 먼저 "핵심만 남긴 글"로 줄인 뒤 대본을 쓴다.

const CONDENSE_OVER = 2500; // 이보다 길면 줄이기부터

const SYSTEM = `너는 긴 글에서 핵심만 남기는 편집자야.
- 원문의 사실만 쓴다. 없는 내용을 지어내거나 추측하지 마.
- 숫자로 된 성과(시간, 비율, 건수, 금액)는 단위까지 그대로 살려라. 특히 글 끝부분의 결과를 절대 빠뜨리지 마.
- 문제 → 시도 → 해결 → 성과 순서로 정리하고, 각 항목은 한두 문장으로.
- 인용할 만한 대화나 장면(누가 무슨 말을 했는지)이 있으면 한두 개 남겨라.
- 전체 1200자 이내, 평서문.`;

const schema = {
  type: "object",
  properties: { summary: { type: "string" } },
  required: ["summary"],
  additionalProperties: false,
};

/** 긴 글을 핵심만 남긴 글로. 짧은 글은 그대로 돌려준다 */
export async function condense(text: string): Promise<string> {
  if (text.length <= CONDENSE_OVER) return text;
  const { summary } = await chatJSON<{ summary: string }>({
    system: SYSTEM,
    user: `아래 글에서 핵심만 남겨줘.\n\n${text}`,
    schemaName: "summary",
    schema,
  });
  return summary.trim().length >= 80 ? summary : text;
}
