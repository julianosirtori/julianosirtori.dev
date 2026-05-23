"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReactionsProps {
  slug: string;
}

interface ReactionData {
  [key: string]: number;
}

const REACTIONS = [
  { emoji: "👍", label: "Like", key: "like" },
  { emoji: "🔥", label: "Fire", key: "fire" },
  { emoji: "💡", label: "Insightful", key: "insightful" },
  { emoji: "🎉", label: "Celebrate", key: "celebrate" },
  { emoji: "❤️", label: "Love", key: "love" },
];

export function Reactions({ slug }: ReactionsProps) {
  const [reactions, setReactions] = useState<ReactionData>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [showBurst, setShowBurst] = useState<string | null>(null);

  useEffect(() => {
    const storedReactions = localStorage.getItem(`reactions-${slug}`);
    const storedUserReactions = localStorage.getItem(`user-reactions-${slug}`);
    if (storedReactions) setReactions(JSON.parse(storedReactions));
    if (storedUserReactions) setUserReactions(JSON.parse(storedUserReactions));
  }, [slug]);

  const handleReaction = (key: string) => {
    const hasReacted = userReactions.includes(key);
    const newUserReactions = hasReacted
      ? userReactions.filter((r) => r !== key)
      : [...userReactions, key];
    const newReactions = {
      ...reactions,
      [key]: hasReacted
        ? Math.max((reactions[key] || 1) - 1, 0)
        : (reactions[key] || 0) + 1,
    };

    if (!hasReacted) {
      setShowBurst(key);
      setTimeout(() => setShowBurst(null), 600);
    }

    setUserReactions(newUserReactions);
    setReactions(newReactions);

    localStorage.setItem(`reactions-${slug}`, JSON.stringify(newReactions));
    localStorage.setItem(
      `user-reactions-${slug}`,
      JSON.stringify(newUserReactions),
    );
  };

  const totalReactions = Object.values(reactions).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-fg-subtle text-xs">
        {totalReactions > 0
          ? `${totalReactions} reaction${totalReactions > 1 ? "s" : ""}`
          : "Be the first to react"}
      </p>

      <div className="flex flex-wrap justify-center gap-1.5">
        {REACTIONS.map((reaction) => {
          const isActive = userReactions.includes(reaction.key);
          const count = reactions[reaction.key] || 0;

          return (
            <motion.button
              type="button"
              key={reaction.key}
              onClick={() => handleReaction(reaction.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={
                isActive
                  ? "border-accent bg-accent-muted text-fg relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors"
                  : "border-border text-fg-muted hover:border-fg-muted hover:text-fg relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors"
              }
              aria-label={reaction.label}
              title={reaction.label}
            >
              <span className="text-base leading-none">{reaction.emoji}</span>
              {count > 0 && (
                <span className="min-w-3 text-xs font-medium">{count}</span>
              )}

              <AnimatePresence>
                {showBurst === reaction.key && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{
                          opacity: 0,
                          scale: 1,
                          x: Math.cos((i / 6) * Math.PI * 2) * 24,
                          y: Math.sin((i / 6) * Math.PI * 2) * 24,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
                      >
                        {reaction.emoji}
                      </motion.span>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
