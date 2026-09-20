import { keyPhrase } from "@/entities/talk/emphasis";
import type { Template } from "@/entities/talk/model";

// LLM 이 자주 어기는 구성 규칙을 코드로 한 번 더 맞춘다

type Scene = { text: string; template: Template };

/** 한 나레이션에서 템플릿별 최대 횟수 */
const LIMITS: Partial<Record<Template["type"], number>> = { rollingNumber: 3, title: 3, speaker: 2 };

const mediaOf = (t: Template) => (t.type === "image" ? t.src : t.type === "mockup" ? t.media?.src : undefined);

/** 앞 장면과 겹치지 않고, 횟수 제한에도 걸리지 않는 가장 단순한 대체 장면 */
function alternative(scene: Scene, prev: Template | undefined, canUseTitle: boolean): Template {
  const word =
    scene.template.type === "rollingNumber" && scene.template.caption ? scene.template.caption : keyPhrase(scene.text);
  return prev?.type === "keywords" && canUseTitle
    ? { type: "title", title: word }
    : { type: "keywords", keywords: [word] };
}

type Tally = { counts: Map<Template["type"], number>; usedMedia: Set<string> };

/** 횟수 초과, 이미 쓴 이미지, 앞 장면과 같은 템플릿이면 바꿔야 한다 */
function mustReplace(template: Template, prev: Template | undefined, tally: Tally) {
  const overLimit = (tally.counts.get(template.type) ?? 0) >= (LIMITS[template.type] ?? Number.POSITIVE_INFINITY);
  const media = mediaOf(template);
  return overLimit || (media !== undefined && tally.usedMedia.has(media)) || prev?.type === template.type;
}

function record(template: Template, tally: Tally) {
  tally.counts.set(template.type, (tally.counts.get(template.type) ?? 0) + 1);
  const media = mediaOf(template);
  if (media) tally.usedMedia.add(media);
}

export function enforceRules<T extends Scene>(scenes: T[], opts: { hasAvatar: boolean }): T[] {
  const tally: Tally = { counts: new Map(), usedMedia: new Set() };
  const out = scenes.map((scene) => ({ ...scene }));

  for (const [i, scene] of out.entries()) {
    const prev = out[i - 1]?.template;
    if (mustReplace(scene.template, prev, tally)) {
      scene.template = alternative(scene, prev, (tally.counts.get("title") ?? 0) < (LIMITS.title ?? 0));
    }
    record(scene.template, tally);
  }

  // 사진을 올렸는데 발표자 장면이 없으면, 마무리 인사를 발표자가 하게 한다
  const last = out.at(-1);
  if (opts.hasAvatar && last && !out.some((s) => s.template.type === "speaker")) last.template = { type: "speaker" };
  return out;
}
