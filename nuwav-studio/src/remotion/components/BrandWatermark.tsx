import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img } from "remotion";

type WatermarkPosition = "top-right" | "bottom-right";

interface BrandWatermarkProps {
  logoUrl?: string;
  companyName: string;
  position?: WatermarkPosition;
}

export const BrandWatermark: React.FC<BrandWatermarkProps> = ({
  logoUrl,
  companyName,
  position = "bottom-right",
}) => {
  const frame = useCurrentFrame();

  // Fade in over the first 20 frames
  const opacity = interpolate(frame, [0, 20], [0, 0.75], {
    extrapolateRight: "clamp",
  });

  const positionStyle: React.CSSProperties =
    position === "top-right"
      ? { top: 24, right: 24 }
      : { bottom: 24, right: 24 };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...positionStyle,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity,
        }}
      >
        {logoUrl && (
          <Img
            src={logoUrl}
            style={{
              height: 28,
              width: "auto",
              objectFit: "contain",
            }}
          />
        )}
        <span
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            letterSpacing: "0.02em",
          }}
        >
          {companyName}
        </span>
      </div>
    </AbsoluteFill>
  );
};
