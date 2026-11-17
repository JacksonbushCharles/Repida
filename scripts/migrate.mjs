import { readdir, readFile } from "node:fs/promises";
import env from "@next/env";
import pg from "pg";

const { loadEnvConfig } = env;
loadEnvConfig(process.cwd());

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DATABASE_URL to the PostgreSQL connection string before migrating.");
}

const folder = new URL("../drizzle/", import.meta.url);
const files = (await readdir(folder)).filter((file) => file.endsWith(".sql")).sort();

if (files.length === 0) {
  throw new Error("No SQL migration files were found in drizzle/.");
}

const database = new Pool({ connectionString, max: 1 });
const client = await database.connect();

try {
  await client.query("BEGIN");
  for (const file of files) {
    const migration = await readFile(new URL(file, folder), "utf8");
    if (migration.trim()) {
      await client.query(migration);
    }
  }
  await client.query("COMMIT");
  console.log(`Repida PostgreSQL migration completed (${files.length} files).`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await database.end();
}
