import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface StatSlideProps {
  stat: number;
  statLabel: string;
  context?: string;
  primaryColor: string;
  durationInFrames: number;
}

export const StatSlide: React.FC<StatSlideProps> = ({
  stat,
  statLabel,
  context,
  primaryColor,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count up the stat number over 45 frames starting at frame 5
  const displayValue = Math.round(
    interpolate(frame, [5, 50], [0, stat], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Scale spring for the number — starts big and settles
  const scale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1.2 },
    from: 0.5,
    to: 1,
  });

  const numberOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label fades up after number
  const labelOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelTranslateY = interpolate(frame, [30, 50], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Context fades in last
  const contextOpacity = interpolate(frame, [50, 65], [0, 1], {
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

  // Format large numbers with commas
  const formattedStat = displayValue.toLocaleString();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a12",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 16,
        opacity: containerOpacity,
      }}
    >
      {/* Background circle accent */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          opacity: numberOpacity,
          transform: `scale(${scale})`,
          color: primaryColor,
          fontSize: 160,
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textAlign: "center",
        }}
      >
        {formattedStat}
      </div>

      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelTranslateY}px)`,
          color: "#ffffff",
          fontSize: 40,
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {statLabel}
      </div>

      {context && (
        <div
          style={{
            opacity: contextOpacity,
            color: "rgba(255,255,255,0.55)",
            fontSize: 24,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          {context}
        </div>
      )}
    </AbsoluteFill>
  );
};
