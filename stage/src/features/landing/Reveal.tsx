"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

/** 스크롤해서 보일 때 한 번 떠오른다 (동작 줄이기면 자리 이동 없이 밝아지기만) */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 220, damping: 28, delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
