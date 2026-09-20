"use client";

import { useEffect, useState } from "react";
import type { NarrationClock } from "@/entities/talk/lib/useNarration";

/**
 * 지금 장면이 얼마나 지났는지 (0~1). 진행 막대가 목소리를 따라 차오른다.
 * 장면이 넘어가면 나레이션 시계가 다시 0 부터 시작하므로 따로 되돌릴 필요가 없다.
 */
export function useSceneProgress(clock: NarrationClock, playing: boolean) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    let frame = 0;
    const tick = () => {
      // 오디오 길이는 로드된 뒤에야 알 수 있어 매 프레임 다시 본다
      const duration = clock.duration();
      setProgress(duration > 0 ? Math.min(1, clock.elapsed() / duration) : 0);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clock, playing]);

  return progress;
}
