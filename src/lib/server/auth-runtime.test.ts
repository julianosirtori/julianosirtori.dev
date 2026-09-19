// @vitest-environment node
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "../db";
import { getAuth } from "./auth";
import { symmetricDecrypt } from "better-auth/crypto";
import { account } from "../db/schema";
import { eq } from "drizzle-orm";
vi.mock("server-only", () => ({}));
beforeAll(async () => {
  process.env.TURSO_DATABASE_URL = `file:/tmp/auth-runtime-${randomUUID()}.db`;
  process.env.BETTER_AUTH_URL = "http://localhost:3000";
  process.env.GITHUB_CLIENT_ID = "test-client";
  process.env.GITHUB_CLIENT_SECRET = "test-secret";
  process.env.BETTER_AUTH_SECRET =
    "test-auth-secret-with-at-least-thirty-two-characters";
  await migrate(getDb(), { migrationsFolder: "./drizzle" });
});
afterEach(() => vi.restoreAllMocks());
it("validates real Better Auth schema and starts GitHub OAuth without contacting GitHub", async () => {
  const response = await getAuth().handler(
    new Request("http://localhost:3000/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        provider: "github",
        callbackURL: "/pt/guestbook",
      }),
    }),
  );
  expect(response.status).toBe(200);
  const result = await response.json();
  const url = new URL(result.url);
  expect(url.origin).toBe("https://github.com");
  expect(url.searchParams.get("redirect_uri")).toBe(
    "http://localhost:3000/api/auth/callback/github",
  );
  expect(response.headers.get("set-cookie")).toBeTruthy();
});
it("completes OAuth with encrypted tokens and keeps them out of the session response", async () => {
  const auth = getAuth();
  const context = await auth.$context;
  const provider = context.socialProviders[0];
  const accessToken = "gho_synthetic_access_token";
  const refreshToken = "ghr_synthetic_refresh_token";
  // Only the provider exchange is mocked; state, callback, adapter and cookies are real.
  vi.spyOn(provider, "validateAuthorizationCode").mockResolvedValue({
    accessToken,
    refreshToken,
    scopes: ["read:user"],
  });
  vi.spyOn(provider, "getUserInfo").mockResolvedValue({
    user: {
      name: "Test User",
      email: "oauth@example.com",
      emailVerified: true,
    },
    data: { id: 123456, login: "test-user" },
  });
  const start = await auth.handler(
    new Request("http://localhost:3000/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        provider: "github",
        callbackURL: "/pt/guestbook",
      }),
    }),
  );
  const authorization = new URL((await start.json()).url);
  const cookie = start.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  const callback = await auth.handler(
    new Request(
      `http://localhost:3000/api/auth/callback/github?code=test-code&state=${authorization.searchParams.get("state")}`,
      { headers: { Cookie: cookie } },
    ),
  );
  expect(callback.status).toBe(302);
  expect(callback.headers.get("location")).toBe("/pt/guestbook");
  const [stored] = await getDb().select().from(account);
  expect(stored.accessToken).not.toBe(accessToken);
  expect(stored.refreshToken).not.toBe(refreshToken);
  expect(
    await symmetricDecrypt({
      key: context.secretConfig,
      data: stored.accessToken!,
    }),
  ).toBe(accessToken);
  expect(
    await symmetricDecrypt({
      key: context.secretConfig,
      data: stored.refreshToken!,
    }),
  ).toBe(refreshToken);
  const session = await auth.handler(
    new Request("http://localhost:3000/api/auth/get-session", {
      headers: {
        Cookie: callback.headers
          .getSetCookie()
          .map((value) => value.split(";")[0])
          .join("; "),
      },
    }),
  );
  const result = await session.json();
  expect(result.user.email).toBe("oauth@example.com");
  expect(JSON.stringify(result)).not.toContain(accessToken);
  expect(JSON.stringify(result)).not.toContain(refreshToken);
  expect(JSON.stringify(result)).not.toContain(stored.accessToken);
});

it("completes GitHub login when neither the profile nor the email API supplies an address", async () => {
  const auth = getAuth();
  const provider = (await auth.$context).socialProviders[0];
  vi.spyOn(provider, "validateAuthorizationCode").mockResolvedValue({
    accessToken: "ghu_synthetic_private_email_token",
    scopes: [],
  });
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = input instanceof Request ? input.url : input.toString();
    if (url === "https://api.github.com/user") {
      return Response.json({
        id: 234567,
        login: "private-email-user",
        name: "Private Email User",
        email: null,
        avatar_url: "https://avatars.githubusercontent.com/u/234567",
      });
    }
    if (url === "https://api.github.com/user/emails") {
      return Response.json(
        { message: "Resource not accessible by integration" },
        { status: 403 },
      );
    }
    throw new Error("Unexpected provider request");
  });

  const start = await auth.handler(
    new Request("http://localhost:3000/api/auth/sign-in/social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        provider: "github",
        callbackURL: "/pt/guestbook",
      }),
    }),
  );
  const authorization = new URL((await start.json()).url);
  const callback = await auth.handler(
    new Request(
      `http://localhost:3000/api/auth/callback/github?code=test-private-email&state=${authorization.searchParams.get("state")}`,
      {
        headers: {
          Cookie: start.headers
            .getSetCookie()
            .map((value) => value.split(";")[0])
            .join("; "),
        },
      },
    ),
  );
  expect(callback.status).toBe(302);
  expect(callback.headers.get("location")).toBe("/pt/guestbook");
  const session = await auth.api.getSession({
    headers: new Headers({
      Cookie: callback.headers
        .getSetCookie()
        .map((value) => value.split(";")[0])
        .join("; "),
    }),
  });
  expect(session?.user).toMatchObject({
    name: "Private Email User",
    email: "234567@github.placeholder.invalid",
    emailVerified: false,
  });
  const [stored] = await getDb()
    .select()
    .from(account)
    .where(eq(account.accountId, "234567"));
  expect(stored.userId).toBe(session?.user.id);
  expect(stored.providerId).toBe("github");
});

it("preserves the private verified address returned by the GitHub email API", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = input instanceof Request ? input.url : input.toString();
    if (url === "https://api.github.com/user") {
      return Response.json({
        id: 345678,
        login: "verified-email-user",
        name: "Verified Email User",
        email: null,
      });
    }
    if (url === "https://api.github.com/user/emails") {
      return Response.json([
        { email: "verified@example.com", primary: true, verified: true },
      ]);
    }
    throw new Error("Unexpected provider request");
  });
  const provider = (await getAuth().$context).socialProviders[0];
  const info = await provider.getUserInfo({
    accessToken: "ghu_synthetic_verified_email_token",
  });
  expect(info?.user).toMatchObject({
    email: "verified@example.com",
    emailVerified: true,
  });
});
