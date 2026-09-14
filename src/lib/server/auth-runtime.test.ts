// @vitest-environment node
import { beforeAll, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "../db";
import { getAuth } from "./auth";
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
