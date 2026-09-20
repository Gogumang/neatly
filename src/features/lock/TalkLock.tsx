"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isPassword, MAX_PASSWORD } from "@/entities/talk/visibility";
import { postJson } from "@/shared/lib/postJson";
import { Button } from "@/shared/ui/Button/Button";
import { TextField } from "@/shared/ui/TextField/TextField";
import { Top } from "@/shared/ui/Top/Top";
import styles from "./TalkLock.module.css";

/** 비공개 나레이션 잠금 화면. 제목만 보여 주고 비밀번호를 묻는다 */
export function TalkLock({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const unlock = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await postJson(`/api/talks/${id}/unlock`, { password });
      // 쿠키가 생겼으니 서버가 내용을 그려 준다
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "비밀번호가 달라요");
      setBusy(false);
    }
  };

  return (
    <main className={styles.page}>
      <motion.form
        className={styles.card}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (isPassword(password)) unlock();
        }}
      >
        <Top title={title} lower="비밀번호를 아는 사람만 볼 수 있어요." />
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          autoFocus
          maxLength={MAX_PASSWORD}
          value={password}
          hasError={Boolean(error)}
          help={error}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(undefined);
          }}
        />
        <Button type="submit" display="block" loading={busy} disabled={!isPassword(password)}>
          보기
        </Button>
      </motion.form>
    </main>
  );
}
