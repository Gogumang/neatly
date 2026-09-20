"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./Button.module.css";

type ButtonStyle = {
  color?: "primary" | "dark" | "danger" | "light";
  variant?: "fill" | "weak";
  size?: "small" | "medium" | "large" | "xlarge";
  display?: "inline" | "block" | "full";
};

const PRESS = { scale: 0.96 };
const PRESS_TRANSITION = { type: "spring", stiffness: 600, damping: 30 } as const;

function buttonClass({ color = "primary", variant = "fill", size = "xlarge", display = "inline" }: ButtonStyle) {
  return cx(styles.button, styles[color], styles[variant], styles[size], display !== "inline" && styles[display]);
}

export type ButtonProps = ButtonStyle &
  Omit<HTMLMotionProps<"button">, "color" | "children"> & { loading?: boolean; children: ReactNode };

export function Button({
  color,
  variant,
  size,
  display,
  loading,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      className={cx(buttonClass({ color, variant, size, display }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      whileTap={disabled || loading ? undefined : PRESS}
      transition={PRESS_TRANSITION}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.loadingLabel}>{children}</span>
          <span className={styles.loadingOverlay}>
            <span className={styles.spinner} />
          </span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

export type ButtonLinkProps = ButtonStyle & Omit<ComponentProps<typeof MotionLink>, "color">;

/** 페이지 이동용 버튼 (Next Link) */
export function ButtonLink({ color, variant, size, display, className, ...rest }: ButtonLinkProps) {
  return (
    <MotionLink
      className={cx(buttonClass({ color, variant, size, display }), className)}
      whileTap={PRESS}
      transition={PRESS_TRANSITION}
      {...rest}
    />
  );
}
