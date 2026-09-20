import "server-only";
import { limitAsync } from "es-toolkit/promise";
import { plainText } from "@/entities/talk/emphasis";
import type { Segment, Talk } from "@/entities/talk/model";
import { generateImage } from "@/server/cover/image";
import { savePanel } from "@/server/store";
import { panelPrompt, webtoonLook } from "./prompt";
import { type WebtoonLook, webtoonPlan } from "./scene";

// 장면마다 웹툰 칸 그림 한 장. 그림 생성이 느려서 동시에 세 장까지만 보낸다.
const CONCURRENCY = 3;

type PanelTalk = Pick<Talk, "id" | "title" | "summary" | "genre">;

type Draft = { segment: Segment; index: number; total: number; scene: string };

/** 칸 하나를 그려 저장한다. 실패하면 null — 그 칸만 글자로 남고 나머지는 계속 그린다 */
async function drawPanel(talkId: string, look: WebtoonLook, draft: Draft): Promise<[string, string] | null> {
  try {
    const prompt = panelPrompt(look, { index: draft.index, total: draft.total, scene: draft.scene });
    const jpeg = await generateImage(prompt, "panel");
    if (!jpeg) return null;
    return [draft.segment.id, await savePanel(talkId, draft.segment.id, jpeg)];
  } catch (e) {
    console.error(`장면 ${draft.segment.id} 웹툰 칸 실패`, e);
    return null;
  }
}

/**
 * 장면들을 웹툰 칸으로 그린다. 돌려주는 Map 의 키는 장면 id, 값은 그림 주소.
 * 그리지 못한 장면은 Map 에 없다 (자막만 읽힌다).
 */
export async function drawPanels(talk: PanelTalk, segments: Segment[]): Promise<Map<string, string>> {
  if (segments.length === 0) return new Map();

  const scenes = segments.map((segment) => ({ id: segment.id, text: plainText(segment.text) }));
  const plan = await webtoonPlan(talk, scenes);
  const look = webtoonLook(talk, plan);
  const planned = new Map((plan?.panels ?? []).map((panel) => [panel.id, panel.scene]));

  const drafts: Draft[] = segments.map((segment, i) => ({
    segment,
    index: i + 1,
    total: segments.length,
    // 콘티가 빠진 칸은 자막을 그대로 소재로 삼는다
    scene: planned.get(segment.id) || plainText(segment.text),
  }));

  const draw = limitAsync((draft: Draft) => drawPanel(talk.id, look, draft), CONCURRENCY);
  const drawn = await Promise.all(drafts.map((draft) => draw(draft)));
  return new Map(drawn.filter((entry): entry is [string, string] => entry !== null));
}
