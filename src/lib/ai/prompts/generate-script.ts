export interface ScriptInput {
  lesson_title: string;
  key_points: string[];
  tone: string;
  target_audience: string;
  duration_seconds: number;
  previous_lesson_summary?: string;
  product_name?: string;
  niche?: string;
}

export function buildScriptPrompt(input: ScriptInput): string {
  const {
    lesson_title,
    key_points,
    tone,
    target_audience,
    duration_seconds,
    previous_lesson_summary,
    product_name,
    niche,
  } = input;

  const wordCount = Math.round((duration_seconds / 60) * 130);
  const contextNote = previous_lesson_summary
    ? `\nThe previous lesson covered: ${previous_lesson_summary}\n`
    : "";

  return `You are an expert scriptwriter for educational video content. Write a complete narration script for the following lesson.

**Lesson Title:** ${lesson_title}
**Target Audience:** ${target_audience}
**Tone:** ${tone}
**Duration Target:** ~${Math.round(duration_seconds / 60)} minutes (~${wordCount} words)
${product_name ? `**Product/Course:** ${product_name}` : ""}
${niche ? `**Niche:** ${niche}` : ""}
${contextNote}

**Key Points to Cover:**
${key_points.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Write the full narration script with scene markers. Use these exact markers:
- [TITLE CARD: Title Here] — opening title card
- [SLIDE: Key point or heading] — each new content slide
- [VISUAL: Description of what should be shown] — describe relevant imagery
- [STAT: number or statistic] — when presenting data
- [PAUSE] — for dramatic pauses
- [CTA: Call to action text] — at the end if appropriate

Guidelines:
- Write in a conversational, engaging ${tone} tone
- Address the audience as "you"
- Use short sentences for clarity
- Include smooth transitions between points
- End with a clear takeaway or summary
- Do NOT include timestamps or stage directions outside the markers above

Write the complete script now:`;
}
