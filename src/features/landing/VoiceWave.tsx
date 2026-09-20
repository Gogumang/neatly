"use client";

import dynamic from "next/dynamic";

// lottie-web 은 브라우저에서만 동작한다 (서버 렌더링 제외)
const Lottie = dynamic(() => import("lottie-react").then((m) => ({ default: m.Lottie })), { ssr: false });

/** 나레이션이 나오는 동안 움직이는 음성 파형. 애니메이션은 scripts/make-lottie.mjs 로 직접 만든다 */
export function VoiceWave({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden style={{ display: "block", width: 60, height: 24 }}>
      <Lottie src="/lottie/wave.json" loop autoplay={playing} speed={playing ? 1 : 0} />
    </span>
  );
}
