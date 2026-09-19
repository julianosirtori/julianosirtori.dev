import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { reactionTypes, type ReactionType } from "@/lib/reactions";
import { isPublishedSlug } from "@/lib/server/posts";
import { readReactions, putReaction } from "@/lib/server/reactions";
import {
  body,
  endpoint,
  HttpError,
  json,
  limit,
  requestKey,
  sameOrigin,
} from "@/lib/server/security";
const COOKIE = "site_reaction_visitor";
async function visitor() {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  if (value && /^[0-9a-f-]{36}$/.test(value)) return value;
  const id = randomUUID();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 31_536_000,
  });
  return id;
}
type Context = { params: Promise<{ slug: string }> };
export async function GET(_request: Request, { params }: Context) {
  return endpoint(async () => {
    const { slug } = await params;
    if (!isPublishedSlug(slug)) throw new HttpError(404, "not_found");
    return json(await readReactions(slug, await visitor()));
  });
}
export async function PUT(request: Request, { params }: Context) {
  return endpoint(async () => {
    sameOrigin(request);
    const { slug } = await params;
    const data = await body(request);
    if (!isPublishedSlug(slug)) throw new HttpError(404, "not_found");
    if (
      !reactionTypes.includes(data.type as ReactionType) ||
      typeof data.active !== "boolean"
    )
      throw new HttpError(400, "invalid");
    await limit(`reactions:${requestKey(request)}`, 120, 60_000);
    const id = await visitor();
    await putReaction(slug, id, data.type as ReactionType, data.active);
    return json(await readReactions(slug, id));
  });
}
