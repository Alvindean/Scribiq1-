import { generateJSON } from "@/lib/ai/claude";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SlideBackgroundColors {
  primary: string;
  accent: string;
  text: string;
}

export interface SlideBackground {
  /** A data-URL (<img src={svgDataUrl}>) or CSS background-image value */
  svgDataUrl: string;
  /** Ready-to-use CSS background string, e.g. for style={{ background }} */
  css: string;
  colors: SlideBackgroundColors;
}

/** Shape of the JSON object we ask the AI to return */
interface AIBackgroundSpec {
  gradient: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  overlayOpacity: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape a string so it is safe to embed in an SVG text node or attribute. */
function escapeSvg(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build an SVG document (1344 × 768, 16:9) that visually represents the
 * AI-generated colour palette.  The SVG uses an inline <linearGradient> so
 * it renders without any external resources and is safe as a data-URL.
 *
 * Layout:
 *   - Gradient background rect
 *   - Three semi-transparent geometric shapes for visual interest
 *   - A subtle overlay rect to honour overlayOpacity
 */
function buildSvg(spec: AIBackgroundSpec): string {
  const { primaryColor, accentColor, overlayOpacity } = spec;

  // Clamp opacity to a safe range regardless of what the AI returned.
  const opacity = Math.min(0.8, Math.max(0, Number(overlayOpacity) || 0));

  // Parse the AI's gradient string.  We derive the angle and up to 4 stops
  // from a "linear-gradient(…)" expression.  If anything looks wrong we fall
  // back to a safe two-stop gradient between primary and accent.
  let gradientAngle = "45deg";
  let gradientId = "bg";

  // Very lenient extraction: pull all #hex or rgb() tokens and the angle.
  const angleMatch = spec.gradient.match(/(\d+deg)/);
  if (angleMatch) gradientAngle = angleMatch[1];

  const colorTokens = spec.gradient.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g) ?? [];
  const stops =
    colorTokens.length >= 2
      ? colorTokens
      : [primaryColor, accentColor];

  // Convert angle to SVG gradient vector (x1,y1 → x2,y2 on a unit square).
  const angleDeg = parseInt(gradientAngle, 10) || 135;
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const x1 = (0.5 - 0.5 * Math.cos(rad)).toFixed(4);
  const y1 = (0.5 - 0.5 * Math.sin(rad)).toFixed(4);
  const x2 = (0.5 + 0.5 * Math.cos(rad)).toFixed(4);
  const y2 = (0.5 + 0.5 * Math.sin(rad)).toFixed(4);

  const stopElements = stops
    .map(
      (color, i) =>
        `<stop offset="${((i / (stops.length - 1)) * 100).toFixed(0)}%" stop-color="${escapeSvg(color)}" />`
    )
    .join("\n      ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1344 768" width="1344" height="768">
  <defs>
    <linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      ${stopElements}
    </linearGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="1344" height="768" fill="url(#${gradientId})" />

  <!-- Geometric accent shapes -->
  <circle cx="1150" cy="130" r="220" fill="${escapeSvg(accentColor)}" opacity="0.18" />
  <circle cx="200"  cy="640" r="160" fill="${escapeSvg(primaryColor)}" opacity="0.15" />
  <polygon
    points="672,60 820,300 524,300"
    fill="${escapeSvg(accentColor)}"
    opacity="0.10"
  />
  <rect
    x="0" y="580" width="1344" height="188"
    fill="${escapeSvg(primaryColor)}"
    opacity="0.12"
  />

  <!-- Optional darkening / lightening overlay -->
  ${
    opacity > 0
      ? `<rect width="1344" height="768" fill="#000000" opacity="${opacity.toFixed(2)}" />`
      : ""
  }
</svg>`;

  return svg;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a slide background using AI-driven colour/gradient selection.
 *
 * No external image-generation API is involved — the AI returns a JSON colour
 * palette and we synthesise an SVG that can be used as:
 *   - `<img src={svgDataUrl} />`
 *   - `style={{ background: css }}`
 */
export async function generateSlideBackground(
  prompt: string
): Promise<SlideBackground> {
  // Ask the AI for a colour/gradient palette suited to the prompt.
  const spec = await generateJSON<AIBackgroundSpec>({
    systemPrompt:
      "You are a slide-design assistant. Return only a JSON object — no markdown, no explanation.",
    prompt: `Given this slide description: "${prompt}", return ONLY a JSON object with these fields:
{
  "gradient": "css linear-gradient string (e.g. linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%))",
  "primaryColor": "#hex",
  "accentColor": "#hex",
  "textColor": "#hex (choose a light or dark colour that contrasts well with the gradient)",
  "overlayOpacity": 0.0 to 0.8 (use 0 for bright gradients, up to 0.5 for very light ones that need darkening for legibility)
}`,
    maxTokens: 256,
    temperature: 0.6,
  });

  // Validate / fill defaults defensively.
  const primaryColor =
    typeof spec.primaryColor === "string" && spec.primaryColor.startsWith("#")
      ? spec.primaryColor
      : "#1a1a2e";
  const accentColor =
    typeof spec.accentColor === "string" && spec.accentColor.startsWith("#")
      ? spec.accentColor
      : "#e94560";
  const textColor =
    typeof spec.textColor === "string" && spec.textColor.startsWith("#")
      ? spec.textColor
      : "#ffffff";

  const safeSpec: AIBackgroundSpec = {
    gradient:
      typeof spec.gradient === "string" && spec.gradient.length > 0
        ? spec.gradient
        : `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
    primaryColor,
    accentColor,
    textColor,
    overlayOpacity: Number(spec.overlayOpacity) || 0,
  };

  // Build SVG and encode it as a data-URL.
  const svgMarkup = buildSvg(safeSpec);
  const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgMarkup).toString("base64")}`;

  // CSS background property — prefer the AI's gradient directly so it stays
  // lightweight (no network round-trip needed for the CSS-only use case).
  const css = safeSpec.gradient;

  return {
    svgDataUrl,
    css,
    colors: {
      primary: primaryColor,
      accent: accentColor,
      text: textColor,
    },
  };
}
