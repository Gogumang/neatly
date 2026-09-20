"use client";

import { clamp } from "es-toolkit/math";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { useKeyboardControls } from "@/entities/talk/lib/useKeyboardControls";
import { usePlayback } from "@/entities/talk/lib/usePlayback";
import type { Talk } from "@/entities/talk/model";
import { SceneTemplate } from "@/entities/talk/ui/scene-templates/SceneTemplate";
import { Icon } from "@/shared/ui/Icon/Icon";
import { ShortEnd } from "./ShortEnd";
import styles from "./ShortPlayer.module.css";
import { ShortProgress } from "./ShortProgress";
import { ShortSubtitle } from "./ShortSubtitle";
import { ShortTapZones } from "./ShortTapZones";
import { useSceneProgress } from "./useSceneProgress";

/**
 * 숏폼 화면. 같은 나레이션을 세로 9:16 무대에 큰 자막 중심으로 보여 준다.
 * 재생·나레이션·장면 넘김은 나레이션 플레이어(usePlayback)를 그대로 쓴다.
 */
export function ShortPlayer({ talk }: { talk: Talk }) {
  const { index, segment, status, clock, go, restart, toggle } = usePlayback(talk);
  const started = status !== "idle";
  const playing = status === "playing";
  const ended = status === "ended";
  const progress = useSceneProgress(clock, playing);
  const last = talk.segments.length - 1;

  // 직접 장면을 옮겼을 때만 위치를 알린다. 자동으로 넘어갈 때 알리면 나레이션과 겹친다.
  const [movedTo, setMovedTo] = useState<number | null>(null);
  const move = (to: number) => {
    setMovedTo(clamp(to, 0, last));
    go(to);
  };

  useKeyboardControls({ toggle, prev: () => move(index - 1), next: () => move(index + 1) });

  return (
    // 운영체제의 '동작 줄이기' 설정이면 이동·확대 애니메이션을 끈다
    <MotionConfig reducedMotion="user">
      <div className={styles.frame} data-theme="dark">
        <div className={styles.stage} data-theme={segment.theme ?? "dark"}>
          <div className={styles.scenes}>
            <AnimatePresence mode="wait">
              <motion.div
                key={segment.id}
                className={styles.scene}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28 }}
              >
                {started && <SceneTemplate template={segment.template} author={talk.author} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={styles.scrim} />

          <ShortProgress segments={talk.segments} index={index} progress={progress} ended={ended} />
          <ShortSubtitle segment={segment} visible={started} playing={playing} clock={clock} />
          <ShortTapZones
            playing={playing}
            onToggle={toggle}
            onPrev={() => move(index - 1)}
            onNext={() => move(index + 1)}
          />
          {!playing && !ended && <Hint title={talk.title} idle={!started} />}

          <AnimatePresence>{ended && <ShortEnd title={talk.title} onReplay={restart} />}</AnimatePresence>

          <p className={styles.srOnly} aria-live="polite">
            {movedTo === index ? `장면 ${index + 1} / ${last + 1}` : ""}
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}

/** 멈춰 있을 때 가운데에 뜨는 안내 (누르는 건 뒤의 ShortTapZones 가 받는다) */
function Hint({ title, idle }: { title: string; idle: boolean }) {
  return (
    <div className={styles.hint}>
      <span className={styles.hintIcon}>
        <Icon name="play" size={26} />
      </span>
      {idle && <p className={styles.hintTitle}>{title}</p>}
      <p className={styles.hintLabel}>{idle ? "눌러서 재생" : "일시정지"}</p>
    </div>
  );
}
