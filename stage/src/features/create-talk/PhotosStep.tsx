import { useState } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { TextField } from "@/shared/ui/TextField/TextField";
import { AvatarPicker } from "./AvatarPicker";
import { ScreenshotPicker } from "./ScreenshotPicker";
import { StepLayout } from "./StepLayout";
import { useUploads } from "./useUploads";

type Photos = { avatarUrl?: string; imageUrls: string[]; authorName?: string };
type Props = { defaultValue: Partial<Photos>; onNext: (photos: Photos) => void };

export function PhotosStep({ defaultValue, onNext }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(defaultValue.avatarUrl);
  const [imageUrls, setImageUrls] = useState(defaultValue.imageUrls ?? []);
  const [authorName, setAuthorName] = useState(defaultValue.authorName ?? "");
  const avatar = useUploads();
  const images = useUploads();
  const busy = avatar.uploading || images.uploading;
  const empty = !avatarUrl && imageUrls.length === 0;

  return (
    <StepLayout
      title="사진이 있으면 더 생생해져요"
      description="없어도 괜찮아요. 글만으로도 나레이션을 만들 수 있어요."
      error={avatar.error ?? images.error}
      onSubmit={() => onNext({ avatarUrl, imageUrls, authorName: authorName.trim() || undefined })}
      cta={
        <Button type="submit" display="block" loading={busy}>
          {empty ? "사진 없이 다음" : "다음"}
        </Button>
      }
    >
      <AvatarPicker
        value={avatarUrl}
        busy={avatar.uploading}
        onPick={async (file) => {
          const [url] = await avatar.upload([file]);
          if (url) setAvatarUrl(url);
        }}
      />
      {avatarUrl && (
        <TextField
          label="발표자 이름 (선택)"
          placeholder="사진 아래에 함께 보여줘요"
          maxLength={30}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      )}
      <ScreenshotPicker
        value={imageUrls}
        busy={images.uploading}
        onAdd={async (files) => {
          const urls = await images.upload(files);
          setImageUrls((prev) => [...prev, ...urls]);
        }}
        onRemove={(url) => setImageUrls((prev) => prev.filter((u) => u !== url))}
      />
    </StepLayout>
  );
}
