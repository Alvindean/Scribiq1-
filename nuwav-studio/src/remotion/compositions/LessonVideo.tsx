import React from "react";
import { AbsoluteFill, Audio, Series, useVideoConfig } from "remotion";
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

export interface LessonVideoProps {
  title: string;
  slides: Slide[];
  voiceoverUrl?: string;
  brandSettings: BrandSettings;
}

export const LessonVideo: React.FC<LessonVideoProps> = ({
  title: _title,
  slides,
  voiceoverUrl,
  brandSettings,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const { primaryColor, backgroundColor = "#0d0d1a", companyName, logoUrl } =
    brandSettings;

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
