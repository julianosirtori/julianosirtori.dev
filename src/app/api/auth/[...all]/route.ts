import { getAuth } from "@/lib/server/auth";
import { endpoint } from "@/lib/server/security";
export const runtime = "nodejs";
const handler = (request: Request) =>
  endpoint(() => getAuth().handler(request));
export { handler as GET, handler as POST };
