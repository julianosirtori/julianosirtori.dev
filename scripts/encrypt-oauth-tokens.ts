import "./env";
import { getDb } from "../src/lib/db";
import { getAuth } from "../src/lib/server/auth";
import { encryptExistingOAuthTokens } from "../src/lib/server/oauth-tokens";

async function main() {
  const { secretConfig } = await getAuth().$context;
  const updated = await encryptExistingOAuthTokens(getDb(), secretConfig);
  console.info({ encryptedAccounts: updated });
}
main().catch(() => {
  console.error(
    "Token encryption failed. Check the database and original auth secret.",
  );
  process.exitCode = 1;
});
