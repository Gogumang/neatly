import "server-only";
import type { Talk } from "@/entities/talk/model";
import { query, queryOne } from "../db";
import type { StoredTalk, TalkRepo } from "./repo";

// stage.talks 테이블 (supabase/schema.sql)

type Row = { id: string; data: Talk; likes: number; voiced: boolean; edit_key: string | null; created_at: Date };

const fromRow = (row: Row): StoredTalk => ({
  ...row.data,
  id: row.id,
  likes: row.likes,
  voiced: row.voiced,
  editKey: row.edit_key ?? undefined,
  createdAt: new Date(row.created_at).toISOString(),
});

export const postgresRepo: TalkRepo = {
  async get(id) {
    const row = await queryOne<Row>("select * from stage.talks where id = $1", [id]);
    return row && fromRow(row);
  },

  async save(talk) {
    const { likes: _likes, voiced, editKey, createdAt, ...data } = talk;
    // 좋아요는 like() 로만 바꾼다 (동시에 눌린 좋아요를 덮어쓰지 않게)
    await query(
      `insert into stage.talks (id, data, voiced, edit_key, created_at) values ($1, $2, $3, $4, $5)
       on conflict (id) do update set data = excluded.data, voiced = excluded.voiced`,
      [talk.id, JSON.stringify(data), voiced, editKey ?? null, createdAt],
    );
  },

  async list() {
    const rows = await query<Row>("select * from stage.talks order by created_at desc limit 200");
    return rows.map(fromRow);
  },

  async like(id) {
    const row = await queryOne<{ likes: number }>("select stage.increment_likes($1) as likes", [id]);
    return row?.likes ?? null;
  },
};
