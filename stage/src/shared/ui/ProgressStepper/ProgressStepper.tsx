import { Icon } from "../Icon/Icon";
import styles from "./ProgressStepper.module.css";

type Step = { label: string; caption?: string };

/** 세로 진행 단계. current 보다 앞은 완료, current 는 진행 중 */
export function ProgressStepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className={styles.list}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li
            key={step.label}
            className={styles.step}
            data-state={state}
            aria-current={state === "active" ? "step" : undefined}
          >
            <span className={styles.dot}>{state === "done" ? <Icon name="check" size={16} /> : i + 1}</span>
            <span>
              {step.label}
              {step.caption && state === "active" && <span className={styles.caption}>{step.caption}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
