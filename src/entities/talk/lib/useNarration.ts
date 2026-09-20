"use client";

import { useCallback, useEffect, useRef } from "react";
import { estimateSeconds } from "@/entities/talk/timeline";
import { SILENT_WAV } from "./silentAudio";

// 장면 하나를 읽어주고 끝나면 onEnd 를 부른다.
// 우선순위: 장면의 audioUrl(서버 TTS) → 브라우저 내장 음성(speechSynthesis) → 글자 수 기반 타이머(음소거)
// iOS 는 사용자 탭 밖에서 새 오디오 재생을 막으므로, 오디오 요소 하나를 탭 순간에 풀어 두고(unlock) 계속 재사용한다.

/** 지금 읽고 있는 장면의 재생 시각 (노래방 자막용) */
export type NarrationClock = { elapsed: () => number; duration: () => number };

export function useNarration() {
  const token = useRef(0);
  const player = useRef<HTMLAudioElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null); // 지금 이 장면을 읽고 있는 오디오 (없으면 음성합성·타이머)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null); // GC 로 onend 가 사라지는 크롬 버그 방지용
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const startedAt = useRef(0);
  const estimated = useRef(0);

  const clock = useRef<NarrationClock>({
    elapsed: () => audio.current?.currentTime ?? (performance.now() - startedAt.current) / 1000,
    duration: () => {
      const d = audio.current?.duration;
      return d && Number.isFinite(d) ? d : estimated.current;
    },
  }).current;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("ko"));
      voice.current =
        voices.find((v) => /yuna|유나/i.test(v.name)) ??
        voices.find((v) => /google/i.test(v.name)) ??
        voices[0] ??
        null;
    };
    pick();
    window.speechSynthesis.addEventListener("voiceschanged", pick);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pick);
  }, []);

  const ensurePlayer = useCallback(() => {
    player.current ??= new Audio();
    return player.current;
  }, []);

  /** 재생 버튼을 누른 순간(사용자 제스처 안)에 불러야 한다 */
  const unlock = useCallback(() => {
    const el = ensurePlayer();
    if (!el.src) {
      el.src = SILENT_WAV;
      el.play().catch(() => {});
    }
    if ("speechSynthesis" in window) window.speechSynthesis.resume();
  }, [ensurePlayer]);

  const stop = useCallback(() => {
    token.current++;
    if (timer.current) clearTimeout(timer.current);
    if (audio.current) {
      audio.current.onended = null;
      audio.current.pause();
    }
    audio.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (text: string, opts: { audioUrl?: string; muted?: boolean; onEnd: () => void }) => {
      stop();
      const my = token.current;
      startedAt.current = performance.now();
      estimated.current = estimateSeconds(text);
      const done = () => {
        if (token.current === my) opts.onEnd();
      };
      const fallback = () => {
        timer.current = setTimeout(done, estimated.current * 1000);
      };

      if (opts.muted) return fallback();

      if (opts.audioUrl) {
        const el = ensurePlayer();
        el.src = opts.audioUrl;
        audio.current = el;
        el.onended = done;
        el.play().catch(() => {
          // 재생이 막히면 타이머로 넘기고, 노래방 자막 시계도 타이머 기준으로 돌린다
          if (token.current !== my) return;
          audio.current = null;
          startedAt.current = performance.now();
          fallback();
        });
        return;
      }

      if (!("speechSynthesis" in window)) return fallback();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ko-KR";
      u.rate = 1.05;
      if (voice.current) u.voice = voice.current;
      u.onend = done;
      u.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") fallback();
      };
      utterance.current = u;
      window.speechSynthesis.speak(u);
    },
    [stop, ensurePlayer],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, unlock, clock };
}
