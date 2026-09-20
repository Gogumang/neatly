"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { ButtonLink } from "@/shared/ui/Button/Button";
import styles from "./Landing.module.css";

const PULL = 0.3; // 커서 쪽으로 끌려오는 정도
const SPRING = { stiffness: 260, damping: 18, mass: 0.4 };

type Props = { href: string; children: ReactNode; color?: "primary" | "light" };

/** 커서를 따라 살짝 끌려오는 주 버튼 (동작 줄이기면 가만히 있는다) */
export function MagneticCta({ href, children, color = "primary" }: Props) {
  const reduced = useReducedMotion() ?? false;
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const follow = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (box.left + box.width / 2)) * PULL);
    y.set((e.clientY - (box.top + box.height / 2)) * PULL);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className={styles.magnet} style={{ x, y }} onPointerMove={follow} onPointerLeave={reset}>
      <ButtonLink href={href} color={color}>
        {children}
      </ButtonLink>
    </motion.span>
  );
}
