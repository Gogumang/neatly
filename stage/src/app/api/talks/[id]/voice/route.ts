import { limitAsync } from "es-toolkit/promise";
import { plainText } from "@/entities/talk/emphasis";
import type { Segment } from "@/entities/talk/model";
import { DEFAULT_VOICE, isVoiceId, type VoiceId } from "@/entities/talk/voices";
import { ELEVENLABS_CONCURRENCY, elevenLabsEnabled } from "@/server/elevenlabs";
import { narrate } from "@/server/narrate";
import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { getTalk, saveAudio, updateTalk } from "@/server/store";

export const maxDuration = 60;

// 제공자가 허용하는 만큼만 동시에 보낸다
const CONCURRENCY = elevenLabsEnabled ? ELEVENLABS_CONCURRENCY : 6;

/** 장면 하나에 목소리를 입힌다. 실패하면 그 장면은 음성 없이 두고(플레이어가 브라우저 음성으로 읽는다) 계속한다 */
async function voiceScene(talkId: string, seg: Segment, voiceId: VoiceId): Promise<Segment> {
  try {
    const { mp3, words, duration } = await narrate(plainText(seg.text), voiceId);
    const audioUrl = await saveAudio(talkId, seg.id, mp3);
    return { ...seg, audioUrl, words, duration };
  } catch (e) {
    console.error(`장면 ${seg.id} 목소리 실패`, e);
    return seg;
  }
}

// 장면마다 나레이션 mp3 를 만들어 붙인다
export async function POST(request: Request, ctx: RouteContext<"/api/talks/[id]/voice">) {
  const { id } = await ctx.params;
  const talk = await getTalk(id);
  if (!talk) return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });
  if (talk.voiced) return Response.json({ ok: true });
  if (!allow(`voice:${clientIp(request)}`, 10, 10 * 60_000)) return tooMany();

  const voiceId = isVoiceId(talk.voice) ? talk.voice : DEFAULT_VOICE;
  const voice = limitAsync((seg: Segment) => voiceScene(id, seg, voiceId), CONCURRENCY);
  const segments = await Promise.all(talk.segments.map(voice));
  const voicedCount = segments.filter((s) => s.audioUrl).length;
  // 목소리를 입히는 동안 수어 자막이 먼저 저장됐을 수 있다. 최신 장면에 소리만 얹는다
  const sound = new Map(segments.map((s) => [s.id, { audioUrl: s.audioUrl, words: s.words, duration: s.duration }]));
  await updateTalk(id, (latest) => ({
    segments: latest.segments.map((seg) => ({ ...seg, ...sound.get(seg.id) })),
    voiced: true,
  }));
  return Response.json({ ok: true, voiced: voicedCount, total: segments.length });
}
