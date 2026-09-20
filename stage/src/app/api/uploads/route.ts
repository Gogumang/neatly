import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { isImageType, MAX_UPLOAD_BYTES, saveUpload } from "@/server/uploads";

export async function POST(request: Request) {
  if (!allow(`uploads:${clientIp(request)}`, 40, 10 * 60_000)) return tooMany();
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "이미지를 골라주세요" }, { status: 400 });
  if (!isImageType(file.type))
    return Response.json({ error: "PNG, JPG, WEBP, GIF 이미지만 올릴 수 있어요" }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: "이미지는 5MB 이하로 올려주세요" }, { status: 400 });

  const url = await saveUpload(Buffer.from(await file.arrayBuffer()), file.type);
  return Response.json({ url });
}
