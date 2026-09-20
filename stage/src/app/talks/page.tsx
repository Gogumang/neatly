import type { Metadata } from "next";
import { getGalleryTalks } from "@/features/gallery/getGalleryTalks";
import { TalkListItem } from "@/features/gallery/TalkListItem";
import { IconLink } from "@/shared/ui/IconButton/IconLink";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "모두의 나레이션 — 또박" };

export default async function AllTalksPage() {
  const talks = await getGalleryTalks();
  return (
    <main className={styles.page}>
      <IconLink href="/" icon="back" label="뒤로" className={styles.back} />
      <h1 className={styles.title}>모두의 나레이션</h1>
      <ul className={styles.list}>
        {talks.map((talk) => (
          <TalkListItem key={talk.id} talk={talk} />
        ))}
      </ul>
    </main>
  );
}
