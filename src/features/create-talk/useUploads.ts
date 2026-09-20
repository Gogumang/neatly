"use client";

import { useState } from "react";
import { uploadImage } from "@/shared/lib/uploadImage";

/** 여러 파일을 순서대로 올리고, 올리는 중·에러 상태를 알려준다 */
export function useUploads() {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string>();

  async function upload(files: File[]): Promise<string[]> {
    setError(undefined);
    setUploading((n) => n + files.length);
    const urls: string[] = [];
    for (const file of files) {
      try {
        urls.push(await uploadImage(file));
      } catch (e) {
        setError(e instanceof Error ? e.message : "이미지를 올리지 못했어요");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    return urls;
  }

  return { upload, uploading: uploading > 0, error };
}
