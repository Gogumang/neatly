"use client";

import { motion } from "motion/react";
import type { Voice } from "@/entities/talk/voices";
import { cx } from "@/shared/lib/cx";
import { Icon } from "@/shared/ui/Icon/Icon";
import styles from "./VoiceOrb.module.css";

const R = 24;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = { voice: Voice; playing: boolean; loading: boolean; progress: number; onToggle: () => void };

/** 목소리 구슬. 누르면 미리듣기, 재생하는 동안 구슬이 숨 쉬고 둘레에 진행 링이 찬다 */
export function VoiceOrb({ voice, playing, loading, progress, onToggle }: Props) {
  const [from, to] = voice.colors;
  return (
    <button
      type="button"
      className={cx(styles.orb, (playing || loading) && styles.active)}
      aria-label={`${voice.name} ${playing ? "미리듣기 멈추기" : "미리듣기"}`}
      onClick={(e) => {
        e.preventDefault(); // 미리듣기는 선택과 별개
        onToggle();
      }}
    >
      <svg className={styles.ring} viewBox="0 0 52 52" aria-hidden>
        <circle className={styles.track} cx="26" cy="26" r={R} fill="none" strokeWidth="2.5" />
        {playing && (
          <circle
            className={styles.bar}
            cx="26"
            cy="26"
            r={R}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        )}
      </svg>
      <motion.span
        className={styles.ball}
        style={{ background: `radial-gradient(circle at 30% 30%, ${to}, ${from} 70%)` }}
        animate={
          playing
            ? { scale: [1, 1.08, 0.96, 1.05, 1], rotate: [0, 20, -10, 10, 0] }
            : loading
              ? { scale: [1, 0.92, 1] }
              : { scale: 1, rotate: 0 }
        }
        transition={playing || loading ? { duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : {}}
      />
      <span className={styles.icon}>
        <Icon name={playing ? "pause" : "play"} size={12} />
      </span>
    </button>
  );
}

export function VoiceTags({ tags }: { tags: readonly string[] }) {
  return (
    <span className={styles.tags}>
      {tags.map((tag) => (
        <span key={tag} className={styles.tag}>
          {tag}
        </span>
      ))}
    </span>
  );
}
