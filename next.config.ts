import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Semua foto disajikan dari public/images sebagai berkas lokal,
    // jadi tidak ada remotePattern yang perlu dibuka.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["@ai-sdk/react"],
  },
};

export default nextConfig;
