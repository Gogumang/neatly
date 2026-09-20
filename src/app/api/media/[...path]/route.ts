import { readMedia } from "@/server/media";
import { parseByteRange } from "@/shared/lib/byteRange";

// 음성·이미지·영상 내보내기. 영상은 브라우저가 앞뒤로 이동(seek)하며 부분만 요청하므로 Range 를 지원한다
export async function GET(request: Request, ctx: RouteContext<"/api/media/[...path]">) {
  const { path } = await ctx.params;
  const file = await readMedia(path.join("/"));
  if (!file) return new Response("Not found", { status: 404 });

  const size = file.bytes.byteLength;
  const headers = {
    "Content-Type": file.type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  const range = parseByteRange(request.headers.get("range"), size);
  if (!range) return new Response(new Uint8Array(file.bytes), { headers: { ...headers, "Content-Length": `${size}` } });

  const { start, end } = range;
  return new Response(new Uint8Array(file.bytes.subarray(start, end + 1)), {
    status: 206,
    headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": `${end - start + 1}` },
  });
}
