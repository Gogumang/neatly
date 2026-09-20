import { useState } from "react";
import { DEFAULT_VOICE, VOICES, type VoiceId } from "@/entities/talk/voices";
import { Button } from "@/shared/ui/Button/Button";
import { RadioCard, RadioCardList } from "@/shared/ui/RadioCard/RadioCard";
import { StepLayout } from "./StepLayout";
import { useVoicePreview } from "./useVoicePreview";
import { VoiceOrb, VoiceTags } from "./VoiceOrb";

type Props = { defaultValue?: VoiceId; onNext: (voice: VoiceId) => void };

export function VoiceStep({ defaultValue, onNext }: Props) {
  const [voice, setVoice] = useState<VoiceId>(defaultValue ?? DEFAULT_VOICE);
  const preview = useVoicePreview();
  return (
    <StepLayout
      title="어떤 목소리로 들려줄까요?"
      description="구슬을 누르면 미리 들어볼 수 있어요."
      onSubmit={() => onNext(voice)}
      cta={
        <Button type="submit" display="block">
          나레이션 만들기
        </Button>
      }
    >
      <RadioCardList label="목소리">
        {VOICES.map((v) => (
          <RadioCard
            key={v.id}
            name="voice"
            value={v.id}
            checked={voice === v.id}
            onSelect={() => setVoice(v.id)}
            left={
              <VoiceOrb
                voice={v}
                playing={preview.playing === v.id}
                loading={preview.loading === v.id}
                progress={preview.progress}
                onToggle={() => preview.toggle(v.id)}
              />
            }
            title={v.name}
            description={
              <>
                {v.description}
                <VoiceTags tags={v.tags} />
              </>
            }
          />
        ))}
      </RadioCardList>
    </StepLayout>
  );
}
