import { motion } from "motion/react";
import type { Talk } from "@/entities/talk/model";
import { riseIn, spring } from "./motion";
import styles from "./SpeakerScene.module.css";

const RINGS = [0, 0.8, 1.6];

/** 발표자 사진. 말하는 동안 사진 주위로 음성 파동이 퍼진다 */
export function SpeakerScene({ author }: { author: Talk["author"] }) {
  if (!author.avatarUrl) return null;
  return (
    <div className={styles.root}>
      <motion.div
        className={styles.stage}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
      >
        {RINGS.map((delay) => (
          <motion.span
            key={delay}
            className={styles.ring}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2.4, delay, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
          />
        ))}
        {/* biome-ignore lint/performance/noImgElement: 사용자가 올린 사진이라 크기를 미리 알 수 없다 */}
        <motion.img
          className={styles.photo}
          src={author.avatarUrl}
          alt={`${author.name} 사진`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.p className={styles.name} {...riseIn(0.25, 10)}>
        {author.name}
        {author.role && <span className={styles.role}>{author.role}</span>}
      </motion.p>
    </div>
  );
}
