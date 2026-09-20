import "server-only";

// OpenAI 호환 chat/completions 호출. LLM_BASE_URL 만 바꾸면 OpenAI ↔ LM Studio 전환.
const BASE_URL = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";
const MODEL = process.env.LLM_MODEL ?? "gpt-5.4-mini";
const API_KEY = process.env.OPENAI_API_KEY ?? "lm-studio";

export type UserContent =
  | string
  | ({ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail?: "low" | "high" } })[];

export async function chatJSON<T>(opts: {
  system: string;
  user: UserContent;
  schemaName: string;
  schema: Record<string, unknown>;
}): Promise<T> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      // 대본 쓰기는 깊은 추론보다 속도가 중요하다 (OpenAI gpt-5 계열에만 있는 옵션)
      ...(MODEL.startsWith("gpt-5") ? { reasoning_effort: "low" } : {}),
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: opts.schemaName, strict: true, schema: opts.schema },
      },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`LLM 응답이 비어 있어요: ${JSON.stringify(data).slice(0, 300)}`);
  return JSON.parse(content) as T;
}
