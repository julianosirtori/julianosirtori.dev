import "server-only";
import {
  symmetricDecrypt,
  symmetricEncrypt,
  type SecretConfig,
} from "better-auth/crypto";
import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { account } from "../db/schema";

/** Protect tokens saved before encryptOAuthTokens was enabled. Never log tokens. */
export async function encryptExistingOAuthTokens(
  db: Database,
  key: string | SecretConfig,
) {
  return db.transaction(async (tx) => {
    const accounts = await tx
      .select()
      .from(account)
      .where(eq(account.providerId, "github"));
    let updated = 0;
    for (const row of accounts) {
      const changes: Partial<typeof account.$inferInsert> = {};
      for (const field of ["accessToken", "refreshToken"] as const) {
        const value = row[field];
        if (!value) continue;
        // Better Auth supports versioned envelopes and legacy bare-hex ciphertext.
        // Old GitHub tokens can be 40 hex characters; ciphertext includes a
        // 24-byte nonce and 16-byte authentication tag, so cannot be that short.
        if (
          value.startsWith("$ba$") ||
          (value.length >= 80 && /^(?:[0-9a-f]{2})+$/i.test(value))
        ) {
          // Abort on an incorrect key or damaged ciphertext instead of double-encrypting.
          await symmetricDecrypt({ key, data: value });
          continue;
        }
        if (
          !/^gh[opusr]_[A-Za-z0-9_]+$/.test(value) &&
          !/^[0-9a-f]{40}$/i.test(value)
        ) {
          throw new Error("Unrecognized GitHub token format");
        }
        changes[field] = await symmetricEncrypt({ key, data: value });
      }
      if (Object.keys(changes).length) {
        await tx.update(account).set(changes).where(eq(account.id, row.id));
        updated++;
      }
    }
    return updated;
  });
}
