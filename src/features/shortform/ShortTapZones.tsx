import type { PointerEvent } from "react";
import styles from "./ShortTapZones.module.css";

type Props = { playing: boolean; onToggle: () => void; onPrev: () => void; onNext: () => void };

// 눌렀을 때 초점이 옮겨 가지 않게 한다 (초점이 버튼에 있으면 스페이스바가 이 버튼을 다시 누른다)
const keepFocus = (e: PointerEvent<HTMLButtonElement>) => e.preventDefault();

/** 화면을 덮는 터치 영역. 가운데는 재생/일시정지, 양옆은 이전·다음 장면 */
export function ShortTapZones({ playing, onToggle, onPrev, onNext }: Props) {
  return (
    <div className={styles.zones}>
      <button type="button" className={styles.side} onPointerDown={keepFocus} onClick={onPrev} aria-label="이전 장면" />
      <button
        type="button"
        className={styles.center}
        onPointerDown={keepFocus}
        onClick={onToggle}
        aria-label={playing ? "일시정지" : "재생"}
      />
      <button type="button" className={styles.side} onPointerDown={keepFocus} onClick={onNext} aria-label="다음 장면" />
    </div>
  );
}
