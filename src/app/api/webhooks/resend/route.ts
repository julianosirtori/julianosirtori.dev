import { resendClient } from "@/lib/server/newsletter-provider";
import { syncUnsubscribe } from "@/lib/server/newsletter";
import { endpoint, HttpError, json } from "@/lib/server/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return endpoint(async () => {
    if (!process.env.RESEND_WEBHOOK_SECRET)
      throw new Error("Webhook unavailable");
    const payload = await request.text();
    if (payload.length > 65536) throw new HttpError(413, "too_large");
    let event;
    try {
      event = resendClient().webhooks.verify({
        payload,
        headers: {
          id: request.headers.get("svix-id") || "",
          timestamp: request.headers.get("svix-timestamp") || "",
          signature: request.headers.get("svix-signature") || "",
        },
        webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
      });
    } catch {
      throw new HttpError(400, "signature");
    }
    if (
      (event.type === "contact.updated" && event.data.unsubscribed) ||
      event.type === "contact.deleted"
    ) {
      const date = Date.parse(event.created_at);
      if (!Number.isFinite(date)) throw new HttpError(400, "invalid");
      await syncUnsubscribe(event.data.email, date);
    }
    return json({ received: true });
  });
}
