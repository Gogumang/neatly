import styles from "./PhotoPickers.module.css";

type Props = { value?: string; busy: boolean; onPick: (file: File) => void };

/** 동그란 프로필 사진 고르기 */
export function AvatarPicker({ value, busy, onPick }: Props) {
  return (
    <div className={styles.section}>
      <span className={styles.label}>프로필 사진</span>
      <label className={styles.avatar}>
        <input
          className={styles.input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-label="프로필 사진 고르기"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(file);
            e.target.value = "";
          }}
        />
        {/* biome-ignore lint/performance/noImgElement: 방금 올린 사진 미리보기 */}
        {value ? <img className={styles.preview} src={value} alt="프로필 사진 미리보기" /> : busy ? "…" : "+"}
      </label>
      <span className={styles.hint}>나레이션에서 발표자가 말하는 장면에 나와요</span>
    </div>
  );
}
