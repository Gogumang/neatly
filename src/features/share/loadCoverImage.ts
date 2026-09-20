import "server-only";
import { readMedia } from "@/server/media";
import { siteUrl } from "./siteUrl";

const IMAGE_TYPE = /^image\/(png|jpeg|gif|webp)/;
const OUR_MEDIA = "/api/media/";

const dataUrl = (type: string, bytes: Buffer) => `data:${type};base64,${bytes.toString("base64")}`;

/** 표지 이미지를 data URL 로 받아온다. 못 받거나 그릴 수 없는 형식이면 null (→ 그라데이션) */
export async function loadCoverImage(src: string): Promise<string | null> {
  try {
    // 우리 저장소에 있는 그림은 자기 자신에게 요청하지 않고 바로 읽는다 (배포 주소를 몰라도 된다)
    if (src.startsWith(OUR_MEDIA)) {
      const file = await readMedia(src.slice(OUR_MEDIA.length));
      return file && IMAGE_TYPE.test(file.type) ? dataUrl(file.type, file.bytes) : null;
    }

    const res = await fetch(new URL(src, siteUrl), { signal: AbortSignal.timeout(5000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !IMAGE_TYPE.test(type)) return null;
    return dataUrl(type, Buffer.from(await res.arrayBuffer()));
  } catch {
    return null;
  }
}
