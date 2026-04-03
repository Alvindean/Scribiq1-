import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";

interface CTASlideProps {
  ctaText: string;
  subText?: string;
  primaryColor: string;
  durationInFrames: number;
}

export const CTASlide: React.FC<CTASlideProps> = ({
  ctaText,
  subText,
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

  // Pulsing background scale — uses interpolate with a looped frame
  const pulseFrame = frame % 60;
  const pulseScale = interpolate(pulseFrame, [0, 30, 60], [1, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow opacity
  const glowOpacity = interpolate(pulseFrame, [0, 30, 60], [0.15, 0.35, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA text entrance — scale-in with spring
  const ctaScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1.2 },
    from: 0.7,
    to: 1,
  });

  const ctaOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // SubText fades in after CTA
  const subOpacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const subTranslateY = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 80 },
    from: 16,
    to: 0,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080810",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 32,
        opacity: containerOpacity,
      }}
    >
      {/* Pulsing radial glow behind CTA */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 65%)`,
          opacity: glowOpacity,
          transform: `scale(${pulseScale})`,
          pointerEvents: "none",
        }}
      />

      {/* CTA text */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          textAlign: "center",
          padding: "0 80px",
          maxWidth: 1000,
        }}
      >
        <AnimatedText
          text={ctaText}
          animation="scale-in"
          delay={0}
          fps={fps}
          style={{
            display: "block",
            color: "#ffffff",
            fontSize: 80,
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            textAlign: "center",
          }}
        />
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: interpolate(frame, [15, 40], [0, 200], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 4,
          backgroundColor: primaryColor,
          borderRadius: 2,
        }}
      />

      {/* SubText */}
      {subText && (
        <p
          style={{
            opacity: subOpacity,
            transform: `translateY(${subTranslateY}px)`,
            color: "rgba(255,255,255,0.7)",
            fontSize: 32,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            margin: 0,
            padding: "0 40px",
          }}
        >
          {subText}
        </p>
      )}
    </AbsoluteFill>
  );
};
