import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";

export interface LessonVideoProps {
  title: string;
  script: string;
  modules: string;
  slideBackground?: string;
}

// ---------------------------------------------------------------------------
// Script parsing
// ---------------------------------------------------------------------------

const SCENE_MARKER = /\[(?:SCENE|SLIDE|TITLE CARD)[^\]]*\]/gi;
const FRAMES_PER_SLIDE = 150; // 5 seconds at 30fps
const CHARS_PER_CHUNK = 200;
const MAX_BULLETS = 3;

function chunkByChars(text: string): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();
  while (remaining.length > 0) {
    if (remaining.length <= CHARS_PER_CHUNK) {
      chunks.push(remaining);
      break;
    }
    // Try to break at a sentence boundary within the target range
    let splitAt = remaining.lastIndexOf(".", CHARS_PER_CHUNK);
    if (splitAt < 50) splitAt = remaining.lastIndexOf(" ", CHARS_PER_CHUNK);
    if (splitAt < 50) splitAt = CHARS_PER_CHUNK;
    chunks.push(remaining.slice(0, splitAt + 1).trim());
    remaining = remaining.slice(splitAt + 1).trim();
  }
  return chunks;
}

function extractBullets(text: string): string[] {
  // Pull out lines that look like bullet points (leading -, *, •, or number.)
  const bulletPattern = /^[\s]*[-*•][\s]+(.+)$/gm;
  const numberedPattern = /^[\s]*\d+[.)]\s+(.+)$/gm;
  const bullets: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = bulletPattern.exec(text)) !== null) {
    bullets.push(match[1].trim());
  }
  while ((match = numberedPattern.exec(text)) !== null) {
    bullets.push(match[1].trim());
  }

  return bullets.slice(0, MAX_BULLETS);
}

interface ParsedSlide {
  kind: "title" | "content" | "outro";
  heading: string;
  bullets: string[];
}

function parseScript(title: string, script: string): ParsedSlide[] {
  const slides: ParsedSlide[] = [];

  // Title slide
  slides.push({ kind: "title", heading: title, bullets: [] });

  if (script.trim().length > 0) {
    // Try to split by scene/slide markers first
    const parts = script
      .split(SCENE_MARKER)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const segments =
      parts.length > 1
        ? parts
        : chunkByChars(script); // Fall back to char-based chunking

    for (const segment of segments) {
      const bullets = extractBullets(segment);

      if (bullets.length > 0) {
        // Use first sentence / short fragment as heading
        const firstLine = segment.split(/[\n.]/)[0].trim().replace(/^[-*•\d.)]+\s*/, "");
        slides.push({
          kind: "content",
          heading: firstLine.slice(0, 80) || "Key Points",
          bullets,
        });
      } else {
        // Plain text — use first sentence as heading, rest as a single bullet
        const sentences = segment.split(/(?<=[.!?])\s+/);
        const heading = sentences[0]?.slice(0, 80) ?? segment.slice(0, 80);
        const body = sentences.slice(1).join(" ").trim();
        slides.push({
          kind: "content",
          heading,
          bullets: body.length > 0 ? [body.slice(0, 140)] : [],
        });
      }
    }
  }

  // Outro
  slides.push({ kind: "outro", heading: "End of Lesson", bullets: [] });

  return slides;
}

// ---------------------------------------------------------------------------
// Slide components (inline — no browser APIs, inline styles only)
// ---------------------------------------------------------------------------

const TitleSlide: React.FC<{ heading: string }> = ({ heading }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateRight: "clamp",
  });
  // Fade out last 15 frames
  const exitOpacity = interpolate(
    frame,
    [FRAMES_PER_SLIDE - 15, FRAMES_PER_SLIDE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: Math.min(opacity, exitOpacity),
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
          padding: "0 10%",
          maxWidth: 1200,
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: 72,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {heading}
        </h1>
      </div>
    </AbsoluteFill>
  );
};

const ContentSlideComp: React.FC<{
  heading: string;
  bullets: string[];
  background?: string;
}> = ({ heading, bullets, background = "#0f0e1a" }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 20], [24, 0], {
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(
    frame,
    [FRAMES_PER_SLIDE - 15, FRAMES_PER_SLIDE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        padding: "80px 120px",
        opacity: Math.min(fadeIn, exitOpacity),
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 8,
          height: "100%",
          background: "linear-gradient(180deg, #7c3aed 0%, #4f46e5 100%)",
        }}
      />

      <div
        style={{
          transform: `translateY(${translateY}px)`,
          width: "100%",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            fontSize: 56,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            margin: "0 0 48px 0",
          }}
        >
          {heading}
        </h2>

        {bullets.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {bullets.map((bullet, i) => {
              const bulletFade = interpolate(frame, [15 + i * 10, 30 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const bulletSlide = interpolate(frame, [15 + i * 10, 30 + i * 10], [20, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 20,
                    opacity: bulletFade,
                    transform: `translateX(${bulletSlide}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      marginTop: 10,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.88)",
                      fontSize: 30,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: 400,
                      lineHeight: 1.55,
                    }}
                  >
                    {bullet}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AbsoluteFill>
  );
};

const OutroSlide: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 20], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          fontSize: 80,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          margin: 0,
          transform: `scale(${scale})`,
        }}
      >
        End of Lesson
      </h2>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

export const LessonVideo: React.FC<LessonVideoProps> = ({
  title,
  script,
  modules: _modules,
  slideBackground,
}) => {
  const slides = parseScript(title, script);
  const totalFrames = slides.length * FRAMES_PER_SLIDE;

  return (
    <AbsoluteFill style={{ backgroundColor: slideBackground ?? "#0f0e1a" }}>
      {slides.map((slide, index) => {
        const from = index * FRAMES_PER_SLIDE;

        if (slide.kind === "title") {
          return (
            <Sequence key={index} from={from} durationInFrames={FRAMES_PER_SLIDE}>
              <TitleSlide heading={slide.heading} />
            </Sequence>
          );
        }

        if (slide.kind === "outro") {
          return (
            <Sequence key={index} from={from} durationInFrames={FRAMES_PER_SLIDE}>
              <OutroSlide />
            </Sequence>
          );
        }

        return (
          <Sequence key={index} from={from} durationInFrames={FRAMES_PER_SLIDE}>
            <ContentSlideComp
              heading={slide.heading}
              bullets={slide.bullets}
              background={slideBackground}
            />
          </Sequence>
        );
      })}

      {/* Invisible element to consume totalFrames so TS doesn't complain */}
      {totalFrames > 0 && null}
    </AbsoluteFill>
  );
};
