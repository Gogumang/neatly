"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rememberEditKey } from "@/shared/lib/editKeys";
import { postJson } from "@/shared/lib/postJson";
import type { TalkInput } from "./funnel";

/** 형식마다 대본 다음에 만들어야 하는 것들 */
function jobsFor(format: string): string[] {
  if (format === "webtoon") return ["cover", "sign", "panels"];
  return ["cover", "sign", "voice"];
}

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
        // 형식에 맞는 것들을 한꺼번에 만든다. 하나가 실패해도 대본은 완성됐으니 그대로 보낸다
        const jobs = jobsFor(input.format).map((job) => postJson(`/api/talks/${id}/${job}`).catch(() => undefined));
        await Promise.all(jobs);
        setProgress(2);
        setTimeout(() => router.replace(`/talks/${id}`), 700);
      } catch (e) {
        onError(e instanceof Error ? e.message : "문제가 생겼어요");
      }
    })();
  }, [input, onError, router]);

  return progress;
}
