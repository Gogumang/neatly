import type { ReactNode } from "react";
import styles from "./RadioCard.module.css";

export function RadioCardList({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ul className={styles.list} aria-label={label}>
      {children}
    </ul>
  );
}

type RadioCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  left?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
};

/** 여러 개 중 하나를 고르는 카드. 고르면 파란 테두리 */
export function RadioCard({ name, value, checked, onSelect, left, title, description, right }: RadioCardProps) {
  return (
    <li>
      <label className={styles.card}>
        <input className={styles.radio} type="radio" name={name} value={value} checked={checked} onChange={onSelect} />
        {left}
        <span className={styles.body}>
          <span className={styles.title}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
        {right}
      </label>
    </li>
  );
}
