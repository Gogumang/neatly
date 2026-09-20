import { AnimatePresence, motion } from "motion/react";
import { parseEmphasis, plainText } from "@/entities/talk/emphasis";
import type { Segment } from "@/entities/talk/model";
import { cx } from "@/shared/lib/cx";
import styles from "./Subtitle.module.css";
import { useKaraoke } from "./useKaraoke";
import type { NarrationClock } from "./useNarration";

type Props = { segment: Segment; visible: boolean; playing: boolean; clock: NarrationClock };

/** 장면 자막. 목소리를 따라 글자가 차오르고(노래방), ⭐강조⭐ 구절은 파란색 */
export function Subtitle({ segment, visible, playing, clock }: Props) {
  const plain = plainText(segment.text);
  const filled = useKaraoke(segment, plain, clock, playing);
  let offset = 0;
  // aria-live 를 두지 않는다: 나레이션과 스크린 리더가 같은 문장을 겹쳐 읽게 된다.
  // 글로 따라가려면 대본 페이지(/talks/[id]/transcript)를 쓴다.
  return (
    <div className={styles.area}>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={segment.id}
            className={cx(styles.text, segment.size === "large" && styles.large)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* 글자별 span 은 스크린 리더가 한 글자씩 끊어 읽으므로 문장을 따로 둔다 */}
            <span className={styles.srOnly}>{plain}</span>
            {parseEmphasis(segment.text).flatMap((part) =>
              [...part.text].map((ch) => {
                const i = offset++;
                return (
                  <span key={i} aria-hidden className={cx(part.em && styles.em, i < filled && styles.sung)}>
                    {ch}
                  </span>
                );
              }),
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
