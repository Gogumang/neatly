import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sampleTalk } from "@/entities/talk/sample";
import { Player } from "@/features/player/Player";
import { findTalk } from "@/features/share/findTalk";
import { shareMetadata } from "@/features/share/shareMetadata";
import { ShortPlayer } from "@/features/shortform/ShortPlayer";
import { WebtoonStrip } from "@/features/webtoon/WebtoonStrip";
import { getTalk, toPublicTalk } from "@/server/store";

// 링크 미리보기 제목·설명. 이미지는 옆의 opengraph-image.tsx
export async function generateMetadata(props: PageProps<"/talks/[id]">): Promise<Metadata> {
  const talk = await findTalk((await props.params).id);
  if (!talk) return {};
  return shareMetadata({ title: `${talk.title} — 또박`, description: talk.summary });
}

export default async function TalkPage(props: PageProps<"/talks/[id]">) {
  const { id } = await props.params;
  const stored = id === sampleTalk.id ? null : await getTalk(id);
  const talk = id === sampleTalk.id ? sampleTalk : stored && toPublicTalk(stored);
  if (!talk) notFound();
  // 만들 때 고른 형식대로 보여 준다 (수어는 자막을 켠 채로 플레이어가 연다)
  if (talk.format === "webtoon") return <WebtoonStrip talk={talk} />;
  if (talk.format === "short") return <ShortPlayer talk={talk} />;
  return <Player talk={talk} />;
}
