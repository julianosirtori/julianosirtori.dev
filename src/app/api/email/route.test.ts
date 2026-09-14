import { describe, expect, it } from "vitest";

import { validateContactPayload } from "@/app/api/email/route";

const validPayload = {
  name: "Juliano",
  email: "juliano@example.com",
  companyOrProject: "Projeto pessoal",
  collaborationType: "freelance",
  message: "Quero conversar sobre o contexto do projeto.",
};

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

import { vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
it("returns failure when Resend resolves with an error", async () => {
  send.mockResolvedValue({
    data: null,
    error: { message: "provider unavailable" },
  });
  const response = await POST(
    new NextRequest("http://localhost/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    }),
  );
  expect(response.status).toBe(500);
});
