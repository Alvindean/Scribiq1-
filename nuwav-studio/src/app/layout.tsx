import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NuWav Studio — AI Course & VSL Builder",
  description:
    "Build complete AI-powered online courses and Video Sales Letters in minutes. Scripts, voiceover, video, and hosted pages — all generated automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
