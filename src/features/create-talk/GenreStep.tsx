import { GENRES, type GenreId } from "@/entities/talk/genres";
import { RadioCard, RadioCardList } from "@/shared/ui/RadioCard/RadioCard";
import { StepLayout } from "./StepLayout";

/** 첫 단계: 종류를 누르면 바로 다음으로 넘어간다 (따로 누를 버튼을 두지 않는다) */
export function GenreStep({ defaultValue, onNext }: { defaultValue?: GenreId; onNext: (genre: GenreId) => void }) {
  return (
    <StepLayout title="어떤 종류의 이야기인가요?">
      <RadioCardList label="나레이션 종류">
        {GENRES.map((g) => (
          <RadioCard
            key={g.id}
            name="genre"
            value={g.id}
            checked={defaultValue === g.id}
            onSelect={() => onNext(g.id)}
            title={g.name}
          />
        ))}
      </RadioCardList>
    </StepLayout>
  );
}
