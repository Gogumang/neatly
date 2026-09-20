"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import { cx } from "@/shared/lib/cx";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./IconButton.module.css";

type IconButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  icon: IconName;
  /** 스크린 리더용 이름 (필수) */
  label: string;
  size?: "medium" | "large";
  variant?: "clear" | "solid";
};

export function IconButton({ icon, label, size = "medium", variant = "clear", className, ...rest }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      className={cx(styles.button, styles[size], variant === "solid" && styles.solid, className)}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      {...rest}
    >
      <Icon name={icon} size={size === "large" ? 22 : 20} />
    </motion.button>
  );
}
