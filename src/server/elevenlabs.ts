import { delay } from "es-toolkit/promise";
import "server-only";
import type { SpokenWord } from "@/entities/talk/model";

// ElevenLabs 는 음성과 함께 글자별 발음 시각을 준다. 그래서 받아쓰기(whisper) 단계가 필요 없다.

const MODEL = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
const TIMEOUT_MS = 40_000;

export const elevenLabsEnabled = Boolean(process.env.ELEVENLABS_API_KEY);

/** 요금제마다 동시에 보낼 수 있는 요청 수가 정해져 있다 (기본 3) */
export const ELEVENLABS_CONCURRENCY = Number(process.env.ELEVENLABS_CONCURRENCY ?? 3);

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

/** 글자별 시각 → 단어별 시각 (공백에서 끊는다) */
export function toWords(alignment: Alignment): SpokenWord[] {
  const words: SpokenWord[] = [];
  let current: SpokenWord | null = null;
  alignment.characters.forEach((ch, i) => {
    const start = alignment.character_start_times_seconds[i] ?? 0;
    const end = alignment.character_end_times_seconds[i] ?? start;
    if (/\s/.test(ch)) {
      current = null;
      return;
    }
    if (current) {
      current.text += ch;
      current.end = end;
      return;
    }
    current = { text: ch, start, end };
    words.push(current);
  });
  return words;
}

async function request(text: string, voiceId: string): Promise<Response> {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "" },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

/** 문장 하나를 mp3 + 단어 시각으로. 동시 요청 제한(429)에 걸리면 잠깐 쉬었다 다시 시도한다 */
export async function speakWithTimings(
  text: string,
  voiceId: string,
): Promise<{ mp3: Buffer; words: SpokenWord[]; duration: number }> {
  let res = await request(text, voiceId);
  for (let wait = 700; !res.ok && res.status === 429 && wait <= 2800; wait *= 2) {
    await delay(wait);
    res = await request(text, voiceId);
  }
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as { audio_base64: string; alignment: Alignment | null };
  const words = data.alignment ? toWords(data.alignment) : [];
  return { mp3: Buffer.from(data.audio_base64, "base64"), words, duration: words.at(-1)?.end ?? 0 };
}
