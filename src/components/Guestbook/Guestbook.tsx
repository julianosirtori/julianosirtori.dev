"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneIcon, PersonIcon } from "@radix-ui/react-icons";

import { createStorage } from "@/utils/storage";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

interface GuestbookProps {
  placeholder: {
    name: string;
    message: string;
  };
  submitText: string;
  emptyText: string;
}

const storage = createStorage("guestbook");

function isValidEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.name === "string" &&
    typeof e.message === "string" &&
    typeof e.timestamp === "number"
  );
}

function formatTimestamp(timestamp: number, locale: string): string {
  const date = new Date(timestamp);
  const diffInHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return locale === "pt" ? "agora mesmo" : "just now";
  }
  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return locale === "pt" ? `${hours}h atrás` : `${hours}h ago`;
  }
  if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return locale === "pt" ? `${days}d atrás` : `${days}d ago`;
  }
  return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export function Guestbook({
  placeholder,
  submitText,
  emptyText,
}: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/pt")) setLocale("pt");

    const stored = storage.get<unknown[]>("entries", []);
    if (Array.isArray(stored)) {
      setEntries(stored.filter(isValidEntry));
    }

    const savedName = storage.get<string>("name", "");
    if (typeof savedName === "string") setName(savedName);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    storage.set("entries", updatedEntries);
    storage.set("name", name.trim());

    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="border-border rounded-xl border p-5">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="name" className="sr-only">
                {placeholder.name}
              </label>
              <div className="relative">
                <PersonIcon className="text-fg-subtle absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={placeholder.name}
                  className="border-border bg-bg text-fg placeholder:text-fg-subtle focus:border-accent w-full rounded-md border py-2 pr-3 pl-9 text-sm transition-colors focus:outline-none"
                  required
                  maxLength={50}
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder.message}
              className="border-border bg-bg text-fg placeholder:text-fg-subtle focus:border-accent w-full resize-none rounded-md border p-3 text-sm transition-colors focus:outline-none"
              rows={3}
              required
              maxLength={500}
            />
            <div className="text-fg-subtle absolute right-3 bottom-2 text-xs">
              {message.length}/500
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="bg-fg text-bg hover:bg-fg/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="border-bg h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <PaperPlaneIcon className="h-3.5 w-3.5" />
              )}
              {submitText}
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {entries.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-fg-muted text-center text-sm"
            >
              {emptyText}
            </motion.p>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="border-border hover:border-fg-muted rounded-lg border p-4 transition-colors"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-bg-muted text-fg-muted flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-fg text-sm font-medium">{entry.name}</p>
                    <p className="text-fg-subtle text-xs">
                      {formatTimestamp(entry.timestamp, locale)}
                    </p>
                  </div>
                </div>
                <p className="text-fg-muted text-sm whitespace-pre-wrap">
                  {entry.message}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
