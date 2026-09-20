"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./Finale.module.css";
import { MagneticCta } from "./MagneticCta";
import { useReducedOnClient } from "./useReducedOnClient";

/** 마지막 구간: 무대가 화면을 가득 채우도록 커지고, 그 위로 권유가 떠오른다 */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedOnClient();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.62], [0.78, 1.42]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.16], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.34, 0.58], [0, 1]);
  const y = useTransform(scrollYProgress, [0.34, 0.66], [72, 0]);

  return (
    <section ref={ref} className={cx(styles.track, reduced && styles.still)}>
      <div className={styles.sticky}>
        <motion.div className={styles.panel} aria-hidden style={reduced ? undefined : { scale, opacity: panelOpacity }}>
          <span className={styles.panelGlow} />
          <span className={styles.panelGrain} />
        </motion.div>

        <motion.div className={styles.content} style={reduced ? undefined : { opacity, y }}>
          <h2 className={styles.title}>
            당신의 이야기도
            <br />
            무대에 올려보세요
          </h2>
          <p className={styles.lower}>글 한 편이면 충분해요. 목소리와 장면은 또박이 맡을게요.</p>
          <MagneticCta href="/new" color="light">
            내 글로 나레이션 만들기
          </MagneticCta>
          <span className={styles.note}>가입 없이 바로 만들어볼 수 있어요</span>
        </motion.div>
      </div>
    </section>
  );
}
