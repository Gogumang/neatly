"use client";

import { useEffect, useState } from "react";
import type { Segment } from "@/entities/talk/model";
import { cx } from "@/shared/lib/cx";
import styles from "./SignPanel.module.css";

/** 지금 읽고 있는 장면의 재생 시각 (초) */
type Clock = { elapsed: () => number; duration: () => number };

type Props = { segment: Segment; playing: boolean; clock: Clock; className?: string };

/**
 * 나레이션 진행에 맞춰 지금 손으로 표현할 차례인 단어 자리.
 * 장면 길이를 단어 수로 똑같이 나눈다. 재생 중이 아니면 -1 (아무 단어도 강조하지 않는다).
 */
function useCurrentWord(count: number, clock: Clock, playing: boolean): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
    if (!playing || count === 0) return;
    let frame = 0;
    const tick = () => {
      const total = clock.duration();
      const ratio = total > 0 ? clock.elapsed() / total : 0;
      setCurrent(Math.min(count - 1, Math.max(0, Math.floor(ratio * count))));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count, clock, playing]);

  return playing ? current : -1;
}

/**
 * 수어 어순 자막. 장면 자막을 한국수어 어순으로 옮긴 단어들을 나레이션에 맞춰 차례로 짚어준다.
 * 수어 통역 영상이 아니라, 수어 어순·어휘로 읽는 글자 자막이다.
 */
export function SignPanel({ segment, playing, clock, className }: Props) {
  const words = segment.sign ?? [];
  const current = useCurrentWord(words.length, clock, playing);
  if (words.length === 0) return null;
  let at = 0;

  return (
    <section className={cx(styles.panel, className)} aria-label="한국수어 어순 자막">
      <p className={styles.label}>한국수어 어순</p>
      <p className={styles.words}>
        {/* 같은 단어가 두 번 나올 수 있어 나온 자리를 키로 쓴다 */}
        {words.map((word) => {
          const i = at++;
          return (
            <span key={i} className={cx(styles.word, i === current && styles.now)}>
              {word}
            </span>
          );
        })}
      </p>
    </section>
  );
}
