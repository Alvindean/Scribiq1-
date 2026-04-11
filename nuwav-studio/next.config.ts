import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Remotion + its compositor natives must not be bundled by Next.js/Turbopack.
  // They are only imported dynamically in the nodejs-runtime render route.
  serverExternalPackages: [
    "@remotion/renderer",
    "@remotion/bundler",
    "@remotion/compositor-linux-x64-gnu",
    "@remotion/compositor-linux-x64-musl",
    "@remotion/compositor-linux-arm64-gnu",
    "@remotion/compositor-linux-arm64-musl",
    "@remotion/compositor-darwin-x64",
    "@remotion/compositor-darwin-arm64",
    "@remotion/compositor-win32-x64-msvc",
    "remotion",
  ],
};

export default nextConfig;
