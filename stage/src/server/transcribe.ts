import "server-only";
import type { SpokenWord } from "@/entities/talk/model";

/** 만든 나레이션 mp3 를 다시 받아써서 단어별 발화 시간을 얻는다 (노래방 자막용) */
export async function wordTimings(mp3: Buffer): Promise<{ words: SpokenWord[]; duration?: number }> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(mp3)], { type: "audio/mpeg" }), "narration.mp3");
  form.append("model", "whisper-1");
  form.append("language", "ko");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
    // 자막 연출용이라 오래 기다리지 않는다. 넘으면 호출한 쪽에서 진행률 비례 자막으로 대신한다
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`transcribe ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { duration?: number; words?: { word: string; start: number; end: number }[] };
  return {
    words: (data.words ?? []).map((w) => ({ text: w.word.trim(), start: w.start, end: w.end })),
    duration: data.duration,
  };
}
