import React from "react";
import {
  AbsoluteFill,
  Audio,
  Series,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { TitleCard } from "../scenes/TitleCard";
import { ContentSlide } from "../scenes/ContentSlide";
import { StatSlide } from "../scenes/StatSlide";
import { TestimonialSlide } from "../scenes/TestimonialSlide";
import { CTASlide } from "../scenes/CTASlide";
import { BrandWatermark } from "../components/BrandWatermark";
import { ProgressBar } from "../components/ProgressBar";

type SlideType = "title" | "content" | "stat" | "testimonial" | "cta";

interface BaseSlide {
  type: SlideType;
  durationInFrames: number;
}

interface TitleSlide extends BaseSlide {
  type: "title";
  title: string;
  subtitle?: string;
  backgroundColor?: string;
}

interface ContentSlideData extends BaseSlide {
  type: "content";
  heading: string;
  body: string;
  imageUrl?: string;
  bulletPoints?: string[];
}

interface StatSlideData extends BaseSlide {
  type: "stat";
  stat: number;
  statLabel: string;
  context?: string;
}

interface TestimonialSlideData extends BaseSlide {
  type: "testimonial";
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

interface CTASlideData extends BaseSlide {
  type: "cta";
  ctaText: string;
  subText?: string;
}

type Slide =
  | TitleSlide
  | ContentSlideData
  | StatSlideData
  | TestimonialSlideData
  | CTASlideData;

interface BrandSettings {
  primaryColor: string;
  backgroundColor?: string;
  companyName: string;
  logoUrl?: string;
}

export interface VSLVideoProps {
  title: string;
  slides: Slide[];
  voiceoverUrl?: string;
  brandSettings: BrandSettings;
  /** Countdown appears when this many seconds remain; 0 disables it */
  countdownAtSeconds?: number;
}

// Countdown timer overlay — shows animated seconds remaining
const CountdownTimer: React.FC<{
  totalFrames: number;
  fps: number;
  atRemainingSeconds: number;
  primaryColor: string;
}> = ({ totalFrames, fps, atRemainingSeconds, primaryColor }) => {
  const frame = useCurrentFrame();
  const totalCountdownFrames = atRemainingSeconds * fps;
  const framesRemaining = totalFrames - frame;

  // Only show when within the countdown window
  if (framesRemaining > totalCountdownFrames) return null;

  const secondsLeft = Math.ceil(framesRemaining / fps);

  const opacity = interpolate(
    framesRemaining,
    [totalCountdownFrames, totalCountdownFrames - fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pulse scale each second
  const pulseProgress = (framesRemaining % fps) / fps;
  const scale = interpolate(pulseProgress, [0, 0.2, 1], [1.2, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        right: 40,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: primaryColor,
          fontSize: 52,
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          lineHeight: 1,
          transform: `scale(${scale})`,
        }}
      >
        {secondsLeft}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        seconds left
      </div>
    </div>
  );
};

// Urgency banner — pulses at the bottom above the progress bar for CTA slides
const UrgencyBanner: React.FC<{
  text: string;
  primaryColor: string;
  visible: boolean;
}> = ({ text, primaryColor, visible }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, visible ? 1 : 0], {
    extrapolateRight: "clamp",
  });

  const pulseOpacity = interpolate(frame % 45, [0, 22, 45], [0.85, 1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: opacity * pulseOpacity,
        backgroundColor: primaryColor,
        color: "#ffffff",
        fontSize: 22,
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        padding: "8px 32px",
        borderRadius: 40,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

export const VSLVideo: React.FC<VSLVideoProps> = ({
  title: _title,
  slides,
  voiceoverUrl,
  brandSettings,
  countdownAtSeconds = 30,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const {
    primaryColor,
    backgroundColor = "#080810",
    companyName,
    logoUrl,
  } = brandSettings;

  // Determine whether the last slide is a CTA to show the urgency banner
  const lastSlide = slides[slides.length - 1];
  const lastSlideIsCTA = lastSlide?.type === "cta";
  const ctaText =
    lastSlide && lastSlide.type === "cta" ? lastSlide.ctaText : "";

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Optional voiceover track */}
      {voiceoverUrl && <Audio src={voiceoverUrl} />}

      {/* Scene sequence */}
      <Series>
        {slides.map((slide, index) => {
          const key = `slide-${index}`;

          if (slide.type === "title") {
            return (
              <Series.Sequence key={key} durationInFrames={slide.durationInFrames}>
                <TitleCard
                  title={slide.title}
                  subtitle={slide.subtitle}
                  primaryColor={primaryColor}
                  backgroundColor={slide.backgroundColor ?? backgroundColor}
                  durationInFrames={slide.durationInFrames}
                />
              </Series.Sequence>
            );
          }

          if (slide.type === "content") {
            return (
              <Series.Sequence key={key} durationInFrames={slide.durationInFrames}>
                <ContentSlide
                  heading={slide.heading}
                  body={slide.body}
                  imageUrl={slide.imageUrl}
                  bulletPoints={slide.bulletPoints}
                  primaryColor={primaryColor}
                  durationInFrames={slide.durationInFrames}
                />
              </Series.Sequence>
            );
          }

          if (slide.type === "stat") {
            return (
              <Series.Sequence key={key} durationInFrames={slide.durationInFrames}>
                <StatSlide
                  stat={slide.stat}
                  statLabel={slide.statLabel}
                  context={slide.context}
                  primaryColor={primaryColor}
                  durationInFrames={slide.durationInFrames}
                />
              </Series.Sequence>
            );
          }

          if (slide.type === "testimonial") {
            return (
              <Series.Sequence key={key} durationInFrames={slide.durationInFrames}>
                <TestimonialSlide
                  quote={slide.quote}
                  author={slide.author}
                  role={slide.role}
                  avatarUrl={slide.avatarUrl}
                  primaryColor={primaryColor}
                  durationInFrames={slide.durationInFrames}
                />
              </Series.Sequence>
            );
          }

          if (slide.type === "cta") {
            return (
              <Series.Sequence key={key} durationInFrames={slide.durationInFrames}>
                <CTASlide
                  ctaText={slide.ctaText}
                  subText={slide.subText}
                  primaryColor={primaryColor}
                  durationInFrames={slide.durationInFrames}
                />
              </Series.Sequence>
            );
          }

          return null;
        })}
      </Series>

      {/* VSL-specific: countdown timer */}
      {countdownAtSeconds > 0 && (
        <CountdownTimer
          totalFrames={durationInFrames}
          fps={fps}
          atRemainingSeconds={countdownAtSeconds}
          primaryColor={primaryColor}
        />
      )}

      {/* VSL-specific: urgency banner on CTA slide */}
      {lastSlideIsCTA && (
        <UrgencyBanner
          text={ctaText}
          primaryColor={primaryColor}
          visible={lastSlideIsCTA}
        />
      )}

      {/* Persistent overlays */}
      <BrandWatermark
        logoUrl={logoUrl}
        companyName={companyName}
        position="top-right"
      />
      <ProgressBar totalFrames={durationInFrames} fps={fps} color={primaryColor} />
    </AbsoluteFill>
  );
};
