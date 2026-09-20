import "server-only";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertId, dataDir, isSafeId } from "../dataDir";
import type { StoredTalk, TalkRepo } from "./repo";

// 개발용: 나레이션 하나 = .data/talks/<id>.json

const talkPath = (id: string) => dataDir("talks", `${id}.json`);

async function get(id: string): Promise<StoredTalk | null> {
  if (!isSafeId(id)) return null;
  return readFile(talkPath(id), "utf8")
    .then((text) => JSON.parse(text) as StoredTalk)
    .catch(() => null);
}

async function save(talk: StoredTalk) {
  assertId(talk.id);
  await mkdir(path.dirname(talkPath(talk.id)), { recursive: true });
  await writeFile(talkPath(talk.id), JSON.stringify(talk, null, 2));
}

export const localRepo: TalkRepo = {
  get,
  save,
  async list() {
    const files = await readdir(dataDir("talks")).catch(() => [] as string[]);
    const talks = await Promise.all(files.filter((f) => f.endsWith(".json")).map((f) => get(f.slice(0, -5))));
    return talks.filter((t): t is StoredTalk => t !== null);
  },
  async like(id) {
    const talk = await get(id);
    if (!talk) return null;
    const likes = talk.likes + 1;
    await save({ ...talk, likes });
    return likes;
  },
};
