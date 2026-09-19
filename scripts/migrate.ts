import "./env";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "../src/lib/db";
async function main() {
  await migrate(getDb(), { migrationsFolder: "./drizzle" });
  console.info("Migrations applied.");
}
main().catch(() => {
  console.error("Migration failed. Check database configuration.");
  process.exitCode = 1;
});
