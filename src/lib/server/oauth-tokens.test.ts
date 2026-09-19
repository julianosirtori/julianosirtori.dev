// @vitest-environment node
import { randomUUID } from "node:crypto";
import { beforeAll, beforeEach, expect, it } from "vitest";
import { symmetricDecrypt, symmetricEncrypt } from "better-auth/crypto";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "../db";
import { account, user } from "../db/schema";
import { encryptExistingOAuthTokens } from "./oauth-tokens";

const key = "synthetic-auth-secret-with-at-least-32-characters";
beforeAll(async () => {
  process.env.TURSO_DATABASE_URL = `file:/tmp/oauth-encryption-${randomUUID()}.db`;
  await migrate(getDb(), { migrationsFolder: "./drizzle" });
});
beforeEach(async () => {
  await getDb().delete(account);
  await getDb().delete(user);
  await getDb().insert(user).values({
    id: "user",
    name: "Test",
    email: "test@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});
async function seed(
  id: string,
  accessToken: string | null,
  refreshToken: string | null = null,
) {
  await getDb().insert(account).values({
    id,
    accountId: id,
    providerId: "github",
    userId: "user",
    accessToken,
    refreshToken,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
it("encrypts existing modern and legacy GitHub tokens and is idempotent", async () => {
  const access = "gho_synthetic_plaintext";
  const refresh = "ghr_synthetic_plaintext";
  const legacy = "a".repeat(40);
  await seed("modern", access, refresh);
  await seed("legacy", legacy);
  await seed("empty", null);
  expect(await encryptExistingOAuthTokens(getDb(), key)).toBe(2);
  const rows = await getDb().select().from(account);
  for (const row of rows.filter((row) => row.accessToken)) {
    expect(await symmetricDecrypt({ key, data: row.accessToken! })).toBe(
      row.id === "modern" ? access : legacy,
    );
  }
  const modern = rows.find((row) => row.id === "modern")!;
  expect(await symmetricDecrypt({ key, data: modern.refreshToken! })).toBe(
    refresh,
  );
  expect(JSON.stringify(rows)).not.toContain(access);
  expect(JSON.stringify(rows)).not.toContain(refresh);
  expect(await encryptExistingOAuthTokens(getDb(), key)).toBe(0);
  expect(await getDb().select().from(account)).toEqual(rows);
});
it("preserves valid versioned envelopes and legacy ciphertext with the original keys", async () => {
  const secretConfig = {
    currentVersion: 1,
    keys: new Map([[1, key]]),
    legacySecret: key,
  };
  await seed(
    "versioned",
    await symmetricEncrypt({ key: secretConfig, data: "gho_test" }),
  );
  await seed(
    "bare",
    await symmetricEncrypt({ key, data: "gho_legacy_encryption" }),
  );
  const before = await getDb().select().from(account);
  expect(await encryptExistingOAuthTokens(getDb(), secretConfig)).toBe(0);
  expect(await getDb().select().from(account)).toEqual(before);
});
it.each(["wrong-key", "damaged-ciphertext", "unrecognized-format"])(
  "rolls back the complete migration on %s",
  async (failure) => {
    await seed("plaintext", "gho_test");
    await seed(
      "encrypted",
      failure === "wrong-key"
        ? await symmetricEncrypt({
            key: "different-original-key",
            data: "gho_original",
          })
        : failure === "damaged-ciphertext"
          ? "$ba$1$damaged"
          : "not-a-recognized-token",
    );
    const before = await getDb().select().from(account);
    await expect(encryptExistingOAuthTokens(getDb(), key)).rejects.toThrow();
    expect(await getDb().select().from(account)).toEqual(before);
  },
);
