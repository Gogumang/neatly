import { motion } from "motion/react";
import type { Template } from "@/entities/talk/model";
import { cx } from "@/shared/lib/cx";
import styles from "./ChatScene.module.css";
import { spring } from "./motion";

type Message = Extract<Template, { type: "chat" }>["messages"][number];

/** 메신저 대화가 한 줄씩 올라온다 */
export function ChatScene({ messages }: { messages: Message[] }) {
  return (
    <div className={styles.root}>
      {messages.map((m, i) => (
        <motion.div
          key={`${i}-${m.text}`}
          className={cx(styles.row, m.mine && styles.mine)}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring, delay: 0.15 + i * 0.55 }}
        >
          <span className={styles.avatar}>{m.name.slice(0, 1)}</span>
          <div className={styles.body}>
            <span className={styles.name}>{m.name}</span>
            <span className={styles.bubble}>{m.text}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
