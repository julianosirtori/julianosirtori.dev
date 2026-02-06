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
    // Load reactions from localStorage
    const storedReactions = localStorage.getItem(`reactions-${slug}`);
    const storedUserReactions = localStorage.getItem(`user-reactions-${slug}`);

    if (storedReactions) {
      setReactions(JSON.parse(storedReactions));
    }
    if (storedUserReactions) {
      setUserReactions(JSON.parse(storedUserReactions));
    }
  }, [slug]);

  const handleReaction = (key: string) => {
    const hasReacted = userReactions.includes(key);
    let newUserReactions: string[];
    let newReactions: ReactionData;

    if (hasReacted) {
      // Remove reaction
      newUserReactions = userReactions.filter((r) => r !== key);
      newReactions = {
        ...reactions,
        [key]: Math.max((reactions[key] || 1) - 1, 0),
      };
    } else {
      // Add reaction
      newUserReactions = [...userReactions, key];
      newReactions = {
        ...reactions,
        [key]: (reactions[key] || 0) + 1,
      };
      // Show burst animation
      setShowBurst(key);
      setTimeout(() => setShowBurst(null), 600);
    }

    setUserReactions(newUserReactions);
    setReactions(newReactions);

    // Save to localStorage
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
    <div className="my-12 flex flex-col items-center gap-4">
      <p className="text-secondary text-sm">
        {totalReactions > 0
          ? `${totalReactions} reaction${totalReactions > 1 ? "s" : ""}`
          : "Be the first to react!"}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {REACTIONS.map((reaction) => {
          const isActive = userReactions.includes(reaction.key);
          const count = reactions[reaction.key] || 0;

          return (
            <motion.button
              key={reaction.key}
              onClick={() => handleReaction(reaction.key)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 ${
                isActive
                  ? "border-cyan bg-cyan/10 text-cyan"
                  : "border-hover bg-hover/50 text-secondary hover:border-cyan/50 hover:text-primary"
              }`}
              aria-label={reaction.label}
              title={reaction.label}
            >
              <span className="text-xl">{reaction.emoji}</span>
              {count > 0 && (
                <span className="min-w-[1.25rem] text-sm font-medium">
                  {count}
                </span>
              )}

              {/* Burst animation */}
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
                          x: Math.cos((i / 6) * Math.PI * 2) * 30,
                          y: Math.sin((i / 6) * Math.PI * 2) * 30,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
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
