import type { RenderJob, Export, PublishedPage, MediaAsset } from "./database";

export type { RenderJob, Export, PublishedPage, MediaAsset };

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
  duration: number;
}
