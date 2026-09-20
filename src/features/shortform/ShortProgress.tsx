import type { Segment } from "@/entities/talk/model";
import styles from "./ShortProgress.module.css";

type Props = { segments: Segment[]; index: number; progress: number; ended: boolean };

/** 화면 맨 위 장면 진행 막대. 장면 수만큼 칸을 두고 지금 칸은 목소리를 따라 찬다 */
export function ShortProgress({ segments, index, progress, ended }: Props) {
  const fillOf = (i: number) => (ended || i < index ? 1 : i === index ? progress : 0);
  return (
    <div className={styles.bar} aria-hidden>
      {segments.map((segment, i) => (
        <span key={segment.id} className={styles.cell}>
          <span className={styles.fill} style={{ transform: `scaleX(${fillOf(i)})` }} />
        </span>
      ))}
    </div>
  );
}
