export const reactionTypes = [
  "like",
  "fire",
  "insightful",
  "celebrate",
  "love",
] as const;
export type ReactionType = (typeof reactionTypes)[number];
export type ReactionSnapshot = {
  counts: Partial<Record<ReactionType, number>>;
  selected: ReactionType[];
};
