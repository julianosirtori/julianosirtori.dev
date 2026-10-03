import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { SKILLS_BRANCH } from "./constants";

/**
 * Checks GitHub's `X-Hub-Signature-256` header: `sha256=` followed by the hex
 * HMAC of the raw body with the webhook secret. Compared in constant time.
 */
export function verifyGithubSignature(
  secret: string,
  payload: string,
  header: string | null,
): boolean {
  if (!secret || !header?.startsWith("sha256=")) return false;
  const hex = header.slice("sha256=".length);
  if (!/^[0-9a-f]{64}$/i.test(hex)) return false;
  const expected = createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest();
  const received = Buffer.from(hex, "hex");
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

/**
 * GitHub sends either `application/json` or a form with a `payload` field,
 * depending on the webhook's content type setting.
 */
export function pushedRef(
  payload: string,
  contentType: string | null,
): string | null {
  let raw = payload;
  if (
    contentType?.toLowerCase().startsWith("application/x-www-form-urlencoded")
  ) {
    raw = new URLSearchParams(payload).get("payload") ?? "";
  }
  try {
    const data: unknown = JSON.parse(raw);
    if (data && typeof data === "object" && "ref" in data) {
      const { ref } = data as { ref: unknown };
      return typeof ref === "string" ? ref : null;
    }
  } catch {
    // Signed but unreadable: treat it like a push we do not act on.
  }
  return null;
}

export const SKILLS_BRANCH_REF = `refs/heads/${SKILLS_BRANCH}`;
