import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Soniq — AI Course Creator",
    template: "%s | Soniq",
  },
  description:
    "Build and publish AI-powered courses, VSLs, and music education content",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://soniq.app"
  ),
  openGraph: {
    type: "website",
    siteName: "Soniq",
    title: "Soniq — AI Course Creator",
    description:
      "Build and publish AI-powered courses, VSLs, and music education content",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Soniq",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soniq — AI Course Creator",
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
