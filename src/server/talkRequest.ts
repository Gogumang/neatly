import "server-only";
import { DEFAULT_FORMAT, isFormatId } from "@/entities/talk/formats";
import { DEFAULT_GENRE, isGenreId } from "@/entities/talk/genres";
import { DEFAULT_LENGTH, isLengthId } from "@/entities/talk/lengths";
import { DEFAULT_VISIBILITY, isPassword, isVisibilityId } from "@/entities/talk/visibility";
import { isVoiceId, type VoiceId } from "@/entities/talk/voices";
import { isLink } from "@/shared/lib/isLink";
import { importLink } from "./link/importLink";
import type { ScriptInput } from "./script/writeScript";
import { hashPassword } from "./talkPass";
import { isUploadUrl } from "./uploads";

const MAX_IMAGES = 6;

type Body = {
  format?: unknown;
  genre?: unknown;
  length?: unknown;
  text?: unknown;
  subject?: unknown;
  authorName?: unknown;
  avatarUrl?: unknown;
  imageUrls?: unknown;
  voice?: unknown;
  visibility?: unknown;
  password?: unknown;
};

export class InputError extends Error {}

/**
 * 나레이션 만들기 요청을 검증해 대본 재료로 만든다.
 * text 가 링크 하나면 그 페이지의 글과 이미지를 가져와 쓴다 (올린 이미지가 먼저).
 */
/** 글 한 편을 얻는다. 링크 하나면 그 페이지에서 본문과 이미지를 가져온다 */
async function readStory(body: Body | null) {
  const raw = typeof body?.text === "string" ? body.text.trim() : "";
  const story = isLink(raw) ? await importLink(raw) : { text: raw, imageUrls: [] };
  if (story.text.length < 80) throw new InputError("글을 조금 더 길게 써주세요 (80자 이상)");
  if (story.text.length > 8000) throw new InputError("글이 너무 길어요 (8,000자 이하)");
  return story;
}

/** 공개 범위. 비공개는 비밀번호를 그 자리에서 해시로 바꾼다 (평문은 저장하지 않는다) */
function readVisibility(body: Body | null) {
  const visibility = isVisibilityId(body?.visibility) ? body.visibility : DEFAULT_VISIBILITY;
  if (visibility !== "private") return { visibility };
  const password = typeof body?.password === "string" ? body.password : "";
  if (!isPassword(password)) throw new InputError("비밀번호는 4~20자로 적어주세요");
  return { visibility, pass: hashPassword(password) };
}

export async function readTalkRequest(body: Body | null): Promise<{ input: ScriptInput; voice?: VoiceId }> {
  const uploaded = Array.isArray(body?.imageUrls) ? body.imageUrls.filter(isUploadUrl) : [];
  // 링크를 읽어오기 전에 공개 범위부터 확인한다 (잘못 적었으면 바로 돌려보낸다)
  const access = readVisibility(body);
  const fromLink = await readStory(body);

  const subject = typeof body?.subject === "string" ? body.subject.trim().slice(0, 40) : "";
  if (subject.length < 2) throw new InputError("어떤 이야기인지 제목을 적어주세요");
  const authorName = typeof body?.authorName === "string" ? body.authorName.trim().slice(0, 30) : undefined;
  return {
    input: {
      format: isFormatId(body?.format) ? body.format : DEFAULT_FORMAT,
      genre: isGenreId(body?.genre) ? body.genre : DEFAULT_GENRE,
      length: isLengthId(body?.length) ? body.length : DEFAULT_LENGTH,
      text: fromLink.text,
      subject,
      authorName,
      avatarUrl: isUploadUrl(body?.avatarUrl) ? body.avatarUrl : undefined,
      imageUrls: [...uploaded, ...fromLink.imageUrls].slice(0, MAX_IMAGES),
      ...access,
    },
    voice: isVoiceId(body?.voice) ? body.voice : undefined,
  };
}
