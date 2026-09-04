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
