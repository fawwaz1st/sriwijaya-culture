import type { MetadataRoute } from "next";
import { ARTIKEL, DAFTAR_UMKM, DESTINASI } from "@/lib/arsip";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://sriwijaya-culture.vercel.app";
const TERAKHIR_DIPERBARUI = new Date("2026-10-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const tetap = [
    "",
    "/destinasi",
    "/jelajah",
    "/umkm",
    "/artikel",
    "/asisten",
    "/metodologi",
    "/tentang",
  ];

  return [
    ...tetap.map((r) => ({
      url: `${BASE}${r}`,
      lastModified: TERAKHIR_DIPERBARUI,
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.8,
    })),
    ...DESTINASI.map((d) => ({
      url: `${BASE}/destinasi/${d.id}`,
      lastModified: TERAKHIR_DIPERBARUI,
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
      lastModified: TERAKHIR_DIPERBARUI,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}