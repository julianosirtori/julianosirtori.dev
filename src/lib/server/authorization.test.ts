// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "../db";
import { account, user } from "../db/schema";
import { identity } from "./auth";
const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("better-auth", () => ({ betterAuth: () => ({ api: { getSession } }) }));
beforeAll(async () => {
  process.env.TURSO_DATABASE_URL = `file:/tmp/auth-test-${randomUUID()}.db`;
  process.env.GITHUB_CLIENT_ID = "test";
  process.env.GITHUB_CLIENT_SECRET = "test";
  process.env.BETTER_AUTH_SECRET =
    "test-secret-with-more-than-thirty-two-characters";
  process.env.ADMIN_GITHUB_ID = "123";
  await migrate(getDb(), { migrationsFolder: "./drizzle" });
  await getDb().insert(user).values({
    id: "owner",
    name: "Owner",
    email: "owner@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await getDb().insert(user).values({
    id: "visitor",
    name: "Owner",
    email: "visitor@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await getDb().insert(account).values({
    id: "a",
    userId: "owner",
    accountId: "123",
    providerId: "github",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await getDb().insert(account).values({
    id: "b",
    userId: "visitor",
    accountId: "456",
    providerId: "github",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});
beforeEach(() => getSession.mockReset());
describe("server administrator identity", () => {
  it("rejects anonymous requests", async () => {
    getSession.mockResolvedValue(null);
    await expect(identity(new Headers(), true)).rejects.toMatchObject({
      status: 401,
    });
  });
  it("uses numeric GitHub ID, never the display name", async () => {
    getSession.mockResolvedValue({ user: { id: "visitor", name: "Owner" } });
    await expect(identity(new Headers(), true)).rejects.toMatchObject({
      status: 403,
    });
  });
  it("allows only configured GitHub owner", async () => {
    getSession.mockResolvedValue({ user: { id: "owner" } });
    expect((await identity(new Headers(), true)).githubId).toBe("123");
  });
  it("does not authorize admin when configuration is missing", async () => {
    getSession.mockResolvedValue({ user: { id: "owner" } });
    delete process.env.ADMIN_GITHUB_ID;
    await expect(identity(new Headers(), true)).rejects.toMatchObject({
      status: 403,
    });
    process.env.ADMIN_GITHUB_ID = "123";
  });
});
