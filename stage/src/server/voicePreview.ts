import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { VoiceId } from "@/entities/talk/voices";
import { dataDir } from "./dataDir";
import { narrate } from "./narrate";
import { publicUrl, putObject, supabaseEnabled } from "./supabase";

const SAMPLE = "안녕하세요. 제가 AI로 문제를 해결한 이야기를 들려드릴게요.";

// 한 번 만든 미리듣기는 저장해 두고 재사용한다 (Supabase 저장소 또는 로컬 파일).
// 저장은 다음 요청을 빠르게 하려는 것뿐이라, 읽기·쓰기가 실패해도 새로 만들어 들려준다.

async function readCached(voice: VoiceId): Promise<Buffer | null> {
  if (!supabaseEnabled) return readFile(dataDir("voice-previews", `${voice}.mp3`)).catch(() => null);
  const res = await fetch(publicUrl(`voice-previews/${voice}.mp3`), { signal: AbortSignal.timeout(5_000) }).catch(
    () => null,
  );
  return res?.ok ? Buffer.from(await res.arrayBuffer()) : null;
}

async function writeCache(voice: VoiceId, mp3: Buffer) {
  if (supabaseEnabled) return void (await putObject(`voice-previews/${voice}.mp3`, mp3, "audio/mpeg"));
  await mkdir(dataDir("voice-previews"), { recursive: true });
  await writeFile(dataDir("voice-previews", `${voice}.mp3`), mp3);
}

export async function voicePreview(voice: VoiceId): Promise<Buffer> {
  const cached = await readCached(voice);
  if (cached) return cached;
  const { mp3 } = await narrate(SAMPLE, voice);
  await writeCache(voice, mp3).catch(() => {});
  return mp3;
}
