/** 클래스 이름 합치기. falsy 값은 버린다. */
export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}
