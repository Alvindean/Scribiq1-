export interface VSLInput {
  product_name: string;
  niche: string;
  target_audience: string;
  pain_points: string[];
  benefits: string[];
  price?: string;
  duration_target?: number; // seconds
  tone?: string;
}

export function buildVSLPrompt(input: VSLInput): string {
  const {
    product_name,
    niche,
    target_audience,
    pain_points,
    benefits,
    price,
    duration_target,
    tone = "persuasive",
  } = input;

  const wordCount = duration_target
    ? Math.round((duration_target / 60) * 130)
    : 1500;

  return `You are a world-class direct response copywriter. Write a complete Video Sales Letter (VSL) script for the following product.

**Product Name:** ${product_name}
**Niche:** ${niche}
**Target Audience:** ${target_audience}
**Tone:** ${tone}
**Target Length:** ~${wordCount} words (~${Math.round(wordCount / 130)} minutes)
${price ? `**Price:** ${price}` : ""}

**Pain Points:**
${pain_points.map((p) => `- ${p}`).join("\n")}

**Benefits:**
${benefits.map((b) => `- ${b}`).join("\n")}

Write a complete VSL script following this proven structure:
1. **HOOK** — Grab attention immediately (shocking stat, bold claim, or question)
2. **PROBLEM** — Describe the pain in vivid detail; make them feel understood
3. **AGITATION** — Amplify the problem; show the cost of inaction
4. **SOLUTION** — Reveal the product as the answer
5. **PROOF** — Social proof, testimonials, results, credentials
6. **OFFER** — Present what's included; stack the value
7. **URGENCY** — Create genuine scarcity or time pressure
8. **CTA** — Clear, direct call to action with risk reversal

Use these scene markers:
- [TITLE CARD: Text] — opening hook title
- [SLIDE: Heading] — new section
- [VISUAL: Description] — imagery description
- [STAT: Statistic] — data points
- [TESTIMONIAL: Name | Quote] — social proof
- [OFFER STACK: Item name | Value] — offer components
- [CTA: Button text | URL] — call to action

Write the complete VSL script now:`;
}
