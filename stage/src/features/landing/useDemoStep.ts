"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMO_STEPS } from "./script";

export const FLY_MS = 700; // 문장이 무대로 날아가는 시간
export const HOLD_MS = 3200; // 장면을 보여주는 시간

type Phase = "fly" | "scene";

/** 문장이 날아가는 중(fly) → 장면이 보이는 중(scene) 을 반복한다. 멈추거나 원하는 문장으로 건너뛸 수 있다 */
export function useDemoStep(paused: boolean) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("fly");

  // 스크롤·키보드로 건너뛸 때는 날아가는 동작 없이 바로 장면을 보여준다
  const select = useCallback((index: number, next: Phase = "fly") => {
    setStep((index + DEMO_STEPS.length) % DEMO_STEPS.length);
    setPhase(next);
  }, []);

  useEffect(() => {
    const toScene = phase === "fly" ? setTimeout(() => setPhase("scene"), FLY_MS) : undefined;
    if (paused) return () => clearTimeout(toScene);
    const next = setTimeout(() => select(step + 1), phase === "fly" ? FLY_MS + HOLD_MS : HOLD_MS);
    return () => {
      clearTimeout(toScene);
      clearTimeout(next);
    };
  }, [step, phase, paused, select]);

  return { step, phase, select, demo: DEMO_STEPS[step] };
}
