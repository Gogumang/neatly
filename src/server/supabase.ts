import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY 가 있으면 Supabase(DB + 저장소), 없으면 로컬 파일(.data/)을 쓴다.
// service role 키는 서버에서만 쓴다. 브라우저에는 서명된 업로드 주소만 건넨다.

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET ?? "media";

export const supabaseEnabled = Boolean(SUPABASE_URL && SERVICE_KEY);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Supabase 환경변수가 없어요");
  client ??= createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  return client;
}

/** 공개 버킷 파일 주소의 앞부분. 우리 저장소 파일인지 확인할 때 쓴다 */
export const publicPrefix = () => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

export const publicUrl = (path: string) => `${publicPrefix()}${path}`;

/** 저장소에 올리고 공개 주소를 돌려준다 */
export async function putObject(path: string, bytes: Buffer, contentType: string): Promise<string> {
  const { error } = await supabase()
    .storage.from(BUCKET)
    .upload(path, bytes, { contentType, upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(`저장소 업로드 실패: ${error.message}`);
  return publicUrl(path);
}

/** 브라우저가 직접 올릴 수 있는 1회용 업로드 주소 */
export async function signedUploadUrl(path: string): Promise<string> {
  const { data, error } = await supabase().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(`업로드 주소 발급 실패: ${error?.message}`);
  return data.signedUrl;
}
