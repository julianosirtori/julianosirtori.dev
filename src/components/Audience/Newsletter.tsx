"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { track } from "@/lib/analytics";
import { copyFor, buttonClass, inputClass } from "./copy";
export function NewsletterForm({
  source,
  article,
}: {
  source: "footer" | "article" | "newsletter";
  article?: string;
}) {
  const lang = useLocale();
  const t = copyFor(lang);
  const id = useId();
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  useEffect(() => {
    if (!ref.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("newsletter_form_view", {
            location: source,
            content_id: article,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [source, article]);
  return (
    <form
      ref={ref}
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (state === "sending" || state === "sent") return;
        const email = new FormData(e.currentTarget).get("email");
        setState("sending");
        try {
          const response = await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, language: lang, source, article }),
          });
          if (!response.ok) throw new Error();
          setState("sent");
          track("newsletter_submit", { location: source, content_id: article });
        } catch {
          setState("error");
          track("newsletter_error", { location: source, content_id: article });
        }
      }}
    >
      <label htmlFor={id} className="text-fg text-sm font-medium">
        {t.email}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className={inputClass}
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={state === "sending" || state === "sent"}
          aria-describedby={`${id}-hint ${id}-status`}
        />
        <button
          className={`${buttonClass} shrink-0`}
          disabled={state === "sending" || state === "sent"}
        >
          {state === "sending" ? t.sending : t.subscribe}
        </button>
      </div>
      <p id={`${id}-hint`} className="text-fg-muted text-xs leading-relaxed">
        {t.hint}
      </p>
      <p
        id={`${id}-status`}
        role="status"
        className={`text-sm ${state === "error" ? "text-error" : "text-fg-muted"}`}
      >
        {state === "sent" ? t.check : state === "error" ? t.error : ""}
      </p>
    </form>
  );
}
export function NewsletterBlock({
  source,
  article,
}: {
  source: "footer" | "article";
  article?: string;
}) {
  const t = copyFor(useLocale());
  return (
    <section
      aria-label="Newsletter"
      className="border-border grid gap-6 border-t py-8"
    >
      <div>
        <h2 className="text-fg text-xl font-medium tracking-tight">
          {t.title}
        </h2>
        <p className="text-fg-muted mt-2 max-w-[58ch] text-sm leading-relaxed">
          {t.intro}
        </p>
      </div>
      <NewsletterForm source={source} article={article} />
    </section>
  );
}
export function NewsletterAction({
  mode,
}: {
  mode: "confirm" | "unsubscribe";
}) {
  const lang = useLocale();
  const t = copyFor(lang);
  const [state, setState] = useState<
    "idle" | "sending" | "done" | "expired" | "error"
  >("idle");
  return (
    <div className="space-y-6">
      <p className="text-fg-muted leading-relaxed">
        {mode === "confirm" ? t.hint : t.unsubscribeHint}
      </p>
      {state !== "done" && state !== "expired" && (
        <button
          className={buttonClass}
          disabled={state === "sending"}
          onClick={async () => {
            setState("sending");
            const search = new URLSearchParams(window.location.search);
            try {
              const response = await fetch(`/api/newsletter/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                  mode === "confirm"
                    ? { token: search.get("token") }
                    : {
                        id: search.get("id"),
                        signature: search.get("signature"),
                      },
                ),
              });
              if (response.status === 410 || response.status === 400) {
                setState("expired");
                return;
              }
              if (!response.ok) throw new Error();
              const result = await response.json();
              setState("done");
              window.history.replaceState(null, "", window.location.pathname);
              if (mode === "confirm" && result.fresh)
                track("newsletter_confirmed", { location: "newsletter" });
            } catch {
              setState("error");
              track("newsletter_error", { location: "newsletter" });
            }
          }}
        >
          {state === "sending"
            ? t.sending
            : mode === "confirm"
              ? t.confirm
              : t.unsubscribe}
        </button>
      )}
      <p role="status" className={state === "error" ? "text-error" : "text-fg"}>
        {state === "done"
          ? mode === "confirm"
            ? t.confirmed
            : t.unsubscribed
          : state === "expired"
            ? t.expired
            : state === "error"
              ? t.error
              : ""}
      </p>
      {state === "expired" && (
        <a
          className="text-accent inline-flex min-h-11 items-center underline"
          href={`/${lang}/newsletter`}
        >
          {t.title}
        </a>
      )}
    </div>
  );
}
