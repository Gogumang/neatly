import "server-only";
import { type GenreId, genreOf } from "@/entities/talk/genres";
import { type LengthId, lengthOf } from "@/entities/talk/lengths";
import type { Talk } from "@/entities/talk/model";
import { chatJSON, type UserContent } from "../llm";
import { uploadAsDataUrl } from "../uploads";
import { condense } from "./condense";
import { toSegments } from "./normalize";
import { chooseOpening, openingInstruction } from "./opening";
import { SCRIPT_SYSTEM_PROMPT } from "./prompt";
import { type RawTalk, talkSchema } from "./schema";

export type ScriptInput = {
  /** 보여 주는 방식 (FormatId) */
  format: string;
  genre: GenreId;
  length: LengthId;
  text: string;
  subject: string;
  /** 발표자 이름 (사진을 올린 경우에만) */
  authorName?: string;
  avatarUrl?: string;
  imageUrls: string[];
};

/** 원문 + [이미지 N] 들을 LLM 이 볼 수 있는 메시지로 */
async function buildUserContent(input: ScriptInput): Promise<UserContent> {
  const opening = chooseOpening({ text: input.text, hasAvatar: Boolean(input.avatarUrl) });
  const genre = genreOf(input.genre);
  const length = lengthOf(input.length);
  const header = [
    `나레이션 종류: ${genre.name} (흐름: ${genre.flow})`,
    `장면 수: ${length.min}~${length.max}개 (이 범위를 꼭 지켜)`,
    `제목(사용자가 정함): ${input.subject}`,
    `발표자 사진: ${input.avatarUrl ? "있음" : "없음"}`,
    openingInstruction(opening),
    "",
    `원문:\n${input.text}`,
  ].join("\n");
  const images = await Promise.all(input.imageUrls.map(uploadAsDataUrl));
  return [
    { type: "text", text: header },
    ...images.flatMap((url, i) =>
      url
        ? [
            { type: "text" as const, text: `[이미지 ${i + 1}]` },
            { type: "image_url" as const, image_url: { url, detail: "low" as const } },
          ]
        : [],
    ),
  ];
}

/** 줄글 → 나레이션 대본 */
export async function writeScript(input: ScriptInput): Promise<Omit<Talk, "id">> {
  // 긴 글은 핵심만 남긴 뒤 대본을 쓴다 (뒷부분 성과가 묻히지 않게)
  const source = await condense(input.text);
  const raw = await chatJSON<RawTalk>({
    system: SCRIPT_SYSTEM_PROMPT,
    user: await buildUserContent({ ...input, text: source }),
    schemaName: "talk",
    schema: talkSchema,
  });
  return {
    // 제목은 사용자가 정한 이름을 그대로 쓴다 (AI 가 바꾸지 않게)
    title: input.subject,
    summary: raw.summary,
    genre: input.genre,
    format: input.format,
    author: { name: input.authorName ?? "", avatarUrl: input.avatarUrl },
    segments: toSegments(raw, { images: input.imageUrls, hasAvatar: Boolean(input.avatarUrl), source }),
  };
}
