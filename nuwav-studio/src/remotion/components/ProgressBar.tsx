import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface ProgressBarProps {
  totalFrames: number;
  fps: number;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalFrames,
  fps: _fps,
  color = "#ffffff",
  height = 3,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, totalFrames - 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade in over first 10 frames
  const opacity = interpolate(frame, [0, 10], [0, 0.8], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height,
          backgroundColor: "rgba(255,255,255,0.2)",
          opacity,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
