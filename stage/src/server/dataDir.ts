import "server-only";
import path from "node:path";

/** 로컬 저장 폴더. 테스트에서는 STAGE_DATA_DIR 로 임시 폴더를 쓴다 */
export const dataDir = (...parts: string[]) => path.join(process.env.STAGE_DATA_DIR ?? path.resolve(".data"), ...parts);

const SAFE_ID = /^[a-z0-9-]+$/i;

export const isSafeId = (id: string) => SAFE_ID.test(id);

/** 경로 밖으로 나가는 id 를 막는다 */
export function assertId(...ids: string[]) {
  for (const id of ids) if (!isSafeId(id)) throw new Error(`잘못된 id: ${id}`);
}

export function newId() {
  return crypto.randomUUID().slice(0, 8);
}
