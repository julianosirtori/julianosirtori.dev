import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { getDb } from "../db";
import { confirmations, deliveries, subscribers } from "../db/schema";
import {
  hash,
  token,
  seal,
  unseal,
  siteUrl,
  HttpError,
  reserveMailQuota,
} from "./security";
import { newsletterProvider, type MailPayload } from "./newsletter-provider";
const DAY = 86_400_000;
const CONSENT = "biweekly-v1";
export type Subscription = typeof subscribers.$inferSelect;

function unsubscribeSignature(id: string) {
  if (!process.env.NEWSLETTER_SECRET) throw new Error("Newsletter unavailable");
  return createHmac("sha256", process.env.NEWSLETTER_SECRET)
    .update(`unsubscribe:${id}`)
    .digest("base64url");
}
function unsubscribeUrl(s: Subscription) {
  return `${siteUrl()}/${s.language}/newsletter/unsubscribe?id=${s.id}&signature=${unsubscribeSignature(s.id)}`;
}
function welcome(s: Subscription): MailPayload {
  return {
    to: s.email,
    subject:
      s.language === "pt"
        ? "Boas-vindas às Notas do Juliano"
        : "Welcome to Notas do Juliano",
    text:
      s.language === "pt"
        ? `Inscrição confirmada! A cada duas semanas, em português: uma decisão prática, um aprendizado e até três links comentados. Cerca de cinco minutos de leitura.\n\nCancelar a inscrição: ${unsubscribeUrl(s)}`
        : `You're subscribed! Every two weeks, in English: one practical decision, one lesson and up to three annotated links. About five minutes of reading.\n\nUnsubscribe: ${unsubscribeUrl(s)}`,
  };
}
export async function subscribe(
  email: string,
  language: "pt" | "en",
  source: string,
  article: string | null,
) {
  const now = Date.now();
  const generation = randomUUID();
  const rawToken = token();
  const url = `${siteUrl()}/${language}/newsletter/confirm?token=${rawToken}`;
  const payload = seal(
    JSON.stringify({
      to: email,
      subject:
        language === "pt"
          ? "Confirme sua inscrição — Notas do Juliano"
          : "Confirm your subscription — Notas do Juliano",
      text:
        language === "pt"
          ? `Você solicitou a newsletter quinzenal em português. Abra o link e confirme sua inscrição. Válido por 24 horas. Se não foi você, ignore este e-mail.\n\n${url}`
          : `You requested the biweekly newsletter in English. Open the link and confirm your subscription. Valid for 24 hours. If this wasn't you, ignore this email.\n\n${url}`,
    }),
  );
  const db = getDb();
  const [prior] = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email));
  if (prior?.status === "unsubscribed")
    await processDelivery(`${prior.generation}:unsubscribe`);
  const job = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email));
    // Same response for all addresses. Repeated requests do not rotate a live token.
    if (
      existing &&
      ((existing.status === "active" && existing.language === language) ||
        (existing.status !== "unsubscribed" &&
          now - existing.requestedAt < DAY))
    ) {
      return `${existing.generation}:confirmation`;
    }
    const id = existing?.id || randomUUID();
    if (existing) {
      await tx
        .update(deliveries)
        .set({ state: "cancelled", payload: "" })
        .where(
          and(eq(deliveries.subscriberId, id), eq(deliveries.state, "pending")),
        );
      await tx
        .update(subscribers)
        .set({
          language,
          source,
          article,
          generation,
          status: "pending",
          requestedAt: now,
          confirmedAt: null,
          consentVersion: CONSENT,
        })
        .where(eq(subscribers.id, id));
    } else
      await tx.insert(subscribers).values({
        id,
        email,
        language,
        source,
        article,
        generation,
        requestedAt: now,
        consentVersion: CONSENT,
      });
    await tx.insert(confirmations).values({
      hash: hash(rawToken),
      subscriberId: id,
      generation,
      expiresAt: now + DAY,
    });
    const jobId = `${generation}:confirmation`;
    await tx.insert(deliveries).values({
      id: jobId,
      subscriberId: id,
      generation,
      kind: "confirmation",
      payload,
      createdAt: now,
    });
    return jobId;
  });
  await processDelivery(job);
}
export async function confirm(rawToken: string) {
  const db = getDb();
  const now = Date.now();
  const result = await db.transaction(async (tx) => {
    const [proof] = await tx
      .select()
      .from(confirmations)
      .where(eq(confirmations.hash, hash(rawToken)));
    if (!proof) throw new HttpError(410, "expired");
    const [subscriber] = await tx
      .select()
      .from(subscribers)
      .where(eq(subscribers.id, proof.subscriberId));
    if (
      !subscriber ||
      subscriber.generation !== proof.generation ||
      subscriber.status === "unsubscribed"
    )
      throw new HttpError(410, "expired");
    if (proof.consumedAt)
      return { subscriber, fresh: subscriber.status !== "active" };
    if (proof.expiresAt <= now) throw new HttpError(410, "expired");
    await tx
      .update(confirmations)
      .set({ consumedAt: now })
      .where(eq(confirmations.hash, proof.hash));
    await tx
      .update(subscribers)
      .set({ status: "confirmed", confirmedAt: now })
      .where(eq(subscribers.id, subscriber.id));
    await tx
      .insert(deliveries)
      .values({
        id: `${proof.generation}:activate`,
        subscriberId: subscriber.id,
        generation: proof.generation,
        kind: "activate",
        payload: "",
        createdAt: now,
      })
      .onConflictDoNothing();
    return { subscriber: { ...subscriber, confirmedAt: now }, fresh: true };
  });
  await processDelivery(`${result.subscriber.generation}:activate`);
  // Welcome failure does not undo confirmed consent or contact activation. Retry command handles it.
  await processDelivery(`${result.subscriber.generation}:welcome`).catch(
    () => undefined,
  );
  return {
    confirmed: true,
    fresh: result.fresh,
    language: result.subscriber.language,
  };
}
export async function unsubscribe(id: string, signature: string) {
  const expected = Buffer.from(unsubscribeSignature(id));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
    throw new HttpError(400, "invalid");
  const db = getDb();
  await db.transaction(async (tx) => {
    const [s] = await tx
      .select()
      .from(subscribers)
      .where(eq(subscribers.id, id));
    if (!s) throw new HttpError(400, "invalid");
    await tx
      .update(subscribers)
      .set({ status: "unsubscribed", unsubscribedAt: Date.now() })
      .where(eq(subscribers.id, id));
    await tx
      .update(deliveries)
      .set({ state: "cancelled", payload: "" })
      .where(
        and(
          eq(deliveries.subscriberId, id),
          eq(deliveries.state, "pending"),
          ne(deliveries.kind, "unsubscribe"),
        ),
      );
    await tx
      .insert(deliveries)
      .values({
        id: `${s.generation}:unsubscribe`,
        subscriberId: id,
        generation: s.generation,
        kind: "unsubscribe",
        payload: "",
        createdAt: Date.now(),
      })
      .onConflictDoNothing();
  });
  await processDeliveryFromSubscriber(id);
}
async function processDeliveryFromSubscriber(id: string) {
  const [s] = await getDb()
    .select()
    .from(subscribers)
    .where(eq(subscribers.id, id));
  await processDelivery(`${s.generation}:unsubscribe`);
}
export async function processDelivery(id: string) {
  const db = getDb();
  const now = Date.now();
  const [initial] = await db
    .select()
    .from(deliveries)
    .where(eq(deliveries.id, id));
  if (!initial || initial.state === "sent" || initial.state === "cancelled")
    return;
  if (initial.state === "review") throw new HttpError(503, "delivery_review");
  const isMail = initial.kind === "confirmation" || initial.kind === "welcome";
  if (isMail && !initial.firstAttemptAt) await reserveMailQuota();
  await db
    .update(deliveries)
    .set({ firstAttemptAt: now })
    .where(and(eq(deliveries.id, id), isNull(deliveries.firstAttemptAt)));
  await db
    .update(deliveries)
    .set({ attempts: sql`${deliveries.attempts} + 1` })
    .where(and(eq(deliveries.id, id), eq(deliveries.state, "pending")));
  // A write transaction serializes delivery, confirmation and cancellation. Provider idempotency
  // bridges a provider success followed by a database rollback/crash (24h retention).
  await db.transaction(async (tx) => {
    await tx
      .update(deliveries)
      .set({ state: "pending" })
      .where(and(eq(deliveries.id, id), eq(deliveries.state, "pending")));
    const [job] = await tx
      .select()
      .from(deliveries)
      .where(eq(deliveries.id, id));
    if (job.state !== "pending") return;
    const [s] = await tx
      .select()
      .from(subscribers)
      .where(eq(subscribers.id, job.subscriberId));
    if (
      s.generation !== job.generation ||
      (s.status === "unsubscribed" && job.kind !== "unsubscribe") ||
      (job.kind === "confirmation" && s.status !== "pending")
    ) {
      await tx
        .update(deliveries)
        .set({ state: "cancelled", payload: "" })
        .where(eq(deliveries.id, id));
      return;
    }
    if (
      isMail &&
      job.firstAttemptAt &&
      now - job.firstAttemptAt > 23 * 3_600_000
    ) {
      // Never automatically resend an ambiguous email after the provider forgets its key.
      await tx
        .update(deliveries)
        .set({ state: "review" })
        .where(eq(deliveries.id, id));
      return;
    }
    let providerId: string | undefined;
    if (job.kind === "activate") {
      providerId = await newsletterProvider.activate(s.email, s.language);
      await tx
        .update(subscribers)
        .set({ status: "active" })
        .where(eq(subscribers.id, s.id));
      await tx
        .insert(deliveries)
        .values({
          id: `${s.generation}:welcome`,
          subscriberId: s.id,
          generation: s.generation,
          kind: "welcome",
          payload: seal(JSON.stringify(welcome(s))),
          createdAt: now,
        })
        .onConflictDoNothing();
    } else if (job.kind === "unsubscribe")
      await newsletterProvider.unsubscribe(s.email);
    else
      providerId = await newsletterProvider.send(
        JSON.parse(unseal(job.payload)),
        job.id,
      );
    await tx
      .update(deliveries)
      .set({ state: "sent", acceptedAt: now, providerId, payload: "" })
      .where(eq(deliveries.id, id));
  });
  const [current] = await db
    .select()
    .from(deliveries)
    .where(eq(deliveries.id, id));
  if (current.state === "review") throw new HttpError(503, "delivery_review");
}
export async function syncUnsubscribe(email: string, eventAt: number) {
  const db = getDb();
  await db.transaction(async (tx) => {
    const [s] = await tx
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase()));
    if (!s || eventAt <= s.providerEventAt || eventAt < (s.confirmedAt || 0))
      return;
    await tx
      .update(subscribers)
      .set({
        status: "unsubscribed",
        unsubscribedAt: eventAt,
        providerEventAt: eventAt,
      })
      .where(eq(subscribers.id, s.id));
    await tx
      .update(deliveries)
      .set({ state: "cancelled", payload: "" })
      .where(
        and(eq(deliveries.subscriberId, s.id), eq(deliveries.state, "pending")),
      );
  });
}
