import { readFileSync } from "node:fs"; import pg from "pg";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>[l.slice(0,l.indexOf("=")).trim(), l.slice(l.indexOf("=")+1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl:{rejectUnauthorized:false} }); await c.connect();
const { rows } = await c.query("select id, data->>'format' f, data->>'title' t, (select count(*) from jsonb_array_elements(data->'segments') s where s ? 'panelUrl') panels, (select count(*) from jsonb_array_elements(data->'segments') s where s ? 'sign') sign, (select count(*) from jsonb_array_elements(data->'segments') s where s ? 'audioUrl') audio from stage.talks order by created_at desc limit 6");
console.table(rows); await c.end();
