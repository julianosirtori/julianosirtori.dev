import { unsubscribe } from "@/lib/server/newsletter";
import {
  body,
  endpoint,
  HttpError,
  json,
  limit,
  requestKey,
  sameOrigin,
} from "@/lib/server/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return endpoint(async () => {
    sameOrigin(request);
    await limit(`unsubscribe:${requestKey(request)}`, 30, 60_000);
    const data = await body(request);
    if (
      typeof data.id !== "string" ||
      data.id.length > 40 ||
      typeof data.signature !== "string" ||
      data.signature.length > 100
    )
      throw new HttpError(400, "invalid");
    await unsubscribe(data.id, data.signature);
    return json({ unsubscribed: true });
  });
}
