import type { FormatId } from "@/entities/talk/formats";
import type { GenreId } from "@/entities/talk/genres";
import type { LengthId } from "@/entities/talk/lengths";
import type { VoiceId } from "@/entities/talk/voices";

export type TalkInput = {
  /** 무엇으로 만들지: 나레이션·수어·웹툰·숏폼 */
  format: FormatId;
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
type WithFormat = Draft & { format: FormatId };

/** 나레이션 만들기 단계별로 확정된 정보 */
export type CreateTalkSteps = {
  format: Draft;
  genre: WithFormat;
  subject: WithFormat & { genre: GenreId };
  story: WithFormat & { genre: GenreId; subject: string };
  length: WithFormat & { genre: GenreId; subject: string; text: string };
  photos: WithFormat & { genre: GenreId; length: LengthId; subject: string; text: string };
  voice: WithFormat & { genre: GenreId; length: LengthId; subject: string; text: string; imageUrls: string[] };
  generate: TalkInput;
};
