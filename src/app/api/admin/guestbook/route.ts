import { identity } from "@/lib/server/auth";
import { listEntries, type GuestbookStatus } from "@/lib/server/guestbook";
import { endpoint, HttpError, json } from "@/lib/server/security";
export async function GET(request: Request) {
  return endpoint(async () => {
    await identity(request.headers, true);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "pending";
    if (!["pending", "approved", "rejected"].includes(status))
      throw new HttpError(400, "invalid");
    const cursor = url.searchParams.get("before");
    if (cursor && !/^\d{13}:[0-9a-f-]{36}$/.test(cursor))
      throw new HttpError(400, "invalid");
    const before = cursor
      ? { createdAt: Number(cursor.split(":")[0]), id: cursor.split(":")[1] }
      : undefined;
    return json({
      entries: await listEntries(status as GuestbookStatus, before),
    });
  });
}
