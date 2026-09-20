import { FORMATS, type FormatId } from "@/entities/talk/formats";
import { RadioCard, RadioCardList } from "@/shared/ui/RadioCard/RadioCard";
import { StepLayout } from "./StepLayout";

/** 첫 단계: 무엇으로 만들지 고른다. 누르면 바로 다음으로 넘어간다 */
export function FormatStep({ defaultValue, onNext }: { defaultValue?: FormatId; onNext: (format: FormatId) => void }) {
  return (
    <StepLayout title="무엇으로 만들까요?">
      <RadioCardList label="만들 형식">
        {FORMATS.map((f) => (
          <RadioCard
            key={f.id}
            name="format"
            value={f.id}
            checked={defaultValue === f.id}
            onSelect={() => onNext(f.id)}
            title={f.name}
            description={f.lower}
          />
        ))}
      </RadioCardList>
    </StepLayout>
  );
}
