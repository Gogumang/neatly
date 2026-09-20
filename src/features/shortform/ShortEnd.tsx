import { motion } from "motion/react";
import { Button, ButtonLink } from "@/shared/ui/Button/Button";
import { Icon } from "@/shared/ui/Icon/Icon";
import styles from "./ShortEnd.module.css";

/** 마지막 장면이 끝나면 덮는 화면. 항상 다크 테마 */
export function ShortEnd({ title, onReplay }: { title: string; onReplay: () => void }) {
  return (
    <motion.div
      className={styles.end}
      data-theme="dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // 사라지는 동안 뒤의 터치 영역을 가리지 않게
      exit={{ opacity: 0, pointerEvents: "none", transition: { duration: 0.25 } }}
    >
      <p className={styles.title}>{title}</p>
      <div className={styles.buttons}>
        <Button size="large" display="full" onClick={onReplay}>
          <Icon name="replay" size={18} />
          다시 보기
        </Button>
        <ButtonLink href="/new" color="light" size="large" display="full">
          내 글로 만들어보기
        </ButtonLink>
      </div>
    </motion.div>
  );
}
