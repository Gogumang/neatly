import { matchesEditKey } from "@/server/editKey";
import { getTalk, updateTalk } from "@/server/store";
import { isUploadUrl, isVideoType, MAX_VIDEO_BYTES, saveUpload } from "@/server/uploads";

export const maxDuration = 60;

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

/** 서버로 직접 받은 영상(로컬 모드) → 저장 후 주소. 문제가 있으면 에러 메시지 */
async function receiveVideo(request: Request): Promise<string | { error: string }> {
  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return { error: "영상을 골라주세요" };
  if (!isVideoType(file.type)) return { error: "MP4, WEBM, MOV 영상만 올릴 수 있어요" };
  if (file.size > MAX_VIDEO_BYTES) return { error: "영상은 100MB 이하로 올려주세요" };
  return saveUpload(Buffer.from(await file.arrayBuffer()), file.type);
}

/**
 * 나레이션에 수어 통역 영상을 붙인다. 나레이션을 만든 사람(수정 키)만 할 수 있다.
 * - Supabase: 브라우저가 직접 올린 뒤 { url } 만 보낸다
 * - 로컬: 영상 파일을 multipart 로 보낸다
 */
export async function POST(request: Request, ctx: RouteContext<"/api/talks/[id]/sign">) {
  const { id } = await ctx.params;
  const talk = await getTalk(id);
  if (!talk) return Response.json({ error: "나레이션을 찾을 수 없어요" }, { status: 404 });
  if (!matchesEditKey(talk.editKey, request.headers.get("x-edit-key"))) {
    return Response.json({ error: "이 나레이션을 만든 브라우저에서만 수어 영상을 올릴 수 있어요" }, { status: 403 });
  }

  const isJson = request.headers.get("content-type")?.includes("application/json");
  const received = isJson
    ? ((await request.json().catch(() => null)) as { url?: unknown } | null)?.url
    : await receiveVideo(request);
  if (received && typeof received === "object") return Response.json(received, { status: 400 });
  if (!isUploadUrl(received) || !VIDEO_EXT.test(received)) {
    return Response.json({ error: "올린 영상을 찾을 수 없어요" }, { status: 400 });
  }

  await updateTalk(id, () => ({ signVideoUrl: received }));
  return Response.json({ signVideoUrl: received });
}
