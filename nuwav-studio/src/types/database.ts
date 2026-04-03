export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Row<T> = T;
type Insert<T> = Partial<T>;
type Update<T> = Partial<T>;

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string | null;
          plan: "starter" | "pro" | "agency" | "enterprise";
          stripe_customer_id: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["organizations"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["organizations"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          org_id: string | null;
          email: string;
          name: string | null;
          role: "owner" | "admin" | "member" | "client";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      projects: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["projects"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          order: number;
          type: "intro" | "lesson" | "cta" | "testimonial" | "bonus" | "outro";
          created_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["modules"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["modules"]["Row"]>;
        Relationships: [];
      };
      lessons: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["lessons"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["lessons"]["Row"]>;
        Relationships: [];
      };
      templates: {
        Row: {
          id: string;
          name: string;
          type: "course" | "vsl" | "hybrid";
          niche_category: string | null;
          description: string | null;
          structure: Json;
          thumbnail_url: string | null;
          is_public: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["templates"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["templates"]["Row"]>;
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          project_id: string | null;
          lesson_id: string | null;
          type: "image" | "video" | "audio" | "pdf";
          url: string;
          storage_key: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["media_assets"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["media_assets"]["Row"]>;
        Relationships: [];
      };
      published_pages: {
        Row: {
          id: string;
          project_id: string;
          slug: string;
          page_type: "sales" | "checkout" | "course_portal" | "lesson";
          content: Json;
          custom_domain: string | null;
          is_live: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["published_pages"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["published_pages"]["Row"]>;
        Relationships: [];
      };
      render_jobs: {
        Row: {
          id: string;
          project_id: string;
          lesson_id: string | null;
          status: "queued" | "rendering" | "complete" | "failed";
          composition_id: string | null;
          output_url: string | null;
          error_message: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["render_jobs"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["render_jobs"]["Row"]>;
        Relationships: [];
      };
      exports: {
        Row: {
          id: string;
          project_id: string;
          format: "mp4" | "pdf" | "pptx" | "scorm" | "zip";
          url: string | null;
          status: "pending" | "processing" | "complete" | "failed";
          created_at: string;
        };
        Insert: Insert<Database["public"]["Tables"]["exports"]["Row"]>;
        Update: Update<Database["public"]["Tables"]["exports"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// Suppress unused type warning
type _RowHelper = Row<unknown>;
