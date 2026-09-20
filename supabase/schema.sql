-- Stage 저장소. 기존 스키마(public)에는 손대지 않고 stage 스키마만 쓴다.
-- 실행: psql "$DATABASE_URL?sslmode=require" -f supabase/schema.sql

create schema if not exists stage;

-- 나레이션: 본문은 data(jsonb), 자주 바뀌거나 걸러 보는 값은 컬럼
create table if not exists stage.talks (
  id text primary key,
  data jsonb not null,
  likes integer not null default 0,
  voiced boolean not null default false,
  edit_key text,
  created_at timestamptz not null default now()
);

create index if not exists talks_created_at_idx on stage.talks (created_at desc);

-- 음성·이미지. (Supabase Storage 키를 받으면 그쪽으로 옮긴다)
create table if not exists stage.media (
  path text primary key,
  content_type text not null,
  bytes bytea not null,
  created_at timestamptz not null default now()
);

-- 좋아요: 동시에 눌려도 빠지지 않게 DB 안에서 1 올린다
create or replace function stage.increment_likes(talk_id text)
returns integer
language sql
as $$
  update stage.talks set likes = likes + 1 where id = talk_id returning likes;
$$;
