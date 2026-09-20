import { motion } from "motion/react";
import styles from "./KeywordsScene.module.css";
import { bouncy } from "./motion";

// 키워드 칩 배경 (라이트/다크 공통으로 선명한 파스텔)
const PALETTE = ["#CAAEFF", "#7AEA8F", "#FF8FAA", "#86B4FF", "#FFD66B"];

export function KeywordsScene({ keywords }: { keywords: string[] }) {
  return (
    <div className={styles.root}>
      {keywords.map((keyword, i) => (
        <motion.span
          key={`${i}-${keyword}`}
          className={styles.keyword}
          style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
          initial={{ opacity: 0, scale: 0.4, rotate: i % 2 ? 8 : -8, y: 30 }}
          animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2, y: 0 }}
          transition={{ ...bouncy, delay: 0.1 + i * 0.18 }}
        >
          {keyword}
        </motion.span>
      ))}
    </div>
  );
}
