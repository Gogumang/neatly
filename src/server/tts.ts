import { delay } from "es-toolkit/promise";
import "server-only";

const MODEL = process.env.TTS_MODEL ?? "gpt-4o-mini-tts";
const INSTRUCTIONS =
  "한국어 테크 컨퍼런스 발표자처럼 말해요. 밝고 따뜻하지만 차분하게, 문장 끝을 또렷하게. 너무 빠르지 않게.";

const TIMEOUT_MS = 30_000;

async function requestSpeech(text: string, voice: string): Promise<Buffer> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, voice, input: text, instructions: INSTRUCTIONS, response_format: "mp3" }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new TtsError(res.status, await res.text());
  return Buffer.from(await res.arrayBuffer());
}

class TtsError extends Error {
  constructor(
    readonly status: number,
    body: string,
  ) {
    super(`TTS ${status}: ${body}`);
  }
}

/** 요청이 너무 많거나(429) 서버 오류·시간 초과면 잠깐 쉬었다가 다시. 잘못된 요청(4xx)은 다시 해도 같다 */
const retryDelay = (e: unknown) => {
  if (!(e instanceof TtsError)) return 500;
  if (e.status === 429) return 1500;
  return e.status >= 500 ? 500 : null;
};

/** 문장 하나를 mp3 로. 가끔 응답이 멈추거나 몰리는 경우가 있어 한 번 다시 시도한다 */
export async function synthesize(text: string, voice: string): Promise<Buffer> {
  try {
    return await requestSpeech(text, voice);
  } catch (e) {
    const wait = retryDelay(e);
    if (wait === null) throw e;
    await delay(wait);
    return requestSpeech(text, voice);
  }
}
