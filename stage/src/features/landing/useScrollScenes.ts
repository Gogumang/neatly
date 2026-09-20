"use client";

import { useInView, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

const IDLE_MS = 420; // 이만큼 멈춰 있으면 다시 자동 재생

/** 섹션을 스크롤한 만큼 장면 번호를 정한다. 손을 떼면 자동 재생에 넘긴다 */
export function useScrollScenes(count: number) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const [index, setIndex] = useState<number | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrolling(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScrolling(false), IDLE_MS);
    setIndex(Math.min(count - 1, Math.max(0, Math.floor(value * count))));
  });

  useEffect(() => () => clearTimeout(timer.current), []);

  return { ref, inView, scrolling, index, progress: scrollYProgress };
}
