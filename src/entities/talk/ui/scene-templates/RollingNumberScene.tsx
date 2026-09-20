import { motion } from "motion/react";
import type { Template } from "@/entities/talk/model";
import { riseIn, spring } from "./motion";
import { RollingDigit } from "./RollingDigit";
import styles from "./RollingNumberScene.module.css";

type Props = Extract<Template, { type: "rollingNumber" }> & { still?: boolean };

/** "2,000" → 자릿수는 굴리고 쉼표는 그대로 */
function toGlyphs(from: number, to: number) {
  const digits = String(to).length;
  const start = String(from).padStart(digits, "0").slice(-digits);
  let d = 0;
  return [...to.toLocaleString("ko-KR")].map((ch, i) => {
    if (!/\d/.test(ch)) return { key: `sep-${i}`, sep: ch } as const;
    const index = d++;
    return {
      key: `d-${i}`,
      from: Number(start[index]),
      to: Number(ch),
      duration: 1.4 + (digits - index) * 0.18,
    } as const;
  });
}

export function RollingNumberScene({ from = 0, to, prefix, suffix, caption, still }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.number}>
        {prefix && <span>{prefix}</span>}
        {toGlyphs(from, to).map((g) =>
          "sep" in g ? (
            <span key={g.key} className={styles.separator}>
              {g.sep}
            </span>
          ) : still ? (
            <span key={g.key} className={styles.separator}>
              {g.to}
            </span>
          ) : (
            <RollingDigit key={g.key} from={g.from} to={g.to} duration={g.duration} />
          ),
        )}
        {suffix && (
          <motion.span
            className={styles.suffix}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            {suffix}
          </motion.span>
        )}
      </div>
      {caption && (
        <motion.p className={styles.caption} {...riseIn(0.5, 8)}>
          {caption}
        </motion.p>
      )}
    </div>
  );
}
