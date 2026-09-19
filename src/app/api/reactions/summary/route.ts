import { publishedSlugs } from "@/lib/server/posts";
import { reactionSummary } from "@/lib/server/reactions";
import { endpoint, json } from "@/lib/server/security";
export async function GET() {
  return endpoint(async () => json(await reactionSummary(publishedSlugs)));
}
