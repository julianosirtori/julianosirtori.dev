import { subscribe } from "@/lib/server/newsletter";
import {
  body,
  endpoint,
  HttpError,
  json,
  limit,
  requestKey,
  sameOrigin,
  hash,
} from "@/lib/server/security";
import { isPublishedSlug } from "@/lib/server/posts";
import {
  assertNewsletterConfigured,
  assertNewsletterRecipient,
} from "@/lib/server/newsletter-policy";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return endpoint(async () => {
    sameOrigin(request);
    const data = await body(request);
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof data.language !== "string" ||
      !["pt", "en"].includes(data.language) ||
      typeof data.source !== "string" ||
      !["footer", "article", "newsletter"].includes(data.source) ||
      (data.article != null && !isPublishedSlug(data.article))
    )
      throw new HttpError(400, "invalid");
    assertNewsletterConfigured();
    assertNewsletterRecipient(email);
    await limit(`subscribe:ip:${requestKey(request)}`, 10, 3_600_000);
    await limit(`subscribe:email:${hash(email)}`, 3, 3_600_000);
    await subscribe(
      email,
      data.language as "pt" | "en",
      String(data.source),
      (data.article as string) || null,
    );
    return json({ pending: true });
  });
}
