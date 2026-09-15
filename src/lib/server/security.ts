import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";
import { lt, sql } from "drizzle-orm";
import { getDb } from "../db";
import { limits } from "../db/schema";
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export function siteUrl() {
  return new URL(process.env.BETTER_AUTH_URL || "http://localhost:3000").origin;
}
export function sameOrigin(request: Request) {
  if (request.headers.get("origin") !== siteUrl())
    throw new HttpError(403, "origin");
}
export async function boundedText(request: Request, maxBytes: number) {
  // Bound streaming bodies too; Content-Length is not trustworthy.
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "invalid");
  let value = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.length;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new HttpError(413, "too_large");
    }
    value += decoder.decode(chunk.value, { stream: true });
  }
  return value + decoder.decode();
}
export async function body(request: Request, maxBytes = 8192) {
  const mediaType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json")
    throw new HttpError(415, "content_type");
  const value = await boundedText(request, maxBytes);
  try {
    const data = JSON.parse(value);
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error();
    return data as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "invalid");
  }
}
async function incrementLimit(key: string, max: number, expiresAt: number) {
  if (!Number.isSafeInteger(max) || max < 1) throw new Error("Invalid quota");
  const db = getDb();
  const id = hash(key);
  const [row] = await db
    .insert(limits)
    .values({ key: id, count: 1, expiresAt })
    .onConflictDoUpdate({
      target: limits.key,
      set: { count: sql`${limits.count} + 1` },
    })
    .returning();
  if (row.count > max) throw new HttpError(429, "rate_limited");
  if (row.count === 1)
    await db.delete(limits).where(lt(limits.expiresAt, Date.now()));
}
export async function limit(key: string, max: number, duration: number) {
  const bucket = Math.floor(Date.now() / duration);
  await incrementLimit(`${key}:${bucket}`, max, (bucket + 1) * duration);
}
export function requestKey(request: Request) {
  // Vercel overwrites this header. Other deployments must set it at a trusted proxy.
  return process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0] || "unknown"
    : "local";
}
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export async function endpoint(action: () => Promise<Response>) {
  try {
    return await action();
  } catch (error) {
    return json(
      { error: error instanceof HttpError ? error.code : "unavailable" },
      error instanceof HttpError ? error.status : 503,
    );
  }
}
function encryptionKey() {
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Newsletter secret unavailable");
  return createHash("sha256").update(secret).digest();
}
export function seal(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  return Buffer.concat([
    iv,
    cipher.update(value, "utf8"),
    cipher.final(),
    cipher.getAuthTag(),
  ]).toString("base64url");
}
export function unseal(value: string) {
  const buffer = Buffer.from(value, "base64url");
  const cipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    buffer.subarray(0, 12),
  );
  cipher.setAuthTag(buffer.subarray(-16));
  return Buffer.concat([
    cipher.update(buffer.subarray(12, -16)),
    cipher.final(),
  ]).toString("utf8");
}
export async function reserveMailQuota(
  channel: "newsletter" | "contact" = "newsletter",
) {
  const daily =
    channel === "newsletter"
      ? process.env.NEWSLETTER_DAILY_LIMIT || 80
      : process.env.CONTACT_DAILY_LIMIT || 20;
  const monthly =
    channel === "newsletter"
      ? process.env.NEWSLETTER_MONTHLY_LIMIT || 2400
      : process.env.CONTACT_MONTHLY_LIMIT || 600;
  await limit(`${channel}:daily`, Number(daily), 86_400_000);
  const now = new Date();
  await incrementLimit(
    `${channel}:month:${now.toISOString().slice(0, 7)}`,
    Number(monthly),
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
}
