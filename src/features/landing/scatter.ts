import type { CSSProperties } from "react";

export type Cell = { i: number; ch: string; em: boolean };

/**
 * 글자마다 흩어질 방향·거리. 자리 번호로만 정해서 서버와 브라우저가 같은 값을 쓴다.
 * 황금각(137.5°)으로 돌리면 방향이 고르게 퍼진다.
 */
export function scatterVars(i: number): CSSProperties {
  const angle = (i * 137.5 * Math.PI) / 180;
  const radius = 16 + ((i * 29) % 26);
  return {
    "--dx": `${(Math.cos(angle) * radius).toFixed(1)}px`,
    "--dy": `${(Math.sin(angle) * radius - 8).toFixed(1)}px`,
    "--rot": `${((i * 47) % 21) - 10}deg`,
    "--i": i,
  } as CSSProperties;
}

/**
 * 글자를 단어 뭉치로 묶는다. 낱글자를 inline-block 으로 두면 아무 데서나 줄이 바뀌므로,
 * 띄어쓰기만 따로 떼어 그 자리에서만 줄이 바뀌게 한다.
 */
export function toWordGroups(cells: Cell[]): Cell[][] {
  const groups: Cell[][] = [];
  let current: Cell[] = [];
  for (const cell of cells) {
    if (cell.ch === " ") {
      if (current.length > 0) groups.push(current);
      groups.push([cell]);
      current = [];
      continue;
    }
    current.push(cell);
  }
  if (current.length > 0) groups.push(current);
  return groups;
}
