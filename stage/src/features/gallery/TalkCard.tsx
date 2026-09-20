"use client";

import Link from "next/link";
import { useState } from "react";
import type { Talk } from "@/entities/talk/model";
import { CardPreview } from "./CardPreview";
import styles from "./TalkCarousel.module.css";
import { TalkCoverImage } from "./TalkCoverImage";

/** 목록 카드. 마우스를 올리면 미리보기가 재생된다 (터치 기기는 그냥 썸네일) */
export function TalkCard({ talk }: { talk: Talk }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/talks/${talk.id}`}
      className={styles.card}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* 제목·만든이는 썸네일 이미지 안에 들어 있다 */}
      <TalkCoverImage talk={talk} className={styles.image} />
      {hovered && <CardPreview talk={talk} />}
    </Link>
  );
}
