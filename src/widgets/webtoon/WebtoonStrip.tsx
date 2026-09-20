"use client";

import { MotionConfig } from "motion/react";
import type { Talk } from "@/entities/talk/model";
import { CopyButton } from "@/shared/ui/CopyButton/CopyButton";
import { Top } from "@/shared/ui/Top/Top";
import { WebtoonPanel } from "./WebtoonPanel";
import styles from "./WebtoonStrip.module.css";

/**
 * 같은 대본을 웹툰으로 읽는 화면. 제목 아래로 장면 순서대로 칸이 이어지고,
 * 칸마다 AI 가 그린 그림과 자막이 세로로 쭉 내려간다.
 */
export function WebtoonStrip({ talk }: { talk: Talk }) {
  const { author } = talk;
  return (
    // 동작 줄이기를 켜 둔 사람에게는 자리 이동 없이 밝아지기만 한다
    <MotionConfig reducedMotion="user">
      <main className={styles.strip}>
        <Top
          upper={<span className={styles.upper}>{["웹툰", author.name, author.role].filter(Boolean).join(" · ")}</span>}
          title={talk.title}
          lower={talk.summary || undefined}
        />
        <CopyButton className={styles.copy} />
        <ol className={styles.panels}>
          {talk.segments.map((segment, i) => (
            <WebtoonPanel key={segment.id} segment={segment} n={i + 1} />
          ))}
        </ol>
      </main>
    </MotionConfig>
  );
}
