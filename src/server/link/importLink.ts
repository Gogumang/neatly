import "server-only";
import { limitAsync } from "es-toolkit/promise";
import { isImageType, MAX_UPLOAD_BYTES, saveUpload } from "../uploads";
import { type Article, readHtml, readMarkdown } from "./readArticle";
import { LinkError, safeFetch } from "./safeFetch";

const MAX_IMAGES = 4;
const MIN_IMAGE_BYTES = 8 * 1024; // 이보다 작으면 아이콘·배지로 보고 뺀다
const MAX_TEXT = 8000;

/** github.com/owner/repo → README 원문 주소 */
function githubReadme(url: URL): URL | null {
  const [owner, repo, ...rest] = url.pathname.split("/").filter(Boolean);
  if (url.hostname !== "github.com" || !owner || !repo || rest.length > 0) return null;
  return new URL(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`);
}

async function readLink(link: string): Promise<Article> {
  const readme = githubReadme(new URL(link));
  const target = readme ?? link;
  const { bytes, url, type } = await safeFetch(target, {
    accept: /html|text\/plain|markdown/,
    maxBytes: 3 * 1024 * 1024,
    rejectMessage: "웹페이지 링크만 쓸 수 있어요",
  });
  const body = bytes.toString("utf8");
  return readme || !type.includes("html") ? readMarkdown(body, url) : readHtml(body, url);
}

const downloadImage = limitAsync(async (url: URL): Promise<string | null> => {
  const file = await safeFetch(url, { accept: /^image\//, maxBytes: MAX_UPLOAD_BYTES, rejectMessage: "" }).catch(
    () => null,
  );
  if (!file || !isImageType(file.type) || file.bytes.byteLength < MIN_IMAGE_BYTES) return null;
  return saveUpload(file.bytes, file.type);
}, 4);

/** 링크에서 글과 이미지를 가져와 나레이션 재료로 만든다. 이미지는 우리 저장소로 옮겨 둔다 */
export async function importLink(link: string): Promise<{ text: string; imageUrls: string[] }> {
  const article = await readLink(link);
  const text = [article.title, article.text].filter(Boolean).join("\n\n").slice(0, MAX_TEXT);
  if (text.length < 80) {
    throw new LinkError("링크에서 글을 가져오지 못했어요. 로그인이 필요하거나 글이 없는 페이지일 수 있어요.");
  }
  const saved = await Promise.all(article.images.slice(0, MAX_IMAGES * 2).map(downloadImage));
  return { text, imageUrls: saved.filter((u): u is string => u !== null).slice(0, MAX_IMAGES) };
}
