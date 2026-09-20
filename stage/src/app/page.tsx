import Link from "next/link";
import { sampleTalk } from "@/entities/talk/sample";
import { getGalleryTalks } from "@/features/gallery/getGalleryTalks";
import { TalkCarousel } from "@/features/gallery/TalkCarousel";
import { Aurora } from "@/features/landing/Aurora";
import { Converter } from "@/features/landing/Converter";
import { Features } from "@/features/landing/Features";
import { Finale } from "@/features/landing/Finale";
import { HeroStarter } from "@/features/landing/HeroStarter";
import { HeroTitle } from "@/features/landing/HeroTitle";
import styles from "@/features/landing/Landing.module.css";
import { Reveal } from "@/features/landing/Reveal";
import { SectionTitle } from "@/features/landing/SectionTitle";
import { StatLine } from "@/features/landing/StatLine";

export default async function Home() {
  const talks = await getGalleryTalks();
  const scenes = talks.reduce((sum, talk) => sum + talk.segments.length, 0);
  // 예시 나레이션에는 좋아요가 없다
  const likes = talks.reduce((sum, t) => sum + ("likes" in t && typeof t.likes === "number" ? t.likes : 0), 0);
  return (
    <main className={styles.page}>
      <section className={`${styles.wrap} ${styles.hero}`}>
        <Aurora />
        <HeroTitle />
        <div className={styles.actions}>
          <HeroStarter />
          <Link href={`/talks/${sampleTalk.id}`} className={styles.textLink}>
            예시 나레이션 먼저 보기 ›
          </Link>
          <StatLine talks={talks.length} scenes={scenes} likes={likes} />
        </div>
        <span className={styles.scrollCue} aria-hidden />
      </section>

      <div className={styles.wrap}>
        <Converter />
      </div>

      <section className={`${styles.wrap} ${styles.section}`}>
        <SectionTitle
          label="HOW IT WORKS"
          lines={["글 한 편이", "나레이션이 되기까지"]}
          lower="문장을 읽고, 어울리는 장면을 고르고, 목소리에 맞춰 자막을 채우는 일까지 또박이 합니다."
        />
        <Features />
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <Reveal>
          <TalkCarousel title="모두의 나레이션" talks={talks} moreHref="/talks" />
        </Reveal>
      </section>

      <Finale />
    </main>
  );
}
