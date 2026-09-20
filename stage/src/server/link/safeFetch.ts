import "server-only";
import { lookup } from "node:dns/promises";
import { isPrivateAddress } from "./privateAddress";

const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 10_000;

export class LinkError extends Error {}

/** 공개 인터넷 주소인지 확인. 호스트 이름이 가리키는 모든 IP 가 공개 주소여야 한다 */
async function assertPublicUrl(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new LinkError("http, https 링크만 쓸 수 있어요");
  if (url.username || url.password) throw new LinkError("로그인 정보가 들어간 링크는 쓸 수 없어요");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = await lookup(host, { all: true }).catch(() => []);
  if (addresses.length === 0) throw new LinkError("링크 주소를 찾을 수 없어요");
  if (addresses.some((a) => isPrivateAddress(a.address))) throw new LinkError("공개된 웹페이지 링크만 쓸 수 있어요");
}

/** 크기 제한을 넘으면 멈추고 읽는다 */
async function readLimited(res: Response, maxBytes: number): Promise<Buffer> {
  const reader = res.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (let r = await reader.read(); !r.done; r = await reader.read()) {
    size += r.value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new LinkError("파일이 너무 커요");
    }
    chunks.push(r.value);
  }
  return Buffer.concat(chunks);
}

type FetchOptions = { accept: RegExp; maxBytes: number; rejectMessage: string };

/**
 * 사용자가 준 링크의 내용을 가져온다.
 * 리다이렉트도 한 단계씩 직접 따라가며 매번 주소를 검사한다 (내부망으로 우회하는 것을 막기 위해).
 * DNS 조회와 실제 연결 사이에 주소가 바뀌는 공격(DNS rebinding)까지 완전히 막지는 못한다.
 */
export async function safeFetch(input: string | URL, opts: FetchOptions) {
  let url = new URL(input);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(url);
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TtobakBot/1.0)" },
    }).catch(() => {
      throw new LinkError("링크를 열 수 없어요");
    });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      url = new URL(location, url);
      continue;
    }
    if (!res.ok) throw new LinkError(`링크를 열 수 없어요 (${res.status})`);
    const type = res.headers.get("content-type") ?? "";
    if (!opts.accept.test(type)) throw new LinkError(opts.rejectMessage);
    return { bytes: await readLimited(res, opts.maxBytes), type: type.split(";")[0]?.trim() ?? "", url };
  }
  throw new LinkError("리다이렉트가 너무 많아요");
}
