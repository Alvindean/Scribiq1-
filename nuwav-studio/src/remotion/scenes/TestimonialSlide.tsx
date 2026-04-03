import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
} from "remotion";

interface TestimonialSlideProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
  primaryColor: string;
  durationInFrames: number;
}

export const TestimonialSlide: React.FC<TestimonialSlideProps> = ({
  quote,
  author,
  role,
  avatarUrl,
  primaryColor,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade out near end
  const containerOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Opening quote mark scales in
  const quoteMarkScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
    from: 0,
    to: 1,
  });

  // Quote text fades up after the quote mark
  const quoteOpacity = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const quoteTranslateY = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 80 },
    from: 24,
    to: 0,
  });

  // Author block slides up after quote
  const authorOpacity = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const authorTranslateY = spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, stiffness: 80 },
    from: 16,
    to: 0,
  });

  // Avatar scale spring
  const avatarScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 16, stiffness: 90 },
    from: 0.6,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d1a",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 120px",
        opacity: containerOpacity,
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: primaryColor,
        }}
      />

      <div
        style={{
          maxWidth: 900,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Opening quote mark */}
        <div
          style={{
            color: primaryColor,
            fontSize: 120,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            lineHeight: 1,
            transform: `scale(${quoteMarkScale})`,
            transformOrigin: "center",
            opacity: quoteMarkScale,
            userSelect: "none",
            height: 80,
            display: "flex",
            alignItems: "center",
          }}
        >
          &ldquo;
        </div>

        {/* Quote text */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteTranslateY}px)`,
            color: "#ffffff",
            fontSize: 34,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            lineHeight: 1.6,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {quote}
        </div>

        {/* Author block */}
        <div
          style={{
            opacity: authorOpacity,
            transform: `translateY(${authorTranslateY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 8,
          }}
        >
          {avatarUrl && (
            <div
              style={{
                transform: `scale(${avatarScale})`,
                transformOrigin: "center",
                flexShrink: 0,
              }}
            >
              <Img
                src={avatarUrl}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${primaryColor}`,
                  display: "block",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
              }}
            >
              {author}
            </span>
            <span
              style={{
                color: primaryColor,
                fontSize: 18,
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
              }}
            >
              {role}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
