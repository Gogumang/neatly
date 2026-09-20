import { useState } from "react";
import { type GenreId, genreOf } from "@/entities/talk/genres";
import { isLink } from "@/shared/lib/isLink";
import { Button } from "@/shared/ui/Button/Button";
import { TextArea } from "@/shared/ui/TextField/TextField";
import { EXAMPLE_STORY } from "./exampleStory";
import { StepLayout } from "./StepLayout";
import styles from "./StoryStep.module.css";

const MIN = 80;
const MAX = 8000;

type Props = { genre: GenreId; defaultValue?: string; error?: string; onNext: (text: string) => void };

export function StoryStep({ genre, defaultValue, error, onNext }: Props) {
  const { question, placeholder } = genreOf(genre);
  const [text, setText] = useState(defaultValue ?? "");
  const link = isLink(text);
  const length = text.trim().length;
  const tooShort = !link && length > 0 && length < MIN;
  const valid = link || (length >= MIN && text.length <= MAX);
  return (
    <StepLayout
      title={question}
      description="글을 붙여넣거나, 블로그·깃허브 링크를 넣어도 돼요."
      error={error}
      onSubmit={() => valid && onNext(text)}
      cta={
        <Button type="submit" display="block" disabled={!valid}>
          다음
        </Button>
      }
    >
      <TextArea
        className={styles.story}
        aria-label="이야기"
        placeholder={`${placeholder}\n\n또는 글이 있는 링크 하나를 붙여넣어 주세요.`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        hasError={tooShort || text.length > MAX}
        help={link ? "🔗 링크에서 글과 이미지를 가져올게요" : tooShort ? `${MIN}자 이상 써주세요` : undefined}
        helpRight={link ? undefined : `${text.length.toLocaleString()} / ${MAX.toLocaleString()}`}
      />
      <Button
        className={styles.example}
        size="small"
        color="dark"
        variant="weak"
        onClick={() => setText(EXAMPLE_STORY)}
      >
        예시 글로 채워보기
      </Button>
    </StepLayout>
  );
}
