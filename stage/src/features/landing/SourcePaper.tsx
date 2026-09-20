"use client";

import { motion } from "motion/react";
import { cx } from "@/shared/lib/cx";
import styles from "./Converter.module.css";
import { DEMO_STEPS } from "./script";
import { TryInput } from "./TryInput";

const BEAM = { duration: 0.7, ease: [0.16, 1, 0.3, 1] } as const;

type Props = {
  step: number;
  flying: boolean;
  reduced: boolean;
  custom: boolean;
  onSelect: (index: number) => void;
  onTry: (sentence: string) => void;
  onReset: () => void;
};

/** 왼쪽 원고. 지금 읽는 문장에 조명이 붙고, 무대 쪽으로 빛줄기가 건너간다 */
export function SourcePaper({ step, flying, reduced, custom, onSelect, onTry, onReset }: Props) {
  return (
    <div className={styles.paper}>
      <span className={styles.paperLabel}>내가 쓴 글 · 문장을 눌러보세요</span>
      {DEMO_STEPS.map((item, i) => (
        <button
          type="button"
          key={item.source}
          className={cx(styles.line, i === step && styles.lineActive)}
          aria-pressed={i === step}
          onClick={() => onSelect(i)}
        >
          {i === step && !reduced && (
            <>
              <motion.span layoutId="line-spot" className={styles.spot} aria-hidden />
              <motion.span layoutId="line-marker" className={styles.marker} aria-hidden />
            </>
          )}
          {item.source}
          {/* 글이 무대로 건너가는 빛줄기 (글자는 덧그리지 않는다) */}
          {i === step && flying && !reduced && (
            <motion.span
              className={styles.beam}
              aria-hidden
              initial={{ scaleX: 0.15, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={BEAM}
            />
          )}
        </button>
      ))}
      <TryInput custom={custom} onTry={onTry} onReset={onReset} />
    </div>
  );
}
