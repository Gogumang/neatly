"use client";

import { useFunnel } from "@use-funnel/browser";
import { useRouter } from "next/navigation";
import { IconButton } from "@/shared/ui/IconButton/IconButton";
import { CreateProgress } from "./CreateProgress";
import styles from "./CreateTalk.module.css";
import type { CreateTalkSteps } from "./funnel";
import { GenreStep } from "./GenreStep";
import { LengthStep } from "./LengthStep";
import { PhotosStep } from "./PhotosStep";
import { StoryStep } from "./StoryStep";
import { SubjectStep } from "./SubjectStep";
import { VoiceStep } from "./VoiceStep";

/** 나레이션 만들기 퍼널: 장르 → 제목 → 이야기 → 길이 → 사진 → 목소리 → 생성. 브라우저 뒤로가기로 단계를 오간다 */
export function CreateTalk() {
  const router = useRouter();
  const funnel = useFunnel<CreateTalkSteps>({ id: "create-talk", initial: { step: "genre", context: {} } });
  const back = () => (funnel.index > 0 && funnel.step !== "generate" ? funnel.history.back() : router.push("/"));

  return (
    <main className={styles.page}>
      <IconButton className={styles.back} icon="back" label="뒤로" onClick={back} />
      <funnel.Render
        genre={({ context, history }) => (
          <GenreStep defaultValue={context.genre} onNext={(genre) => history.push("subject", { ...context, genre })} />
        )}
        subject={({ context, history }) => (
          <SubjectStep
            defaultValue={context.subject}
            onNext={(subject) => history.push("story", { ...context, subject })}
          />
        )}
        story={({ context, history }) => (
          <StoryStep
            genre={context.genre}
            defaultValue={context.text}
            error={context.error}
            onNext={(text) => history.push("length", { ...context, text, error: undefined })}
          />
        )}
        length={({ context, history }) => (
          <LengthStep
            defaultValue={context.length}
            onNext={(length) => history.push("photos", { ...context, length })}
          />
        )}
        photos={({ context, history }) => (
          <PhotosStep defaultValue={context} onNext={(photos) => history.push("voice", { ...context, ...photos })} />
        )}
        voice={({ context, history }) => (
          <VoiceStep defaultValue={context.voice} onNext={(voice) => history.push("generate", { ...context, voice })} />
        )}
        generate={({ context, history }) => (
          <CreateProgress input={context} onError={(error) => history.replace("story", { ...context, error })} />
        )}
      />
    </main>
  );
}
