import { motion } from "motion/react";
import type { Template } from "@/entities/talk/model";
import { Badge } from "@/shared/ui/Badge/Badge";
import { riseIn, spring } from "./motion";
import styles from "./TitleScene.module.css";

export function TitleScene({ eyebrow, title, subtitle }: Extract<Template, { type: "title" }>) {
  const lines = title.split("\n");
  return (
    <div className={styles.root}>
      {eyebrow && (
        <motion.div className={styles.eyebrow} {...riseIn(0.05, 12)}>
          <Badge size="large">{eyebrow}</Badge>
        </motion.div>
      )}
      <h1 className={styles.title}>
        {lines.map((line, i) => (
          <motion.span
            key={`${i}-${line}`}
            className={styles.line}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...spring, delay: 0.15 + i * 0.12 }}
          >
            {line}
          </motion.span>
        ))}
      </h1>
      {subtitle && (
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + lines.length * 0.12 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
