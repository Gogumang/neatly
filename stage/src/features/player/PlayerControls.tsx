import Link from "next/link";
import type { Talk } from "@/entities/talk/model";
import { IconButton } from "@/shared/ui/IconButton/IconButton";
import styles from "./PlayerControls.module.css";
import type { PlaybackStatus } from "./usePlayback";

type Props = {
  talk: Talk;
  index: number;
  status: PlaybackStatus;
  muted: boolean;
  go: (index: number) => void;
  toggle: () => void;
  toggleMute: () => void;
  /** 수어 영상이 있는 나레이션만 */
  sign?: { on: boolean; toggle: () => void };
};

export function PlayerControls({ talk, index, status, muted, go, toggle, toggleMute, sign }: Props) {
  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <div className={styles.meta}>
          <strong>{talk.title}</strong>
          <span>
            {talk.author.name}
            {talk.author.role ? ` · ${talk.author.role}` : ""}
          </span>
        </div>
        <div className={styles.buttons}>
          <IconButton icon="prev" label="이전 장면" onClick={() => go(index - 1)} />
          <IconButton
            icon={status === "playing" ? "pause" : "play"}
            label={status === "playing" ? "일시정지" : "재생"}
            size="large"
            variant="solid"
            onClick={toggle}
          />
          <IconButton icon="next" label="다음 장면" onClick={() => go(index + 1)} />
          <IconButton icon={muted ? "mute" : "sound"} label={muted ? "소리 켜기" : "소리 끄기"} onClick={toggleMute} />
          {sign && (
            <IconButton
              icon="sign"
              label={sign.on ? "수어 통역 끄기" : "수어 통역 켜기"}
              aria-pressed={sign.on}
              className={sign.on ? styles.signOn : undefined}
              onClick={sign.toggle}
            />
          )}
          {/* 소리·움직임 없이 글로 읽는 길. 새 아이콘 대신 짧은 글자 링크 */}
          <Link href={`/talks/${talk.id}/transcript`} className={styles.transcript} aria-label="대본으로 보기">
            대본
          </Link>
        </div>
      </div>
    </div>
  );
}
