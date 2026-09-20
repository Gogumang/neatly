import { coverVersion } from "@/entities/talk/cover";
import type { Talk } from "@/entities/talk/model";
import { thumbGradient } from "@/features/share/thumbGradient";
import { cx } from "@/shared/lib/cx";
import styles from "./TalkCoverImage.module.css";

/** 나레이션 대표 이미지. 서버가 만든 썸네일을 받아오고, 그 전엔 그라데이션만 보인다 */
export function TalkCoverImage({
  talk,
  size = "card",
  className,
}: {
  talk: Talk;
  /** card = 4:5 카드, row = 목록 한 줄의 정사각 */
  size?: "card" | "row";
  className?: string;
}) {
  return (
    <span className={cx(styles.cover, className)} style={{ background: thumbGradient(talk.id) }}>
      {/* biome-ignore lint/performance/noImgElement: 라우트가 만들어 주는 이미지라 next/image 를 거칠 필요가 없다 */}
      <img
        className={styles.image}
        src={`/talks/${talk.id}/thumbnail?size=${size}&v=${coverVersion(talk)}`}
        alt={size === "card" ? talk.title : ""}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
