"use client";

import { type FormEvent, useState } from "react";
import styles from "./TryInput.module.css";

type Props = { onTry: (sentence: string) => void; onReset: () => void; custom: boolean };

/** 방문자가 자기 문장을 넣어 바로 장면으로 바꿔 보는 칸 */
export function TryInput({ onTry, onReset, custom }: Props) {
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (value.trim().length >= 4) onTry(value);
  }

  return (
    <>
      <form className={styles.try} onSubmit={submit}>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="내 문장으로 해보기: 정확도가 92%까지 올랐어요"
          maxLength={60}
          aria-label="문장을 넣어 장면으로 바꿔보기"
        />
        <button type="submit" className={styles.submit} disabled={value.trim().length < 4}>
          장면으로
        </button>
      </form>
      {custom && (
        <button type="button" className={styles.reset} onClick={onReset}>
          ↺ 예시로 돌아가기
        </button>
      )}
    </>
  );
}
