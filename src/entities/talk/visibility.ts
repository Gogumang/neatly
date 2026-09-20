// 누가 볼 수 있나. 값이 없는 예전 나레이션은 공개로 본다.
export const VISIBILITIES = [
  { id: "public", name: "공개" },
  { id: "private", name: "비공개" },
] as const;

export type VisibilityId = (typeof VISIBILITIES)[number]["id"];

export const DEFAULT_VISIBILITY: VisibilityId = "public";

export const isVisibilityId = (value: unknown): value is VisibilityId => VISIBILITIES.some((v) => v.id === value);

type Access = { visibility?: string; pass?: unknown };

/** 비밀번호를 넣어야 볼 수 있는지. 비밀번호가 없는 옛 비공개 나레이션은 공개로 본다 */
export const isLocked = (talk: Access) => talk.visibility === "private" && Boolean(talk.pass);

/** 목록(갤러리)에 넣을 나레이션인지 */
export const isListed = (talk: Access) => !isLocked(talk);

const MIN_PASSWORD = 4;
export const MAX_PASSWORD = 20;

/** 쓸 수 있는 비밀번호인지 (4~20자) */
export const isPassword = (value: string) => value.length >= MIN_PASSWORD && value.length <= MAX_PASSWORD;
