import Link from "next/link";
import type { Talk } from "@/entities/talk/model";
import { LikeButton } from "./LikeButton";
import { TalkCoverImage } from "./TalkCoverImage";
import styles from "./TalkListItem.module.css";

export function TalkListItem({ talk }: { talk: Talk & { likes?: number } }) {
  return (
    <li className={styles.item}>
      <Link href={`/talks/${talk.id}`} className={styles.link}>
        <TalkCoverImage talk={talk} size="row" className={styles.thumb} />
        <span className={styles.texts}>
          <span className={styles.title}>{talk.title}</span>
          <span className={styles.author}>{talk.author.name}</span>
        </span>
      </Link>
      {talk.likes !== undefined && <LikeButton id={talk.id} initial={talk.likes} />}
    </li>
  );
}
