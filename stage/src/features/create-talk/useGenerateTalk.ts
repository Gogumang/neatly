"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rememberEditKey } from "@/shared/lib/editKeys";
import { postJson } from "@/shared/lib/postJson";
import type { TalkInput } from "./funnel";

/** 0: 대본 쓰는 중, 1: 목소리 입히는 중, 2: 완성 */
export type GenerateProgress = 0 | 1 | 2;

/** 화면에 들어오면 한 번만 나레이션 생성을 시작하고, 끝나면 나레이션 페이지로 보낸다 */
export function useGenerateTalk(input: TalkInput, onError: (message: string) => void) {
  const router = useRouter();
  const [progress, setProgress] = useState<GenerateProgress>(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const { id, editKey } = await postJson<{ id: string; editKey: string }>("/api/talks", input);
        rememberEditKey(id, editKey);
        setProgress(1);
        // 목소리가 실패해도 대본은 완성됐으니 나레이션으로 보낸다 (플레이어가 브라우저 음성으로 읽는다)
        await postJson(`/api/talks/${id}/voice`).catch(() => undefined);
        setProgress(2);
        setTimeout(() => router.replace(`/talks/${id}`), 700);
      } catch (e) {
        onError(e instanceof Error ? e.message : "문제가 생겼어요");
      }
    })();
  }, [input, onError, router]);

  return progress;
}
