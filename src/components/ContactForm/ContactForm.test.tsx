import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import en from "@/locales/en/work-with-me.json";
import { ContactForm } from "./ContactForm";

const { track, trackLead } = vi.hoisted(() => ({
  track: vi.fn(),
  trackLead: vi.fn(),
}));
vi.mock("@/lib/analytics", () => ({ track, trackLead }));

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  track.mockClear();
  trackLead.mockClear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

function renderFilledForm() {
  render(
    <NextIntlClientProvider locale="en" messages={{ workWithMe: en }}>
      <ContactForm />
    </NextIntlClientProvider>,
  );
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Private Name" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "private@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Company or project"), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByLabelText("Collaboration type"), {
    target: { value: "freelance" },
  });
  fireEvent.change(screen.getByLabelText("Context"), {
    target: { value: "Private context" },
  });
  return screen.getByRole("button", { name: "Send message" });
}

describe("ContactForm analytics", () => {
  it("reports generate_lead after the backend accepts the message", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    const button = renderFilledForm();
    await act(async () => fireEvent.submit(button));
    expect(trackLead).toHaveBeenCalledExactlyOnceWith("form_submit");
    expect(JSON.stringify(track.mock.calls)).not.toContain("private");
  });

  it("reports an error and no lead when sending fails", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    const button = renderFilledForm();
    await act(async () => fireEvent.submit(button));
    expect(trackLead).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith("contact_form_error", {
      location: "contact",
    });
  });
});
