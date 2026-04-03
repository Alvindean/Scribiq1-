import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedText } from "../components/AnimatedText";

interface TitleCardProps {
  title: string;
  subtitle?: string;
  primaryColor: string;
  backgroundColor: string;
  durationInFrames: number;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  primaryColor,
  backgroundColor,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Divider line grows from 0 to 80% width
  const lineWidth = interpolate(frame, [15, 40], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle fades in after the title
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out near end
  const containerOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: containerOpacity }}>
      <GradientBackground
        primaryColor={backgroundColor}
        secondaryColor={primaryColor}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 0,
          padding: "0 10%",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 900,
            width: "100%",
          }}
        >
          <AnimatedText
            text={title}
            animation="fade-up"
            delay={0}
            style={{
              display: "block",
              color: "#ffffff",
              fontSize: 72,
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          />

          {/* Animated divider */}
          <div
            style={{
              width: `${lineWidth}%`,
              height: 4,
              backgroundColor: "#ffffff",
              margin: "0 auto 24px",
              borderRadius: 2,
              opacity: 0.6,
            }}
          />

          {subtitle && (
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 32,
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                lineHeight: 1.4,
                margin: 0,
                opacity: subtitleOpacity,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
