import { motion } from "motion/react";
import Link from "next/link";
import type { Talk } from "@/entities/talk/model";
import { SignUploadLink } from "@/features/sign/SignUploadLink";
import { Button } from "@/shared/ui/Button/Button";
import { Icon } from "@/shared/ui/Icon/Icon";
import { Top } from "@/shared/ui/Top/Top";
import styles from "./PlayerCover.module.css";

/** 재생 전·후에 덮는 표지. 항상 다크 테마 */
export function PlayerCover({ talk, ended, onPlay }: { talk: Talk; ended: boolean; onPlay: () => void }) {
  return (
    <motion.div
      className={styles.cover}
      data-theme="dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // 사라지는 동안 뒤의 버튼을 가리지 않게
      exit={{ opacity: 0, pointerEvents: "none", transition: { duration: 0.3 } }}
    >
      <motion.div
        className={styles.card}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.1 }}
      >
        <Top
          size="hero"
          align="center"
          upper={<span className={styles.author}>{talk.author.name}</span>}
          title={talk.title}
        />
        <Button size="xlarge" onClick={onPlay}>
          <Icon name={ended ? "replay" : "play"} size={18} />
          {ended ? "다시 보기" : "나레이션 보기"}
        </Button>
        {ended && (
          <Link href="/new" className={styles.next}>
            나도 나레이션 만들기 ›
          </Link>
        )}
        <Link href={`/talks/${talk.id}/transcript`} className={styles.next}>
          대본으로 보기 ›
        </Link>
        {!talk.signVideoUrl && <SignUploadLink talkId={talk.id} className={styles.next} />}
      </motion.div>
    </motion.div>
  );
}
