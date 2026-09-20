import { keyPhrase } from "@/entities/talk/emphasis";
import type { Segment, Template } from "@/entities/talk/model";
import { groundRollingNumber, numbersIn } from "./grounding";
import { enforceRules } from "./rules";
import type { RawTalk, RawTemplate } from "./schema";

/** 대본을 맞춰 볼 재료: 올린 이미지, 발표자 사진 여부, 원문(숫자 근거 확인용) */
export type ScriptAssets = { images: string[]; hasAvatar: boolean; source: string };

// null → 속성 제거 (재귀)
function dropNulls<T>(value: T): T {
  if (Array.isArray(value)) return value.map(dropNulls) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, dropNulls(v)]),
    ) as T;
  }
  return value;
}

/** 쓸 수 없는 장면(없는 이미지·사진, 근거 없는 숫자)은 자막의 핵심 구절을 보여주는 장면으로 바꾼다 */
function fallback(text: string): Template {
  return { type: "keywords", keywords: [keyPhrase(text)] };
}

type Resolved = Record<string, unknown> & { type: string };

function resolveMockup(rest: Resolved, image: string | undefined, text: string): Template {
  if (image) return { type: "mockup", media: { kind: "image", src: image } };
  return rest.screen ? (rest as Template) : fallback(text);
}

function resolveRolling(rest: Resolved, text: string, sourceNumbers: Set<number>): Template {
  const number = rest as Extract<Template, { type: "rollingNumber" }>;
  if (number.from === number.to) delete number.from;
  return groundRollingNumber(number, sourceNumbers) ?? fallback(number.caption ?? text);
}

/** LLM 이 준 이미지 번호를 실제 URL 로 바꾸고, 쓸 수 없는 장면은 대체한다 */
function resolveTemplate(raw: RawTemplate, text: string, assets: ScriptAssets, sourceNumbers: Set<number>): Template {
  const { imageIndex, ...rest } = dropNulls(raw);
  const image = typeof imageIndex === "number" ? assets.images[imageIndex - 1] : undefined;
  switch (rest.type) {
    case "image":
      return image ? ({ ...rest, src: image } as Template) : fallback(text);
    case "speaker":
      return assets.hasAvatar ? { type: "speaker" } : fallback(text);
    case "mockup":
      return resolveMockup(rest, image, text);
    case "rollingNumber":
      return resolveRolling(rest, text, sourceNumbers);
    default:
      return rest as Template;
  }
}

/** LLM 결과를 플레이어가 쓰는 장면 목록으로. 템플릿 규칙을 코드로 한 번 더 보정한다 */
export function toSegments(raw: RawTalk, assets: ScriptAssets): Segment[] {
  const sourceNumbers = numbersIn(assets.source);
  const scenes = raw.segments.map((s) => ({
    ...s,
    template: resolveTemplate(s.template, s.text, assets, sourceNumbers),
  }));
  return enforceRules(scenes, assets).map((s, i) => {
    const isTitle = s.template.type === "title";
    return {
      id: `s${i + 1}`,
      text: s.text,
      theme: isTitle ? "dark" : "light",
      size: isTitle ? "large" : s.size,
      template: s.template,
    };
  });
}
