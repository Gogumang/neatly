"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Talk } from "@/entities/talk/model";
import { Icon } from "@/shared/ui/Icon/Icon";
import { sortTalks } from "./sortTalks";
import styles from "./TalkBrowser.module.css";
import { TalkCard } from "./TalkCard";
import { TalkRow } from "./TalkRow";
import { useStripScroll } from "./useStripScroll";

type Stored = Talk & { likes: number; createdAt: string };

/** 메인 아래쪽에서 보여주는 나레이션 모음. 분류 탭으로 걸러 보고, 표지를 펼치거나 한 줄로 읽는다 */
export function TalkBrowser({ talks }: { talks: Stored[] }) {
  // 토스처럼 가로로 펼친 표지를 먼저 보여준다 (스크롤을 내리면 옆으로 흐른다)
  const [spread, setSpread] = useState(true);
  const strip = useRef<HTMLUListElement>(null);
  useStripScroll(strip, spread);
  const reduced = useReducedMotion() ?? false;

  // 스크롤해서 다가오면 작게 시작해 제자리 크기로 커진다 (마무리 화면과 같은 결)
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  // 서버가 그린 style 과 엉키지 않게 붙은 뒤부터 움직인다
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const grow = mounted && !reduced ? { scale } : undefined;
  // 보기를 바꿀 때 지금 것은 작아지며 사라지고, 새 것은 커지며 들어온다
  const swap = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 1.06 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.94 },
        transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
      };

  const shown = useMemo(() => sortTalks(talks), [talks]);

  return (
    <motion.section id="talks" ref={section} className={styles.section} style={grow}>
      <h2 className={styles.heading}>모두의 나레이션</h2>

      {shown.length === 0 ? (
        <p className={styles.empty}>아직 올라온 나레이션이 없어요.</p>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {spread ? (
            // 펼쳐보기: 같은 크기의 표지가 가로로 쭉 이어진다 (끌거나 좌우 스크롤로 넘긴다)
            <motion.ul key="spread" className={styles.strip} ref={strip} {...swap}>
              {shown.map((talk) => (
                <li key={talk.id} className={styles.stripItem}>
                  <TalkCard talk={talk} />
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul key="rows" className={styles.rows} {...swap}>
              {shown.map((talk) => (
                <TalkRow key={talk.id} talk={talk} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
      <button type="button" className={styles.view} onClick={() => setSpread((v) => !v)}>
        <Icon name={spread ? "list" : "grid"} className={styles.viewIcon} />
        {spread ? "목록보기" : "펼쳐보기"}
      </button>
    </motion.section>
  );
}
