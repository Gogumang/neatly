"use client";

import Link from "next/link";
import { useState } from "react";
import type { Talk } from "@/entities/talk/model";
import { CardPreview } from "./CardPreview";
import styles from "./TalkCard.module.css";
import { TalkCoverImage } from "./TalkCoverImage";

type Props = { talk: Talk; focused?: boolean; onSelect?: () => void };

/** 목록 카드. 가운데(또는 마우스를 올린) 카드는 미리보기가 재생된다 */
export function TalkCard({ talk, focused, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/talks/${talk.id}`}
      className={styles.card}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => {
        setHovered(true);
        onSelect?.();
      }}
      onBlur={() => setHovered(false)}
    >
      {/* 제목·만든이는 썸네일 이미지 안에 들어 있다 */}
      <TalkCoverImage talk={talk} className={styles.image} />
      {(hovered || focused) && <CardPreview talk={talk} />}
    </Link>
  );
}
