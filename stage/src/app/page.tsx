import Link from "next/link";
import { sampleTalk } from "@/entities/talk/sample";
import { getGalleryTalks } from "@/features/gallery/getGalleryTalks";
import { TalkBrowser } from "@/features/gallery/TalkBrowser";
import { Aurora } from "@/features/landing/Aurora";
import { Converter } from "@/features/landing/Converter";
import { Features } from "@/features/landing/Features";
import hero from "@/features/landing/Hero.module.css";
import { HeroTitle } from "@/features/landing/HeroTitle";
import styles from "@/features/landing/Landing.module.css";
import { SectionTitle } from "@/features/landing/SectionTitle";
import { StatLine } from "@/features/landing/StatLine";
import { ButtonLink } from "@/shared/ui/Button/Button";

export default async function Home() {
  const talks = await getGalleryTalks();
  // 예시로 보여 줄 나레이션은 실제로 만들어진 것 중 첫 번째 (녹음된 목소리가 들어 있다)
  const example = talks[0] ?? sampleTalk;
  const scenes = talks.reduce((sum, talk) => sum + talk.segments.length, 0);
  // 예시 나레이션에는 좋아요가 없다
  const likes = talks.reduce((sum, t) => sum + ("likes" in t && typeof t.likes === "number" ? t.likes : 0), 0);
  return (
    <main className={styles.page}>
      <section className={`${styles.wrap} ${styles.snap} ${styles.screen} ${hero.hero}`}>
        <Aurora />
        <HeroTitle />
        <div className={hero.actions}>
          <ButtonLink href="/new">나레이션 만들어보기</ButtonLink>
          <Link href={`/talks/${example.id}`} className={hero.textLink}>
            예시 나레이션 먼저 보기 ›
          </Link>
          <StatLine talks={talks.length} scenes={scenes} likes={likes} />
        </div>
        <span className={hero.scrollCue} aria-hidden />
      </section>

      <div className={`${styles.wrap} ${styles.snap}`}>
        <Converter />
      </div>

      <section className={`${styles.wrap} ${styles.snap} ${styles.screen} ${styles.section}`}>
        <SectionTitle
          label="HOW IT WORKS"
          lines={["글 한 편이", "나레이션이 되기까지"]}
          lower="문장을 읽고, 어울리는 장면을 고르고, 목소리에 맞춰 자막을 채우는 일까지 또박이 합니다."
        />
        <Features />
      </section>

      <TalkBrowser talks={talks} />
    </main>
  );
}
