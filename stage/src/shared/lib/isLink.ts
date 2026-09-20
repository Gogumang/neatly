/** 입력 전체가 링크 하나인지 (글 대신 링크를 붙여넣은 경우) */
export function isLink(input: string): boolean {
  const value = input.trim();
  if (!/^https?:\/\/\S+$/i.test(value)) return false;
  try {
    return Boolean(new URL(value).hostname.includes("."));
  } catch {
    return false;
  }
}
