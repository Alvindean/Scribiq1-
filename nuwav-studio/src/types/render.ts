import type { Database } from "./database";

export type RenderJob = Database["public"]["Tables"]["render_jobs"]["Row"];
export type Export = Database["public"]["Tables"]["exports"]["Row"];
export type PublishedPage = Database["public"]["Tables"]["published_pages"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];

export interface RenderCompositionProps {
  lessonId: string;
  title: string;
  script: string;
  slides: SlideData[];
  voiceoverUrl?: string;
  brandSettings?: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
}

export interface SlideData {
  type: "title_card" | "content" | "stat" | "testimonial" | "cta" | "recap";
  heading: string;
  body?: string;
  imageUrl?: string;
  stat?: string;
  statLabel?: string;
  quote?: string;
  author?: string;
  ctaText?: string;
  ctaUrl?: string;
  duration: number; // frames
}
