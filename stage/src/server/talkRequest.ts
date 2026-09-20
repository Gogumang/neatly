import "server-only";
import { DEFAULT_GENRE, isGenreId } from "@/entities/talk/genres";
import { DEFAULT_LENGTH, isLengthId } from "@/entities/talk/lengths";
import { isVoiceId, type VoiceId } from "@/entities/talk/voices";
import { isLink } from "@/shared/lib/isLink";
import { importLink } from "./link/importLink";
import type { ScriptInput } from "./script/writeScript";
import { isUploadUrl } from "./uploads";

const MAX_IMAGES = 6;

type Body = {
  genre?: unknown;
  length?: unknown;
  text?: unknown;
  subject?: unknown;
  authorName?: unknown;
  avatarUrl?: unknown;
  imageUrls?: unknown;
  voice?: unknown;
};

export class InputError extends Error {}

/**
 * 나레이션 만들기 요청을 검증해 대본 재료로 만든다.
 * text 가 링크 하나면 그 페이지의 글과 이미지를 가져와 쓴다 (올린 이미지가 먼저).
 */
export async function readTalkRequest(body: Body | null): Promise<{ input: ScriptInput; voice?: VoiceId }> {
  const raw = typeof body?.text === "string" ? body.text.trim() : "";
  const uploaded = Array.isArray(body?.imageUrls) ? body.imageUrls.filter(isUploadUrl) : [];
  const fromLink = isLink(raw) ? await importLink(raw) : { text: raw, imageUrls: [] };

  if (fromLink.text.length < 80) throw new InputError("글을 조금 더 길게 써주세요 (80자 이상)");
  if (fromLink.text.length > 8000) throw new InputError("글이 너무 길어요 (8,000자 이하)");

  const subject = typeof body?.subject === "string" ? body.subject.trim().slice(0, 40) : "";
  if (subject.length < 2) throw new InputError("어떤 이야기인지 제목을 적어주세요");
  const authorName = typeof body?.authorName === "string" ? body.authorName.trim().slice(0, 30) : undefined;
  return {
    input: {
      genre: isGenreId(body?.genre) ? body.genre : DEFAULT_GENRE,
      length: isLengthId(body?.length) ? body.length : DEFAULT_LENGTH,
      text: fromLink.text,
      subject,
      authorName,
      avatarUrl: isUploadUrl(body?.avatarUrl) ? body.avatarUrl : undefined,
      imageUrls: [...uploaded, ...fromLink.imageUrls].slice(0, MAX_IMAGES),
    },
    voice: isVoiceId(body?.voice) ? body.voice : undefined,
  };
}
