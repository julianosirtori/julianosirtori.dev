// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }));
vi.mock("next/cache", () => ({
  revalidateTag,
  unstable_cache: <T>(fn: T) => fn,
}));

import { POST } from "./route";
import { verifyGithubSignature } from "@/lib/skills/webhook";

const SECRET = "test-webhook-secret";

function sign(body: string, secret = SECRET) {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

function delivery({
  event = "push",
  body = JSON.stringify({ ref: "refs/heads/main" }),
  signature = sign(body),
  contentType = "application/json",
}: {
  event?: string;
  body?: string;
  signature?: string | null;
  contentType?: string;
} = {}) {
  const headers: Record<string, string> = {
    "content-type": contentType,
    "x-github-event": event,
  };
  if (signature) headers["x-hub-signature-256"] = signature;
  return new Request("http://localhost/api/webhooks/skills", {
    method: "POST",
    headers,
    body,
  });
}

beforeEach(() => {
  revalidateTag.mockClear();
  vi.stubEnv("SKILLS_WEBHOOK_SECRET", SECRET);
});

afterEach(() => vi.unstubAllEnvs());

describe("verifyGithubSignature", () => {
  const body = '{"zen":"Keep it logically awesome."}';

  it("accepts the HMAC SHA-256 of the raw body", () => {
    expect(verifyGithubSignature(SECRET, body, sign(body))).toBe(true);
  });

  it.each([
    ["no header", null],
    ["no prefix", sign(body).replace("sha256=", "")],
    ["sha1 header", `sha1=${"a".repeat(40)}`],
    ["wrong secret", sign(body, "other")],
    ["short digest", "sha256=abcd"],
    ["non-hex digest", `sha256=${"z".repeat(64)}`],
  ])("rejects %s", (_, header) => {
    expect(verifyGithubSignature(SECRET, body, header)).toBe(false);
  });

  it("rejects a body changed after signing", () => {
    expect(verifyGithubSignature(SECRET, `${body} `, sign(body))).toBe(false);
  });
});

describe("POST /api/webhooks/skills", () => {
  it("revalidates the catalog on a signed push to main", async () => {
    const response = await POST(delivery());
    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("skills-catalog", "max");
  });

  it("accepts form-encoded deliveries", async () => {
    const body = new URLSearchParams({
      payload: JSON.stringify({ ref: "refs/heads/main" }),
    }).toString();
    const response = await POST(
      delivery({ body, contentType: "application/x-www-form-urlencoded" }),
    );
    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledOnce();
  });

  it("answers 401 without a signature and invalidates nothing", async () => {
    expect((await POST(delivery({ signature: null }))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("answers 401 for a forged signature", async () => {
    const response = await POST(delivery({ signature: sign("other body") }));
    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("answers GitHub's ping", async () => {
    const body = JSON.stringify({ zen: "Design for failure.", hook_id: 1 });
    const response = await POST(delivery({ event: "ping", body }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ event: "ping" });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("ignores pushes to other branches", async () => {
    const body = JSON.stringify({ ref: "refs/heads/feature" });
    const response = await POST(delivery({ body }));
    expect(response.status).toBe(200);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("ignores other events", async () => {
    const response = await POST(delivery({ event: "issues" }));
    expect(response.status).toBe(200);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("is unavailable when the secret is not configured", async () => {
    vi.stubEnv("SKILLS_WEBHOOK_SECRET", "");
    expect((await POST(delivery())).status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
