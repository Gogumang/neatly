"use client";

import { motion } from "motion/react";
import stage from "./StageFx.module.css";
import { DEMO_STEPS } from "./script";

const SWEEP = { duration: 0.9, ease: [0.16, 1, 0.3, 1] } as const;
const SPOT = { type: "spring", stiffness: 200, damping: 26 } as const;

/** 장면이 바뀔 때 카드를 한 번 훑는 빛과 번짐, 그리고 지금 장면을 따라가는 조명 */
export function StageFx({ sceneKey, step }: { sceneKey: string; step: number }) {
  return (
    <>
      <span className={stage.spotRail} aria-hidden>
        <motion.span
          className={stage.spot}
          style={{ width: `${100 / DEMO_STEPS.length}%` }}
          animate={{ x: `${step * 100}%` }}
          transition={SPOT}
        />
      </span>

      <span className={stage.fx} aria-hidden>
        <motion.span
          key={`sweep-${sceneKey}`}
          className={stage.sweep}
          initial={{ x: "-140%", opacity: 0 }}
          animate={{ x: "140%", opacity: [0, 1, 0] }}
          transition={SWEEP}
        />
        <motion.span
          key={`bloom-${sceneKey}`}
          className={stage.bloom}
          initial={{ opacity: 0.8, scale: 0.65 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </span>
    </>
  );
}
