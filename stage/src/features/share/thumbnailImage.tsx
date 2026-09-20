import "server-only";
import { ImageResponse } from "next/og";
import { talkCover } from "@/entities/talk/cover";
import type { Talk } from "@/entities/talk/model";
import { loadCoverImage } from "./loadCoverImage";
import { ogFonts } from "./ogFonts";
import { ThumbCard, ThumbSquare } from "./ThumbCard";
import { thumbGradient } from "./thumbGradient";
import { thumbHighlight } from "./thumbHighlight";

const SIZES = {
  /** 캐러셀 카드 (4:5) */
  card: { width: 800, height: 1000 },
  /** 목록 한 줄의 정사각 */
  row: { width: 400, height: 400 },
};

export type ThumbnailSize = keyof typeof SIZES;

export function isThumbnailSize(value: string): value is ThumbnailSize {
  return value === "card" || value === "row";
}

// 내용이 거의 안 바뀌니 오래 두고 쓴다
const CACHE = "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";

/** 가운데를 채울 순서: 발표자 사진 → 숫자·키워드 → 올린 이미지 → 그라데이션 */
async function resolveArt(talk: Talk, size: ThumbnailSize) {
  const highlight = thumbHighlight(talk);
  const avatar = talk.author.avatarUrl ? await loadCoverImage(talk.author.avatarUrl) : null;
  // 프로필 사진을 뺀 채로 물어보면 "올린 이미지"만 골라준다
  const uploaded = talkCover({ ...talk, author: { name: talk.author.name } });
  const wantsImage = size === "row" || (!avatar && !highlight);
  const background = wantsImage && uploaded.kind === "image" ? await loadCoverImage(uploaded.src) : null;
  return { gradient: thumbGradient(talk.id), background, avatar, highlight };
}

export async function talkThumbnailImage(talk: Talk, size: ThumbnailSize) {
  const { gradient, background, avatar, highlight } = await resolveArt(talk, size);
  const card =
    size === "row" ? (
      <ThumbSquare
        gradient={gradient}
        image={background ?? avatar}
        number={highlight?.kind === "number" ? highlight.value : undefined}
      />
    ) : (
      <ThumbCard
        title={talk.title}
        author={talk.author.name}
        role={talk.author.role}
        gradient={gradient}
        background={background}
        avatar={avatar}
        highlight={highlight}
      />
    );
  return new ImageResponse(card, { ...SIZES[size], fonts: [...ogFonts], headers: { "cache-control": CACHE } });
}
