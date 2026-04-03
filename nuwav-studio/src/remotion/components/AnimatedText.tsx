import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type AnimationType = "fade-up" | "typewriter" | "scale-in" | "word-by-word";

interface AnimatedTextProps {
  text: string;
  animation: AnimationType;
  delay?: number;
  fps?: number;
  style?: React.CSSProperties;
}

interface WordProps {
  word: string;
  wordIndex: number;
  delay: number;
  fps: number;
  style?: React.CSSProperties;
}

const AnimatedWord: React.FC<WordProps> = ({ word, wordIndex, delay, fps, style }) => {
  const frame = useCurrentFrame();
  const startFrame = delay + wordIndex * 4;

  const opacity = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.8 },
    from: 0,
    to: 1,
  });

  const translateY = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.8 },
    from: 15,
    to: 0,
  });

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px)`,
        marginRight: "0.25em",
        ...style,
      }}
    >
      {word}
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  animation,
  delay = 0,
  fps = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps: videoFps } = useVideoConfig();
  const resolvedFps = fps ?? videoFps;

  if (animation === "fade-up") {
    const opacity = spring({
      frame: frame - delay,
      fps: resolvedFps,
      config: { damping: 20, stiffness: 80, mass: 1 },
      from: 0,
      to: 1,
    });

    const translateY = spring({
      frame: frame - delay,
      fps: resolvedFps,
      config: { damping: 18, stiffness: 80, mass: 1 },
      from: 20,
      to: 0,
    });

    return (
      <span
        style={{
          display: "inline-block",
          opacity,
          transform: `translateY(${translateY}px)`,
          ...style,
        }}
      >
        {text}
      </span>
    );
  }

  if (animation === "scale-in") {
    const opacity = spring({
      frame: frame - delay,
      fps: resolvedFps,
      config: { damping: 20, stiffness: 100, mass: 0.9 },
      from: 0,
      to: 1,
    });

    const scale = spring({
      frame: frame - delay,
      fps: resolvedFps,
      config: { damping: 18, stiffness: 100, mass: 0.9 },
      from: 0.8,
      to: 1,
    });

    return (
      <span
        style={{
          display: "inline-block",
          opacity,
          transform: `scale(${scale})`,
          ...style,
        }}
      >
        {text}
      </span>
    );
  }

  if (animation === "typewriter") {
    // Reveal characters one by one using interpolate
    const charCount = text.length;
    const charsToShow = Math.floor(
      interpolate(frame - delay, [0, charCount * 2], [0, charCount], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );

    return (
      <span style={{ display: "inline-block", ...style }}>
        {text.slice(0, charsToShow)}
        {charsToShow < charCount && (
          <span
            style={{
              opacity: interpolate(frame % 30, [0, 15, 30], [1, 0, 1]),
              borderRight: "2px solid currentColor",
            }}
          />
        )}
      </span>
    );
  }

  if (animation === "word-by-word") {
    const words = text.split(" ");
    return (
      <span style={{ display: "inline-block", ...style }}>
        {words.map((word, index) => (
          <AnimatedWord
            key={index}
            word={word}
            wordIndex={index}
            delay={delay}
            fps={resolvedFps}
            style={style}
          />
        ))}
      </span>
    );
  }

  return <span style={style}>{text}</span>;
};
