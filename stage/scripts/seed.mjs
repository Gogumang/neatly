// 배포한 서버에 "또박을 또박으로 소개하는 나레이션"을 만든다.
// 사용: node scripts/seed.mjs https://배포주소
import { readFile } from "node:fs/promises";

const base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  console.error("사용법: node scripts/seed.mjs https://배포주소");
  process.exit(1);
}

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} ${res.status}: ${data.error ?? ""}`);
  return data;
}

const text = await readFile(new URL("../docs/stage-story.md", import.meta.url), "utf8");
const started = Date.now();
const { id, editKey } = await post("/api/talks", { genre: "project", authorName: "또박 팀", text, voice: "marin" });
await post(`/api/talks/${id}/voice`);
console.log(`만들었어요 (${((Date.now() - started) / 1000).toFixed(1)}초): ${base}/talks/${id}`);
console.log(`수정 키 (수어 영상을 붙일 때 필요, 안전하게 보관): ${editKey}`);
