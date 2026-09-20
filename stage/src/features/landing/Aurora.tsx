"use client";

import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./Aurora.module.css";
import { usePointerDepth } from "./usePointerDepth";

type Depth = { px: MotionValue<number>; py: MotionValue<number>; scrollY: MotionValue<number> };

/** 층 하나의 어긋남: 포인터로 pull 픽셀, 스크롤로 drag 배만큼 밀린다 */
function useDepth({ px, py, scrollY }: Depth, pull: number, drag: number) {
  const x = useTransform(px, (v) => v * pull);
  const y = useTransform([py, scrollY], (all) => {
    const [v = 0, s = 0] = all as number[];
    return v * pull + s * drag;
  });
  return { x, y };
}

/** 첫 화면 배경: 천천히 흐르는 오로라 위에, 스크롤·포인터로 어긋나는 깊이 층을 얹는다 */
export function Aurora() {
  const reduced = useReducedMotion() ?? false;
  const { px, py } = usePointerDepth(!reduced);
  const { scrollY } = useScroll();
  const depth = { px, py, scrollY };
  const far = useDepth(depth, -12, 0.07);
  const near = useDepth(depth, 26, 0.18);
  const opacity = useTransform(scrollY, [0, 700], [1, 0.32]);

  return (
    <div className={styles.aurora} aria-hidden>
      <motion.div className={styles.layer} style={reduced ? undefined : { x: far.x, y: far.y, opacity }}>
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
      </motion.div>
      <motion.div className={styles.layer} style={reduced ? undefined : { x: near.x, y: near.y, opacity }}>
        <span className={`${styles.blob} ${styles.b3}`} />
        <span className={`${styles.blob} ${styles.b4}`} />
      </motion.div>
      <span className={styles.beam} />
      <span className={styles.grain} />
    </div>
  );
}
