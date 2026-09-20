import type { PanInfo } from "motion/react";
import type { KeyboardEvent } from "react";

const SWIPE_PX = 56; // 이만큼 밀면 장면이 넘어간다

/** 화살표 키와 밀기로 장면을 넘기는 손잡이 */
export function stageGestures(move: (delta: number) => void) {
  return {
    onKeyDown: (e: KeyboardEvent) => {
      const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (delta === 0) return;
      e.preventDefault();
      move(delta);
    },
    onDragEnd: (_: unknown, info: PanInfo) => {
      if (Math.abs(info.offset.x) > SWIPE_PX) move(info.offset.x < 0 ? 1 : -1);
    },
  };
}
