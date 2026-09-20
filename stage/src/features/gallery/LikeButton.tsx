"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cx } from "@/shared/lib/cx";
import { postJson } from "@/shared/lib/postJson";
import { Icon } from "@/shared/ui/Icon/Icon";
import styles from "./LikeButton.module.css";

// 브라우저마다 한 번만 좋아요. (편의 기능이라 저장이 실패해도 괜찮다)
const KEY = "stage:liked";

function readLiked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function rememberLiked(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...readLiked(), id]));
  } catch {
    // 저장소를 못 쓰는 환경이면 새로고침 후 다시 누를 수 있을 뿐이다
  }
}

export function LikeButton({ id, initial, className }: { id: string; initial: number; className?: string }) {
  const [likes, setLikes] = useState(initial);
  const [liked, setLiked] = useState(false);

  useEffect(() => setLiked(readLiked().includes(id)), [id]);

  async function like() {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    rememberLiked(id);
    const res = await postJson<{ likes: number }>(`/api/talks/${id}/like`).catch(() => null);
    if (res) setLikes(res.likes);
  }

  return (
    <motion.button
      type="button"
      className={cx(styles.like, liked && styles.liked, className)}
      onClick={like}
      aria-pressed={liked}
      aria-label={`좋아요 ${likes}개`}
      whileTap={{ scale: 0.92 }}
    >
      <motion.span key={String(liked)} initial={{ scale: liked ? 0.3 : 1 }} animate={{ scale: 1 }}>
        <Icon name="heart" size={16} filled={liked} />
      </motion.span>
      {likes}
    </motion.button>
  );
}
