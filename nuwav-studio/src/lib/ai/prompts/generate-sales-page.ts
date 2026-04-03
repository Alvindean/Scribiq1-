export interface SalesPageInput {
  product_name: string;
  niche: string;
  target_audience: string;
  key_benefits: string[];
  price: string;
  vsl_headline?: string;
  tone?: string;
}

export function buildSalesPagePrompt(input: SalesPageInput): string {
  const {
    product_name,
    niche,
    target_audience,
    key_benefits,
    price,
    vsl_headline,
    tone = "professional",
  } = input;

  return `You are an expert copywriter. Create compelling sales page copy for the following product.

**Product:** ${product_name}
**Niche:** ${niche}
**Audience:** ${target_audience}
**Price:** ${price}
**Tone:** ${tone}
${vsl_headline ? `**VSL Headline:** ${vsl_headline}` : ""}

**Key Benefits:**
${key_benefits.map((b) => `- ${b}`).join("\n")}

Generate a complete JSON object with the following sales page sections:
{
  "headline": "Main headline",
  "subheadline": "Supporting subheadline",
  "hero_cta": "Button text",
  "benefits_section": {
    "heading": "Section heading",
    "items": [{"icon": "emoji", "title": "Benefit title", "description": "Short description"}]
  },
  "social_proof": {
    "heading": "Section heading",
    "testimonials": [{"name": "Name", "role": "Role", "quote": "Testimonial text"}]
  },
  "offer_section": {
    "heading": "What You Get",
    "items": [{"title": "Item", "value": "$X value"}],
    "total_value": "$X",
    "price": "${price}",
    "cta": "Button text"
  },
  "guarantee": {
    "heading": "Guarantee heading",
    "body": "Guarantee text"
  },
  "faq": [{"question": "Q?", "answer": "A."}]
}`;
}
