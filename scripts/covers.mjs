// 표지 그림이 없는 나레이션에 표지를 채워 넣는다.
//   node scripts/covers.mjs http://localhost:3000 [--force]
const site = process.argv[2] ?? "http://localhost:3000";
const force = process.argv.includes("--force");

const page = await fetch(`${site}/talks`).then((r) => r.text());
const ids = [...new Set([...page.matchAll(/\/talks\/([0-9a-f]{8})/g)].map((m) => m[1]))];
console.log(`${ids.length}개 나레이션`);

for (const id of ids) {
  const res = await fetch(`${site}/api/talks/${id}/cover${force ? "?force=1" : ""}`, { method: "POST" });
  const body = await res.json().catch(() => ({}));
  console.log(id, res.status, body.coverUrl ?? body.error ?? "");
}
