import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { dataDir } from "./dataDir";
import { dbEnabled, query, queryOne } from "./db";
import { putObject, supabaseEnabled } from "./supabase";

// 음성·이미지·영상 파일. 저장 위치는 환경에 따라 세 가지다.
// 1) Supabase Storage (키가 있을 때)  2) Postgres stage.media  3) 로컬 .data/media (개발)

const SAFE_PATH = /^[a-z0-9/_-]+\.[a-z0-9]+$/i;

const mediaUrl = (objectPath: string) => `/api/media/${objectPath}`;

/** 저장하고 브라우저에서 쓸 URL 을 돌려준다 */
export async function putMedia(objectPath: string, bytes: Buffer, contentType: string): Promise<string> {
  if (!SAFE_PATH.test(objectPath)) throw new Error(`잘못된 경로: ${objectPath}`);
  if (supabaseEnabled) return putObject(objectPath, bytes, contentType);
  if (dbEnabled) {
    await query(
      `insert into stage.media (path, content_type, bytes) values ($1, $2, $3)
       on conflict (path) do update set content_type = excluded.content_type, bytes = excluded.bytes`,
      [objectPath, contentType, bytes],
    );
    return mediaUrl(objectPath);
  }
  const file = dataDir("media", objectPath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, bytes);
  return mediaUrl(objectPath);
}

export async function readMedia(objectPath: string): Promise<{ bytes: Buffer; type: string } | null> {
  if (!SAFE_PATH.test(objectPath) || objectPath.includes("..")) return null;
  if (dbEnabled) {
    const row = await queryOne<{ content_type: string; bytes: Buffer }>(
      "select content_type, bytes from stage.media where path = $1",
      [objectPath],
    );
    return row && { bytes: row.bytes, type: row.content_type };
  }
  const bytes = await readFile(dataDir("media", objectPath)).catch(() => null);
  return bytes && { bytes, type: guessType(objectPath) };
}

const TYPES: Record<string, string> = {
  mp3: "audio/mpeg",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

const guessType = (objectPath: string) => TYPES[objectPath.split(".").pop() ?? ""] ?? "application/octet-stream";
