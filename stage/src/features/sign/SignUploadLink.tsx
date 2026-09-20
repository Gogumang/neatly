"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readEditKey } from "@/shared/lib/editKeys";

/** 이 브라우저에서 만든 나레이션이면 "수어 영상 붙이기" 링크를 보여준다 */
export function SignUploadLink({ talkId, className }: { talkId: string; className?: string }) {
  const [mine, setMine] = useState(false);
  useEffect(() => setMine(Boolean(readEditKey(talkId))), [talkId]);
  if (!mine) return null;
  return (
    <Link href={`/talks/${talkId}/sign`} className={className}>
      🤟 수어 통역 영상 붙이기 ›
    </Link>
  );
}
