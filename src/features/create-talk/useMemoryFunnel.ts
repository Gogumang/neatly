"use client";

import { createUseFunnel } from "@use-funnel/browser";
import { useCallback, useState } from "react";

/**
 * 단계를 주소에 남기지 않는 퍼널.
 * 기본 라우터는 단계마다 방문 기록을 쌓아서, 만들기 화면을 벗어나려면 뒤로가기를 여러 번 눌러야 한다.
 * 여기서는 단계를 메모리에만 두고, 단계 이동은 화면 왼쪽 위 뒤로가기 버튼이 맡는다.
 */
export const useMemoryFunnel = createUseFunnel(({ initialState }) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const push = useCallback((state: (typeof history)[number]) => {
    setHistory((prev) => {
      setCurrentIndex(prev.length);
      return [...prev, state];
    });
  }, []);

  const replace = useCallback((state: (typeof history)[number]) => {
    setHistory((prev) => {
      const next = [...prev];
      next[next.length - 1] = state;
      setCurrentIndex(next.length - 1);
      return next;
    });
  }, []);

  const go = useCallback((delta: number) => {
    setCurrentIndex((prev) => Math.min(Math.max(prev + delta, 0), Number.MAX_SAFE_INTEGER));
  }, []);

  return { history, currentIndex, push, replace, go, cleanup: () => undefined };
});
