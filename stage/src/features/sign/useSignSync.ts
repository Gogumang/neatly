"use client";

import { type RefObject, useEffect, useMemo } from "react";
import type { Segment } from "@/entities/talk/model";
import { segmentStarts } from "@/entities/talk/timeline";

const DRIFT = 1; // 초. 이보다 어긋나면 장면 시작 시각으로 맞춘다

/**
 * 수어 영상을 나레이션 재생에 맞춘다.
 * 영상은 나레이션 시작과 함께 녹화된 것이라, 장면 i 는 영상의 segmentStarts[i] 초에 해당한다.
 * 이어서 재생될 때는 그대로 두고, 장면을 건너뛰었거나 많이 어긋났을 때만 옮긴다.
 */
export function useSignSync(
  video: RefObject<HTMLVideoElement | null>,
  segments: Segment[],
  index: number,
  playing: boolean,
) {
  const starts = useMemo(() => segmentStarts(segments), [segments]);

  useEffect(() => {
    const el = video.current;
    const target = starts[index] ?? 0;
    if (el && Math.abs(el.currentTime - target) > DRIFT) el.currentTime = target;
  }, [video, starts, index]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [video, playing]);
}
