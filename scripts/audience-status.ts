import "./env";
import { count, eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { subscribers, deliveries, guestbook } from "../src/lib/db/schema";
async function main() {
  const db = getDb();
  const subscriptionCounts = await db
    .select({ status: subscribers.status, count: count() })
    .from(subscribers)
    .groupBy(subscribers.status);
  const queue = await db
    .select({ state: deliveries.state, kind: deliveries.kind, count: count() })
    .from(deliveries)
    .groupBy(deliveries.state, deliveries.kind);
  const pending = await db
    .select({ count: count() })
    .from(guestbook)
    .where(eq(guestbook.status, "pending"));
  console.info(
    JSON.stringify(
      {
        subscriptions: subscriptionCounts,
        deliveries: queue,
        pendingNotes: pending[0].count,
      },
      null,
      2,
    ),
  );
}
main().catch(() => {
  console.error("Status unavailable. Check database configuration.");
  process.exitCode = 1;
});
