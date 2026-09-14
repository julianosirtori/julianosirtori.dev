import { confirm } from "@/lib/server/newsletter";
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
    await limit(`confirm:${requestKey(request)}`, 30, 60_000);
    const data = await body(request);
    if (
      typeof data.token !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(data.token)
    )
      throw new HttpError(410, "expired");
    return json(await confirm(data.token));
  });
}
