import { plainText } from "@/entities/talk/emphasis";
import type { Segment, Talk } from "@/entities/talk/model";
import { IconLink } from "@/shared/ui/IconButton/IconLink";
import { Top } from "@/shared/ui/Top/Top";
import { describeTemplate } from "./describeTemplate";
import styles from "./Transcript.module.css";

function TranscriptScene({ segment, n, author }: { segment: Segment; n: number; author: Talk["author"] }) {
  const { kind, lines } = describeTemplate(segment.template, author);
  return (
    <li className={styles.scene}>
      {/* 장면마다 제목을 둬서 스크린 리더로 장면 단위로 건너뛸 수 있게 */}
      <h2 className={styles.number}>장면 {n}</h2>
      <p className={styles.text}>{plainText(segment.text)}</p>
      <div className={styles.visual}>
        <p className={styles.kind}>화면 · {kind}</p>
        {lines.length > 0 && (
          <ul className={styles.lines}>
            {lines.map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: 순서가 바뀌지 않는 정적 목록이고, 같은 대화가 반복될 수 있다
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/** 나레이션 전체 대본. 소리·움직임 없이 글로 끝까지 읽을 수 있는 길 */
export function Transcript({ talk }: { talk: Talk }) {
  const { author } = talk;
  return (
    <main className={styles.page}>
      <IconLink href={`/talks/${talk.id}`} icon="back" label="나레이션으로 돌아가기" className={styles.back} />
      <Top
        upper={
          <span className={styles.upper}>
            대본 · {author.name}
            {author.role ? ` · ${author.role}` : ""}
          </span>
        }
        title={talk.title}
        lower={talk.summary || undefined}
      />
      <ol className={styles.scenes}>
        {talk.segments.map((segment, i) => (
          <TranscriptScene key={segment.id} segment={segment} n={i + 1} author={author} />
        ))}
      </ol>
    </main>
  );
}
