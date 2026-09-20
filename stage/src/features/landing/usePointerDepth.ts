"use client";

import { type MotionValue, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

const SOFT = { stiffness: 70, damping: 20, mass: 0.7 };

/**
 * 포인터가 화면 어디에 있는지 -0.5~0.5 로 돌려준다 (마우스만).
 * 층마다 다른 배율로 곱해 쓰면 깊이가 생긴다. 동작 줄이기면 가만히 있는다.
 */
export function usePointerDepth(enabled: boolean): { px: MotionValue<number>; py: MotionValue<number> } {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, SOFT);
  const py = useSpring(rawY, SOFT);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { px, py };
}
