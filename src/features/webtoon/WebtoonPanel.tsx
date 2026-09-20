"use client";

import { motion } from "motion/react";
import { parseEmphasis, plainText } from "@/entities/talk/emphasis";
import type { Segment } from "@/entities/talk/model";
import { cx } from "@/shared/lib/cx";
import styles from "./WebtoonStrip.module.css";

/** 스크롤해서 보이면 한 번 떠오른다. 동작 줄이기면 자리 이동 없이 밝아지기만 한다 */
const RISE = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { type: "spring", stiffness: 220, damping: 30 },
} as const;

/** 자막. ⭐강조⭐ 구절만 색을 달리한다 */
function Caption({ text }: { text: string }) {
  let at = 0;
  return (
    <p className={styles.caption}>
      {parseEmphasis(text).map((part) => {
        const i = at++;
        return (
          <span key={i} className={cx(part.em && styles.em)}>
            {part.text}
          </span>
        );
      })}
    </p>
  );
}

/**
 * 웹툰 한 칸. 그림 아래에 자막이 말풍선처럼 붙는다.
 * 아직 그림이 없는 장면은 자막만 남겨 글로는 끝까지 읽히게 한다.
 */
export function WebtoonPanel({ segment, n }: { segment: Segment; n: number }) {
  return (
    <motion.li className={styles.panel} {...RISE}>
      {/* 장면 번호는 눈에 보이지 않지만 스크린 리더가 칸 단위로 끊어 읽게 둔다 */}
      <h2 className={styles.srOnly}>{n}번째 칸</h2>
      {segment.panelUrl && (
        <span className={styles.frame}>
          {/* biome-ignore lint/performance/noImgElement: 저장소가 내주는 이미지라 next/image 를 거칠 필요가 없다 */}
          <img
            className={styles.art}
            src={segment.panelUrl}
            alt={plainText(segment.text)}
            loading="lazy"
            decoding="async"
            width={1536}
            height={1024}
          />
        </span>
      )}
      <Caption text={segment.text} />
    </motion.li>
  );
}
