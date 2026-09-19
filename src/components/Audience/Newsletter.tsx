"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircledIcon,
  CheckIcon,
  CrossCircledIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
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
  const [errorKey, setErrorKey] = useState<
    "error" | "newsletterTestRecipient" | "newsletterRateLimited"
  >("error");
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
        setErrorKey("error");
        try {
          const response = await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, language: lang, source, article }),
          });
          if (!response.ok) {
            const result: unknown = await response.json().catch(() => null);
            const code =
              result && typeof result === "object" && "error" in result
                ? result.error
                : null;
            if (response.status === 403 && code === "newsletter_test_recipient")
              setErrorKey("newsletterTestRecipient");
            else if (response.status === 429)
              setErrorKey("newsletterRateLimited");
            throw new Error("newsletter_submit_failed");
          }
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
          type="submit"
          className={`${buttonClass} shrink-0`}
          disabled={state === "sending" || state === "sent"}
          aria-busy={state === "sending"}
        >
          {state === "sending" ? t.sending : t.subscribe}
          {state === "sending" ? (
            <UpdateIcon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 motion-safe:animate-spin"
            />
          ) : state === "sent" ? (
            <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          ) : (
            <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
          )}
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
        {state === "sent" ? t.check : state === "error" ? t[errorKey] : ""}
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
    <div className="mt-6">
      <p className="text-fg-muted leading-relaxed">
        {mode === "confirm" ? t.hint : t.unsubscribeHint}
      </p>
      {state !== "done" && state !== "expired" && (
        <button
          type="button"
          className={`${buttonClass} mt-7`}
          disabled={state === "sending"}
          aria-busy={state === "sending"}
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
      {state !== "idle" && state !== "sending" && (
        <div
          role="status"
          className={`mt-7 flex items-start gap-3 border-l-2 py-1 pl-4 ${
            state === "error"
              ? "border-error text-error"
              : "border-accent text-fg"
          }`}
        >
          {state === "done" ? (
            <CheckCircledIcon
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0"
            />
          ) : (
            <CrossCircledIcon
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0"
            />
          )}
          <p className="leading-relaxed">
            {state === "done"
              ? mode === "confirm"
                ? t.confirmed
                : t.unsubscribed
              : state === "expired"
                ? t.expired
                : t.error}
          </p>
        </div>
      )}
      {state === "expired" && (
        <a
          className="text-accent mt-5 inline-flex min-h-11 items-center underline underline-offset-4"
          href={`/${lang}/newsletter`}
        >
          {t.title}
        </a>
      )}
    </div>
  );
}

export function NewsletterActionPage({
  mode,
  title,
}: {
  mode: "confirm" | "unsubscribe";
  title: string;
}) {
  const lang = useLocale();
  const t = copyFor(lang);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-16 sm:py-24">
      <section className="border-border grid w-full gap-10 overflow-hidden border-y py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:items-end md:py-16">
        <div aria-hidden="true">
          <p className="text-fg-subtle mb-8 font-mono text-xs tracking-[0.14em] uppercase">
            {mode === "confirm" ? t.confirmKicker : t.unsubscribeKicker}
          </p>
          <p className="text-fg text-[clamp(7rem,24vw,15rem)] leading-[0.72] font-semibold tracking-[-0.09em]">
            {mode === "confirm" ? "+" : "−"}
          </p>
        </div>

        <div className="flex flex-col items-start md:pb-1">
          <h1 className="text-fg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          <NewsletterAction mode={mode} />
          <Link
            href={`/${lang}`}
            className="text-fg-muted hover:text-fg mt-9 inline-flex min-h-11 items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeftIcon aria-hidden="true" />
            {t.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
