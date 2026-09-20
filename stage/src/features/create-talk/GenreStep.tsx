import { useState } from "react";
import { DEFAULT_GENRE, GENRES, type GenreId } from "@/entities/talk/genres";
import { Button } from "@/shared/ui/Button/Button";
import { RadioCard, RadioCardList } from "@/shared/ui/RadioCard/RadioCard";
import { StepLayout } from "./StepLayout";

export function GenreStep({ defaultValue, onNext }: { defaultValue?: GenreId; onNext: (genre: GenreId) => void }) {
  const [genre, setGenre] = useState<GenreId>(defaultValue ?? DEFAULT_GENRE);
  return (
    <StepLayout
      title="어떤 나레이션을 만들까요?"
      onSubmit={() => onNext(genre)}
      cta={
        <Button type="submit" display="block">
          다음
        </Button>
      }
    >
      <RadioCardList label="나레이션 종류">
        {GENRES.map((g) => (
          <RadioCard
            key={g.id}
            name="genre"
            value={g.id}
            checked={genre === g.id}
            onSelect={() => setGenre(g.id)}
            title={g.name}
            description={g.flow}
          />
        ))}
      </RadioCardList>
    </StepLayout>
  );
}
