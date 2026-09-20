"use client";

import { useEffect, useState } from "react";
import { plainText } from "@/entities/talk/emphasis";

/** 소개 화면에서 장면 자막을 브라우저 음성으로 들려준다 (서버 호출 없이 맛보기) */
export function useDemoVoice() {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function toggle(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (speaking) return setSpeaking(false);
    const utterance = new SpeechSynthesisUtterance(plainText(text));
    utterance.lang = "ko-KR";
    utterance.rate = 1.05;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return { speaking, toggle };
}
