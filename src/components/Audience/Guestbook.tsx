"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import {
  ExitIcon,
  GitHubLogoIcon,
  PaperPlaneIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { track } from "@/lib/analytics";
import {
  buttonClass,
  copyFor,
  inputClass,
  secondaryButtonClass,
  textButtonClass,
} from "./copy";
export type Entry = {
  id: string;
  name: string;
  image: string | null;
  githubId: string;
  githubUsername?: string | null;
  createdAt: number;
  message: string;
  status: "pending" | "approved" | "rejected";
};
export function legacyDrafts(): string[] {
  try {
    const data: unknown = JSON.parse(
      localStorage.getItem("guestbook:entries") || "[]",
    );
    if (!Array.isArray(data)) return [];
    return data
      .map((v) =>
        typeof v === "string" ? v : v && typeof v === "object" ? v.message : "",
      )
      .filter(
        (v): v is string =>
          typeof v === "string" && v.trim().length > 0 && v.length <= 500,
      )
      .slice(0, 30);
  } catch {
    return [];
  }
}
export function EntryCard({
  entry,
  lang,
  children,
}: {
  entry: Entry;
  lang: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="border-border rounded-lg border p-5">
      <div className="flex items-center gap-3">
        <Image
          unoptimized
          src={`https://avatars.githubusercontent.com/u/${encodeURIComponent(entry.githubId)}?s=88`}
          alt=""
          width={44}
          height={44}
          className="rounded-full"
        />
        <div>
          <a
            href={`https://github.com/${encodeURIComponent(entry.githubUsername || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg hover:text-accent inline-flex min-h-11 items-center font-medium"
          >
            {entry.name}
          </a>
          <time
            className="text-fg-muted block text-xs"
            dateTime={new Date(entry.createdAt).toISOString()}
          >
            {new Intl.DateTimeFormat(lang, {
              dateStyle: "medium",
              timeZone: "UTC",
            }).format(entry.createdAt)}
          </time>
        </div>
      </div>
      <p className="text-fg mt-4 text-sm leading-relaxed break-words whitespace-pre-wrap">
        {entry.message}
      </p>
      {children}
    </article>
  );
}
export function GuestbookClient() {
  const lang = useLocale();
  const t = copyFor(lang);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState("");
  const [drafts, setDrafts] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const textarea = useRef<HTMLTextAreaElement>(null);
  const load = useCallback(async () => {
    setFailed(false);
    try {
      const response = await fetch("/api/guestbook");
      if (!response.ok) throw new Error();
      setEntries((await response.json()).entries);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    void load();
    setDrafts(legacyDrafts());
    fetch("/api/guestbook/session")
      .then(async (response) => {
        if (response.ok) {
          setName((await response.json()).name);
          try {
            if (sessionStorage.getItem("guestbook:login")) {
              sessionStorage.removeItem("guestbook:login");
              track("guestbook_login_success", { location: "guestbook" });
            }
          } catch {}
        }
      })
      .catch(() => undefined)
      .finally(() => setSessionReady(true));
  }, [load]);
  return (
    <div className="space-y-10">
      <section className="border-border bg-bg-elevated rounded-lg border p-5 sm:p-7">
        {name ? (
          <div className="text-fg-muted mb-5 flex items-center justify-between gap-4 text-sm">
            <span>{name}</span>
            <button
              type="button"
              className={textButtonClass}
              onClick={async () => {
                const response = await fetch("/api/auth/sign-out", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: "{}",
                }).catch(() => null);
                if (response?.ok) setName(null);
                else setState("error");
              }}
            >
              <ExitIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {t.logout}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`${secondaryButtonClass} mb-6 w-full sm:w-auto`}
            disabled={!sessionReady || state === "sending"}
            aria-busy={state === "sending"}
            onClick={async () => {
              track("guestbook_login_start", { location: "guestbook" });
              setState("sending");
              try {
                const response = await fetch("/api/auth/sign-in/social", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    provider: "github",
                    callbackURL: `/${lang}/guestbook`,
                  }),
                });
                const result = await response.json();
                if (!response.ok || !result.url) throw new Error();
                const url = new URL(result.url);
                if (url.origin !== "https://github.com") throw new Error();
                try {
                  sessionStorage.setItem("guestbook:login", "1");
                } catch {}
                window.location.assign(url.href);
              } catch {
                setState("error");
                track("guestbook_error", { location: "guestbook" });
              }
            }}
          >
            {state === "sending" ? (
              <UpdateIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 motion-safe:animate-spin"
              />
            ) : (
              <GitHubLogoIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            )}
            {t.login}
          </button>
        )}
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name || state === "sending") return;
            setState("sending");
            try {
              const response = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
              });
              if (!response.ok) throw new Error();
              setState("sent");
              setMessage("");
              track("guestbook_submit", { location: "guestbook" });
            } catch {
              setState("error");
              track("guestbook_error", { location: "guestbook" });
            }
          }}
        >
          <label
            htmlFor="guestbook-message"
            className="text-fg block text-sm font-medium"
          >
            {t.message}
          </label>
          <textarea
            ref={textarea}
            id="guestbook-message"
            className={inputClass}
            rows={4}
            maxLength={500}
            required
            disabled={!name || state === "sending"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-describedby="guestbook-hint guestbook-status"
          />
          <div className="text-fg-muted flex justify-between gap-3 text-xs">
            <p id="guestbook-hint">{t.moderation}</p>
            <span className="shrink-0 font-mono tabular-nums">
              {message.length}/500
            </span>
          </div>
          <button
            type="submit"
            className={`${buttonClass} w-full sm:w-auto`}
            disabled={!name || !message.trim() || state === "sending"}
            aria-busy={Boolean(name) && state === "sending"}
          >
            {name && state === "sending" ? (
              <UpdateIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 motion-safe:animate-spin"
              />
            ) : (
              <PaperPlaneIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            )}
            {name && state === "sending" ? t.sending : t.send}
          </button>
          <p
            id="guestbook-status"
            role="status"
            className={`text-sm ${state === "error" ? "text-error" : "text-fg-muted"}`}
          >
            {state === "sent" ? t.received : state === "error" ? t.error : ""}
          </p>
        </form>
      </section>
      {drafts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-fg text-lg font-medium">{t.drafts}</h2>
          {drafts.map((draft, index) => (
            <div key={index} className="border-border rounded-md border p-4">
              <p className="text-fg-muted text-sm break-words whitespace-pre-wrap">
                {draft}
              </p>
              <button
                type="button"
                className={`${textButtonClass} mt-2`}
                onClick={() => {
                  setMessage(draft);
                  textarea.current?.focus();
                }}
              >
                {t.recover}
              </button>
            </div>
          ))}
        </section>
      )}
      <section aria-label={t.guestbook} className="space-y-4">
        {failed ? (
          <div role="status" className="text-fg-muted">
            <p>{t.unavailable}</p>
            <button
              type="button"
              onClick={() => void load()}
              className={`${secondaryButtonClass} mt-3`}
            >
              {t.retry}
            </button>
          </div>
        ) : entries === null ? (
          <p role="status" className="text-fg-muted">
            {lang === "pt" ? "Carregando recados…" : "Loading notes…"}
          </p>
        ) : entries.length === 0 ? (
          <p className="text-fg-muted py-4">{t.empty}</p>
        ) : (
          entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} lang={lang} />
          ))
        )}
      </section>
    </div>
  );
}
export function GuestbookAdmin() {
  const lang = useLocale();
  const t = copyFor(lang);
  const [status, setStatus] = useState<Entry["status"]>("pending");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [more, setMore] = useState(false);
  const load = useCallback(
    async (before?: string) => {
      setBusy(true);
      setFailed(false);
      try {
        const response = await fetch(
          `/api/admin/guestbook?status=${status}${before ? `&before=${before}` : ""}`,
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        setEntries((previous) =>
          before ? [...previous, ...data.entries] : data.entries,
        );
        setMore(data.entries.length === 30);
      } catch {
        setFailed(true);
      } finally {
        setBusy(false);
      }
    },
    [status],
  );
  useEffect(() => {
    setEntries([]);
    void load();
  }, [load]);
  return (
    <div className="space-y-6">
      <div aria-label={t.admin} className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            aria-pressed={tab === status}
            disabled={busy}
            className={tab === status ? buttonClass : secondaryButtonClass}
            onClick={() => setStatus(tab)}
          >
            {t[tab]}
          </button>
        ))}
      </div>
      {failed && (
        <div role="alert">
          <p>{t.error}</p>
          <button className={textButtonClass} onClick={() => void load()}>
            {t.retry}
          </button>
        </div>
      )}
      {busy && <p role="status">{t.sending}</p>}
      {!busy && !failed && !entries.length && (
        <p className="text-fg-muted">
          {lang === "pt"
            ? "Nenhum recado nesta lista."
            : "No notes in this list."}
        </p>
      )}
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} lang={lang}>
          <div className="mt-5 flex flex-wrap gap-2">
            {(["approved", "rejected", "pending"] as const)
              .filter((next) => next !== entry.status)
              .map((next) => (
                <button
                  key={next}
                  className={buttonClass}
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setFailed(false);
                    try {
                      const response = await fetch(
                        `/api/admin/guestbook/${entry.id}`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: next }),
                        },
                      );
                      if (!response.ok) throw new Error();
                      await load();
                    } catch {
                      setFailed(true);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {next === "approved"
                    ? t.approve
                    : next === "rejected"
                      ? t.reject
                      : t.unpublish}
                </button>
              ))}
          </div>
        </EntryCard>
      ))}
      {more && (
        <button
          className={buttonClass}
          disabled={busy}
          onClick={() =>
            void load(
              `${entries[entries.length - 1].createdAt}:${entries[entries.length - 1].id}`,
            )
          }
        >
          {t.more}
        </button>
      )}
    </div>
  );
}
