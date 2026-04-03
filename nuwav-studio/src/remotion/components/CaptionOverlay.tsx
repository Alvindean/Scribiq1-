import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface Caption {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface CaptionOverlayProps {
  captions: Caption[];
}

const FADE_FRAMES = 6;

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({ captions }) => {
  const frame = useCurrentFrame();

  const activeCaption = captions.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  if (!activeCaption) return null;

  const { text, startFrame, endFrame } = activeCaption;

  // Fade in over FADE_FRAMES at the start, fade out over FADE_FRAMES at the end
  const opacity = interpolate(
    frame,
    [
      startFrame,
      startFrame + FADE_FRAMES,
      endFrame - FADE_FRAMES,
      endFrame,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 60,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          maxWidth: "80%",
          textAlign: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#ffffff",
          fontSize: 32,
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          padding: "12px 28px",
          borderRadius: 8,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
