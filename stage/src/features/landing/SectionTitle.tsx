"use client";

import { MotionConfig, motion } from "motion/react";
import styles from "./Landing.module.css";

const VIEW = { once: true, margin: "-90px" } as const;
const SPRING = { type: "spring", stiffness: 180, damping: 24 } as const;

// 잘린 글줄은 스스로 "보인다"고 알릴 수 없다. 바깥에서 신호를 내려 준다
const FADE = { hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } };
const RISE = { hidden: { y: "115%" }, shown: { y: "0%" } };

type Props = { label: string; lines: string[]; lower?: string };

/** 섹션 제목: 작은 이름표 → 글줄이 아래에서 차례로 올라온다 (동작 줄이기면 그대로 보인다) */
export function SectionTitle({ label, lines, lower }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className={styles.sectionHead} initial="hidden" whileInView="shown" viewport={VIEW} variants={FADE}>
        <motion.span className={styles.label} variants={FADE} transition={SPRING}>
          {label}
        </motion.span>

        <h2 className={styles.sectionTitle}>
          {lines.map((line, i) => (
            <span className={styles.mask} key={line}>
              <motion.span
                className={styles.maskInner}
                variants={RISE}
                transition={{ ...SPRING, delay: 0.06 + i * 0.09 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        {lower && (
          <motion.p className={styles.sectionLower} variants={FADE} transition={{ ...SPRING, delay: 0.2 }}>
            {lower}
          </motion.p>
        )}
      </motion.div>
    </MotionConfig>
  );
}
