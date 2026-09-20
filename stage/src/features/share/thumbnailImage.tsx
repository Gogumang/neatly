import "server-only";
import { ImageResponse } from "next/og";
import type { Talk } from "@/entities/talk/model";
import { loadCoverImage } from "./loadCoverImage";
import { ogFonts } from "./ogFonts";
import { ThumbCard, ThumbSquare } from "./ThumbCard";
import { thumbGradient } from "./thumbGradient";

const SIZES = {
  /** 펼쳐보기 카드 (4:5, 제목 포함) */
  card: { width: 800, height: 1000 },
  /** 목록 한 줄의 정사각 */
  row: { width: 400, height: 400 },
  /** 목록보기용 세로 그림 (글자 없이 그림만) */
  art: { width: 360, height: 450 },
};

export type ThumbnailSize = keyof typeof SIZES;

export function isThumbnailSize(value: string): value is ThumbnailSize {
  return value === "card" || value === "row" || value === "art";
}

// 내용이 거의 안 바뀌니 오래 두고 쓴다
const CACHE = "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";

/**
 * 썸네일 그림은 AI 가 그린 표지 한 장뿐이다.
 * 표지가 아직 없는 나레이션만 잠시 색면으로 보이고, 표지가 만들어지면 그 그림으로 바뀐다.
 */
export async function talkThumbnailImage(talk: Talk, size: ThumbnailSize) {
  const image = talk.coverUrl ? await loadCoverImage(talk.coverUrl) : null;
  const gradient = thumbGradient(talk.id);
  const card =
    size === "card" ? (
      <ThumbCard
        title={talk.title}
        author={talk.author.name}
        role={talk.author.role}
        image={image}
        gradient={gradient}
      />
    ) : (
      <ThumbSquare image={image} gradient={gradient} />
    );
  return new ImageResponse(card, { ...SIZES[size], fonts: [...ogFonts], headers: { "cache-control": CACHE } });
}
