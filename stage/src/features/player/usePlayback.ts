"use client";

import { clamp } from "es-toolkit/math";
import { useCallback, useEffect, useRef, useState } from "react";
import { plainText } from "@/entities/talk/emphasis";
import type { Talk } from "@/entities/talk/model";
import { SCENE_GAP } from "@/entities/talk/timeline";
import { useNarration } from "./useNarration";

export type PlaybackStatus = "idle" | "playing" | "paused" | "ended";

/** 장면 순서·재생 상태·나레이션을 한곳에서 관리한다 */
export function usePlayback(talk: Talk) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [muted, setMuted] = useState(false);
  const { speak, stop, unlock, clock } = useNarration();
  const gap = useRef<ReturnType<typeof setTimeout> | null>(null);

  const last = talk.segments.length - 1;
  const segment = talk.segments[index];

  // 재생 중이면 현재 장면을 읽고, 끝나면 다음 장면으로
  useEffect(() => {
    if (status !== "playing") return;
    speak(plainText(segment.text), {
      audioUrl: segment.audioUrl,
      muted,
      onEnd: () => {
        gap.current = setTimeout(() => {
          if (index >= last) setStatus("ended");
          else setIndex((i) => i + 1);
        }, SCENE_GAP * 1000);
      },
    });
    return () => {
      if (gap.current) clearTimeout(gap.current);
      stop();
    };
  }, [status, index, muted, segment, last, speak, stop]);

  // go·restart·toggle 은 모두 버튼 클릭에서 불리므로, 그 순간에 오디오 재생 권한을 풀어 둔다
  const go = useCallback(
    (to: number) => {
      unlock();
      setIndex(clamp(to, 0, last));
      setStatus((s) => (s === "ended" || s === "idle" ? "playing" : s));
    },
    [last, unlock],
  );

  const restart = useCallback(() => {
    unlock();
    setIndex(0);
    setStatus("playing");
  }, [unlock]);

  const toggle = useCallback(() => {
    unlock();
    setStatus((s) => {
      if (s === "ended") setIndex(0);
      return s === "playing" ? "paused" : "playing";
    });
  }, [unlock]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return { index, segment, status, muted, clock, go, restart, toggle, toggleMute };
}
