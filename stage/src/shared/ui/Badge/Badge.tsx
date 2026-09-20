import type { ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./Badge.module.css";

type BadgeProps = {
  color?: "blue" | "grey" | "green" | "red" | "orange" | "glass";
  size?: "small" | "medium" | "large";
  className?: string;
  children: ReactNode;
};

export function Badge({ color = "blue", size = "medium", className, children }: BadgeProps) {
  return <span className={cx(styles.badge, styles[color], styles[size], className)}>{children}</span>;
}
