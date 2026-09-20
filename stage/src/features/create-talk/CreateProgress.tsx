import { motion } from "motion/react";
import { isLink } from "@/shared/lib/isLink";
import { ProgressStepper } from "@/shared/ui/ProgressStepper/ProgressStepper";
import { Top } from "@/shared/ui/Top/Top";
import styles from "./CreateProgress.module.css";
import type { TalkInput } from "./funnel";
import { useGenerateTalk } from "./useGenerateTalk";

const steps = (fromLink: boolean) => [
  {
    label: fromLink ? "링크에서 글을 가져와 대본을 쓰고 있어요" : "글을 읽고 대본을 쓰고 있어요",
    caption: "문제 · 시도 · 해결 · 성과로 흐름을 짜는 중",
  },
  { label: "장면마다 목소리를 입히고 있어요", caption: "문장마다 나레이션을 녹음하는 중" },
  { label: "나레이션이 완성됐어요" },
];

export function CreateProgress({ input, onError }: { input: TalkInput; onError: (message: string) => void }) {
  const current = useGenerateTalk(input, onError);
  const list = steps(isLink(input.text));
  const done = current >= list.length - 1;
  return (
    <motion.section className={styles.root} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Top
        title={done ? "완성됐어요!" : "나레이션을 만들고 있어요"}
        lower={done ? "곧 나레이션으로 이동해요." : "보통 20초 정도 걸려요."}
      />
      <ProgressStepper steps={list} current={done ? list.length : current} />
      <p className={styles.tip}>
        💡 나레이션이 만들어지면 링크로 공유하고, 갤러리에서 다른 사람들의 나레이션도 볼 수 있어요.
      </p>
    </motion.section>
  );
}
