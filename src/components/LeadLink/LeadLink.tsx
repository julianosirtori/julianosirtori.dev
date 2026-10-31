"use client";

import type { ReactNode } from "react";

import { trackLead, type LeadAction } from "@/lib/analytics";

export interface LeadLinkProps {
  href: string;
  action: Exclude<LeadAction, "form_submit">;
  className?: string;
  external?: boolean;
  children: ReactNode;
}

/** Direct contact CTA that reports `generate_lead` with its channel on click. */
export function LeadLink({
  href,
  action,
  className,
  external = false,
  children,
}: LeadLinkProps) {
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => trackLead(action)}
    >
      {children}
    </a>
  );
}
