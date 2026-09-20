import { useState } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { TextField } from "@/shared/ui/TextField/TextField";
import { StepLayout } from "./StepLayout";

/** 무엇에 대한 이야기인지. 이 이름이 나레이션 제목이 된다 */
export function SubjectStep({ defaultValue, onNext }: { defaultValue?: string; onNext: (subject: string) => void }) {
  const [name, setName] = useState(defaultValue ?? "");
  const valid = name.trim().length > 0;
  return (
    <StepLayout
      title="무엇에 대한 이야기인가요?"
      onSubmit={() => valid && onNext(name.trim())}
      cta={
        <Button type="submit" display="block" disabled={!valid}>
          다음
        </Button>
      }
    >
      <TextField
        aria-label="프로젝트 이름"
        placeholder="예: 고객센터 문의 자동 분류"
        help="나레이션 제목으로 쓰여요"
        maxLength={40}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
    </StepLayout>
  );
}
