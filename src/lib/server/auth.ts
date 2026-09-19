import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import * as schema from "../db/schema";
import { HttpError, siteUrl } from "./security";
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (instance ??= createAuth());
}
function createAuth() {
  if (
    !process.env.GITHUB_CLIENT_ID ||
    !process.env.GITHUB_CLIENT_SECRET ||
    !process.env.BETTER_AUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET.length < 32
  )
    throw new Error("Authentication unavailable");
  return betterAuth({
    baseURL: siteUrl(),
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "sqlite", schema }),
    user: {
      additionalFields: {
        githubUsername: { type: "string", required: false, input: false },
      },
    },
    socialProviders: {
      github: {
        mapProfileToUser: (profile) => ({
          githubUsername: profile.login,
          // GitHub identity is sufficient for the guestbook; this is not a contact address.
          ...(!profile.email && {
            email: `${profile.id}@github.placeholder.invalid`,
            emailVerified: false,
          }),
        }),
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      },
    },
    account: {
      encryptOAuthTokens: true,
      accountLinking: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      modelName: "authRateLimit",
    },
  });
}
export async function identity(headers: Headers, admin = false) {
  const session = await getAuth().api.getSession({ headers });
  if (!session) throw new HttpError(401, "unauthorized");
  const [github] = await getDb()
    .select()
    .from(schema.account)
    .where(
      and(
        eq(schema.account.userId, session.user.id),
        eq(schema.account.providerId, "github"),
      ),
    );
  if (!github) throw new HttpError(403, "github_required");
  if (
    admin &&
    (!process.env.ADMIN_GITHUB_ID ||
      github.accountId !== process.env.ADMIN_GITHUB_ID)
  )
    throw new HttpError(403, "forbidden");
  return { user: session.user, githubId: github.accountId };
}
