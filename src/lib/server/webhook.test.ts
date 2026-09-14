// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/webhooks/resend/route";
import { createHmac } from "node:crypto";
const { syncUnsubscribe } = vi.hoisted(() => ({ syncUnsubscribe: vi.fn() }));
vi.mock("./newsletter", () => ({ syncUnsubscribe }));
describe("signed Resend webhook", () => {
  const key = Buffer.from("test-secret-with-32-characters!!!");
  process.env.RESEND_API_KEY = "re_test";
  process.env.RESEND_WEBHOOK_SECRET = `whsec_${key.toString("base64")}`;
  function request(valid: boolean) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const id = "msg_test";
    const payload = JSON.stringify({
      type: "contact.updated",
      created_at: new Date().toISOString(),
      data: { email: "reader@example.com", unsubscribed: true },
    });
    const signature = createHmac("sha256", key)
      .update(`${id}.${timestamp}.${payload}`)
      .digest("base64");
    return new Request("http://localhost/api/webhooks/resend", {
      method: "POST",
      headers: {
        "svix-id": id,
        "svix-timestamp": timestamp,
        "svix-signature": valid ? `v1,${signature}` : "invalid",
      },
      body: payload,
    });
  }
  it("rejects forged signature and syncs a valid cancellation", async () => {
    expect((await POST(request(false))).status).toBe(400);
    expect(syncUnsubscribe).not.toHaveBeenCalled();
    expect((await POST(request(true))).status).toBe(200);
    expect(syncUnsubscribe).toHaveBeenCalledWith(
      "reader@example.com",
      expect.any(Number),
    );
  });
});
