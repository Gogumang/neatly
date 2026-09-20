import { isIP } from "node:net";

// 서버 내부·사설망으로 요청이 새지 않도록 막을 주소 대역 (SSRF 방지)

const V4_BLOCKS: [base: number, bits: number][] = [
  [0x00000000, 8], // 0.0.0.0/8
  [0x0a000000, 8], // 10.0.0.0/8
  [0x64400000, 10], // 100.64.0.0/10 (CGNAT)
  [0x7f000000, 8], // 127.0.0.0/8
  [0xa9fe0000, 16], // 169.254.0.0/16 (링크 로컬, 클라우드 메타데이터)
  [0xac100000, 12], // 172.16.0.0/12
  [0xc0000000, 24], // 192.0.0.0/24 (IETF 예약)
  [0xc0000200, 24], // 192.0.2.0/24 (문서용)
  [0xc0a80000, 16], // 192.168.0.0/16
  [0xc6120000, 15], // 198.18.0.0/15 (벤치마크)
  [0xc6336400, 24], // 198.51.100.0/24 (문서용)
  [0xcb007100, 24], // 203.0.113.0/24 (문서용)
  [0xe0000000, 3], // 224.0.0.0/3 (멀티캐스트·예약·브로드캐스트)
];

function isPrivateV4(n: number) {
  return V4_BLOCKS.some(([base, bits]) => n >>> (32 - bits) === base >>> (32 - bits));
}

const v4ToInt = (ip: string) => ip.split(".").reduce((n, part) => (n << 8) + Number(part), 0) >>> 0;

/** IPv6 문자열 → 16비트 그룹 8개. "::" 축약과 끝의 점 표기 IPv4 도 푼다 */
function v6Groups(ip: string): number[] {
  let text = ip.toLowerCase().split("%")[0] ?? "";
  const dotted = text.match(/(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (dotted) {
    const n = v4ToInt(dotted);
    text = `${text.slice(0, -dotted.length)}${(n >>> 16).toString(16)}:${(n & 0xffff).toString(16)}`;
  }
  const [head = "", tail] = text.split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const fill = tail === undefined ? [] : Array(8 - left.length - right.length).fill("0");
  return [...left, ...fill, ...right].map((g) => Number.parseInt(g || "0", 16));
}

/** IPv4 를 품은 IPv6 형식이면 그 IPv4(정수), 아니면 null */
function embeddedV4(g: number[]): number | null {
  const v4 = (((g[6] ?? 0) << 16) | (g[7] ?? 0)) >>> 0;
  const zeros = (from: number, to: number) => g.slice(from, to).every((x) => x === 0);
  if (zeros(0, 5) && g[5] === 0xffff) return v4; // ::ffff:a.b.c.d (매핑)
  if (zeros(0, 6) && v4 > 1) return v4; // ::a.b.c.d (호환). :: 와 ::1 은 따로 막는다
  if (g[0] === 0x64 && g[1] === 0xff9b && zeros(2, 6)) return v4; // 64:ff9b::/96 (NAT64)
  return null;
}

function isPrivateV6(ip: string) {
  const g = v6Groups(ip);
  const v4 = embeddedV4(g);
  if (v4 !== null) return isPrivateV4(v4);

  const [first = 0] = g;
  return (
    g.every((x) => x === 0) || // ::
    (g.slice(0, 7).every((x) => x === 0) && g[7] === 1) || // ::1
    (first & 0xfe00) === 0xfc00 || // fc00::/7 고유 로컬
    (first & 0xffc0) === 0xfe80 || // fe80::/10 링크 로컬
    (first & 0xff00) === 0xff00 || // ff00::/8 멀티캐스트
    (first === 0x2001 && g[1] === 0x0db8) // 2001:db8::/32 문서용
  );
}

/** 공개 인터넷이 아닌 주소면 true. IP 형식이 아니면 true(막는다) */
export function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateV4(v4ToInt(ip));
  if (version === 6) return isPrivateV6(ip);
  return true;
}
