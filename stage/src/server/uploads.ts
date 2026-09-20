import "server-only";
import { isSafeId, newId } from "./dataDir";
import { putMedia, readMedia } from "./media";
import { publicPrefix, signedUploadUrl, supabaseEnabled } from "./supabase";

// 사용자가 올린 파일: 이미지(프로필 사진·스크린샷), 영상(수어 통역)
// Supabase 가 있으면 브라우저가 서명된 주소로 직접 올리고(서버 요청 크기 제한 회피), 없으면 서버가 받아 로컬에 둔다.

const IMAGE_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" } as const;
const VIDEO_TYPES = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" } as const;
const TYPES = { ...IMAGE_TYPES, ...VIDEO_TYPES };

type ImageType = keyof typeof IMAGE_TYPES;
type VideoType = keyof typeof VIDEO_TYPES;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export const isImageType = (type: string): type is ImageType => type in IMAGE_TYPES;
export const isVideoType = (type: string): type is VideoType => type in VIDEO_TYPES;
export const isMediaType = (type: string): type is ImageType | VideoType => isImageType(type) || isVideoType(type);

const MIME_BY_EXT: Record<string, string> = Object.fromEntries(Object.entries(TYPES).map(([mime, ext]) => [ext, mime]));
const NAME = /^[a-z0-9-]+\.(png|jpg|webp|gif|mp4|webm|mov)$/i;

const newName = (type: ImageType | VideoType) => `${newId()}.${TYPES[type]}`;

/** 우리가 저장한 업로드 파일이면 파일 이름, 아니면 null. 로컬 /api/uploads/… 또는 Supabase 공개 주소 …/uploads/… */
function uploadName(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const prefix = supabaseEnabled ? `${publicPrefix()}uploads/` : "/api/media/uploads/";
  if (!url.startsWith(prefix)) return null;
  const name = url.slice(prefix.length);
  return NAME.test(name) ? name : null;
}

export const isUploadUrl = (url: unknown): url is string => uploadName(url) !== null;

/** 서버가 가진 파일을 저장하고 주소를 돌려준다 (링크에서 가져온 이미지 등) */
export async function saveUpload(bytes: Buffer, type: ImageType | VideoType): Promise<string> {
  return putMedia(`uploads/${newName(type)}`, bytes, type);
}

/** 브라우저가 직접 올릴 곳. Supabase 가 없으면 null (서버로 올리면 된다) */
export async function directUploadTarget(
  type: ImageType | VideoType,
): Promise<{ uploadUrl: string; url: string } | null> {
  if (!supabaseEnabled) return null;
  const objectPath = `uploads/${newName(type)}`;
  return { uploadUrl: await signedUploadUrl(objectPath), url: `${publicPrefix()}${objectPath}` };
}

async function readUpload(name: string): Promise<{ bytes: Buffer; type: string } | null> {
  if (!NAME.test(name) || !isSafeId(name.split(".")[0] ?? "")) return null;
  return readMedia(`uploads/${name}`);
}

/** 우리 업로드 파일 → LLM 에 보낼 data URL */
export async function uploadAsDataUrl(url: string): Promise<string | null> {
  const name = uploadName(url);
  if (!name) return null;
  if (!supabaseEnabled) {
    const file = await readUpload(name);
    return file && `data:${file.type};base64,${file.bytes.toString("base64")}`;
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) }).catch(() => null);
  if (!res?.ok) return null;
  const type = res.headers.get("content-type") ?? MIME_BY_EXT[name.split(".")[1] ?? ""] ?? "image/png";
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
}
