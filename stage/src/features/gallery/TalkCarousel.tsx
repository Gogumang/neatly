import Link from "next/link";
import type { Talk } from "@/entities/talk/model";
import { TalkCard } from "./TalkCard";
import styles from "./TalkCarousel.module.css";

/** 큰 이미지 카드를 가로로 넘겨 보는 나레이션 목록 */
export function TalkCarousel({ title, talks, moreHref }: { title: string; talks: Talk[]; moreHref: string }) {
  return (
    <section>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <Link href={moreHref} className={styles.more}>
          전체 보기 ›
        </Link>
      </div>
      <ul className={styles.track}>
        {talks.map((talk) => (
          <li key={talk.id} className={styles.item}>
            <TalkCard talk={talk} />
          </li>
        ))}
      </ul>
    </section>
  );
}
