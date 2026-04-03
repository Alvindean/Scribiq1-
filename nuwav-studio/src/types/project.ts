import type { InferSelectModel } from "drizzle-orm";
import type {
  projects,
  modules,
  lessons,
  profiles,
  organizations,
  templates,
} from "@/lib/db/schema";

export type Project = InferSelectModel<typeof projects>;
export type Module = InferSelectModel<typeof modules>;
export type Lesson = InferSelectModel<typeof lessons>;
export type Profile = InferSelectModel<typeof profiles>;
export type Organization = InferSelectModel<typeof organizations>;
export type Template = InferSelectModel<typeof templates>;

export type ProjectInsert = Partial<Project>;
export type ProjectUpdate = Partial<Project>;
export type ModuleInsert = Partial<Module>;
export type LessonInsert = Partial<Lesson>;
export type LessonUpdate = Partial<Lesson>;

export type ProjectWithModules = Project & {
  modules: (Module & { lessons: Lesson[] })[];
};

export type ProjectStatus = Project["status"];
export type ProjectType = Project["type"];
export type LessonStatus = Lesson["status"];

export interface BrandSettings {
  colors: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  fonts: {
    heading?: string;
    body?: string;
  };
  logo_url: string | null;
}
