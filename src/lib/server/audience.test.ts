// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { migrate } from "drizzle-orm/libsql/migrator";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "../db";
import * as schema from "../db/schema";
import {
  confirm,
  subscribe,
  syncUnsubscribe,
  processDelivery,
  unsubscribe,
} from "./newsletter";
import { newsletterProvider } from "./newsletter-provider";
import { unseal } from "./security";
import { addEntry, listEntries, moderate } from "./guestbook";
import { putReaction, readReactions, reactionSummary } from "./reactions";
vi.mock("./newsletter-provider", () => ({
  newsletterProvider: {
    send: vi.fn(),
    activate: vi.fn(),
    unsubscribe: vi.fn(),
  },
}));
const send = vi.mocked(newsletterProvider.send);
const activate = vi.mocked(newsletterProvider.activate);
let clock = Date.now();
beforeAll(async () => {
  process.env.TURSO_DATABASE_URL = `file:/tmp/audience-${randomUUID()}.db`;
  process.env.NEWSLETTER_SECRET =
    "test-secret-with-at-least-thirty-two-characters";
  process.env.BETTER_AUTH_URL = "http://localhost:3000";
  await migrate(getDb(), { migrationsFolder: "./drizzle" });
});
beforeEach(async () => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  send.mockResolvedValue("mail-id");
  activate.mockResolvedValue("contact-id");
  clock = Date.now();
  for (const table of [
    schema.deliveries,
    schema.confirmations,
    schema.subscribers,
    schema.limits,
    schema.moderationLog,
    schema.guestbook,
    schema.reactions,
    schema.account,
    schema.user,
  ])
    await getDb().delete(table);
});
function confirmationToken() {
  return send.mock.calls[0][0].text.match(/token=([\w-]+)/)![1];
}
async function subscriber() {
  return (await getDb().select().from(schema.subscribers))[0];
}
describe("newsletter with a migrated libSQL database and simulated provider", () => {
  it("keeps consent pending until explicit confirmation, uses hashes, sends bilingual welcome once", async () => {
    await subscribe("reader@example.com", "pt", "article", "hello-world");
    const token = confirmationToken();
    expect((await subscriber()).status).toBe("pending");
    const [proof] = await getDb().select().from(schema.confirmations);
    expect(proof.hash).not.toBe(token);
    expect(proof.expiresAt - (await subscriber()).requestedAt).toBe(86_400_000);
    expect(await confirm(token)).toMatchObject({
      confirmed: true,
      fresh: true,
      language: "pt",
    });
    expect((await subscriber()).status).toBe("active");
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0].text).toContain("Cancelar a inscrição");
    expect(activate).toHaveBeenCalledWith("reader@example.com", "pt");
    expect(await confirm(token)).toMatchObject({ fresh: false });
    expect(send).toHaveBeenCalledTimes(2);
  });
  it("does not rotate a live token or duplicate confirmation emails", async () => {
    await subscribe("reader@example.com", "en", "footer", null);
    const generation = (await subscriber()).generation;
    await subscribe("reader@example.com", "en", "newsletter", null);
    expect((await subscriber()).generation).toBe(generation);
    expect(send).toHaveBeenCalledTimes(1);
    await confirm(confirmationToken());
    expect(send.mock.calls[1][0].text).toContain("Every two weeks, in English");
  });
  it("retries a failed unsubscribe instead of cancelling its own queued job", async () => {
    await subscribe("reader@example.com", "en", "newsletter", null);
    await confirm(confirmationToken());
    const url = new URL(send.mock.calls[1][0].text.match(/http[^\s]+/)![0]);
    const id = url.searchParams.get("id")!;
    const signature = url.searchParams.get("signature")!;
    vi.mocked(newsletterProvider.unsubscribe).mockRejectedValueOnce(
      new Error("offline"),
    );
    await expect(unsubscribe(id, signature)).rejects.toThrow();
    await unsubscribe(id, signature);
    expect(newsletterProvider.unsubscribe).toHaveBeenCalledTimes(2);
    const [job] = await getDb()
      .select()
      .from(schema.deliveries)
      .where(eq(schema.deliveries.kind, "unsubscribe"));
    expect(job.state).toBe("sent");
    await expect(unsubscribe(id, "forged")).rejects.toMatchObject({
      status: 400,
    });
  });
  it("rejects invalid and expired confirmation", async () => {
    await subscribe("reader@example.com", "pt", "newsletter", null);
    const token = confirmationToken();
    vi.spyOn(Date, "now").mockReturnValue(
      (await subscriber()).requestedAt + 86_400_001,
    );
    await expect(confirm(token)).rejects.toMatchObject({ status: 410 });
    await expect(confirm("invalid")).rejects.toMatchObject({ status: 410 });
    expect(activate).not.toHaveBeenCalled();
  });
  it("persists encrypted retry payload and reuses provider idempotency key after a failure", async () => {
    send.mockRejectedValueOnce(new Error("offline"));
    await expect(
      subscribe("reader@example.com", "en", "newsletter", null),
    ).rejects.toThrow();
    const [job] = await getDb().select().from(schema.deliveries);
    expect(job.state).toBe("pending");
    expect(job.attempts).toBe(1);
    expect(job.payload).not.toContain("reader@");
    expect(unseal(job.payload)).toContain("reader@example.com");
    await processDelivery(job.id);
    expect(send.mock.calls[0][1]).toBe(send.mock.calls[1][1]);
    await processDelivery(job.id);
    expect(send).toHaveBeenCalledTimes(2);
  });
  it("requires manual review after provider idempotency retention, never silently resends", async () => {
    send.mockRejectedValueOnce(new Error("ambiguous"));
    await expect(
      subscribe("reader@example.com", "en", "newsletter", null),
    ).rejects.toThrow();
    const [job] = await getDb().select().from(schema.deliveries);
    vi.spyOn(Date, "now").mockReturnValue(clock + 24 * 3_600_000);
    await expect(processDelivery(job.id)).rejects.toMatchObject({
      code: "delivery_review",
    });
    expect(send).toHaveBeenCalledTimes(1);
    expect((await getDb().select().from(schema.deliveries))[0].state).toBe(
      "review",
    );
  });
  it("retries activation without consuming consent again and queues failed welcome", async () => {
    await subscribe("reader@example.com", "en", "newsletter", null);
    const token = confirmationToken();
    activate.mockRejectedValueOnce(new Error("offline"));
    await expect(confirm(token)).rejects.toThrow();
    expect((await subscriber()).status).toBe("confirmed");
    send.mockRejectedValueOnce(new Error("welcome offline"));
    expect(await confirm(token)).toMatchObject({
      confirmed: true,
      fresh: true,
    });
    expect((await subscriber()).status).toBe("active");
    const jobs = await getDb()
      .select()
      .from(schema.deliveries)
      .where(eq(schema.deliveries.kind, "welcome"));
    expect(jobs[0].state).toBe("pending");
    await processDelivery(jobs[0].id);
    expect(send).toHaveBeenCalledTimes(3);
  });
  it("syncs cancellation idempotently and requires fresh consent to resubscribe", async () => {
    await subscribe("reader@example.com", "pt", "newsletter", null);
    const oldToken = confirmationToken();
    await confirm(oldToken);
    await syncUnsubscribe("reader@example.com", Date.now() + 10);
    expect((await subscriber()).status).toBe("unsubscribed");
    await syncUnsubscribe("reader@example.com", Date.now() + 10);
    await expect(confirm(oldToken)).rejects.toMatchObject({ status: 410 });
    send.mockClear();
    await subscribe("reader@example.com", "en", "newsletter", null);
    const newToken = confirmationToken();
    expect(newToken).not.toBe(oldToken);
    expect((await subscriber()).status).toBe("pending");
    await expect(confirm(oldToken)).rejects.toMatchObject({ status: 410 });
    await confirm(newToken);
    expect((await subscriber()).language).toBe("en");
  });
});
describe("guestbook moderation and persistence", () => {
  async function author() {
    const id = randomUUID();
    await getDb()
      .insert(schema.user)
      .values({
        id,
        name: "Visitor",
        email: `${id}@example.com`,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    await getDb().insert(schema.account).values({
      id: randomUUID(),
      userId: id,
      accountId: "123",
      providerId: "github",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }
  it("keeps pending/rejected entries private, deduplicates and records moderator actions", async () => {
    const id = await author();
    await addEntry(id, "<script>text, never HTML</script>");
    await addEntry(id, "<script>text, never HTML</script>");
    expect(await listEntries()).toHaveLength(0);
    const pending = await listEntries("pending");
    expect(pending).toHaveLength(1);
    await moderate(pending[0].id, "approved", id);
    expect((await listEntries())[0].message).toBe(
      "<script>text, never HTML</script>",
    );
    await moderate(pending[0].id, "rejected", id);
    expect(await listEntries()).toHaveLength(0);
    expect(await getDb().select().from(schema.moderationLog)).toHaveLength(2);
  });
  it("paginates without skipping notes with the same timestamp", async () => {
    const id = await author();
    const now = Date.now();
    await getDb()
      .insert(schema.guestbook)
      .values(
        Array.from({ length: 31 }, (_, i) => ({
          id: randomUUID(),
          userId: id,
          message: `note ${i}`,
          fingerprint: `fp-${i}`,
          createdAt: now,
        })),
      );
    const first = await listEntries("pending");
    const last = first[first.length - 1];
    const second = await listEntries("pending", {
      createdAt: last.createdAt,
      id: last.id,
    });
    expect(first).toHaveLength(30);
    expect(second).toHaveLength(1);
    expect(new Set([...first, ...second].map((e) => e.id)).size).toBe(31);
  });
  it("enforces message limits", async () => {
    const id = await author();
    await expect(addEntry(id, " ")).rejects.toMatchObject({ status: 400 });
    await expect(addEntry(id, "x".repeat(501))).rejects.toMatchObject({
      status: 400,
    });
  });
});
describe("persistent reactions", () => {
  it("keeps concurrent repeated PUTs unique, removes idempotently and aggregates only published slugs", async () => {
    await Promise.all(
      Array.from({ length: 10 }, () =>
        putReaction("hello-world", "visitor-a", "like", true),
      ),
    );
    await putReaction("hello-world", "visitor-b", "love", true);
    await putReaction("other", "visitor-a", "fire", true);
    await putReaction("draft", "visitor-a", "like", true);
    expect(await readReactions("hello-world", "visitor-a")).toEqual({
      counts: { like: 1, love: 1 },
      selected: ["like"],
    });
    expect(await reactionSummary(["hello-world", "other"])).toEqual({
      reactions: 3,
      articles: 2,
    });
    await putReaction("hello-world", "visitor-a", "like", false);
    await putReaction("hello-world", "visitor-a", "like", false);
    expect(await reactionSummary(["hello-world"])).toEqual({
      reactions: 1,
      articles: 1,
    });
    expect((await readReactions("hello-world", "visitor-a")).selected).toEqual(
      [],
    );
  });
});
