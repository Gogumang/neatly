import type { Metadata } from "next";
import { CreateTalk } from "@/features/create-talk/CreateTalk";

export const metadata: Metadata = { title: "새 나레이션 만들기 — 또박" };

export default function NewTalkPage() {
  return <CreateTalk />;
}
