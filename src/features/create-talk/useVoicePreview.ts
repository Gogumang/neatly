"use client";

import { useEffect, useRef, useState } from "react";

/** 목소리 미리듣기: 한 번에 하나만 재생하고, 재생 진행률(0~1)을 알려준다 */
export function useVoicePreview() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const el = audio.current;
      if (el?.duration) setProgress(el.currentTime / el.duration);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => () => audio.current?.pause(), []);

  function toggle(voice: string) {
    audio.current?.pause();
    setProgress(0);
    if (playing === voice || loading === voice) {
      setPlaying(null);
      setLoading(null);
      return;
    }
    const el = new Audio(`/api/voices/${voice}`);
    audio.current = el;
    const reset = () => {
      setPlaying(null);
      setLoading(null);
    };
    el.onended = reset;
    el.onerror = reset;
    el.onplaying = () => {
      setLoading(null);
      setPlaying(voice);
    };
    setPlaying(null);
    setLoading(voice);
    el.play().catch(reset);
  }

  return { playing, loading, progress, toggle };
}
