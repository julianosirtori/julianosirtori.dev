import "server-only";
import { HttpError } from "./security";

export function newsletterRecipientAllowed(email: string) {
  const configured = process.env.NEWSLETTER_ALLOWED_EMAILS?.trim();
  if (!configured) return process.env.VERCEL_ENV !== "preview";
  const normalized = email.trim().toLowerCase();
  return configured
    .split(",")
    .some((allowed) => allowed.trim().toLowerCase() === normalized);
}

export function assertNewsletterRecipient(email: string) {
  if (!newsletterRecipientAllowed(email))
    throw new HttpError(403, "newsletter_test_recipient");
}

export function assertNewsletterConfigured() {
  const required = [
    "RESEND_API_KEY",
    "NEWSLETTER_SECRET",
    "RESEND_SEGMENT_PT",
    "RESEND_SEGMENT_EN",
    ...(process.env.VERCEL_ENV === "preview"
      ? ["NEWSLETTER_ALLOWED_EMAILS"]
      : []),
  ];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    console.warn("[newsletter] configuration_missing", { variables: missing });
    throw new HttpError(503, "unavailable");
  }
  if (
    process.env.NEWSLETTER_SECRET!.length < 32 ||
    process.env.RESEND_SEGMENT_PT === process.env.RESEND_SEGMENT_EN
  ) {
    console.warn("[newsletter] configuration_invalid");
    throw new HttpError(503, "unavailable");
  }
}
