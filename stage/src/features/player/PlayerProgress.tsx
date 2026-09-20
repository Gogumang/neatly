import type { Segment } from "@/entities/talk/model";
import styles from "./PlayerProgress.module.css";

type Props = { segments: Segment[]; index: number; ended: boolean; go: (index: number) => void };

/** 화면 맨 위 장면 진행바. 누르면 그 장면으로 이동 */
export function PlayerProgress({ segments, index, ended, go }: Props) {
  const state = (i: number) => (i < index || ended ? "done" : i === index ? "current" : "todo");
  return (
    <div className={styles.progress}>
      {segments.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className={styles.step}
          data-state={state(i)}
          onClick={() => go(i)}
          aria-label={`${i + 1}번째 장면`}
        />
      ))}
    </div>
  );
}
