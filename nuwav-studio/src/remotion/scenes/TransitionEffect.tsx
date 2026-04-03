import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type TransitionType = "fade" | "slide-left" | "slide-up";

interface TransitionEffectProps {
  type?: TransitionType;
  durationInFrames: number;
}

export const TransitionEffect: React.FC<TransitionEffectProps> = ({
  type = "fade",
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  if (type === "fade") {
    // Fade to black and back (full transition: in + out)
    const opacity = interpolate(
      frame,
      [0, durationInFrames / 2, durationInFrames],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
          opacity,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === "slide-left") {
    // A solid panel sweeps left-to-right then right-to-left
    const translateX = interpolate(
      frame,
      [0, durationInFrames / 2, durationInFrames],
      [-100, 0, 100],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000000",
            transform: `translateX(${translateX}%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  if (type === "slide-up") {
    // A solid panel sweeps bottom-to-top then top-to-bottom
    const translateY = interpolate(
      frame,
      [0, durationInFrames / 2, durationInFrames],
      [100, 0, -100],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000000",
            transform: `translateY(${translateY}%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return null;
};
