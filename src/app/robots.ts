import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://sriwijaya-culture.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    // Favorit hanya hidup di peramban pengunjung, jadi tidak berguna bagi
    // perayap. API memegang data pihak ketiga, bukan halaman yang layak
    // diindeks.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/favorit"] }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
