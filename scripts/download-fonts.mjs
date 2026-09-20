// Toss Product Sans / Tossface 폰트를 public/fonts 로 내려받고, 로컬 경로를 가리키는 src/app/fonts.css 를 만든다.
// 사용: node scripts/download-fonts.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://static.toss.im";
const OUT_DIR = path.resolve("public/fonts");
const WEIGHTS = new Set(["400", "500", "600", "700"]);
const CONCURRENCY = 16;

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

// woff2 만 남기고 @font-face 블록을 다시 쓴다. 반환: { css, files: [{ url, local }] }
function rewrite(css, { resolve, toLocal, keepWeight }) {
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  const files = [];
  const out = [];
  for (const block of blocks) {
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
    if (keepWeight && !keepWeight(weight)) continue;
    const woff2 = block.match(/url\(["']?([^"')]+\.woff2)["']?\)/)?.[1];
    if (!woff2) continue;
    const url = resolve(woff2);
    const local = toLocal(url);
    files.push({ url, local });
    // swap: 폰트 조각을 받는 동안에도 글자가 사라지지 않게
    out.push(block.replace(/src:[^;}]+/, `src:url("/fonts/${local}") format("woff2");font-display:swap`));
  }
  return { css: out.join("\n"), files };
}

async function download(files) {
  let i = 0;
  let done = 0;
  async function worker() {
    while (i < files.length) {
      const { url, local } = files[i++];
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const dest = path.join(OUT_DIR, local);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      if (++done % 50 === 0) console.log(`  ${done}/${files.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

const tpsCss = (await fetchText(`${ORIGIN}/tps/main.css`)) + (await fetchText(`${ORIGIN}/tps/others.css`));
const tps = rewrite(tpsCss, {
  resolve: (u) => new URL(u, ORIGIN).href,
  toLocal: (u) => `tps/${new URL(u).pathname.split("/").slice(-2).join("/")}`, // tps/<weight>/<n>.woff2
  keepWeight: (w) => WEIGHTS.has(w),
});

const tossface = rewrite(await fetchText(`${ORIGIN}/tossface-font/tossface.css`), {
  resolve: (u) => new URL(u, ORIGIN).href,
  toLocal: (u) => `tossface/${path.basename(new URL(u).pathname)}`,
});

const files = [...tps.files, ...tossface.files];
console.log(`Downloading ${files.length} font files...`);
await download(files);

const cssPath = path.resolve("src/app/fonts.css");
await writeFile(cssPath, `${tps.css}\n${tossface.css}\n`);
console.log(`Wrote ${cssPath}`);
