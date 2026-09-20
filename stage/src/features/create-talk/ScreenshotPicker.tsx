import styles from "./PhotoPickers.module.css";

const MAX_SCREENSHOTS = 6;

type Props = { value: string[]; busy: boolean; onAdd: (files: File[]) => void; onRemove: (url: string) => void };

/** 스크린샷·결과 이미지 여러 장 고르기 */
export function ScreenshotPicker({ value, busy, onAdd, onRemove }: Props) {
  const left = MAX_SCREENSHOTS - value.length;
  return (
    <div className={styles.section}>
      <span className={styles.label}>스크린샷 · 결과 이미지</span>
      <div className={styles.grid}>
        {value.map((url) => (
          <div key={url} className={styles.tile}>
            {/* biome-ignore lint/performance/noImgElement: 방금 올린 이미지 미리보기 */}
            <img className={styles.preview} src={url} alt="" />
            <button type="button" className={styles.remove} aria-label="이미지 빼기" onClick={() => onRemove(url)}>
              ×
            </button>
          </div>
        ))}
        {left > 0 && (
          <label className={styles.add}>
            <input
              className={styles.input}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              aria-label="이미지 추가"
              disabled={busy}
              onChange={(e) => {
                onAdd([...(e.target.files ?? [])].slice(0, left));
                e.target.value = "";
              }}
            />
            {busy ? "…" : "+"}
          </label>
        )}
      </div>
      <span className={styles.hint}>AI가 이미지를 보고 알맞은 장면에 넣어요 (최대 {MAX_SCREENSHOTS}장)</span>
    </div>
  );
}
