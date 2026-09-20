import "server-only";
import { chatJSON } from "../llm";
import { SIGN_SYSTEM_PROMPT } from "./prompt";
import { glossSchema, type RawGloss } from "./schema";

// 장면 자막을 한국수어(KSL) 어순·어휘의 단어 배열(수어 글로스)로 옮긴다.
// 아바타가 손을 움직이는 진짜 수어 영상이 아니라, 수어 어순으로 읽는 자막용 단어다.

export type GlossScene = { id: string; text: string };

const MAX_WORDS = 8;
/** 이모지·문장부호는 수어 단어가 될 수 없다 */
const DROP = /[\p{Extended_Pictographic}\p{P}\p{S}]/gu;

/** LLM 이 준 단어 하나를 다듬는다. 남는 게 없으면 빈 문자열 */
const cleanWord = (word: unknown): string =>
  typeof word === "string" ? word.replace(DROP, "").replace(/\s+/g, "").slice(0, 12) : "";

function cleanWords(words: unknown): string[] {
  if (!Array.isArray(words)) return [];
  return words.map(cleanWord).filter(Boolean).slice(0, MAX_WORDS);
}

/**
 * LLM 이 장면을 빠뜨렸을 때 쓰는 대비책: 문장을 띄어쓰기로 자르고 흔한 조사·어미를 떼어 낸다.
 * 제대로 된 수어 어순은 아니지만, 빈 칸보다는 낫다.
 */
function fallbackWords(text: string): string[] {
  return text
    .replace(DROP, " ")
    .split(/\s+/)
    .map((word) => word.replace(/(은|는|이|가|을|를|에서|에게|에|으로|로|와|과|도|만|의)$/, "") || word)
    .filter((word) => word.length > 0)
    .slice(0, MAX_WORDS);
}

/**
 * 장면 자막들을 한국수어 어순 단어로 옮긴다.
 * 돌려주는 Map 의 키는 장면 id. LLM 호출이 실패하면 빈 Map (수어 자막 없이 재생된다).
 */
export async function signGloss(scenes: GlossScene[]): Promise<Map<string, string[]>> {
  const targets = scenes.filter((scene) => scene.text.trim().length > 0);
  if (targets.length === 0) return new Map();

  const user = targets.map((scene, i) => `${i + 1}. id=${scene.id}\n문장: ${scene.text}`).join("\n\n");
  const raw = await chatJSON<RawGloss>({
    system: SIGN_SYSTEM_PROMPT,
    user: `아래 ${targets.length}개 장면을 한국수어 어순 단어로 옮겨줘.\n\n${user}`,
    schemaName: "sign_gloss",
    schema: glossSchema,
  });

  const byId = new Map<string, string[]>();
  for (const scene of Array.isArray(raw?.scenes) ? raw.scenes : []) {
    const words = cleanWords(scene?.words);
    if (typeof scene?.id === "string" && words.length > 0) byId.set(scene.id, words);
  }
  return new Map(targets.map((scene) => [scene.id, byId.get(scene.id) ?? fallbackWords(scene.text)]));
}
