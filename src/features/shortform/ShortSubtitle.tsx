import { AnimatePresence, motion } from "motion/react";
import { parseEmphasis, plainText } from "@/entities/talk/emphasis";
import type { Segment } from "@/entities/talk/model";
import { useKaraoke } from "@/features/player/useKaraoke";
import type { NarrationClock } from "@/features/player/useNarration";
import { cx } from "@/shared/lib/cx";
import styles from "./ShortSubtitle.module.css";

type Props = { segment: Segment; visible: boolean; playing: boolean; clock: NarrationClock };

/** 숏폼 자막. 화면 아래 절반을 채우는 큰 글씨가 목소리를 따라 차오른다 */
export function ShortSubtitle({ segment, visible, playing, clock }: Props) {
  const plain = plainText(segment.text);
  const filled = useKaraoke(segment, plain, clock, playing);
  let offset = 0;
  // aria-live 를 두지 않는다: 나레이션과 스크린 리더가 같은 문장을 겹쳐 읽는다 (대본 페이지가 따로 있다)
  return (
    <div className={styles.area}>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={segment.id}
            className={cx(styles.text, segment.size === "large" && styles.large)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
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
