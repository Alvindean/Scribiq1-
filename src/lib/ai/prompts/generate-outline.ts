export interface OutlineInput {
  niche: string;
  product_name: string;
  target_audience: string;
  tone: string;
  duration_target?: number;
  type: "course" | "vsl" | "hybrid";
  template_structure?: object | null;
}

export interface OutlineLesson {
  title: string;
  duration_seconds: number;
  key_points: string[];
  scene_types: string[];
}

export interface OutlineModule {
  title: string;
  type: "intro" | "lesson" | "cta" | "testimonial" | "bonus" | "outro";
  lessons: OutlineLesson[];
}

export interface GeneratedOutline {
  title: string;
  modules: OutlineModule[];
}

export function buildOutlinePrompt(input: OutlineInput): string {
  const {
    niche,
    product_name,
    target_audience,
    tone,
    duration_target,
    type,
    template_structure,
  } = input;

  const durationNote = duration_target
    ? `The total content duration target is approximately ${Math.round(duration_target / 60)} minutes.`
    : "";

  const templateNote = template_structure
    ? `Use this template structure as a guide: ${JSON.stringify(template_structure)}`
    : "";

  return `You are an expert course creator and content strategist. Generate a detailed outline for the following project.

**Project Type:** ${type === "course" ? "Online Course" : type === "vsl" ? "Video Sales Letter (VSL)" : "Hybrid Course + VSL"}
**Niche:** ${niche}
**Product Name:** ${product_name}
**Target Audience:** ${target_audience}
**Tone:** ${tone}
${durationNote}
${templateNote}

Generate a complete, professional outline following these rules:
- For courses: Include intro, 2-5 content modules, and outro. Each module has 1-5 lessons.
- For VSLs: Follow Hook → Problem → Agitation → Solution → Proof → Offer → Urgency → CTA structure.
- For hybrid: Combine a VSL hook with free value lessons, then a pitch.
- Each lesson should have a compelling title and 3-5 key points.
- scene_types options: "title_card", "content", "stat", "testimonial", "cta", "recap"
- Duration should total approximately ${duration_target ? Math.round(duration_target / 60) : 30} minutes.

Return a JSON object with this exact structure:
{
  "title": "Compelling Course/Product Title",
  "modules": [
    {
      "title": "Module Title",
      "type": "intro|lesson|cta|testimonial|bonus|outro",
      "lessons": [
        {
          "title": "Lesson Title",
          "duration_seconds": 300,
          "key_points": ["point 1", "point 2", "point 3"],
          "scene_types": ["title_card", "content", "content", "recap"]
        }
      ]
    }
  ]
}`;
}
