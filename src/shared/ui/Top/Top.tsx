import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./Top.module.css";

type TopProps = {
  upper?: ReactNode;
  title: ReactNode;
  lower?: ReactNode;
  size?: "page" | "hero";
  align?: "left" | "center";
  as?: "h1" | "h2";
};

/** 화면 상단 제목 영역: 위 보조 문구 · 제목 · 설명 */
export function Top({ upper, title, lower, size = "page", align = "left", as: Heading = "h1" }: TopProps) {
  return (
    <header className={cx(styles.top, size === "hero" && styles.hero, align === "center" && styles.center)}>
      {upper && <div className={styles.upper}>{upper}</div>}
      <Heading className={styles.title}>{title}</Heading>
      {lower && <p className={styles.lower}>{lower}</p>}
    </header>
  );
}
