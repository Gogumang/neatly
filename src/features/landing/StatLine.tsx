import { CountUp } from "./CountUp";
import styles from "./Landing.module.css";

type Props = { talks: number; scenes: number; likes: number };

/** 갤러리에 실제로 올라온 나레이션을 그대로 센 줄 (없는 숫자는 쓰지 않는다) */
export function StatLine({ talks, scenes, likes }: Props) {
  return (
    <p className={styles.stat}>
      지금까지 또박으로 만든 나레이션{" "}
      <strong>
        <CountUp value={talks} />편
      </strong>
      <span aria-hidden> · </span>장면{" "}
      <strong>
        <CountUp value={scenes} />개
      </strong>
      <span aria-hidden> · </span>받은 좋아요{" "}
      <strong>
        <CountUp value={likes} />
      </strong>
    </p>
  );
}
