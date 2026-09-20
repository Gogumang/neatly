import type { Talk, Template } from "@/entities/talk/model";

/** 장면 화면을 글로 옮긴 것. kind 는 화면 종류, lines 는 화면에 보이는 내용 */
export type SceneDescription = { kind: string; lines: string[] };

const isText = (s: string | undefined): s is string => Boolean(s?.trim());

function describeMockup({ media, screen }: Extract<Template, { type: "mockup" }>): string[] {
  const lines: string[] = [];
  if (media) lines.push(media.kind === "video" ? "앱 화면 영상" : "앱 화면 이미지");
  if (screen) {
    lines.push(screen.title);
    for (const item of screen.items) {
      lines.push([item.emoji, item.title, item.description && `— ${item.description}`].filter(isText).join(" "));
    }
  }
  return lines;
}

/** 화면을 볼 수 없어도 같은 내용을 얻도록, 장면 템플릿을 짧은 글로 바꾼다 */
export function describeTemplate(template: Template, author: Talk["author"]): SceneDescription {
  switch (template.type) {
    case "title":
      // 제목은 화면에서 줄바꿈으로 나뉘지만 글로는 한 문장
      return {
        kind: "제목",
        lines: [template.eyebrow, template.title.replace(/\s*\n\s*/g, " "), template.subtitle].filter(isText),
      };
    case "keywords":
      return { kind: "키워드", lines: template.keywords };
    case "rollingNumber": {
      const { prefix = "", to, suffix = "", caption } = template;
      return { kind: "숫자", lines: [`${prefix}${to.toLocaleString("ko-KR")}${suffix}`, caption].filter(isText) };
    }
    case "mockup":
      return { kind: "앱 화면", lines: describeMockup(template) };
    case "chat":
      return { kind: "대화", lines: template.messages.map((m) => `${m.name}: ${m.text}`) };
    case "speaker":
      return { kind: "발표자 사진", lines: [[author.name, author.role].filter(isText).join(" · ")] };
    case "image":
      return { kind: "이미지", lines: [template.caption].filter(isText) };
  }
}
