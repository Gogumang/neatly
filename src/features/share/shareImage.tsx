import "server-only";
import { ImageResponse } from "next/og";
import { type TalkCover, talkCover } from "@/entities/talk/cover";
import type { Talk } from "@/entities/talk/model";
import { loadCoverImage } from "./loadCoverImage";
import { ogFonts } from "./ogFonts";
import { ShareCard } from "./ShareCard";

const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

/** 표지 이미지를 못 쓰면 나레이션마다 정해진 그라데이션으로 */
async function resolveCover(talk: Talk): Promise<TalkCover> {
  const cover = talkCover(talk);
  if (cover.kind === "gradient") return cover;
  const src = await loadCoverImage(cover.src);
  return src ? { kind: "image", src } : talkCover({ ...talk, segments: [], author: { name: talk.author.name } });
}

export async function talkShareImage(talk: Talk) {
  const cover = await resolveCover(talk);
  return shareImage(<ShareCard title={talk.title} author={talk.author.name} cover={cover} />);
}

export function shareImage(card: React.ReactElement) {
  return new ImageResponse(card, { ...SHARE_IMAGE_SIZE, fonts: [...ogFonts] });
}
