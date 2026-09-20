"use client";

import { MotionConfig, motion } from "motion/react";
import styles from "./Landing.module.css";

const VIEW = { once: true, margin: "-90px" } as const;
const SPRING = { type: "spring", stiffness: 180, damping: 24 } as const;

type Props = { label: string; lines: string[]; lower?: string };

/** 섹션 제목: 작은 이름표 → 글줄이 아래에서 차례로 올라온다 (동작 줄이기면 그대로 보인다) */
export function SectionTitle({ label, lines, lower }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.sectionHead}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={SPRING}
        >
          {label}
        </motion.span>

        <h2 className={styles.sectionTitle}>
          {lines.map((line, i) => (
            <span className={styles.mask} key={line}>
              <motion.span
                className={styles.maskInner}
                initial={{ y: "115%" }}
                whileInView={{ y: "0%" }}
                viewport={VIEW}
                transition={{ ...SPRING, delay: 0.06 + i * 0.09 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        {lower && (
          <motion.p
            className={styles.sectionLower}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW}
            transition={{ ...SPRING, delay: 0.18 }}
          >
            {lower}
          </motion.p>
        )}
      </div>
    </MotionConfig>
  );
}
