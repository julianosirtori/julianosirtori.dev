// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDb } from "@/lib/db";
import { limits } from "@/lib/db/schema";
import { POST, validateContactPayload } from "./route";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
const validPayload = {
  name: "Juliano",
  email: "juliano@example.com",
  companyOrProject: "Projeto pessoal",
  collaborationType: "freelance",
  message: "Quero conversar sobre o contexto do projeto.",
};
function request(
  payload: unknown = validPayload,
  headers: Record<string, string> = {},
) {
  return new Request("http://localhost:3000/api/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Origin: "http://localhost:3000",
      "x-vercel-forwarded-for": "192.0.2.1",
      ...headers,
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}
beforeAll(async () => {
  vi.stubEnv("TURSO_DATABASE_URL", `file:/tmp/contact-${randomUUID()}.db`);
  await migrate(getDb(), { migrationsFolder: "./drizzle" });
});
beforeEach(async () => {
  vi.restoreAllMocks();
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  vi.stubEnv("VERCEL", "1");
  vi.stubEnv("CONTACT_DAILY_LIMIT", "20");
  vi.stubEnv("CONTACT_MONTHLY_LIMIT", "600");
  await getDb().delete(limits);
  send
    .mockReset()
    .mockResolvedValue({ data: { id: "test-email" }, error: null });
});
describe("validateContactPayload", () => {
  it("accepts a complete collaboration request", () => {
    expect(validateContactPayload(validPayload)).toEqual(validPayload);
  });
  it("rejects missing collaboration context", () => {
    expect(
      validateContactPayload({ ...validPayload, companyOrProject: "" }),
    ).toBeNull();
  });
  it("rejects an unknown collaboration type", () => {
    expect(
      validateContactPayload({
        ...validPayload,
        collaborationType: "anything",
      }),
    ).toBeNull();
  });
});
describe("contact endpoint protection", () => {
  it.each([
    [
      "foreign origin",
      validPayload,
      { Origin: "https://attacker.example" },
      403,
    ],
    ["missing origin", validPayload, { Origin: "" }, 403],
    ["plain text", validPayload, { "Content-Type": "text/plain" }, 415],
    [
      "invalid JSON media type",
      validPayload,
      { "Content-Type": "application/jsonp" },
      415,
    ],
    ["malformed JSON", "{", {}, 400],
    ["invalid payload", { ...validPayload, message: "" }, {}, 400],
    ["oversized body", "a".repeat(32769), { "Content-Length": "1" }, 413],
  ])(
    "rejects %s without sending email",
    async (_label, payload, headers, status) => {
      const response = await POST(
        request(payload, headers as Record<string, string>),
      );
      expect(response.status).toBe(status);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(send).not.toHaveBeenCalled();
    },
  );
  it("accepts the maximum Unicode message and keeps the recipient fixed", async () => {
    const response = await POST(
      request({ ...validPayload, message: "漢".repeat(5000) }),
    );
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "julianosirtori@gmail.com",
        replyTo: validPayload.email,
      }),
    );
  });
  it("allows only three concurrent sends per trusted IP despite spoofed forwarding headers", async () => {
    const responses = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        POST(
          request(
            { ...validPayload, email: `reader${i}@example.com` },
            {
              "x-forwarded-for": `192.0.2.${i + 10}`,
              "x-real-ip": `192.0.2.${i + 10}`,
            },
          ),
        ),
      ),
    );
    expect(responses.filter((r) => r.status === 200)).toHaveLength(3);
    expect(responses.filter((r) => r.status === 429)).toHaveLength(7);
    expect(send).toHaveBeenCalledTimes(3);
  });
  it("limits a normalized email across different IPs", async () => {
    for (let i = 0; i < 4; i++) {
      const response = await POST(
        request(
          {
            ...validPayload,
            email: i % 2 ? "JULIANO@example.com" : validPayload.email,
          },
          { "x-vercel-forwarded-for": `192.0.2.${i + 1}` },
        ),
      );
      expect(response.status).toBe(i < 3 ? 200 : 429);
    }
    expect(send).toHaveBeenCalledTimes(3);
  });
  it.each(["CONTACT_DAILY_LIMIT", "CONTACT_MONTHLY_LIMIT"])(
    "enforces the global %s across distinct senders",
    async (quota) => {
      vi.stubEnv(quota, "2");
      for (let i = 0; i < 3; i++) {
        const response = await POST(
          request(
            { ...validPayload, email: `reader${i}@example.com` },
            { "x-vercel-forwarded-for": `192.0.2.${i + 1}` },
          ),
        );
        expect(response.status).toBe(i < 2 ? 200 : 429);
      }
      expect(send).toHaveBeenCalledTimes(2);
    },
  );
  it("does not send when persistent rate limiting is unavailable", async () => {
    vi.spyOn(getDb(), "insert").mockImplementationOnce(() => {
      throw new Error("private database error");
    });
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "unavailable" });
    expect(send).not.toHaveBeenCalled();
  });
  it("returns a generic failure when Resend resolves with an error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockResolvedValue({
      data: null,
      error: { message: "private provider error" },
    });
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: "Failed to send email" });
  });
});
