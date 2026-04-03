import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface GradientBackgroundProps {
  primaryColor: string;
  secondaryColor: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  primaryColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();

  // Animate the gradient angle slowly over time (0 → 360 over 300 frames)
  const angle = interpolate(frame, [0, 300], [135, 225], {
    extrapolateRight: "clamp",
  });

  // Subtle background brightness pulse
  const brightness = interpolate(frame, [0, 60, 120], [0.92, 1, 0.92], {
    extrapolateRight: "clamp",
  });

  // Mesh overlay opacity — fades in gently
  const meshOpacity = interpolate(frame, [0, 30], [0, 0.15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${primaryColor}, ${secondaryColor})`,
        filter: `brightness(${brightness})`,
      }}
    >
      {/* Radial mesh overlay for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 40%, rgba(255,255,255,${meshOpacity}) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 70%, rgba(0,0,0,${meshOpacity * 0.5}) 0%, transparent 50%)`,
        }}
      />
    </AbsoluteFill>
  );
};
