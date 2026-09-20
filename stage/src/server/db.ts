import "server-only";
import { Pool } from "pg";

// Supabase Postgres 직접 연결. 기존 스키마(public)는 건드리지 않고 stage 스키마만 쓴다.

const URL = process.env.DATABASE_URL;

export const dbEnabled = Boolean(URL);

let pool: Pool | null = null;

function db(): Pool {
  if (!URL) throw new Error("DATABASE_URL 이 없어요");
  // Supabase 풀러는 TLS 를 쓰지만 인증서 체인을 검증하지 않는다 (서버리스에서 흔한 설정)
  pool ??= new Pool({ connectionString: URL, ssl: { rejectUnauthorized: false }, max: 3 });
  return pool;
}

export async function query<T>(text: string, values: unknown[] = []): Promise<T[]> {
  const result = await db().query(text, values);
  return result.rows as T[];
}

export async function queryOne<T>(text: string, values: unknown[] = []): Promise<T | null> {
  const [row] = await query<T>(text, values);
  return row ?? null;
}
