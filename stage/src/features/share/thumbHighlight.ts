import type { Talk } from "@/entities/talk/model";

export type Highlight = { kind: "number"; value: string; caption?: string } | { kind: "keywords"; items: string[] };

/** 썸네일 가운데를 채울 핵심 장면. 지어내지 않고 segments 에 실제로 있는 값만 쓴다 */
export function thumbHighlight(talk: Talk): Highlight | null {
  for (const { template } of talk.segments) {
    if (template.type !== "rollingNumber") continue;
    const value = `${template.prefix ?? ""}${template.to.toLocaleString("ko-KR")}${template.suffix ?? ""}`;
    return { kind: "number", value, caption: template.caption };
  }
  for (const { template } of talk.segments) {
    if (template.type === "keywords" && template.keywords.length > 0)
      return { kind: "keywords", items: template.keywords.slice(0, 3) };
  }
  return null;
}
