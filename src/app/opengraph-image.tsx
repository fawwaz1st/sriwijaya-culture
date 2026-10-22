import { ImageResponse } from "next/og";

/**
 * Gambar Open Graph dinamis.
 *
 * Sebelumnya /opengraph-image 404 dan tautan yang dibagikan tampil
 * polos. Sekarang: judul situs di atas latar gelap situs, satu berkas
 * yang dirender saat build.
 */
export const alt = "Sriwijaya Culture — Arsip Digital Palembang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0b0d0c",
          color: "#f2efe8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#d9a832", letterSpacing: 4 }}>
          ARSIP DIGITAL PALEMBANG
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 88, lineHeight: 1.05, maxWidth: 900 }}>
            Sriwijaya Culture
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#b9b5ab", maxWidth: 780 }}>
            Destinasi, usaha lokal, dan sejarah budaya — setiap angka menunjuk sumbernya.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#8a877f" }}>
          sriwijaya-culture.vercel.app
        </div>
      </div>
    ),
    size,
  );
}
