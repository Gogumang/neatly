"use client";

import { useEffect, useState } from "react";
import { parseEmphasis } from "@/entities/talk/emphasis";
import { cx } from "@/shared/lib/cx";
import styles from "./KaraokeLine.module.css";
import { type Cell, scatterVars, toWordGroups } from "./scatter";

/** 목소리를 따라 글자가 차오르는 자막 (소개용 축소판). 처음엔 흩어졌던 글자가 제자리로 모인다 */
export function KaraokeLine({ text, durationMs, active }: { text: string; durationMs: number; active: boolean }) {
  const [filled, setFilled] = useState(0);
  let n = 0;
  const cells: Cell[] = parseEmphasis(text).flatMap((part) =>
    [...part.text].map((ch) => ({ ch, em: part.em, i: n++ })),
  );

  useEffect(() => {
    if (!active) return setFilled(0);
    const started = performance.now();
    let frame = 0;
    const tick = () => {
      const ratio = Math.min(1, (performance.now() - started) / durationMs);
      setFilled(Math.round(ratio * cells.length));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, cells.length]);

  return (
    <>
      {toWordGroups(cells).map((group) =>
        // 띄어쓰기는 그대로 둔다 (여기서만 줄이 바뀐다)
        group[0].ch === " " ? (
          <span key={group[0].i} className={styles.space}>
            {" "}
          </span>
        ) : (
          <span key={group[0].i} className={styles.word}>
            {group.map((cell) => (
              <span
                key={cell.i}
                className={cx(styles.ch, cell.em && styles.em, cell.i < filled && styles.sung)}
                style={scatterVars(cell.i)}
              >
                {cell.ch}
              </span>
            ))}
          </span>
        ),
      )}
    </>
  );
}
