"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { parseEmphasis } from "@/entities/talk/emphasis";
import type { Talk } from "@/entities/talk/model";
import { SceneTemplate } from "@/entities/talk/ui/scene-templates/SceneTemplate";
import { cx } from "@/shared/lib/cx";
import styles from "./CardPreview.module.css";

/** 같은 글자가 또 나와도 구분되게 시작 위치를 붙인다 */
function withOffsets<T extends { text: string }>(parts: T[]) {
  let at = 0;
  return parts.map((part) => {
    const here = at;
    at += part.text.length;
    return { at: here, part };
  });
}

const STEP_MS = 1600;
const MAX_SCENES = 4;

/** 카드에 마우스를 올리면 그 나레이션의 앞 장면들을 소리 없이 넘겨 보여준다 */
export function CardPreview({ talk }: { talk: Talk }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const scenes = talk.segments.slice(0, MAX_SCENES);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % scenes.length), STEP_MS);
    return () => clearInterval(timer);
  }, [scenes.length, reduced]);

  const scene = scenes[index];
  if (!scene) return null;

  return (
    <div className={styles.preview} aria-hidden>
      <div className={styles.progress}>
        {scenes.map((s, i) => (
          <span key={s.id} className={cx(styles.step, i <= index && styles.stepOn)} />
        ))}
      </div>
      <div className={styles.scene}>
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SceneTemplate template={scene.template} author={talk.author} still />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className={styles.subtitle}>
        {withOffsets(parseEmphasis(scene.text)).map(({ at, part }) => (
          <span key={at} className={part.em ? styles.em : undefined}>
            {part.text}
          </span>
        ))}
      </p>
    </div>
  );
}
