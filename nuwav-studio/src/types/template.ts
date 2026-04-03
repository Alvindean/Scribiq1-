import type { Template as DbTemplate } from "./database";

export type Template = DbTemplate;
export type TemplateInsert = Partial<DbTemplate>;

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
