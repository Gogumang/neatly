import "server-only";
import { assertId, isSafeId } from "./dataDir";
import { dbEnabled } from "./db";
import { putMedia, readMedia } from "./media";
import { supabaseEnabled } from "./supabase";
import { localRepo } from "./talks/localRepo";
import { postgresRepo } from "./talks/postgresRepo";
import type { StoredTalk } from "./talks/repo";
import { supabaseRepo } from "./talks/supabaseRepo";

// 나레이션·음성 저장소. Supabase 환경변수가 있으면 Supabase, 없으면 로컬 파일(.data/)

export type { StoredTalk } from "./talks/repo";

const repo = supabaseEnabled ? supabaseRepo : dbEnabled ? postgresRepo : localRepo;

/** 화면에 넘겨도 되는 부분만 */
export function toPublicTalk({ editKey: _secret, ...talk }: StoredTalk): Omit<StoredTalk, "editKey"> {
  return talk;
}

export const saveTalk = (talk: StoredTalk) => repo.save(talk);

export const getTalk = (id: string) => (isSafeId(id) ? repo.get(id) : Promise.resolve(null));

export const listTalks = () => repo.list();

/**
 * 다시 읽은 최신 나레이션에 바꿀 부분만 덮어쓴다.
 * 오래 걸리는 작업(목소리 입히기) 중에 다른 요청이 저장한 값(좋아요, 수어 영상)을 지우지 않기 위해서다.
 */
export async function updateTalk(
  id: string,
  change: (latest: StoredTalk) => Partial<StoredTalk>,
): Promise<StoredTalk | null> {
  const latest = await getTalk(id);
  if (!latest) return null;
  const next = { ...latest, ...change(latest), id: latest.id };
  await repo.save(next);
  return next;
}

export async function likeTalk(id: string): Promise<number> {
  const likes = isSafeId(id) ? await repo.like(id) : null;
  if (likes === null) throw new Error("나레이션을 찾을 수 없어요");
  return likes;
}

/** 저장하고, 플레이어가 재생할 URL 을 돌려준다 */
export async function saveAudio(id: string, segId: string, mp3: Buffer): Promise<string> {
  assertId(id, segId);
  return putMedia(`audio/${id}/${segId}.mp3`, mp3, "audio/mpeg");
}

export async function readAudio(id: string, segId: string): Promise<Buffer | null> {
  if (!isSafeId(id) || !isSafeId(segId)) return null;
  const file = await readMedia(`audio/${id}/${segId}.mp3`);
  return file?.bytes ?? null;
}
