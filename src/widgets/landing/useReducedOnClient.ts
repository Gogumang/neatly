"use client";

import { useIsClient } from "@suspensive/react";
import { useReducedMotion } from "motion/react";

/**
 * "동작 줄이기" 설정.
 * 서버가 그린 화면과 어긋나지 않게, 브라우저에 붙은 뒤부터 판단한다.
 */
export function useReducedOnClient() {
  const reduced = useReducedMotion() ?? false;
  return useIsClient() && reduced;
}
