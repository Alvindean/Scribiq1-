import type { Database } from "./database";

export type Template = Database["public"]["Tables"]["templates"]["Row"];
export type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"];

export interface TemplateStructureModule {
  type: "intro" | "lesson" | "cta" | "testimonial" | "bonus" | "outro";
  title: string;
  lesson_count: number;
}

export interface TemplateStructure {
  modules: TemplateStructureModule[];
  scene_types: string[];
  default_duration_seconds: number;
}
