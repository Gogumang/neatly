import { postJson } from "./postJson";

type Target = { mode: "direct"; uploadUrl: string; url: string } | { mode: "server" };

type Options = { kind: "image" | "video"; talkId?: string; editKey?: string };

/**
 * 파일을 저장소로 올린다.
 * - direct: 서버가 준 1회용 주소로 브라우저가 바로 올린다 (서버 요청 크기 제한을 피한다) → 공개 주소
 * - server: 저장소가 없는 개발 환경. null 을 돌려주면 호출한 쪽이 서버로 직접 보낸다
 */
export async function uploadDirect(file: File, opts: Options): Promise<string | null> {
  const headers: Record<string, string> = opts.editKey ? { "x-edit-key": opts.editKey } : {};
  const target = await postJson<Target>(
    "/api/uploads/sign",
    { kind: opts.kind, type: file.type, size: file.size, talkId: opts.talkId },
    headers,
  );
  if (target.mode === "server") return null;

  // Supabase 서명 업로드 형식: multipart 에 cacheControl 과 이름 없는 파일 필드
  const form = new FormData();
  form.append("cacheControl", "31536000");
  form.append("", file);
  const res = await fetch(target.uploadUrl, { method: "PUT", body: form, headers: { "x-upsert": "false" } });
  if (!res.ok) throw new Error("파일을 올리지 못했어요. 잠시 후 다시 시도해주세요.");
  return target.url;
}
