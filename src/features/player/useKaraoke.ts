"use client";

import { useEffect, useMemo, useState } from "react";
import { charTimes, filledCount } from "@/entities/talk/karaoke";
import type { Segment } from "@/entities/talk/model";
import type { NarrationClock } from "./useNarration";

/** 나레이션 재생 시각에 맞춰 자막이 몇 글자까지 채워졌는지 (text 는 ⭐ 를 뺀 자막) */
export function useKaraoke(segment: Segment, text: string, clock: NarrationClock, playing: boolean) {
  const [filled, setFilled] = useState(0);
  const { words } = segment;
  const length = [...text].length;
  const withWords = useMemo(() => (words?.length ? charTimes(text, { words, duration: 0 }) : null), [text, words]);

  useEffect(() => {
    setFilled(0);
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      // 단어 시간이 없으면 재생 길이에 비례해 채운다 (길이는 오디오가 로드된 뒤에야 알 수 있어 매 프레임 계산)
      const times = withWords ?? charTimes(text, { duration: clock.duration() });
      setFilled(filledCount(times, clock.elapsed()));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, withWords, clock, playing]);

  return playing ? filled : length;
}
