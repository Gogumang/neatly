import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { sampleTalk } from "@/entities/talk/sample";
import { isLocked } from "@/entities/talk/visibility";
import { TalkLock } from "@/features/lock/TalkLock";
import { Player } from "@/features/player/Player";
import { findTalk } from "@/features/share/findTalk";
import { shareMetadata } from "@/features/share/shareMetadata";
import { ShortPlayer } from "@/features/shortform/ShortPlayer";
import { WebtoonStrip } from "@/features/webtoon/WebtoonStrip";
import { getTalk, type StoredTalk, toPublicTalk } from "@/server/store";
import { isUnlocked, passCookieName } from "@/server/talkPass";

// 링크 미리보기 제목·설명. 이미지는 옆의 opengraph-image.tsx
export async function generateMetadata(props: PageProps<"/talks/[id]">): Promise<Metadata> {
  const talk = await findTalk((await props.params).id);
  if (!talk) return {};
  // 비공개 나레이션은 제목만 (findTalk 가 요약을 비워서 준다)
  return shareMetadata({ title: `${talk.title} — 또박`, description: talk.summary || undefined });
}

/** 비공개 나레이션은 이 브라우저가 비밀번호를 맞힌 적이 있어야 열린다 */
async function canOpen(talk: StoredTalk): Promise<boolean> {
  if (!isLocked(talk)) return true;
  const cookie = (await cookies()).get(passCookieName(talk.id))?.value;
  return isUnlocked(talk.id, talk.pass, cookie);
}

export default async function TalkPage(props: PageProps<"/talks/[id]">) {
  const { id } = await props.params;
  const stored = id === sampleTalk.id ? null : await getTalk(id);
  if (stored && !(await canOpen(stored))) return <TalkLock id={stored.id} title={stored.title} />;
  // pass 는 화면으로 넘기지 않는다
  const talk = id === sampleTalk.id ? sampleTalk : stored && toPublicTalk(stored);
  if (!talk) notFound();
  // 만들 때 고른 형식대로 보여 준다 (수어는 자막을 켠 채로 플레이어가 연다)
  if (talk.format === "webtoon") return <WebtoonStrip talk={talk} />;
  if (talk.format === "short") return <ShortPlayer talk={talk} />;
  return <Player talk={talk} />;
}
