"use client";

import { MotionConfig, motion } from "motion/react";
import styles from "./Hero.module.css";

const LINES = [
  ["글을", "붙여넣으면"],
  ["나레이션이", "시작돼요"],
];
const GRADIENT_WORD = "나레이션이";
const SPRING = { type: "spring", stiffness: 190, damping: 23 } as const;

/** 단어 하나가 흐릿한 채로 아래에서 올라와 또렷해진다 */
const rise = (order: number) => ({
  initial: { opacity: 0, y: "0.5em", filter: "blur(14px)" },
  animate: { opacity: 1, y: "0em", filter: "blur(0px)" },
  transition: { ...SPRING, delay: 0.1 + order * 0.08 },
});

/** 첫 화면 제목: 단어마다 차례로 떠오른다 (동작 줄이기면 밝아지기만) */
export function HeroTitle() {
  let order = 0;
  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.heroCopy}>
        <h1 className={styles.heroTitle}>
          {LINES.map((line) => (
            <span className={styles.heroLine} key={line.join(" ")}>
              {line.map((word) => (
                <motion.span
                  key={word}
                  className={word === GRADIENT_WORD ? `${styles.word} ${styles.gradient}` : styles.word}
                  {...rise(order++)}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p className={styles.heroLower} {...rise(order + 1)}>
          AI가 목소리와 장면을 입혀, 읽히지 않던 글을 1분 만에 들려줄 수 있는 나레이션으로 만들어요.
        </motion.p>
      </div>
    </MotionConfig>
  );
}
