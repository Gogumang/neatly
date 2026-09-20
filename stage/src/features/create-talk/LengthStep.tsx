import { useState } from "react";
import { DEFAULT_LENGTH, LENGTHS, type LengthId } from "@/entities/talk/lengths";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button } from "@/shared/ui/Button/Button";
import { RadioCard, RadioCardList } from "@/shared/ui/RadioCard/RadioCard";
import { StepLayout } from "./StepLayout";

type Props = { defaultValue?: LengthId; onNext: (length: LengthId) => void };

export function LengthStep({ defaultValue, onNext }: Props) {
  const [length, setLength] = useState<LengthId>(defaultValue ?? DEFAULT_LENGTH);
  return (
    <StepLayout
      title="얼마나 길게 만들까요?"
      onSubmit={() => onNext(length)}
      cta={
        <Button type="submit" display="block">
          다음
        </Button>
      }
    >
      <RadioCardList label="나레이션 길이">
        {LENGTHS.map((item) => (
          <RadioCard
            key={item.id}
            name="length"
            value={item.id}
            checked={length === item.id}
            onSelect={() => setLength(item.id)}
            title={item.name}
            description={item.description}
            right={<Badge color="grey">{item.scenes}</Badge>}
          />
        ))}
      </RadioCardList>
    </StepLayout>
  );
}
