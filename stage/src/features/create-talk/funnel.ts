import type { GenreId } from "@/entities/talk/genres";
import type { LengthId } from "@/entities/talk/lengths";
import type { VoiceId } from "@/entities/talk/voices";

export type TalkInput = {
  genre: GenreId;
  length: LengthId;
  /** 나레이션 제목 */
  subject: string;
  text: string;
  /** 발표자 이름. 사진을 올린 경우에만 쓴다 */
  authorName?: string;
  avatarUrl?: string;
  imageUrls: string[];
  voice: VoiceId;
};

type Draft = Partial<TalkInput> & { error?: string };

/** 나레이션 만들기 단계별로 확정된 정보 */
export type CreateTalkSteps = {
  genre: Draft;
  subject: Draft & { genre: GenreId };
  story: Draft & { genre: GenreId; subject: string };
  length: Draft & { genre: GenreId; subject: string; text: string };
  photos: Draft & { genre: GenreId; length: LengthId; subject: string; text: string };
  voice: Draft & { genre: GenreId; length: LengthId; subject: string; text: string; imageUrls: string[] };
  generate: TalkInput;
};
