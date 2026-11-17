import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

export const db = connectionString
  ? drizzle(new Pool({ connectionString, max: 10 }), { schema })
  : null;

export const dbReady = Boolean(db);
