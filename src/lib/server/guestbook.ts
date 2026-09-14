import { randomUUID } from "node:crypto";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { getDb } from "../db";
import { account, guestbook, moderationLog, user } from "../db/schema";
import { hash, HttpError } from "./security";
export type GuestbookStatus = "pending" | "approved" | "rejected";
export async function listEntries(
  status: GuestbookStatus = "approved",
  before?: { createdAt: number; id: string },
) {
  return getDb()
    .select({
      id: guestbook.id,
      message: guestbook.message,
      createdAt: guestbook.createdAt,
      status: guestbook.status,
      name: user.name,
      githubUsername: user.githubUsername,
      image: user.image,
      githubId: account.accountId,
    })
    .from(guestbook)
    .innerJoin(user, eq(guestbook.userId, user.id))
    .innerJoin(
      account,
      and(eq(account.userId, user.id), eq(account.providerId, "github")),
    )
    .where(
      and(
        eq(guestbook.status, status),
        before
          ? or(
              lt(guestbook.createdAt, before.createdAt),
              and(
                eq(guestbook.createdAt, before.createdAt),
                lt(guestbook.id, before.id),
              ),
            )
          : undefined,
      ),
    )
    .orderBy(desc(guestbook.createdAt), desc(guestbook.id))
    .limit(30);
}
export async function addEntry(userId: string, message: string) {
  if (!message.trim() || Array.from(message.trim()).length > 500)
    throw new HttpError(400, "invalid");
  const fingerprint = hash(`${userId}:${message.trim()}`);
  await getDb()
    .insert(guestbook)
    .values({
      id: randomUUID(),
      userId,
      message: message.trim(),
      fingerprint,
      createdAt: Date.now(),
    })
    .onConflictDoNothing();
}
export async function moderate(
  id: string,
  status: GuestbookStatus,
  actorId: string,
) {
  await getDb().transaction(async (tx) => {
    const changed = await tx
      .update(guestbook)
      .set({ status, moderatedBy: actorId, moderatedAt: Date.now() })
      .where(eq(guestbook.id, id))
      .returning({ id: guestbook.id });
    if (!changed.length) throw new HttpError(404, "not_found");
    await tx.insert(moderationLog).values({
      id: randomUUID(),
      entryId: id,
      actorId,
      status,
      createdAt: Date.now(),
    });
  });
}
