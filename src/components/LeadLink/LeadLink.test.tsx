import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

import { LeadLink } from "./LeadLink";

const { trackLead } = vi.hoisted(() => ({ trackLead: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackLead }));

beforeEach(() => trackLead.mockClear());

it("reports a lead with the channel when the email CTA is clicked", () => {
  render(
    <LeadLink href="mailto:someone@example.com" action="email">
      Email
    </LeadLink>,
  );
  const link = screen.getByRole("link", { name: "Email" });
  expect(link.getAttribute("target")).toBeNull();
  fireEvent.click(link);
  expect(trackLead).toHaveBeenCalledExactlyOnceWith("email");
});

it("opens external CTAs in a new tab and reports them", () => {
  render(
    <LeadLink
      href="https://www.linkedin.com/in/juliano-sirtori/"
      action="linkedin"
      external
    >
      LinkedIn
    </LeadLink>,
  );
  const link = screen.getByRole("link", { name: "LinkedIn" });
  expect(link.getAttribute("target")).toBe("_blank");
  expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  fireEvent.click(link);
  expect(trackLead).toHaveBeenCalledExactlyOnceWith("linkedin");
});
