"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** 화면에 들어오면 0 에서 실제 값까지 올라가는 숫자 */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion() ?? false;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setShown(value);
    const run = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => run.stop();
  }, [inView, reduced, value]);

  return <span ref={ref}>{shown.toLocaleString("ko-KR")}</span>;
}
