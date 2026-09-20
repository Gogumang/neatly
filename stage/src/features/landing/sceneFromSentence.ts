import type { Template } from "@/entities/talk/model";

// 방문자가 넣은 문장을 그 자리에서 장면으로 바꾼다.
// 서버 대본 생성(LLM)의 아주 단순한 맛보기 버전이다.

const METRIC = /(\d[\d,.]*)\s*(%|배|분|시간|초|일|주|개월|건|명|개|원|점|위|ms|초|MB|GB)/g;
const QUOTE = /[""]([^""]{2,40})[""]|"([^"]{2,40})"/;
const STOPWORDS = new Set(["그리고", "하지만", "그래서", "정말", "너무", "이제", "우리", "저는", "제가"]);

const emphasize = (text: string, phrase: string) => (phrase ? text.replace(phrase, `⭐${phrase}⭐`) : text);

/** 숫자 성과 장면. 마지막 숫자를 결과로 보고, 단위가 같으면 "이전 → 이후" 로 */
function metricScene(text: string, metrics: RegExpMatchArray[]) {
  const last = metrics.at(-1);
  if (!last) return null;
  const first = metrics[0];
  const [phrase, value = "", unit = ""] = last;
  const changed = first && first !== last;
  return {
    subtitle: emphasize(text, phrase),
    template: {
      type: "rollingNumber" as const,
      ...(changed && first[2] === unit ? { from: Number((first[1] ?? "").replace(/,/g, "")) } : {}),
      to: Number(value.replace(/,/g, "")),
      suffix: unit,
      caption: changed ? `${first[0]} → ${phrase}` : phrase,
    },
  };
}

/** 조사·짧은 단어를 뺀 핵심 낱말 3개 */
function keywords(text: string): string[] {
  const words = text
    .replace(/[.,!?~"'"']/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/(을|를|이|가|은|는|에|에서|으로|로|와|과|도|만|까지|부터)$/, ""))
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
  return [...new Set(words)].sort((a, b) => b.length - a.length).slice(0, 3);
}

/** 문장 하나 → 자막 + 장면 */
export function sceneFromSentence(input: string): { subtitle: string; template: Template } {
  const text = input.trim().replace(/\s+/g, " ").slice(0, 60);

  const metric = metricScene(text, [...text.matchAll(METRIC)]);
  if (metric) return metric;

  const quoted = text.match(QUOTE);
  const said = quoted?.[1] ?? quoted?.[2];
  if (said) {
    return {
      subtitle: emphasize(text, said),
      template: { type: "chat", messages: [{ name: "그때", text: said }] },
    };
  }

  const words = keywords(text);
  const phrase = words[0] ?? text;
  if (words.length >= 2) return { subtitle: emphasize(text, phrase), template: { type: "keywords", keywords: words } };
  return { subtitle: emphasize(text, phrase), template: { type: "title", title: phrase } };
}
