import "server-only";
import type { Talk } from "@/entities/talk/model";
import { supabase } from "../supabase";
import type { StoredTalk, TalkRepo } from "./repo";

// talks 테이블: 나레이션 본문은 data(jsonb), 자주 바뀌거나 걸러 보는 값은 컬럼으로 (supabase/schema.sql)

type Row = { id: string; data: Talk; likes: number; voiced: boolean; edit_key: string | null; created_at: string };

const fromRow = (row: Row): StoredTalk => ({
  ...row.data,
  id: row.id,
  likes: row.likes,
  voiced: row.voiced,
  editKey: row.edit_key ?? undefined,
  createdAt: row.created_at,
});

function toRow({ likes, voiced, editKey, createdAt, ...data }: StoredTalk): Row {
  return { id: data.id, data, likes, voiced, edit_key: editKey ?? null, created_at: createdAt };
}

export const supabaseRepo: TalkRepo = {
  async get(id) {
    const { data, error } = await supabase().from("talks").select("*").eq("id", id).maybeSingle<Row>();
    if (error) throw new Error(error.message);
    return data ? fromRow(data) : null;
  },
  async save(talk) {
    // 좋아요는 like() 로만 바꾼다 (동시에 눌린 좋아요를 덮어쓰지 않게)
    const { likes: _likes, ...row } = toRow(talk);
    const { error } = await supabase().from("talks").upsert(row);
    if (error) throw new Error(error.message);
  },
  async list() {
    const { data, error } = await supabase()
      .from("talks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .returns<Row[]>();
    if (error) throw new Error(error.message);
    return (data ?? []).map(fromRow);
  },
  async like(id) {
    const { data, error } = await supabase().rpc("increment_likes", { talk_id: id });
    if (error) throw new Error(error.message);
    return typeof data === "number" ? data : null;
  },
};
