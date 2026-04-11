import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const STARTER_TEMPLATES = [
  {
    name: "Online Course",
    type: "course" as const,
    nicheCategory: "Education",
    description:
      "A full-featured online course with introduction, core lessons, and a closing module. Great for teaching any skill or knowledge area.",
    structure: {
      modules: [
        { type: "intro", title: "Welcome & Overview", lesson_count: 1 },
        { type: "lesson", title: "Core Lessons", lesson_count: 5 },
        { type: "bonus", title: "Bonus Content", lesson_count: 2 },
        { type: "outro", title: "Wrap-Up & Next Steps", lesson_count: 1 },
      ],
      scene_types: ["talking_head", "screen_share", "slides"],
      default_duration_seconds: 3600,
    },
    thumbnailUrl: null,
    isPublic: true,
    createdBy: null,
  },
  {
    name: "Mini Course",
    type: "course" as const,
    nicheCategory: "Education",
    description:
      "A compact, focused course covering a single topic in depth. Ideal for lead magnets, quick-start guides, or standalone training modules.",
    structure: {
      modules: [
        { type: "intro", title: "Introduction", lesson_count: 1 },
        { type: "lesson", title: "Core Content", lesson_count: 3 },
        { type: "cta", title: "Call to Action", lesson_count: 1 },
      ],
      scene_types: ["talking_head", "slides"],
      default_duration_seconds: 1800,
    },
    thumbnailUrl: null,
    isPublic: true,
    createdBy: null,
  },
  {
    name: "VSL",
    type: "vsl" as const,
    nicheCategory: "Sales",
    description:
      "A high-converting video sales letter structured to grab attention, build desire, handle objections, and close with a strong call to action.",
    structure: {
      modules: [
        { type: "intro", title: "Hook & Pattern Interrupt", lesson_count: 1 },
        { type: "lesson", title: "Problem & Agitation", lesson_count: 1 },
        { type: "lesson", title: "Solution & Benefits", lesson_count: 1 },
        { type: "testimonial", title: "Social Proof", lesson_count: 1 },
        { type: "cta", title: "Offer & Close", lesson_count: 1 },
      ],
      scene_types: ["talking_head", "text_overlay", "b_roll"],
      default_duration_seconds: 1800,
    },
    thumbnailUrl: null,
    isPublic: true,
    createdBy: null,
  },
  {
    name: "Workshop",
    type: "hybrid" as const,
    nicheCategory: "Training",
    description:
      "An interactive workshop format combining instructional video with practical exercises and a VSL-style intro to sell access or enrolment.",
    structure: {
      modules: [
        { type: "intro", title: "Workshop Welcome", lesson_count: 1 },
        { type: "lesson", title: "Workshop Sessions", lesson_count: 4 },
        { type: "lesson", title: "Live Q&A Recap", lesson_count: 1 },
        { type: "cta", title: "Enrol Now", lesson_count: 1 },
      ],
      scene_types: ["talking_head", "slides", "screen_share"],
      default_duration_seconds: 5400,
    },
    thumbnailUrl: null,
    isPublic: true,
    createdBy: null,
  },
] as const;

export async function GET(): Promise<Response> {
  try {
    const rows = await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true));

    if (rows.length > 0) {
      return Response.json(rows);
    }

    // Seed starter templates into the DB so subsequent requests and the
    // templates page both return real rows.
    const inserted = await db
      .insert(templates)
      .values(
        STARTER_TEMPLATES.map((t) => ({
          name: t.name,
          type: t.type,
          nicheCategory: t.nicheCategory,
          description: t.description,
          structure: t.structure,
          thumbnailUrl: t.thumbnailUrl,
          isPublic: t.isPublic,
          createdBy: t.createdBy,
        }))
      )
      .returning();

    return Response.json(inserted);
  } catch (err) {
    console.error("[GET /api/templates]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
