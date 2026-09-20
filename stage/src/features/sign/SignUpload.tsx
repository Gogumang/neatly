"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { IconLink } from "@/shared/ui/IconButton/IconLink";
import { Top } from "@/shared/ui/Top/Top";
import styles from "./SignUpload.module.css";
import { useSignUpload } from "./useSignUpload";

/** 나레이션에 수어 통역 영상 붙이기 */
export function SignUpload({ talkId, title }: { talkId: string; title: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const { upload, busy, error } = useSignUpload(talkId);

  return (
    <main className={styles.page}>
      <IconLink href={`/talks/${talkId}`} icon="back" label="나레이션으로" className={styles.back} />
      <Top title="수어 통역 영상을 붙여주세요" lower={`「${title}」 나레이션에 수어 통역을 더해요.`} />
      <ol className={styles.steps}>
        <li>수어통역사가 나레이션을 처음부터 틀어 놓고, 따라서 통역하는 모습을 찍어주세요.</li>
        <li>나레이션 재생을 시작하는 순간 녹화도 시작해 주세요. 장면마다 자동으로 맞춰져요.</li>
        <li>얼굴과 두 손이 잘 보이게, 단색 배경에서 찍으면 가장 잘 보여요.</li>
      </ol>
      <label className={styles.picker}>
        <input
          className={styles.input}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          aria-label="수어 영상 고르기"
          onChange={(e) => {
            const picked = e.target.files?.[0] ?? null;
            setFile(picked);
            setPreview(picked ? URL.createObjectURL(picked) : undefined);
          }}
        />
        {file ? file.name : "🤟 영상 고르기 (MP4 · WEBM · MOV, 100MB 이하)"}
      </label>
      {preview && <video className={styles.preview} src={preview} controls muted playsInline />}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.cta}>
        <Button display="block" disabled={!file} loading={busy} onClick={() => file && upload(file)}>
          수어 영상 붙이기
        </Button>
      </div>
    </main>
  );
}
