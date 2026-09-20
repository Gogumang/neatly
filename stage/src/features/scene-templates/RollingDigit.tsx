import { motion } from "motion/react";
import styles from "./RollingNumberScene.module.css";

const ROW = 1.15; // em, CSS 의 line-height 와 같아야 한다
const SPINS = 2;
const DIGITS = Array.from({ length: (SPINS + 1) * 10 }, (_, n) => n % 10);

/** 숫자 띠를 from 에서 굴려 to 에 멈춘다 */
export function RollingDigit({ from, to, duration }: { from: number; to: number; duration: number }) {
  return (
    <span className={styles.window}>
      <motion.span
        className={styles.strip}
        initial={{ y: `-${from * ROW}em` }}
        animate={{ y: `-${(SPINS * 10 + to) * ROW}em` }}
        transition={{ duration, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        {DIGITS.map((d, n) => (
          <span key={n}>{d}</span>
        ))}
      </motion.span>
    </span>
  );
}
