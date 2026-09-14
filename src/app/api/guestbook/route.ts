import { identity } from "@/lib/server/auth";
import { addEntry, listEntries } from "@/lib/server/guestbook";
import {
  body,
  endpoint,
  HttpError,
  json,
  limit,
  sameOrigin,
} from "@/lib/server/security";
export const runtime = "nodejs";
export async function GET() {
  return endpoint(async () => json({ entries: await listEntries() }));
}
export async function POST(request: Request) {
  return endpoint(async () => {
    sameOrigin(request);
    const { user } = await identity(request.headers);
    const data = await body(request);
    if (typeof data.message !== "string") throw new HttpError(400, "invalid");
    await limit(`guestbook:${user.id}`, 3, 3_600_000);
    await addEntry(user.id, data.message);
    return json({ pending: true });
  });
}
