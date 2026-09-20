import { newId } from "@/server/dataDir";
import { newEditKey } from "@/server/editKey";
import { LinkError } from "@/server/link/safeFetch";
import { allow, clientIp, tooMany } from "@/server/rateLimit";
import { writeScript } from "@/server/script/writeScript";
import { saveTalk } from "@/server/store";
import { InputError, readTalkRequest } from "@/server/talkRequest";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!allow(`talks:${clientIp(request)}`, 10, 10 * 60_000)) return tooMany();
  try {
    const { input, voice } = await readTalkRequest(await request.json().catch(() => null));
    const script = await writeScript(input);
    const id = newId();
    const editKey = newEditKey();
    await saveTalk({ ...script, id, voice, editKey, createdAt: new Date().toISOString(), likes: 0, voiced: false });
    return Response.json({ id, editKey });
  } catch (e) {
    if (e instanceof InputError || e instanceof LinkError) return Response.json({ error: e.message }, { status: 400 });
    console.error(e);
    return Response.json({ error: "대본을 만들지 못했어요. 잠시 후 다시 시도해주세요." }, { status: 502 });
  }
}
