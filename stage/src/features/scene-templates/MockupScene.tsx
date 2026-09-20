import { motion } from "motion/react";
import type { Template } from "@/entities/talk/model";
import { ListRow } from "@/shared/ui/ListRow/ListRow";
import styles from "./MockupScene.module.css";
import { riseIn, spring } from "./motion";

type Props = Extract<Template, { type: "mockup" }>;
type Screen = NonNullable<Props["screen"]>;

function AppScreen({ screen }: { screen: Screen }) {
  return (
    <div className={styles.app}>
      <div className={styles.status}>
        <span>9:41</span>
        <span>●●● ▮</span>
      </div>
      <motion.h3 className={styles.title} {...riseIn(0.25, 10)}>
        {screen.title}
      </motion.h3>
      <ul className={styles.list}>
        {screen.items.map((item, i) => (
          <motion.li key={`${i}-${item.title}`} {...riseIn(0.4 + i * 0.14)}>
            <ListRow top={item.title} bottom={item.description} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** 폰 목업 안에 이미지·영상 또는 생성한 앱 화면을 보여준다. 화면은 항상 라이트 테마 */
export function MockupScene({ media, screen }: Props) {
  return (
    <motion.div
      className={styles.phone}
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
    >
      <div className={styles.screen} data-theme="light">
        {/* biome-ignore lint/performance/noImgElement: 사용자가 올린 임의 URL 이라 next/image 최적화 대상이 아니다 */}
        {media?.kind === "image" && <img className={styles.media} src={media.src} alt="" />}
        {media?.kind === "video" && <video className={styles.media} src={media.src} autoPlay muted loop playsInline />}
        {!media && screen && <AppScreen screen={screen} />}
      </div>
    </motion.div>
  );
}
