import { identity } from "@/lib/server/auth";
import { endpoint, json } from "@/lib/server/security";
export async function GET(request: Request) {
  return endpoint(async () => {
    const { user } = await identity(request.headers);
    return json({ name: user.name });
  });
}
