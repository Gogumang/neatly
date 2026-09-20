import { isVoiceId } from "@/entities/talk/voices";
import { voicePreview } from "@/server/voicePreview";

export async function GET(_req: Request, ctx: RouteContext<"/api/voices/[voice]">) {
  const { voice } = await ctx.params;
  if (!isVoiceId(voice)) return new Response("Not found", { status: 404 });
  try {
    const mp3 = await voicePreview(voice);
    return new Response(new Uint8Array(mp3), {
      // 길이를 알려줘야 브라우저가 재생 길이(duration)를 계산한다
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": `${mp3.byteLength}`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("미리듣기를 만들지 못했어요", { status: 502 });
  }
}
