"use client";

import { useEffect } from "react";

type Controls = { toggle: () => void; prev: () => void; next: () => void };

// 입력칸·버튼·링크에 초점이 있으면 그 요소의 기본 동작(스페이스로 버튼 누르기 등)을 살린다
const isInteractive = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLButtonElement ||
  target instanceof HTMLAnchorElement ||
  target instanceof HTMLSelectElement;

/** 스페이스바: 재생/정지, ← →: 장면 이동 */
export function useKeyboardControls({ toggle, prev, next }: Controls) {
  useEffect(() => {
    const actions: Record<string, () => void> = { Space: toggle, ArrowLeft: prev, ArrowRight: next };
    const onKey = (e: KeyboardEvent) => {
      const action = actions[e.code];
      if (!action || (e.code === "Space" && isInteractive(e.target))) return;
      e.preventDefault();
      action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, prev, next]);
}
