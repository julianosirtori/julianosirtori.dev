/** Only editorial identifiers and bounded metrics belong here; never form values. */
export const eventNames = [
  "page_view",
  "navigation_click",
  "cta_click",
  "project_click",
  "social_click",
  "cv_download_click",
  "article_view",
  "article_read_progress",
  "article_read_complete",
  "comments_open",
  "blog_search",
  "blog_filter_change",
  "command_palette_open",
  "command_palette_select",
  "newsletter_form_view",
  "newsletter_submit",
  "newsletter_confirmed",
  "newsletter_error",
  "guestbook_login_start",
  "guestbook_login_success",
  "guestbook_submit",
  "guestbook_error",
  "reaction_change",
  "playground_command",
  "playground_game_start",
  "contact_form_start",
  "generate_lead",
  "contact_form_error",
  "theme_change",
  "language_change",
] as const;
export type AnalyticsEvent = (typeof eventNames)[number];
type Params = {
  location?:
    | "header"
    | "footer"
    | "article"
    | "newsletter"
    | "guestbook"
    | "command"
    | "playground"
    | "contact"
    | "content";
  content_id?: string;
  action_id?: string;
  result?: "success" | "error" | "unknown";
  progress?: 25 | 50 | 75 | 100;
  result_count?: number;
  theme?: "light" | "dark" | "system";
  target_language?: "pt" | "en";
  active?: boolean;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function safePath(value: string): string {
  const path = value.split(/[?#]/)[0];
  return /^\/(pt|en)(\/[a-zA-Z0-9_/-]*)?$/.test(path) ? path : "/";
}
export function excludedPath(path: string) {
  return /\/(admin|api|auth)(\/|$)/.test(path);
}
const allowed = new Set([
  "location",
  "content_id",
  "action_id",
  "result",
  "progress",
  "result_count",
  "theme",
  "target_language",
  "active",
]);
export function sanitizeParams(
  params: Params,
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!allowed.has(key)) continue;
    if (typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value))
      result[key] = value;
    else if (typeof value === "number" && Number.isFinite(value) && value >= 0)
      result[key] = Math.min(1000000, Math.floor(value));
    else if (typeof value === "boolean") result[key] = value;
  }
  return result;
}
export function track(event: AnalyticsEvent, params: Params = {}) {
  if (
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true"
  )
    return;
  if (!eventNames.includes(event) || excludedPath(window.location.pathname))
    return;
  const route = safePath(window.location.pathname);
  try {
    window.gtag?.("event", event, {
      ...sanitizeParams(params),
      language: route.split("/")[1] === "pt" ? "pt" : "en",
      route,
      page_location: `${window.location.origin}${route}`,
      page_referrer: document.referrer
        ? new URL(document.referrer).origin +
          safePath(new URL(document.referrer).pathname)
        : "",
      ...(event === "page_view" ? { page_title: route } : {}),
    });
  } catch {
    /* Analytics must never affect a user action. */
  }
}
