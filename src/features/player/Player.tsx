"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import type { Talk } from "@/entities/talk/model";
import { SceneTemplate } from "@/features/scene-templates/SceneTemplate";
import { SignPanel } from "@/features/sign/SignPanel";
import styles from "./Player.module.css";
import { PlayerControls } from "./PlayerControls";
import { PlayerCover } from "./PlayerCover";
import { PlayerProgress } from "./PlayerProgress";
import { Subtitle } from "./Subtitle";
import { useKeyboardControls } from "./useKeyboardControls";
import { usePlayback } from "./usePlayback";

export function Player({ talk }: { talk: Talk }) {
  const playback = usePlayback(talk);
  const { index, segment, status, go, restart, toggle } = playback;
  const started = status !== "idle";
  const covered = status === "idle" || status === "ended";
  // 수어로 만든 나레이션은 자막을 처음부터 켜 둔다
  // 수어 어순 자막은 AI 가 만들어 둔 나레이션에만 있다 (예전 나레이션에는 없다)
  // 수어로 만든 나레이션은 자막을 늘 보여 준다 (따로 켜고 끄지 않는다)
  const showSign = talk.format === "sign" && talk.segments.some((seg) => seg.sign?.length);

  // 직접 장면을 옮겼을 때만 위치를 알린다. 자동으로 넘어갈 때 알리면 나레이션과 겹친다.
  const [movedTo, setMovedTo] = useState<number | null>(null);
  const last = talk.segments.length - 1;
  const move = (to: number) => {
    setMovedTo(Math.min(Math.max(to, 0), last));
    go(to);
  };

  useKeyboardControls({ toggle, prev: () => move(index - 1), next: () => move(index + 1) });

  return (
    // 운영체제의 '동작 줄이기' 설정이면 이동·확대 애니메이션을 끈다 (투명도 전환만 남는다)
    <MotionConfig reducedMotion="user">
      <div className={styles.stage} data-theme={segment.theme ?? "light"}>
        {/* 표지가 덮고 있는 동안 뒤의 버튼에 초점·스크린 리더가 닿지 않게 */}
        <div className={styles.main} inert={covered}>
          <PlayerProgress segments={talk.segments} index={index} ended={status === "ended"} go={move} />
          {/* biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: 키보드는 useKeyboardControls 로 처리한다 */}
          <div className={styles.visual} onClick={started ? toggle : undefined}>
            <AnimatePresence mode="wait">
              <motion.div
                key={segment.id}
                className={styles.scene}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                transition={{ duration: 0.25 }}
              >
                {started && <SceneTemplate template={segment.template} author={talk.author} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {started && showSign && <SignPanel segment={segment} playing={status === "playing"} clock={playback.clock} />}
          <Subtitle segment={segment} visible={started} playing={status === "playing"} clock={playback.clock} />
          <PlayerControls talk={talk} {...playback} go={move} />
          <p className={styles.srOnly} aria-live="polite">
            {movedTo === index ? `장면 ${index + 1} / ${last + 1}` : ""}
          </p>
        </div>

        <AnimatePresence>
          {covered && <PlayerCover talk={talk} ended={status === "ended"} onPlay={restart} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
