import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export type Article = { title: string; text: string; images: URL[] };

const tidy = (text: string) =>
  text
    .replace(/[ \t ]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n\n")
    .trim();

function imageUrls(html: string, base: URL): URL[] {
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  return [...document.querySelectorAll("img")].flatMap((img) => {
    const src = img.getAttribute("data-src") ?? img.getAttribute("src") ?? "";
    try {
      const url = new URL(src, base);
      return url.protocol === "https:" || url.protocol === "http:" ? [url] : [];
    } catch {
      return [];
    }
  });
}

/** HTML 에서 본문 글과 본문 이미지를 뽑는다 (대표 이미지 og:image 가 맨 앞) */
export function readHtml(html: string, url: URL): Article {
  const { document } = parseHTML(html);
  const og = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
  const parsed = new Readability(document as unknown as Document).parse();
  const images = [...(og ? [new URL(og, url)] : []), ...imageUrls(parsed?.content ?? "", url)];
  return {
    title: tidy(parsed?.title ?? document.title ?? ""),
    text: tidy(parsed?.textContent ?? ""),
    images: [...new Map(images.map((u) => [u.href, u])).values()],
  };
}

/** 마크다운(README)에서 글과 이미지를 뽑는다 */
export function readMarkdown(markdown: string, base: URL): Article {
  const images = [...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].flatMap((m) => {
    try {
      return [new URL(m[1] ?? "", base)];
    } catch {
      return [];
    }
  });
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  return { title: markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "", text: tidy(text), images };
}
