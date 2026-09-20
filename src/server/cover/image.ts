import "server-only";

// 그림 생성 (OpenAI Images). 표지 포스터와 화자 얼굴을 만든다.
const BASE_URL = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";
const MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2";
const API_KEY = process.env.OPENAI_API_KEY;

/** 낮은 품질로도 충분히 곱다. 썸네일을 그리는 Satori 가 webp 를 못 읽어서 jpeg 로 받는다 */
const OPTIONS = { quality: "low", output_format: "jpeg", output_compression: 80, n: 1 } as const;

/** 표지는 세로 포스터, 화자 얼굴은 정사각, 웹툰 칸은 가로 */
const SIZES = { poster: "1024x1536", face: "1024x1024", panel: "1536x1024" } as const;

// 키가 없거나 꺼 두면 표지 없이 만든다
const enabled = Boolean(API_KEY) && process.env.COVER_IMAGE !== "off";

/** 그림 한 장. 실패하면 null 을 돌려주고, 나레이션은 그림 없이도 만들어진다 */
export async function generateImage(prompt: string, shape: keyof typeof SIZES = "poster"): Promise<Buffer | null> {
  if (!enabled) return null;
  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, prompt, size: SIZES[shape], ...OPTIONS }),
    signal: AbortSignal.timeout(120_000),
  }).catch(() => null);

  if (!res?.ok) return null;
  const data = await res.json().catch(() => null);
  const b64: string | undefined = data?.data?.[0]?.b64_json;
  return b64 ? Buffer.from(b64, "base64") : null;
}
