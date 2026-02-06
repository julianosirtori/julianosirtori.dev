"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneIcon, PersonIcon } from "@radix-ui/react-icons";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  color: string;
}

interface GuestbookProps {
  placeholder: {
    name: string;
    message: string;
  };
  submitText: string;
  emptyText: string;
}

const COLORS = [
  "from-cyan to-green",
  "from-pink to-purple",
  "from-yellow to-orange",
  "from-green to-cyan",
  "from-purple to-pink",
  "from-orange to-red",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function formatTimestamp(timestamp: number, locale: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return locale === "pt" ? "agora mesmo" : "just now";
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return locale === "pt" ? `${hours}h atrás` : `${hours}h ago`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return locale === "pt" ? `${days}d atrás` : `${days}d ago`;
  } else {
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
    });
  }
}

export function Guestbook({
  placeholder,
  submitText,
  emptyText,
}: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("guestbook-entries");
    return stored ? JSON.parse(stored) : [];
  });
  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("guestbook-name") || "";
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locale] = useState(() => {
    if (typeof window === "undefined") return "en";
    return window.location.pathname.startsWith("/pt") ? "pt" : "en";
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      color: getRandomColor(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    // Save to localStorage
    localStorage.setItem("guestbook-entries", JSON.stringify(updatedEntries));
    localStorage.setItem("guestbook-name", name.trim());

    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="border-hover bg-hover/30 rounded-xl border p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="name" className="sr-only">
                {placeholder.name}
              </label>
              <div className="relative">
                <PersonIcon className="text-secondary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={placeholder.name}
                  className="border-hover bg-background text-primary placeholder:text-secondary/50 focus:border-cyan w-full rounded-lg border py-3 pr-4 pl-10 focus:outline-none"
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
              className="border-hover bg-background text-primary placeholder:text-secondary/50 focus:border-cyan w-full resize-none rounded-lg border p-4 focus:outline-none"
              rows={3}
              required
              maxLength={500}
            />
            <div className="text-secondary absolute right-3 bottom-3 text-xs">
              {message.length}/500
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="from-cyan to-green text-background flex items-center gap-2 rounded-lg bg-gradient-to-r px-6 py-2.5 font-medium transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(128,255,234,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <PaperPlaneIcon className="h-4 w-4" />
              )}
              {submitText}
            </button>
          </div>
        </div>
      </form>

      {/* Entries */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {entries.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-secondary text-center"
            >
              {emptyText}
            </motion.p>
          ) : (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group border-hover bg-hover/20 hover:border-hover hover:bg-hover/40 rounded-xl border p-5 transition-all duration-300"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${entry.color} text-background text-lg font-bold`}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-primary font-medium">{entry.name}</p>
                      <p className="text-secondary text-xs">
                        {formatTimestamp(entry.timestamp, locale)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-secondary whitespace-pre-wrap">
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
