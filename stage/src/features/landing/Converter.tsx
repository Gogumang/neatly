"use client";

import { MotionConfig, motion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import type { Template } from "@/entities/talk/model";
import styles from "./Converter.module.css";
import { SourcePaper } from "./SourcePaper";
import { StageCard } from "./StageCard";
import { sceneFromSentence } from "./sceneFromSentence";
import { DEMO_STEPS } from "./script";
import { useDemoStep } from "./useDemoStep";
import { useDemoVoice } from "./useDemoVoice";
import { useReducedOnClient } from "./useReducedOnClient";
import { useScrollScenes } from "./useScrollScenes";
import { useStickyStage } from "./useStickyStage";

/** 글 한 문장이 장면 하나가 되는 과정. 스크롤 구간마다 한 장면씩 넘어간다 */
export function Converter() {
  const [hovered, setHovered] = useState(false);
  const [custom, setCustom] = useState<{ subtitle: string; template: Template } | null>(null);
  const reduced = useReducedOnClient();
  const sticky = useStickyStage();
  const { ref, inView, scrolling, index, progress } = useScrollScenes(DEMO_STEPS.length);
  const paused = hovered || custom !== null || scrolling || !inView || reduced;
  const { step, phase, select, demo: demoStep } = useDemoStep(paused);
  const demo = custom ?? demoStep;
  const voice = useDemoVoice();

  // 구간을 다 지나면 무대가 커지고 원고는 뒤로 물러난다
  const finale = sticky && !reduced;
  const scale = useTransform(progress, [0.84, 1], [1, 1.07]);
  const fade = useTransform(progress, [0.8, 1], [1, 0.18]);
  const glow = useTransform(progress, [0.78, 1], [0, 1]);

  // 스크롤이 가리키는 장면으로 맞춘다 (한 번도 스크롤하지 않았으면 자동 재생에 맡긴다)
  useEffect(() => {
    if (index !== null) select(index, "scene");
  }, [index, select]);

  if (!demo) return null;

  return (
    <MotionConfig reducedMotion="user">
      <section ref={ref} className={styles.track} aria-label="글이 나레이션이 되는 과정">
        <div
          className={styles.converter}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <motion.span className={styles.finaleGlow} aria-hidden style={finale ? { opacity: glow } : undefined} />

          <motion.div style={finale ? { opacity: fade } : undefined}>
            <SourcePaper
              step={step}
              flying={phase === "fly"}
              reduced={reduced}
              custom={custom !== null}
              onSelect={(i) => select(i)}
              onTry={(sentence) => setCustom(sceneFromSentence(sentence))}
              onReset={() => setCustom(null)}
            />
          </motion.div>

          <motion.div style={finale ? { scale } : undefined}>
            <StageCard
              demo={demo}
              step={step}
              showScene={phase === "scene" || custom !== null}
              reduced={reduced}
              move={(delta) => select(step + delta, "scene")}
              voice={voice}
            />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
