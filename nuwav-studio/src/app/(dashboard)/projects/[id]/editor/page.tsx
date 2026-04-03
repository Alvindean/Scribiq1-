import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditorLayout } from "@/components/editor/EditorLayout";
import type { ProjectWithModules } from "@/types/project";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      *,
      modules (
        *,
        lessons ( * )
      )
    `
    )
    .eq("id", id)
    .order("order", { referencedTable: "modules", ascending: true })
    .single();

  if (!project) notFound();

  const typedProject = project as unknown as ProjectWithModules;

  return <EditorLayout project={typedProject} modules={typedProject.modules ?? []} />;
}
