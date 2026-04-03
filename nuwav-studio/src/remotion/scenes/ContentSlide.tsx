import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img } from "remotion";
import { AnimatedText } from "../components/AnimatedText";

interface ContentSlideProps {
  heading: string;
  body: string;
  imageUrl?: string;
  bulletPoints?: string[];
  primaryColor: string;
  durationInFrames: number;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
  heading,
  body,
  imageUrl,
  bulletPoints,
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

  // Body text fade-up
  const bodyOpacity = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyTranslateY = interpolate(frame, [18, 35], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Image slides in from right
  const imageTranslateX = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 80 },
    from: 60,
    to: 0,
  });
  const imageOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hasBullets = bulletPoints && bulletPoints.length > 0;
  const hasImage = Boolean(imageUrl);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f1a",
        opacity: containerOpacity,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 6,
          height: "100%",
          backgroundColor: primaryColor,
        }}
      />

      <AbsoluteFill
        style={{
          flexDirection: hasImage ? "row" : "column",
          alignItems: "center",
          padding: "60px 80px 60px 86px",
          gap: 60,
        }}
      >
        {/* Text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <AnimatedText
            text={heading}
            animation="fade-up"
            delay={0}
            style={{
              display: "block",
              color: "#ffffff",
              fontSize: 52,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          />

          {/* Heading underline */}
          <div
            style={{
              width: interpolate(frame, [8, 25], [0, 64], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              height: 4,
              backgroundColor: primaryColor,
              borderRadius: 2,
            }}
          />

          {!hasBullets && (
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 28,
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                lineHeight: 1.6,
                margin: 0,
                opacity: bodyOpacity,
                transform: `translateY(${bodyTranslateY}px)`,
              }}
            >
              {body}
            </p>
          )}

          {hasBullets && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {bulletPoints!.map((bullet, index) => {
                const bulletOpacity = spring({
                  frame: frame - (20 + index * 8),
                  fps,
                  config: { damping: 20, stiffness: 100 },
                  from: 0,
                  to: 1,
                });
                const bulletTranslateX = spring({
                  frame: frame - (20 + index * 8),
                  fps,
                  config: { damping: 18, stiffness: 100 },
                  from: -20,
                  to: 0,
                });

                return (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      opacity: bulletOpacity,
                      transform: `translateX(${bulletTranslateX}px)`,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: primaryColor,
                        marginTop: 10,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 26,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        lineHeight: 1.5,
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

        {/* Optional image */}
        {hasImage && (
          <div
            style={{
              flex: "0 0 420px",
              opacity: imageOpacity,
              transform: `translateX(${imageTranslateX}px)`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <Img
              src={imageUrl!}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
