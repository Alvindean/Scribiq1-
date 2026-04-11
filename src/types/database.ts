export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  password_hash: string | null;
  created_at: string | null;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string | null;
  plan: "starter" | "pro" | "agency" | "enterprise";
  stripe_customer_id: string | null;
  settings: Json;
  created_at: string | null;
  updated_at: string | null;
}

export interface Profile {
  id: string;
  org_id: string | null;
  email: string;
  name: string | null;
  role: "owner" | "admin" | "member" | "client";
  avatar_url: string | null;
  created_at: string | null;
}

export interface Project {
  id: string;
  org_id: string;
  created_by: string | null;
  type: "course" | "vsl" | "hybrid";
  title: string;
  niche: string | null;
  target_audience: string | null;
  tone: string;
  duration_target: number | null;
  template_id: string | null;
  status: "draft" | "generating" | "review" | "published" | "archived";
  brand_settings: Json;
  created_at: string | null;
  updated_at: string | null;
}

export interface Module {
  id: string;
  project_id: string;
  title: string;
  order: number;
  type: "intro" | "lesson" | "cta" | "testimonial" | "bonus" | "outro";
  created_at: string | null;
}

export interface Lesson {
  id: string;
  module_id: string;
  project_id: string;
  title: string;
  order: number;
  script: string | null;
  slides: Json;
  voiceover_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: "draft" | "scripted" | "voiced" | "rendered" | "published";
  created_at: string | null;
  updated_at: string | null;
}

export interface MediaAsset {
  id: string;
  project_id: string | null;
  lesson_id: string | null;
  type: "image" | "video" | "audio" | "pdf";
  url: string;
  storage_key: string | null;
  metadata: Json;
  created_at: string | null;
}

export interface PublishedPage {
  id: string;
  project_id: string;
  slug: string;
  page_type: "sales" | "checkout" | "course_portal" | "lesson";
  content: Json;
  custom_domain: string | null;
  is_live: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface RenderJob {
  id: string;
  project_id: string;
  lesson_id: string | null;
  status: "queued" | "rendering" | "complete" | "failed";
  composition_id: string | null;
  output_url: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
}

export interface Export {
  id: string;
  project_id: string;
  format: "mp4" | "pdf" | "pptx" | "scorm" | "zip";
  url: string | null;
  status: "pending" | "processing" | "complete" | "failed";
  created_at: string | null;
}

export interface Template {
  id: string;
  name: string;
  type: "course" | "vsl" | "hybrid";
  niche_category: string | null;
  description: string | null;
  structure: Json;
  thumbnail_url: string | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string | null;
}
