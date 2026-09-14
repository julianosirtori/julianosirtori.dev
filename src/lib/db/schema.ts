import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  githubUsername: text("github_username"),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [uniqueIndex("provider_account").on(t.providerId, t.accountId)],
);
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
export const subscribers = sqliteTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  language: text("language", { enum: ["pt", "en"] }).notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "active", "unsubscribed"],
  })
    .notNull()
    .default("pending"),
  generation: text("generation").notNull(),
  source: text("source").notNull(),
  article: text("article"),
  consentVersion: text("consent_version").notNull(),
  requestedAt: integer("requested_at").notNull(),
  confirmedAt: integer("confirmed_at"),
  unsubscribedAt: integer("unsubscribed_at"),
  providerEventAt: integer("provider_event_at").notNull().default(0),
});
export const confirmations = sqliteTable("confirmations", {
  hash: text("hash").primaryKey(),
  subscriberId: text("subscriber_id")
    .notNull()
    .references(() => subscribers.id),
  generation: text("generation").notNull(),
  expiresAt: integer("expires_at").notNull(),
  consumedAt: integer("consumed_at"),
});
export const deliveries = sqliteTable(
  "deliveries",
  {
    id: text("id").primaryKey(),
    subscriberId: text("subscriber_id")
      .notNull()
      .references(() => subscribers.id),
    generation: text("generation").notNull(),
    kind: text("kind", {
      enum: ["confirmation", "activate", "welcome", "unsubscribe"],
    }).notNull(),
    payload: text("payload").notNull(),
    state: text("state", { enum: ["pending", "sent", "review", "cancelled"] })
      .notNull()
      .default("pending"),
    createdAt: integer("created_at").notNull(),
    firstAttemptAt: integer("first_attempt_at"),
    acceptedAt: integer("accepted_at"),
    attempts: integer("attempts").notNull().default(0),
    providerId: text("provider_id"),
  },
  (t) => [index("delivery_queue").on(t.state, t.createdAt)],
);
export const guestbook = sqliteTable(
  "guestbook",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    message: text("message").notNull(),
    fingerprint: text("fingerprint").notNull().unique(),
    createdAt: integer("created_at").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("pending"),
    moderatedBy: text("moderated_by").references(() => user.id),
    moderatedAt: integer("moderated_at"),
  },
  (t) => [index("guestbook_public").on(t.status, t.createdAt)],
);
export const moderationLog = sqliteTable("moderation_log", {
  id: text("id").primaryKey(),
  entryId: text("entry_id")
    .notNull()
    .references(() => guestbook.id),
  actorId: text("actor_id")
    .notNull()
    .references(() => user.id),
  status: text("status").notNull(),
  createdAt: integer("created_at").notNull(),
});
export const reactions = sqliteTable(
  "reactions",
  {
    visitor: text("visitor").notNull(),
    slug: text("slug").notNull(),
    type: text("type", {
      enum: ["like", "fire", "insightful", "celebrate", "love"],
    }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.visitor, t.slug, t.type] }),
    index("reaction_slug").on(t.slug),
  ],
);
export const limits = sqliteTable("request_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
export const authRateLimit = sqliteTable("auth_rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: integer("last_request").notNull(),
});
