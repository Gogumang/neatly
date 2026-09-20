/** JSON POST. 실패하면 서버가 준 error 메시지로 throw */
export async function postJson<T>(url: string, body?: unknown, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "문제가 생겼어요. 잠시 후 다시 시도해주세요.");
  return data as T;
}
