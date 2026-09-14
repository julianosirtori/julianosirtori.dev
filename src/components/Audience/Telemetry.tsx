"use client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { excludedPath, safePath } from "@/lib/analytics";
function sanitize<T extends { url: string }>(event: T): T | null {
  const url = new URL(event.url);
  if (
    excludedPath(url.pathname) ||
    /\/newsletter\/(confirm|unsubscribe)/.test(url.pathname)
  )
    return null;
  return { ...event, url: url.origin + safePath(url.pathname) };
}
export function Telemetry() {
  return (
    <>
      <Analytics beforeSend={sanitize} />
      <SpeedInsights beforeSend={sanitize} />
    </>
  );
}
