import React from "react";
import { Composition } from "remotion";
import { LessonVideo } from "./compositions/LessonVideo";
import { VSLVideo } from "./compositions/VSLVideo";

const DEFAULT_BRAND = {
  primaryColor: "#6366f1",
  backgroundColor: "#0d0d1a",
  companyName: "NuWav Studio",
};

const DEFAULT_VSL_SLIDES = [
  {
    type: "title" as const,
    title: "Welcome to NuWav Studio",
    subtitle: "AI-powered video creation",
    durationInFrames: 90,
  },
  {
    type: "content" as const,
    heading: "Your lesson content goes here",
    body: "Replace this with your actual lesson content when rendering.",
    bulletPoints: ["Key point one", "Key point two", "Key point three"],
    durationInFrames: 120,
  },
  {
    type: "cta" as const,
    ctaText: "Get Started Today",
    subText: "Join thousands of creators already using NuWav Studio",
    durationInFrames: 90,
  },
];

const TOTAL_VSL_FRAMES = DEFAULT_VSL_SLIDES.reduce(
  (sum, s) => sum + s.durationInFrames,
  0
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LessonVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={LessonVideo as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Lesson",
          script: "",
          modules: "",
        }}
      />

      <Composition
        id="VSLVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={VSLVideo as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={TOTAL_VSL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "My VSL",
          slides: DEFAULT_VSL_SLIDES,
          voiceoverUrl: undefined,
          brandSettings: DEFAULT_BRAND,
          countdownAtSeconds: 30,
        }}
      />
    </>
  );
};

/** @deprecated Use RemotionRoot */
export const Root = RemotionRoot;
