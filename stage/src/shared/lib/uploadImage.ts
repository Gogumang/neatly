import { uploadDirect } from "./uploadFile";

/** 이미지 파일을 올리고 URL 을 받는다 */
export async function uploadImage(file: File): Promise<string> {
  const direct = await uploadDirect(file, { kind: "image" });
  if (direct) return direct;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "이미지를 올리지 못했어요");
  return data.url;
}
