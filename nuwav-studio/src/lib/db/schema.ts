import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export interface VisualSettings {
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundImageThumb?: string;
  titlePosition?: "top" | "center" | "bottom";
  textColor?: "light" | "dark";
}

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerId: uuid("owner_id"),
  plan: text("plan")
    .$type<"starter" | "pro" | "agency" | "enterprise">()
    .default("starter")
    .notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  // Stripe subscription fields — requires migration:
  //   ALTER TABLE organizations
  //     ADD COLUMN stripe_subscription_id text,
  //     ADD COLUMN stripe_price_id text,
  //     ADD COLUMN subscription_status text;
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  subscriptionStatus: text("subscription_status").$type<
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "paused"
    | "unpaid"
  >(),
  settings: jsonb("settings").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id"),
  email: text("email").notNull(),
  name: text("name"),
  role: text("role")
    .$type<"owner" | "admin" | "member" | "client">()
    .default("owner")
    .notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").notNull(),
  createdBy: uuid("created_by"),
  type: text("type")
    .$type<"course" | "vsl" | "hybrid">()
    .notNull(),
  title: text("title").notNull(),
  niche: text("niche"),
  targetAudience: text("target_audience"),
  tone: text("tone").notNull().default("professional"),
  durationTarget: integer("duration_target"),
  templateId: uuid("template_id"),
  status: text("status")
    .$type<"draft" | "generating" | "review" | "published" | "archived">()
    .default("draft")
    .notNull(),
  brandSettings: jsonb("brand_settings").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  type: text("type")
    .$type<"intro" | "lesson" | "cta" | "testimonial" | "bonus" | "outro">()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").notNull(),
  projectId: uuid("project_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  script: text("script"),
  slides: jsonb("slides").default([]).notNull(),
  voiceoverUrl: text("voiceover_url"),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  durationSeconds: integer("duration_seconds"),
  visualSettings: jsonb("visual_settings").$type<VisualSettings>(),
  status: text("status")
    .$type<"draft" | "scripted" | "voiced" | "rendered" | "published">()
    .default("draft")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const lyrics = pgTable("lyrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  content: text("content").notNull().default(""),
  version: integer("version").notNull().default(1),
  source: text("source").notNull().default("manual"), // "manual" | "ai" | "analyzer"
  aiPrompt: text("ai_prompt"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Lyric = typeof lyrics.$inferSelect;

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id"),
  lessonId: uuid("lesson_id"),
  type: text("type").$type<"image" | "video" | "audio" | "pdf">().notNull(),
  url: text("url").notNull(),
  storageKey: text("storage_key"),
  metadata: jsonb("metadata").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const publishedPages = pgTable("published_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  slug: text("slug").notNull().unique(),
  pageType: text("page_type")
    .$type<"sales" | "checkout" | "course_portal" | "lesson">()
    .notNull(),
  content: jsonb("content").default({}).notNull(),
  customDomain: text("custom_domain"),
  isLive: boolean("is_live").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const renderJobs = pgTable("render_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  lessonId: uuid("lesson_id"),
  status: text("status")
    .$type<"queued" | "rendering" | "complete" | "failed">()
    .default("queued")
    .notNull(),
  compositionId: text("composition_id"),
  outputUrl: text("output_url"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const exports = pgTable("exports", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  format: text("format")
    .$type<"mp4" | "pdf" | "pptx" | "scorm" | "zip">()
    .notNull(),
  url: text("url"),
  status: text("status")
    .$type<"pending" | "processing" | "complete" | "failed">()
    .default("pending")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").$type<"course" | "vsl" | "hybrid">().notNull(),
  nicheCategory: text("niche_category"),
  description: text("description"),
  structure: jsonb("structure").default({}).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPublic: boolean("is_public").default(false).notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseSlug: text("course_slug").notNull(),
  projectId: uuid("project_id").notNull(),
  studentEmail: text("student_email").notNull(),
  studentName: text("student_name"),
  stripeSessionId: text("stripe_session_id"),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow(),
});

/*
 * SQL migration required to create the enrollments table:
 *
 * CREATE TABLE IF NOT EXISTS enrollments (
 *   id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
 *   course_slug    text        NOT NULL,
 *   project_id     uuid        NOT NULL,
 *   student_email  text        NOT NULL,
 *   student_name   text,
 *   stripe_session_id text,
 *   enrolled_at    timestamptz DEFAULT now()
 * );
 *
 * CREATE INDEX IF NOT EXISTS idx_enrollments_email_slug
 *   ON enrollments (student_email, course_slug);
 */

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  courseSlug: text("course_slug"),
  lessonId: uuid("lesson_id"),
  event: text("event").notNull(), // "lesson_view" | "lesson_complete" | "course_view" | "enrollment"
  studentEmail: text("student_email"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/*
 * SQL migration required to create the analytics_events table:
 *
 * CREATE TABLE IF NOT EXISTS analytics_events (
 *   id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
 *   project_id     uuid        NOT NULL,
 *   course_slug    text,
 *   lesson_id      uuid,
 *   event          text        NOT NULL,
 *   student_email  text,
 *   metadata       jsonb,
 *   created_at     timestamptz DEFAULT now()
 * );
 *
 * CREATE INDEX IF NOT EXISTS idx_analytics_events_project_id
 *   ON analytics_events (project_id);
 *
 * CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
 *   ON analytics_events (created_at);
 */

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id").notNull(),
  email: text("email").notNull(),
  role: text("role")
    .$type<"member" | "admin">()
    .default("member")
    .notNull(),
  token: text("token").notNull().unique(),
  invitedBy: uuid("invited_by").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Invitation = typeof invitations.$inferSelect;

/*
 * SQL migration required to create the invitations table:
 *
 * CREATE TABLE IF NOT EXISTS invitations (
 *   id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
 *   org_id       uuid        NOT NULL,
 *   email        text        NOT NULL,
 *   role         text        NOT NULL DEFAULT 'member',
 *   token        text        NOT NULL UNIQUE,
 *   invited_by   uuid        NOT NULL,
 *   expires_at   timestamptz NOT NULL,
 *   accepted_at  timestamptz,
 *   created_at   timestamptz DEFAULT now()
 * );
 *
 * CREATE INDEX IF NOT EXISTS idx_invitations_org_id   ON invitations (org_id);
 * CREATE INDEX IF NOT EXISTS idx_invitations_email    ON invitations (email);
 * CREATE INDEX IF NOT EXISTS idx_invitations_token    ON invitations (token);
 */

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
