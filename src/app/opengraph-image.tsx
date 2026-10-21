import { ImageResponse } from "next/og";

export const alt = "Sriwijaya Culture — Arsip Digital Palembang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Gambar Open Graph.
 *
 * Dibuat dari HTML, bukan file statis, supaya tipografi dan warna
 * selalu sama dengan situs. Tidak memakai foto agar tidak bergantung
 * pada aset yang bisa hilang.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f0",
          padding: "64px",
          position: "relative",
        }}
      >
        {/* Tekstur titik, sama seperti latar situs. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(22,33,27,0.07) 1px, transparent 0)",
            backgroundSize: "4px 4px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#0d2b1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 36 36" width="44" height="44">
              <path d="M4 21c5 0 5-4 10-4s5 4 10 4 5-3 8-3" fill="none" stroke="#d4a017" strokeWidth="1.6" />
              <path d="M4 26c5 0 5-4 10-4s5 4 10 4 5-3 8-3" fill="none" stroke="#faf7f0" strokeOpacity=".5" strokeWidth="1.2" />
              <path d="M18 5v9M13 9l5-4 5 4" fill="none" stroke="#faf7f0" strokeWidth="1.3" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, color: "#16211b", fontWeight: 700, letterSpacing: "-0.5px" }}>
              Sriwijaya Culture
            </div>
            <div style={{ fontSize: 13, color: "#6b7a70", letterSpacing: "3px" }}>
              ARSIP TERBUKA PALEMBANG
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, color: "#6b4c05", letterSpacing: "3px", marginBottom: 18 }}>
            LEMBAR 01 · ARSIP TERBUKA
          </div>
          <div
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              color: "#16211b",
              fontWeight: 700,
              letterSpacing: "-3px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Sepuluh tempat</span>
            <span>yang membentuk</span>
            <span style={{ color: "#1a4a33" }}>sebuah kota.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            borderTop: "1px solid #b9ad90",
            paddingTop: 18,
            fontSize: 15,
            color: "#47574d",
          }}
        >
          <span>10 destinasi</span>
          <span>7 usaha lokal</span>
          <span>8 catatan sejarah</span>
          <span>19 tonggak</span>
          <span style={{ marginLeft: "auto", color: "#6b4c05" }}>ITFEST 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
