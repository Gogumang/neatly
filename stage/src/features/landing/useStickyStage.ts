"use client";

import { useEffect, useState } from "react";

// Converter.module.css 의 sticky 조건과 같아야 한다
const QUERY = "(min-width: 761px) and (min-height: 820px)";

/** 무대를 붙여 두고 스크롤로 넘기는 화면인지 */
export function useStickyStage() {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setSticky(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return sticky;
}
