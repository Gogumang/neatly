import type { Talk } from "@/entities/talk/model";

export type StoredTalk = Talk & {
  createdAt: string;
  likes: number;
  voiced: boolean;
  /** 만든 사람만 아는 수정 키 (수어 영상 붙이기 등). 브라우저로 내보내면 안 된다 */
  editKey?: string;
};

/** 나레이션 저장소가 할 일. 로컬 파일·Supabase 두 가지 구현이 있다 */
export type TalkRepo = {
  get(id: string): Promise<StoredTalk | null>;
  save(talk: StoredTalk): Promise<void>;
  list(): Promise<StoredTalk[]>;
  /** 좋아요 1 올리고 새 값. 없는 나레이션이면 null */
  like(id: string): Promise<number | null>;
};
