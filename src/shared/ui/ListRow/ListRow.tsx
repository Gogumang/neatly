import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./ListRow.module.css";

type ListRowProps = {
  /** 왼쪽 아이콘 자리 (이모지 등) */
  left?: ReactNode;
  top: ReactNode;
  bottom?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function ListRow({ left, top, bottom, right, className }: ListRowProps) {
  return (
    <div className={cx(styles.row, className)}>
      {left && <span className={styles.asset}>{left}</span>}
      <span className={styles.texts}>
        <span className={styles.top}>{top}</span>
        {bottom && <span className={styles.bottom}>{bottom}</span>}
      </span>
      {right && <span className={styles.right}>{right}</span>}
    </div>
  );
}
