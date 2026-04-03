import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(): Promise<Response> {
  const rows = await db
    .select()
    .from(templates)
    .where(eq(templates.isPublic, true));

  return Response.json(rows);
}
