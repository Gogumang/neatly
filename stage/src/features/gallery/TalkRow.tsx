"use client";

import Link from "next/link";
import { coverVersion } from "@/entities/talk/cover";
import { genreOf } from "@/entities/talk/genres";
import type { Talk } from "@/entities/talk/model";
import { LikeButton } from "./LikeButton";
import styles from "./TalkRow.module.css";

type Stored = Talk & { likes: number };

/** 목록보기 한 줄. 그림은 글자 없는 세로 썸네일을 쓴다 */
export function TalkRow({ talk }: { talk: Stored }) {
  const genre = genreOf(talk.genre);
  return (
    <li className={styles.row}>
      <Link href={`/talks/${talk.id}`} className={styles.cover} tabIndex={-1} aria-hidden>
        {/* biome-ignore lint/performance/noImgElement: 서버에서 만든 썸네일 이미지다 */}
        <img
          src={`/talks/${talk.id}/thumbnail?size=art&v=${coverVersion(talk)}`}
          alt=""
          className={styles.thumb}
          loading="lazy"
        />
      </Link>
      <div className={styles.texts}>
        <span className={styles.genre} style={{ color: genre.color }}>
          {genre.name}
        </span>
        <Link href={`/talks/${talk.id}`} className={styles.title}>
          {talk.title}
        </Link>
        <div className={styles.meta}>
          <span>
            {talk.author.name || "익명"} · 장면 {talk.segments.length}개
          </span>
          <LikeButton id={talk.id} initial={talk.likes} className={styles.like} />
        </div>
        <p className={styles.summary}>{talk.summary}</p>
      </div>
    </li>
  );
}
