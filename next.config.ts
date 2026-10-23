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
  async headers() {
    /**
     * Header keamanan dasar, khususnya Content-Security-Policy.
     *
     * Kebutuhan unik situs ini: iframe Google Maps (maps.google.com),
     * gambar optimasi dari diri sendiri, dan tidak ada skrip pihak
     * ketiga sama sekali. `unsafe-inline` untuk style diperlukan karena
     * Next menyuntik gaya kritis inline. `unsafe-eval` hanya ditambahkan
     * saat `next dev`, karena React memakainya untuk rekonstruksi stack
     * trace; build produksi tetap `script-src 'self'`.
     */
    const dev = process.env.NODE_ENV !== "production";
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src https://maps.google.com https://www.google.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
