import { motion } from "motion/react";
import type { Template } from "@/entities/talk/model";
import styles from "./ImageScene.module.css";
import { riseIn, spring } from "./motion";

/** 올린 이미지를 천천히 당겨 보여준다 (켄 번스) */
export function ImageScene({ src, caption }: Extract<Template, { type: "image" }>) {
  return (
    <div className={styles.root}>
      <motion.div
        className={styles.frame}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
      >
        {/* biome-ignore lint/performance/noImgElement: 사용자가 올린 이미지라 크기를 미리 알 수 없다 */}
        <motion.img
          className={styles.image}
          src={src}
          alt={caption ?? ""}
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 8, ease: "linear" }}
        />
      </motion.div>
      {caption && (
        <motion.p className={styles.caption} {...riseIn(0.4, 8)}>
          {caption}
        </motion.p>
      )}
    </div>
  );
}
