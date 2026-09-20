import "server-only";
import { siteUrl } from "./siteUrl";

const IMAGE_TYPE = /^image\/(png|jpeg|gif|webp)/;

/** 표지 이미지를 data URL 로 받아온다. 못 받거나 그릴 수 없는 형식이면 null (→ 그라데이션) */
export async function loadCoverImage(src: string): Promise<string | null> {
  try {
    const res = await fetch(new URL(src, siteUrl), { signal: AbortSignal.timeout(3000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !IMAGE_TYPE.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}
