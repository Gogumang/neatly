/** "bytes=100-199" → { start, end } (end 포함). 형식이 틀리거나 범위를 벗어나면 null */
export function parseByteRange(header: string | null, size: number): { start: number; end: number } | null {
  const match = header?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || size === 0) return null;
  const [, from = "", to = ""] = match;
  if (!from && !to) return null;
  const start = from ? Number(from) : Math.max(0, size - Number(to));
  const end = from && to ? Math.min(Number(to), size - 1) : size - 1;
  return start <= end && start < size ? { start, end } : null;
}
