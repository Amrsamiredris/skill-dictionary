#!/usr/bin/env node
/**
 * Apply skilldic SQL migrations using a Postgres connection string.
 * Usage: SUPABASE_DB_URL="postgresql://..." node scripts/apply-migrations.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const dbUrl =
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!dbUrl) {
  console.error(
    "Missing SUPABASE_DB_URL. Get it from Supabase → Project Settings → Database → Connection string (URI).",
  );
  process.exit(1);
}

const files = [
  "supabase/migrations/001_stage1_analytics.sql",
  "supabase/migrations/002_stage2_profiles.sql",
];

const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(join(root, file), "utf8");
    console.log(`Running ${file}...`);
    await client.query(sql);
    console.log(`  OK`);
  }

  const tables = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('skill_events', 'skill_feedback', 'profiles', 'contact_messages')
    ORDER BY table_name
  `);
  console.log("\nTables:", tables.rows.map((r) => r.table_name).join(", "));

  const views = await client.query(`
    SELECT table_name FROM information_schema.views
    WHERE table_schema = 'public'
      AND table_name IN ('skill_stats_agg', 'skill_feedback_agg', 'user_skill_stats')
    ORDER BY table_name
  `);
  console.log("Views:", views.rows.map((r) => r.table_name).join(", "));

  await client.end();
  console.log("\nMigrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
