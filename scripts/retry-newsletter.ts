import "./env";
import { eq, asc } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { deliveries } from "../src/lib/db/schema";
import { processDelivery } from "../src/lib/server/newsletter";
async function main() {
  const jobs = await getDb()
    .select({ id: deliveries.id })
    .from(deliveries)
    .where(eq(deliveries.state, "pending"))
    .orderBy(asc(deliveries.createdAt))
    .limit(100);
  let failed = 0;
  for (const job of jobs) {
    try {
      await processDelivery(job.id);
    } catch {
      failed++;
    }
  }
  const review = await getDb()
    .select({ id: deliveries.id })
    .from(deliveries)
    .where(eq(deliveries.state, "review"));
  console.info({ processed: jobs.length, failed, manualReview: review.length });
  if (failed || review.length) process.exitCode = 1;
}
main().catch(() => {
  console.error("Retry failed. Check service configuration.");
  process.exitCode = 1;
});
