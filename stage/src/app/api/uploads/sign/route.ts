import { matchesEditKey } from "@/server/editKey";
import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { getTalk } from "@/server/store";
import {
  directUploadTarget,
  isImageType,
  isMediaType,
  isVideoType,
  MAX_UPLOAD_BYTES,
  MAX_VIDEO_BYTES,
} from "@/server/uploads";

type Body = { kind?: unknown; type?: unknown; size?: unknown; talkId?: unknown };

const bad = (error: string, status = 400) => Response.json({ error }, { status });

/** 이미지·영상 종류와 크기 확인. 문제가 있으면 에러 응답 */
function checkFile(kind: unknown, type: string, size: number): Response | null {
  if (kind === "image") {
    if (!isImageType(type)) return bad("PNG, JPG, WEBP, GIF 이미지만 올릴 수 있어요");
    return size > MAX_UPLOAD_BYTES ? bad("이미지는 5MB 이하로 올려주세요") : null;
  }
  if (kind === "video") {
    if (!isVideoType(type)) return bad("MP4, WEBM, MOV 영상만 올릴 수 있어요");
    return size > MAX_VIDEO_BYTES ? bad("영상은 100MB 이하로 올려주세요") : null;
  }
  return bad("무엇을 올릴지 알 수 없어요");
}

/** 수어 영상은 나레이션을 만든 사람(수정 키)만 */
async function checkVideoOwner(request: Request, talkId: unknown): Promise<Response | null> {
  const talk = typeof talkId === "string" ? await getTalk(talkId) : null;
  if (talk && matchesEditKey(talk.editKey, request.headers.get("x-edit-key"))) return null;
  return bad("이 나레이션을 만든 브라우저에서만 수어 영상을 올릴 수 있어요", 403);
}

/** 업로드 준비. Supabase 를 쓰면 브라우저가 직접 올릴 1회용 주소를, 아니면 { mode: "server" } 를 준다 */
export async function POST(request: Request) {
  if (!allow(`upload-sign:${clientIp(request)}`, 40, 10 * 60_000)) return tooMany();
  const body = (await request.json().catch(() => null)) as Body | null;
  const type = typeof body?.type === "string" ? body.type : "";
  const size = typeof body?.size === "number" ? body.size : Number.POSITIVE_INFINITY;

  const problem =
    checkFile(body?.kind, type, size) ?? (body?.kind === "video" ? await checkVideoOwner(request, body.talkId) : null);
  if (problem) return problem;
  if (!isMediaType(type)) return bad("올릴 수 없는 파일이에요");

  const target = await directUploadTarget(type);
  return Response.json(target ? { mode: "direct", ...target } : { mode: "server" });
}
