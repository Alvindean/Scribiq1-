import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NuWav Studio — AI Course Creator",
    template: "%s | NuWav Studio",
  },
  description:
    "Build and publish AI-powered courses, VSLs, and music education content",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://nuwavstudio.com"
  ),
  openGraph: {
    type: "website",
    siteName: "NuWav Studio",
    title: "NuWav Studio — AI Course Creator",
    description:
      "Build and publish AI-powered courses, VSLs, and music education content",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "NuWav Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NuWav Studio — AI Course Creator",
    description:
      "Build and publish AI-powered courses, VSLs, and music education content",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
