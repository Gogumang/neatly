import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { sampleTalk } from "@/entities/talk/sample";
import { Transcript } from "@/features/transcript/Transcript";
import { getTalk, toPublicTalk } from "@/server/store";

// 제목(metadata)과 본문이 같은 나레이션을 쓰므로 한 요청 안에서 한 번만 읽는다
const loadTalk = cache(async (id: string) => {
  if (id === sampleTalk.id) return sampleTalk;
  const stored = await getTalk(id);
  return stored ? toPublicTalk(stored) : null;
});

export async function generateMetadata(props: PageProps<"/talks/[id]/transcript">): Promise<Metadata> {
  const talk = await loadTalk((await props.params).id);
  return { title: talk ? `${talk.title} 대본 — 또박` : "대본 — 또박" };
}

export default async function TranscriptPage(props: PageProps<"/talks/[id]/transcript">) {
  const talk = await loadTalk((await props.params).id);
  if (!talk) notFound();
  return <Transcript talk={talk} />;
}
