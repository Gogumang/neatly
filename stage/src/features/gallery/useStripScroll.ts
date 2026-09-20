"use client";

import { type RefObject, useEffect } from "react";

/**
 * 가로로 늘어선 목록을 세로 스크롤로 넘긴다.
 * 휠을 내리면 오른쪽으로 흐르고, 마우스로 잡아끌 수도 있다. 터치는 브라우저 기본 동작을 쓴다.
 */
export function useStripScroll(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = enabled ? ref.current : null;
    if (!el) return;

    const wheel = (e: WheelEvent) => {
      // 가로 휠(트랙패드)은 브라우저에 맡긴다
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const end = e.deltaY > 0 ? el.scrollWidth - el.clientWidth - el.scrollLeft : el.scrollLeft;
      // 끝에 닿으면 페이지 스크롤로 넘겨준다
      if (end <= 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    let startX = 0;
    let startLeft = 0;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };

    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const moved = e.clientX - startX;
      if (Math.abs(moved) > 4) el.setPointerCapture?.(e.pointerId);
      el.scrollLeft = startLeft - moved;
    };

    const up = () => {
      dragging = false;
    };

    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [ref, enabled]);
}
