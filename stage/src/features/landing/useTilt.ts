"use client";

import { type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";

const MAX_DEG = 6;

type Tilt = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** 커서를 따라다니는 빛의 자리 */
  glowX: MotionValue<string>;
  glowY: MotionValue<string>;
  glow: MotionValue<number>;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

/** 마우스 위치를 따라 카드가 살짝 기울고, 그 자리에 빛이 번진다 (동작 줄이기면 끈다) */
export function useTilt(enabled: boolean): Tilt {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 180, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [MAX_DEG, -MAX_DEG]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-MAX_DEG, MAX_DEG]), spring);
  const percent = (v: number) => `${(v + 0.5) * 100}%`;
  const glowX = useTransform(useSpring(x, spring), percent);
  const glowY = useTransform(useSpring(y, spring), percent);
  const glow = useSpring(0, { stiffness: 120, damping: 24 });

  const reset = () => {
    x.set(0);
    y.set(0);
    glow.set(0);
  };

  return {
    rotateX,
    rotateY,
    glowX,
    glowY,
    glow,
    onPointerMove: (e) => {
      if (!enabled) return;
      const box = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - box.left) / box.width - 0.5);
      y.set((e.clientY - box.top) / box.height - 0.5);
      glow.set(1);
    },
    onPointerLeave: reset,
  };
}
