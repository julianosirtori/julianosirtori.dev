import { identity } from "@/lib/server/auth";
import { moderate, type GuestbookStatus } from "@/lib/server/guestbook";
import {
  body,
  endpoint,
  HttpError,
  json,
  sameOrigin,
} from "@/lib/server/security";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return endpoint(async () => {
    sameOrigin(request);
    const { user } = await identity(request.headers, true);
    const data = await body(request);
    if (!["pending", "approved", "rejected"].includes(String(data.status)))
      throw new HttpError(400, "invalid");
    await moderate((await params).id, data.status as GuestbookStatus, user.id);
    return json({ updated: true });
  });
}
