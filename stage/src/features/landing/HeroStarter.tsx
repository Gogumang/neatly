"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { cx } from "@/shared/lib/cx";
import { Button } from "@/shared/ui/Button/Button";
import styles from "./Landing.module.css";

// /new 화면이 이어받는 자리
const DRAFT_KEY = "ttobak:draft";

/** 첫 화면에서 바로 글을 붙여넣고 시작하는 칸. 글은 담아 두고 만들기 화면으로 넘긴다 */
export function HeroStarter() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pasted, setPasted] = useState(false);
  const ready = text.trim().length > 0;

  function start(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, text.trim());
    } catch {
      // 저장이 막혀 있어도 이동은 한다
    }
    router.push("/new");
  }

  return (
    <form className={cx(styles.starter, pasted && styles.starterFlash)} onSubmit={start}>
      <textarea
        className={styles.starterInput}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPaste={() => {
          setPasted(true);
          setTimeout(() => setPasted(false), 900);
        }}
        placeholder="여기에 글이나 링크를 붙여넣어 보세요"
        aria-label="나레이션으로 만들 글"
        rows={2}
      />
      <Button type="submit" size="large" disabled={!ready} className={styles.starterButton}>
        나레이션 만들기
      </Button>
    </form>
  );
}
