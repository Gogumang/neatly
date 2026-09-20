import type { Transition } from "motion/react";

export const spring: Transition = { type: "spring", stiffness: 260, damping: 26 };
export const bouncy: Transition = { type: "spring", stiffness: 420, damping: 18 };

/** 아래에서 떠오르며 나타나기 */
export const riseIn = (delay = 0, distance = 16) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});
