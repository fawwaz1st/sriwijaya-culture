import { ImageResponse } from "next/og";

/**
 * Ikon tab peramban.
 *
 * Rancangan: latar malam hampir hitam dengan dua gelombang emas dan
 * satu garis putih. Bentuknya mengikuti logo di header situs (gelombang
 * Sungai Musi dan atap rumah limas), jadi ikon tab tetap dikenali
 * sebagai bagian dari arsip ini, bukan gambar generik.
 *
 * Dibuat sebagai ImageResponse, bukan berkas PNG statis, karena
 * beberapa ukuran dibutuhkan (16, 32, 180 untuk iOS) dan satu
 * definisi vektor lebih mudah dijaga konsisten daripada tiga berkas
 * yang bisa berbeda diam-diam.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0d0c",
          position: "relative",
        }}
      >
        {/* Bingkai tipis emas: mengikat ikon ke palet arsip. */}
        <div
          style={{
            position: "absolute",
            inset: 3,
            border: "1px solid rgba(217,168,50,0.35)",
          }}
        />
        <svg width="44" height="44" viewBox="0 0 28 28" fill="none">
          {/* Gelombang sungai, emas. */}
          <path
            d="M2 17c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
            stroke="#d9a832"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Gelombang kedua, lebih redup: kedalaman sungai. */}
          <path
            d="M2 22c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
            stroke="#f2efe8"
            strokeOpacity="0.45"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Atap limas: rumah adat Palembang. */}
          <path
            d="M14 4v8M10 7.5l4-3.5 4 3.5"
            stroke="#f2efe8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
