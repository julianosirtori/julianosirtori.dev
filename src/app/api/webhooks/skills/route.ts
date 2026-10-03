import { revalidateTag } from "next/cache";

import { SKILLS_CACHE_TAG } from "@/lib/skills/catalog";
import {
  SKILLS_BRANCH_REF,
  pushedRef,
  verifyGithubSignature,
} from "@/lib/skills/webhook";
import { boundedText, endpoint, HttpError, json } from "@/lib/server/security";

export const runtime = "nodejs";

// GitHub caps webhook payloads at 25 MB; push events for this repo are tiny.
const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024;

/**
 * GitHub webhook for julianosirtori/skills (event: push). A signed push to
 * main marks the catalog stale; the next visit serves the cached copy while it
 * refreshes in the background, and a failed refresh keeps the last good one.
 */
export async function POST(request: Request) {
  return endpoint(async () => {
    const secret = process.env.SKILLS_WEBHOOK_SECRET;
    if (!secret) throw new Error("Webhook unavailable");

    const payload = await boundedText(request, MAX_PAYLOAD_BYTES);
    if (
      !verifyGithubSignature(
        secret,
        payload,
        request.headers.get("x-hub-signature-256"),
      )
    ) {
      throw new HttpError(401, "signature");
    }

    const event = request.headers.get("x-github-event");
    if (event === "ping") return json({ received: true, event: "ping" });
    if (event !== "push") return json({ received: true, ignored: "event" });

    const ref = pushedRef(payload, request.headers.get("content-type"));
    if (ref !== SKILLS_BRANCH_REF) {
      return json({ received: true, ignored: "branch" });
    }

    revalidateTag(SKILLS_CACHE_TAG, "max");
    return json({ received: true, revalidated: true });
  });
}
