// ─── Course Template Definitions ─────────────────────────────────────────────
// These are static, code-defined templates (separate from DB `templates` table).
// Used by the TemplateSelector component and the apply-template API route.

export interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  badge?: string; // "Popular", "New"
  type: "course" | "vsl" | "hybrid";
  modules: Array<{
    title: string;
    type: "intro" | "core" | "outro" | "bonus";
    lessons: Array<{ title: string; description?: string }>;
  }>;
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  // 1 ─ How-To Course ─────────────────────────────────────────────────────────
  {
    id: "how-to-course",
    name: "How-To Course",
    description:
      "A classic step-by-step format: welcome your students, deliver core training, then wrap up with clear next steps.",
    icon: "GraduationCap",
    badge: "Popular",
    type: "course",
    modules: [
      {
        title: "Welcome & Introduction",
        type: "intro",
        lessons: [
          {
            title: "Welcome to the Course",
            description: "Set expectations, introduce yourself, and get students excited.",
          },
          {
            title: "What You Will Learn",
            description: "Outline the key outcomes and the journey ahead.",
          },
        ],
      },
      {
        title: "Core Training",
        type: "core",
        lessons: [
          {
            title: "Lesson 1 — Foundations",
            description: "Cover the essential concepts students need before going deeper.",
          },
          {
            title: "Lesson 2 — Step-by-Step Walkthrough",
            description: "Walk through the main process in detail.",
          },
          {
            title: "Lesson 3 — Common Mistakes & How to Avoid Them",
            description: "Address pitfalls and misconceptions head-on.",
          },
          {
            title: "Lesson 4 — Advanced Tips",
            description: "Share pro-level insights to help students level up.",
          },
        ],
      },
      {
        title: "Wrap-Up & Next Steps",
        type: "outro",
        lessons: [
          {
            title: "Recap & Key Takeaways",
            description: "Summarise what students learned and reinforce key points.",
          },
          {
            title: "Your Next Steps",
            description: "Give students a clear action plan to implement immediately.",
          },
        ],
      },
    ],
  },

  // 2 ─ Masterclass ───────────────────────────────────────────────────────────
  {
    id: "masterclass",
    name: "Masterclass",
    description:
      "An in-depth, premium format. Start with foundations, explore advanced concepts across multiple modules, then bring it all together.",
    icon: "Star",
    type: "course",
    modules: [
      {
        title: "Foundations",
        type: "intro",
        lessons: [
          {
            title: "The Big Picture",
            description: "Frame the topic and explain why it matters.",
          },
          {
            title: "Core Principles",
            description: "Establish the mental models that underpin everything else.",
          },
          {
            title: "Your Starting Point",
            description: "Help students assess where they are today.",
          },
        ],
      },
      {
        title: "Advanced Concepts — Part 1",
        type: "core",
        lessons: [
          { title: "Deep Dive — Topic A", description: "Explore the first advanced area in depth." },
          { title: "Deep Dive — Topic B", description: "Layer in the second key concept." },
        ],
      },
      {
        title: "Advanced Concepts — Part 2",
        type: "core",
        lessons: [
          { title: "Deep Dive — Topic C", description: "Continue with the third advanced area." },
          { title: "Deep Dive — Topic D", description: "Round out the advanced content." },
        ],
      },
      {
        title: "Advanced Concepts — Part 3",
        type: "core",
        lessons: [
          { title: "Case Study Breakdown", description: "Walk through a real-world example." },
          { title: "Expert Strategies", description: "Share tactics only insiders know." },
        ],
      },
      {
        title: "Putting It Together",
        type: "outro",
        lessons: [
          {
            title: "Building Your Personalised Plan",
            description: "Guide students to apply everything to their specific situation.",
          },
          {
            title: "Masterclass Recap",
            description: "Celebrate progress and set students up for continued success.",
          },
        ],
      },
    ],
  },

  // 3 ─ Mini-Course ───────────────────────────────────────────────────────────
  {
    id: "mini-course",
    name: "Mini-Course",
    description:
      "Focused and fast — teach one key skill with three core lessons, then give students a concrete action plan.",
    icon: "Zap",
    type: "course",
    modules: [
      {
        title: "Core Concepts",
        type: "core",
        lessons: [
          {
            title: "The Core Idea",
            description: "Introduce the single most important concept.",
          },
          {
            title: "How It Works in Practice",
            description: "Make the idea tangible with a real example.",
          },
          {
            title: "The Key Insight",
            description: "Share the aha-moment that changes everything.",
          },
        ],
      },
      {
        title: "Action Plan",
        type: "outro",
        lessons: [
          {
            title: "Your 3-Step Quick Win",
            description: "Give students three simple actions to take today.",
          },
          {
            title: "What to Do Next",
            description: "Point to resources, community, or the next course.",
          },
        ],
      },
    ],
  },

  // 4 ─ 7-Day Challenge ───────────────────────────────────────────────────────
  {
    id: "7-day-challenge",
    name: "7-Day Challenge",
    description:
      "A daily drip-feed format that builds momentum. One focused module per day keeps students engaged all week.",
    icon: "CalendarDays",
    type: "course",
    modules: [
      {
        title: "Day 1 — Foundation",
        type: "intro",
        lessons: [
          { title: "Welcome to the Challenge", description: "Set the rules and build excitement." },
          { title: "Your Day 1 Task", description: "The first action step to get the ball rolling." },
        ],
      },
      {
        title: "Day 2 — Momentum",
        type: "core",
        lessons: [{ title: "Day 2 Lesson & Task", description: "Build on Day 1 with the next step." }],
      },
      {
        title: "Day 3 — Depth",
        type: "core",
        lessons: [{ title: "Day 3 Lesson & Task", description: "Go deeper into the core skill." }],
      },
      {
        title: "Day 4 — Midpoint Check-In",
        type: "core",
        lessons: [
          { title: "Day 4 Lesson", description: "Introduce the halfway milestone concept." },
          { title: "Midpoint Review", description: "Help students reflect and recalibrate." },
        ],
      },
      {
        title: "Day 5 — Advanced Move",
        type: "core",
        lessons: [{ title: "Day 5 Lesson & Task", description: "Level up with an advanced technique." }],
      },
      {
        title: "Day 6 — Integration",
        type: "core",
        lessons: [{ title: "Day 6 Lesson & Task", description: "Bring the pieces together." }],
      },
      {
        title: "Day 7 — Victory Lap",
        type: "outro",
        lessons: [
          { title: "Final Challenge Task", description: "The capstone action that proves mastery." },
          { title: "Celebrate & What's Next", description: "Acknowledge wins and give the next step." },
        ],
      },
    ],
  },

  // 5 ─ Bootcamp ──────────────────────────────────────────────────────────────
  {
    id: "bootcamp",
    name: "Bootcamp",
    description:
      "An intensive multi-week program: orientation, two weeks of core training, two weeks of advanced work, then graduation.",
    icon: "Dumbbell",
    type: "course",
    modules: [
      {
        title: "Orientation",
        type: "intro",
        lessons: [
          { title: "Welcome to the Bootcamp", description: "Introduce the program and community." },
          { title: "Setting Up for Success", description: "Tools, mindset, and daily commitments." },
          { title: "Bootcamp Overview", description: "Walk through the four-week roadmap." },
        ],
      },
      {
        title: "Weeks 1–2 — Core Skills",
        type: "core",
        lessons: [
          { title: "Week 1 — Skill Block A", description: "Core competency number one." },
          { title: "Week 1 — Skill Block B", description: "Core competency number two." },
          { title: "Week 2 — Practice & Feedback", description: "Apply the skills and review progress." },
          { title: "Week 2 — Milestone Project", description: "Complete the first major deliverable." },
        ],
      },
      {
        title: "Weeks 3–4 — Advanced Training",
        type: "core",
        lessons: [
          { title: "Week 3 — Advanced Skill A", description: "Elevate the first core skill." },
          { title: "Week 3 — Advanced Skill B", description: "Elevate the second core skill." },
          { title: "Week 4 — Capstone Project", description: "Build the final, comprehensive project." },
          { title: "Week 4 — Peer Review", description: "Give and receive structured feedback." },
        ],
      },
      {
        title: "Graduation",
        type: "outro",
        lessons: [
          { title: "Final Debrief", description: "Review everything covered over four weeks." },
          { title: "Graduation & Certification", description: "Celebrate completion and award credentials." },
          { title: "What Comes Next", description: "Career, community, and continued learning paths." },
        ],
      },
    ],
  },

  // 6 ─ Workshop ──────────────────────────────────────────────────────────────
  {
    id: "workshop",
    name: "Workshop",
    description:
      "A hands-on live-session format with pre-work to prime students, five interactive exercises, and a resources hub for replay access.",
    icon: "Wrench",
    badge: "New",
    type: "course",
    modules: [
      {
        title: "Pre-Work",
        type: "intro",
        lessons: [
          {
            title: "Before You Join — What to Prepare",
            description: "Assignments and reading to complete before the live session.",
          },
          {
            title: "Workshop Goals & Agenda",
            description: "Set clear expectations for what will be achieved.",
          },
        ],
      },
      {
        title: "Live Workshop",
        type: "core",
        lessons: [
          { title: "Exercise 1 — Warm-Up", description: "A quick activity to get everyone aligned." },
          { title: "Exercise 2 — Core Skill Practice", description: "The main hands-on drill." },
          { title: "Exercise 3 — Group Challenge", description: "Collaborative problem-solving." },
          { title: "Exercise 4 — Real-World Application", description: "Apply the skill to your own situation." },
          { title: "Exercise 5 — Hot Seats & Q&A", description: "Live coaching and group learning." },
        ],
      },
      {
        title: "Resources & Replay",
        type: "outro",
        lessons: [
          { title: "Workshop Replay", description: "Full recording of the live session." },
          { title: "Downloadable Resources", description: "Worksheets, templates, and reference guides." },
          { title: "Implementation Checklist", description: "Step-by-step actions to take after the workshop." },
        ],
      },
    ],
  },

  // 7 ─ VSL + Course Combo ────────────────────────────────────────────────────
  {
    id: "vsl-course-combo",
    name: "VSL + Course Combo",
    description:
      "Start with a high-converting video sales letter, then deliver a full course. Perfect for selling and teaching in one flow.",
    icon: "Play",
    type: "hybrid",
    modules: [
      {
        title: "VSL Introduction",
        type: "intro",
        lessons: [
          {
            title: "The Hook — Grab Attention",
            description: "Open with a pattern interrupt that stops the scroll.",
          },
          {
            title: "The Problem — Agitate the Pain",
            description: "Describe the core problem your audience faces vividly.",
          },
          {
            title: "The Solution — Introduce Your Offer",
            description: "Present your product as the answer they have been searching for.",
          },
          {
            title: "Social Proof & CTA",
            description: "Stack testimonials and end with a clear call to action.",
          },
        ],
      },
      {
        title: "Course Module 1 — Quick Wins",
        type: "core",
        lessons: [
          { title: "Fast Result #1", description: "Deliver an early win to build confidence." },
          { title: "Fast Result #2", description: "Stack another quick win to maintain momentum." },
        ],
      },
      {
        title: "Course Module 2 — Core Content",
        type: "core",
        lessons: [
          { title: "Core Lesson A", description: "The most important skill or framework." },
          { title: "Core Lesson B", description: "Deepen understanding with the second key topic." },
          { title: "Core Lesson C", description: "Complete the core content arc." },
        ],
      },
      {
        title: "Course Module 3 — Wrap-Up & Upsell",
        type: "outro",
        lessons: [
          { title: "Results Review", description: "Celebrate the transformation students have made." },
          { title: "Next Level Offer", description: "Present the natural next step or upsell." },
        ],
      },
    ],
  },

  // 8 ─ Blank ─────────────────────────────────────────────────────────────────
  {
    id: "blank",
    name: "Blank",
    description:
      "Start with a completely empty project and build your own structure from scratch.",
    icon: "FileText",
    type: "course",
    modules: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTemplateById(id: string): CourseTemplate | undefined {
  return COURSE_TEMPLATES.find((t) => t.id === id);
}

/** Total lesson count across all modules in a template. */
export function templateLessonCount(template: CourseTemplate): number {
  return template.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}
