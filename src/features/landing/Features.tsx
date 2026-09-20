import styles from "./Features.module.css";
import { Reveal } from "./Reveal";

const FEATURES = [
  {
    title: "문장마다 어울리는 장면",
    text: "AI가 글을 읽고 키워드, 올라가는 숫자, 앱 화면, 대화 재현 중에서 골라 장면을 만들어요.",
  },
  {
    title: "목소리를 따라 차오르는 자막",
    text: "목소리 6가지 중에 고르면, 만든 음성을 다시 받아써서 자막이 말하는 속도에 딱 맞게 채워져요.",
  },
  {
    title: "한국수어 어순 자막",
    text: "AI가 문장마다 한국수어 어순·어휘로 옮긴 단어를 만들어, 나레이션에 맞춰 하나씩 짚어줘요.",
  },
  {
    title: "링크 하나면 충분",
    text: "블로그 글이나 깃허브 저장소 주소를 넣으면 본문과 이미지를 가져와 나레이션으로 만들어요.",
  },
  {
    title: "없는 숫자는 쓰지 않아요",
    text: "화면에 크게 뜨는 숫자가 원문에 없으면, 코드가 그 장면을 다른 장면으로 바꿔요.",
  },
  {
    title: "mp4 대신 링크",
    text: "결과는 영상 파일이 아니라 웹 페이지예요. 장면을 건너뛰고, 대본으로 훑어볼 수 있어요.",
  },
] as const;

export function Features() {
  return (
    <ul className={styles.features}>
      {FEATURES.map((feature, i) => (
        <li key={feature.title}>
          <Reveal delay={i * 0.05}>
            <article className={styles.feature}>
              <span className={styles.featureIndex} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
