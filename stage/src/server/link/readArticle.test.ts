import { describe, expect, it } from "vitest";
import { readHtml, readMarkdown } from "./readArticle";

const base = new URL("https://blog.example.com/posts/1");

describe("readHtml", () => {
  it("본문 글과 본문 이미지(대표 이미지 먼저)를 뽑는다", () => {
    const body = "AI로 고객 문의를 분류했어요. ".repeat(30);
    const html = `<html><head><title>문의 분류기</title><meta property="og:image" content="/og.png"></head>
      <body><nav>메뉴 메뉴</nav><article><h1>문의 분류기</h1><p>${body}</p><img src="/shot.png"><p>${body}</p></article></body></html>`;
    const article = readHtml(html, base);
    expect(article.text).toContain("고객 문의를 분류");
    expect(article.text).not.toContain("메뉴 메뉴");
    expect(article.images.map((u) => u.href)).toEqual([
      "https://blog.example.com/og.png",
      "https://blog.example.com/shot.png",
    ]);
  });
});

describe("readMarkdown", () => {
  it("README 에서 제목·글·이미지를 뽑고 링크 문법을 걷어낸다", () => {
    const md = "# 프로젝트\n\n[문서](https://x.com) 를 보세요.\n\n![화면](docs/screen.png)";
    const article = readMarkdown(md, new URL("https://raw.githubusercontent.com/o/r/HEAD/README.md"));
    expect(article.title).toBe("프로젝트");
    expect(article.text).toContain("문서 를 보세요.");
    expect(article.images[0]?.href).toBe("https://raw.githubusercontent.com/o/r/HEAD/docs/screen.png");
  });
});
