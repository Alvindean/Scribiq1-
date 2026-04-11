// ─── Course Template Definitions ─────────────────────────────────────────────

export interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  type: "course" | "vsl" | "hybrid";
  modules: Array<{
    title: string;
    type: "intro" | "core" | "outro" | "bonus";
    lessons: Array<{ title: string; description?: string }>;
  }>;
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    id: "how-to-course",
    name: "How-To Course",
    description: "A classic step-by-step format: welcome your students, deliver core training, then wrap up with clear next steps.",
    icon: "GraduationCap",
    badge: "Popular",
    type: "course",
    modules: [
      {
        title: "Welcome & Introduction",
        type: "intro",
        lessons: [
          { title: "Welcome to the Course", description: "Set expectations, introduce yourself, and get students excited." },
          { title: "What You Will Learn", description: "Outline the key outcomes and the journey ahead." },
        ],
      },
      {
        title: "Core Training",
        type: "core",
        lessons: [
          { title: "Lesson 1 \u2014 Foundations", description: "Cover the essential concepts students need before going deeper." },
          { title: "Lesson 2 \u2014 Step-by-Step Walkthrough", description: "Walk through the main process in detail." },
          { title: "Lesson 3 \u2014 Common Mistakes & How to Avoid Them", description: "Address pitfalls and misconceptions head-on." },
          { title: "Lesson 4 \u2014 Advanced Tips", description: "Share pro-level insights to help students level up." },
        ],
      },
      {
        title: "Wrap-Up & Next Steps",
        type: "outro",
        lessons: [
          { title: "Recap & Key Takeaways", description: "Summarise what students learned and reinforce key points." },
          { title: "Your Next Steps", description: "Give students a clear action plan to implement immediately." },
        ],
      },
    ],
  },
  {
    id: "mini-course",
    name: "Mini-Course",
    description: "Focused and fast \u2014 teach one key skill with three core lessons, then give students a concrete action plan.",
    icon: "Zap",
    type: "course",
    modules: [
      {
        title: "Core Concepts",
        type: "core",
        lessons: [
          { title: "The Core Idea", description: "Introduce the single most important concept." },
          { title: "How It Works in Practice", description: "Make the idea tangible with a real example." },
          { title: "The Key Insight", description: "Share the aha-moment that changes everything." },
        ],
      },
      {
        title: "Action Plan",
        type: "outro",
        lessons: [
          { title: "Your 3-Step Quick Win", description: "Give students three simple actions to take today." },
          { title: "What to Do Next", description: "Point to resources, community, or the next course." },
        ],
      },
    ],
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start with a completely empty project and build your own structure from scratch.",
    icon: "FileText",
    type: "course",
    modules: [],
  },
];

export function getTemplateById(id: string): CourseTemplate | undefined {
  return COURSE_TEMPLATES.find((t) => t.id === id);
}

export function templateLessonCount(template: CourseTemplate): number {
  return template.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}
