import { useState } from "react";
import { isPassword, MAX_PASSWORD, VISIBILITIES, type VisibilityId } from "@/entities/talk/visibility";
import { Button } from "@/shared/ui/Button/Button";
import { RadioCard, RadioCardList } from "@/shared/ui/RadioCard/RadioCard";
import { TextField } from "@/shared/ui/TextField/TextField";
import { StepLayout } from "./StepLayout";

type Access = { visibility: VisibilityId; password?: string };

type Props = { defaultValue?: VisibilityId; defaultPassword?: string; onNext: (access: Access) => void };

/** 공개 범위 고르기. 비공개를 고르면 그 자리에서 비밀번호 입력칸이 열린다 */
export function VisibilityStep({ defaultValue, defaultPassword, onNext }: Props) {
  const [visibility, setVisibility] = useState<VisibilityId | undefined>(defaultValue);
  const [password, setPassword] = useState(defaultPassword ?? "");
  const isPrivate = visibility === "private";
  const ready = isPassword(password);

  const pick = (id: VisibilityId) => {
    setVisibility(id);
    // 공개는 누르면 바로 넘어가고, 비공개는 비밀번호를 받은 뒤에 넘어간다
    if (id === "public") onNext({ visibility: id });
  };

  return (
    <StepLayout
      title="누가 볼 수 있나요?"
      onSubmit={() => isPrivate && ready && onNext({ visibility: "private", password })}
      cta={
        isPrivate ? (
          <Button type="submit" display="block" disabled={!ready}>
            다음
          </Button>
        ) : undefined
      }
    >
      <RadioCardList label="공개 범위">
        {VISIBILITIES.map((v) => (
          <RadioCard
            key={v.id}
            name="visibility"
            value={v.id}
            checked={visibility === v.id}
            onSelect={() => pick(v.id)}
            title={v.name}
          />
        ))}
      </RadioCardList>
      {isPrivate && (
        <TextField
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="4~20자"
          maxLength={MAX_PASSWORD}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
    </StepLayout>
  );
}
