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
};

export function PlayerControls({ talk, index, status, muted, go, toggle, toggleMute }: Props) {
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
        </div>
      </div>
    </div>
  );
}
