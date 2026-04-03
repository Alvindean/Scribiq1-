import type { Database } from "./database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type ModuleInsert = Database["public"]["Tables"]["modules"]["Insert"];

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type LessonInsert = Database["public"]["Tables"]["lessons"]["Insert"];
export type LessonUpdate = Database["public"]["Tables"]["lessons"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];

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
