import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Top } from "@/shared/ui/Top/Top";
import styles from "./StepLayout.module.css";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  error?: string;
  /** 아래 고정 버튼 영역. 눌러서 바로 넘어가는 단계에는 없다 */
  cta?: ReactNode;
  onSubmit?: () => void;
  children: ReactNode;
};

/** 한 화면 = 질문 하나 + 아래 버튼 */
export function StepLayout({ title, description, error, cta, onSubmit, children }: Props) {
  return (
    <motion.form
      className={styles.step}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <Top title={title} lower={description} />
      <div className={styles.body}>
        {children}
        {error && <p className={styles.error}>{error}</p>}
      </div>
      {cta && <div className={styles.cta}>{cta}</div>}
    </motion.form>
  );
}
