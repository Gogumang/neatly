"use client";

import { useRef } from "react";
import type { Segment } from "@/entities/talk/model";
import { cx } from "@/shared/lib/cx";
import styles from "./SignPanel.module.css";
import { useSignSync } from "./useSignSync";

type Props = {
  src: string;
  segments: Segment[];
  index: number;
  playing: boolean;
  /** 수어 화면을 크게 볼지 */
  large: boolean;
  onResize: () => void;
  className?: string;
};

/** 수어 통역 영상. 소리는 나레이션만 쓰므로 영상은 음소거 */
export function SignPanel({ src, segments, index, playing, large, onResize, className }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  useSignSync(video, segments, index, playing);
  return (
    <div className={cx(styles.panel, className)}>
      <video
        ref={video}
        className={styles.video}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-label="수어 통역 영상"
      />
      <span className={styles.label}>수어 통역</span>
      {/* 켜고 끄는 버튼이라 글자는 '크게' 로 두고, 켜짐은 aria-pressed 로 알린다 */}
      <button type="button" className={styles.size} aria-pressed={large} title="수어 화면 크게 보기" onClick={onResize}>
        크게
      </button>
    </div>
  );
}
