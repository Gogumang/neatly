"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readEditKey } from "@/shared/lib/editKeys";
import { postJson } from "@/shared/lib/postJson";
import { uploadDirect } from "@/shared/lib/uploadFile";

/** 저장소가 없는 개발 환경: 영상을 서버로 바로 보낸다 */
async function sendToServer(talkId: string, file: File, editKey: string) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`/api/talks/${talkId}/sign`, {
    method: "POST",
    body: form,
    headers: { "x-edit-key": editKey },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "영상을 올리지 못했어요");
}

export function useSignUpload(talkId: string) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function upload(file: File) {
    const editKey = readEditKey(talkId);
    if (!editKey) return setError("이 나레이션을 만든 브라우저에서만 수어 영상을 올릴 수 있어요");
    setBusy(true);
    setError(undefined);
    try {
      // 큰 영상은 저장소로 직접 올리고, 나레이션에는 주소만 붙인다
      const url = await uploadDirect(file, { kind: "video", talkId, editKey });
      if (url) await postJson(`/api/talks/${talkId}/sign`, { url }, { "x-edit-key": editKey });
      else await sendToServer(talkId, file, editKey);
      router.push(`/talks/${talkId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "영상을 올리지 못했어요");
    } finally {
      setBusy(false);
    }
  }

  return { upload, busy, error };
}
