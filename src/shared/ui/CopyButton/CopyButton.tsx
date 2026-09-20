"use client";

import { useEffect, useState } from "react";
import { cx } from "@/shared/lib/cx";
import styles from "./CopyButton.module.css";

/** 클립보드 API 를 못 쓸 때 쓰는 옛 방식 */
function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  const done = document.execCommand("copy");
  area.remove();
  return done;
}

/** 지금 보고 있는 주소를 복사한다. 복사되면 잠깐 알려 준다 */
export function CopyButton({ className, label = "링크 복사" }: { className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      return;
    } catch {
      // 클립보드 권한이 없거나 창이 활성화되지 않은 경우가 있다
    }
    setCopied(legacyCopy(url));
  };

  return (
    <button type="button" className={cx(styles.copy, copied && styles.done, className)} onClick={copy}>
      {copied ? "복사했어요" : label}
    </button>
  );
}
