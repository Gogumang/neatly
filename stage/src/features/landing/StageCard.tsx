"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Template } from "@/entities/talk/model";
import { SceneTemplate } from "@/features/scene-templates/SceneTemplate";
import { KaraokeLine } from "./KaraokeLine";
import stage from "./Stage.module.css";
import { StageFx } from "./StageFx";
import { DEMO_STEPS } from "./script";
import { stageGestures } from "./stageGestures";
import { FLY_MS, HOLD_MS } from "./useDemoStep";
import { useTilt } from "./useTilt";
import { VoiceWave } from "./VoiceWave";

const spring = { type: "spring", stiffness: 260, damping: 26 } as const;
const AUTHOR = { name: "또박" };

/** 넘기는 방법 안내 (동작 줄이기면 밀기는 꺼둔다) */
const hintText = (reduced: boolean) => (reduced ? "← → 키로 장면 넘기기" : "← → 키나 좌우로 밀어서 장면 넘기기");

type Props = {
  demo: { subtitle: string; template: Template };
  step: number;
  showScene: boolean;
  reduced: boolean;
  move: (delta: number) => void;
  voice: { speaking: boolean; toggle: (text: string) => void };
};

/** 오른쪽 무대: 진행바, 장면, 노래방 자막. 화살표 키·밀기로도 장면을 넘긴다 */
export function StageCard({ demo, step, showScene, reduced, move, voice }: Props) {
  const tilt = useTilt(!reduced);
  const scene = reduced
    ? { initial: false as const, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.86, filter: "blur(10px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, scale: 1.04, filter: "blur(8px)" },
        transition: spring,
      };

  return (
    <motion.div
      className={stage.stage}
      tabIndex={0}
      role="group"
      aria-label={`장면 미리보기 ${step + 1} / ${DEMO_STEPS.length}. 좌우 화살표 키나 밀기로 넘길 수 있어요`}
      style={reduced ? undefined : { rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1200 }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      drag={reduced ? false : "x"}
      dragDirectionLock
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      {...stageGestures(move)}
    >
      {!reduced && (
        <>
          <motion.span
            aria-hidden
            className={stage.glow}
            style={{ left: tilt.glowX, top: tilt.glowY, opacity: tilt.glow }}
          />
          <StageFx sceneKey={demo.subtitle} step={step} />
        </>
      )}

      <StageBar step={step} reduced={reduced} subtitle={demo.subtitle} voice={voice} />

      <div className={stage.scene}>
        <AnimatePresence mode="wait">
          {showScene && (
            <motion.div key={showScene ? demo.subtitle : step} className={stage.sceneInner} {...scene}>
              <SceneTemplate template={demo.template} author={AUTHOR} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className={stage.subtitle}>
        {showScene || reduced ? (
          <KaraokeLine
            key={demo.subtitle}
            text={demo.subtitle}
            durationMs={reduced ? 0 : HOLD_MS * 0.8}
            active={showScene}
          />
        ) : null}
      </p>

      <span className={stage.hint}>{hintText(reduced)}</span>
    </motion.div>
  );
}

/** 장면 진행바와 미리듣기 버튼 */
function StageBar({
  step,
  reduced,
  subtitle,
  voice,
}: Pick<Props, "step" | "reduced" | "voice"> & { subtitle: string }) {
  return (
    <div className={stage.stageBar}>
      <div className={stage.progress}>
        {DEMO_STEPS.map((item, i) => (
          <span key={item.source} className={stage.step}>
            <motion.span
              className={stage.stepFill}
              initial={false}
              animate={{ width: i < step ? "100%" : i === step ? ["0%", "100%"] : "0%" }}
              transition={{ duration: reduced || i !== step ? 0.2 : (FLY_MS + HOLD_MS) / 1000, ease: "linear" }}
            />
          </span>
        ))}
      </div>
      <button
        type="button"
        className={stage.listen}
        onClick={() => voice.toggle(subtitle)}
        aria-label={voice.speaking ? "미리듣기 멈추기" : "이 장면 들어보기"}
      >
        {voice.speaking ? <VoiceWave playing /> : "▶ 들어보기"}
      </button>
    </div>
  );
}
