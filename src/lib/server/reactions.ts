import { and, count, eq, inArray } from "drizzle-orm";
import { getDb } from "../db";
import { reactions } from "../db/schema";
import { type ReactionType, type ReactionSnapshot } from "../reactions";
export async function readReactions(
  slug: string,
  visitor?: string,
): Promise<ReactionSnapshot> {
  const db = getDb();
  const totals = await db
    .select({ type: reactions.type, count: count() })
    .from(reactions)
    .where(eq(reactions.slug, slug))
    .groupBy(reactions.type);
  const selected = visitor
    ? await db
        .select({ type: reactions.type })
        .from(reactions)
        .where(and(eq(reactions.slug, slug), eq(reactions.visitor, visitor)))
    : [];
  return {
    counts: Object.fromEntries(totals.map((t) => [t.type, t.count])),
    selected: selected.map((r) => r.type),
  };
}
export async function putReaction(
  slug: string,
  visitor: string,
  type: ReactionType,
  active: boolean,
) {
  if (active)
    await getDb()
      .insert(reactions)
      .values({ slug, visitor, type })
      .onConflictDoNothing();
  else
    await getDb()
      .delete(reactions)
      .where(
        and(
          eq(reactions.slug, slug),
          eq(reactions.visitor, visitor),
          eq(reactions.type, type),
        ),
      );
}
export async function reactionSummary(slugs: string[]) {
  if (!slugs.length) return { reactions: 0, articles: 0 };
  const rows = await getDb()
    .select({ slug: reactions.slug, count: count() })
    .from(reactions)
    .where(inArray(reactions.slug, slugs))
    .groupBy(reactions.slug);
  return {
    reactions: rows.reduce((n, row) => n + row.count, 0),
    articles: rows.length,
  };
}
