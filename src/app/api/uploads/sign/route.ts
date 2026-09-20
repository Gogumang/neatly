import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { directUploadTarget, isImageType, MAX_UPLOAD_BYTES } from "@/server/uploads";

type Body = { type?: unknown; size?: unknown };

const bad = (error: string) => Response.json({ error }, { status: 400 });

/** 이미지 업로드 준비. Supabase 를 쓰면 브라우저가 직접 올릴 1회용 주소를, 아니면 { mode: "server" } 를 준다 */
export async function POST(request: Request) {
  if (!allow(`upload-sign:${clientIp(request)}`, 40, 10 * 60_000)) return tooMany();
  const body = (await request.json().catch(() => null)) as Body | null;
  const type = typeof body?.type === "string" ? body.type : "";
  const size = typeof body?.size === "number" ? body.size : Number.POSITIVE_INFINITY;

  if (!isImageType(type)) return bad("PNG, JPG, WEBP, GIF 이미지만 올릴 수 있어요");
  if (size > MAX_UPLOAD_BYTES) return bad("이미지는 5MB 이하로 올려주세요");

  const target = await directUploadTarget(type);
  return Response.json(target ? { mode: "direct", ...target } : { mode: "server" });
}
