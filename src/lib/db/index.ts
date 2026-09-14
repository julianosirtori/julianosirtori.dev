import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
let instance: ReturnType<typeof connect> | undefined;
function connect() {
  if (!process.env.TURSO_DATABASE_URL) throw new Error("Database unavailable");
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}
export function getDb() {
  return (instance ??= connect());
}
export type Database = ReturnType<typeof getDb>;
