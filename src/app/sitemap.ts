import type { MetadataRoute } from "next";
import { ARTIKEL, DAFTAR_UMKM, DESTINASI } from "@/lib/arsip";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://sriwijaya-culture.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const tetap = ["", "/destinasi", "/umkm", "/artikel", "/asisten", "/metodologi", "/tentang"];

  return [
    ...tetap.map((r) => ({
      url: `${BASE}${r}`,
      lastModified: new Date("2026-10-21"),
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.8,
    })),
    ...DESTINASI.map((d) => ({
      url: `${BASE}/destinasi/${d.id}`,
      lastModified: new Date("2026-10-21"),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...ARTIKEL.map((a) => ({
      url: `${BASE}/artikel/${a.id}`,
      lastModified: new Date(a.diperbarui ?? a.tanggal),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...DAFTAR_UMKM.map((u) => ({
      url: `${BASE}/umkm/${u.id}`,
      lastModified: new Date("2026-10-21"),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
