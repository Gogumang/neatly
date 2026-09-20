import "server-only";
import type { SpokenWord } from "@/entities/talk/model";
import { DEFAULT_VOICE, type VoiceId, voiceOf } from "@/entities/talk/voices";
import { elevenLabsEnabled, speakWithTimings } from "./elevenlabs";
import { wordTimings } from "./transcribe";
import { synthesize } from "./tts";

// 나레이션 한 문장 만들기.
// ElevenLabs 키가 있으면 음성과 단어별 시각을 한 번에 받고, 없으면 OpenAI TTS + 받아쓰기로 만든다.

export type Narration = { mp3: Buffer; words?: SpokenWord[]; duration?: number };

export async function narrate(text: string, voiceId: VoiceId = DEFAULT_VOICE): Promise<Narration> {
  const voice = voiceOf(voiceId);
  if (elevenLabsEnabled) {
    const { mp3, words, duration } = await speakWithTimings(text, voice.elevenlabs);
    return { mp3, words: words.length ? words : undefined, duration: duration || undefined };
  }
  const mp3 = await synthesize(text, voice.openai);
  // 단어 시각은 자막 연출용이라 실패해도 나레이션은 만든다 (진행률 비례로 대신 채움)
  const timing = await wordTimings(mp3).catch(() => undefined);
  return { mp3, words: timing?.words, duration: timing?.duration };
}
