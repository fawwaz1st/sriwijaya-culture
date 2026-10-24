import { ImageResponse } from "next/og";

/**
 * Ikon untuk layar utama iOS.
 *
 * Versi ini lebih besar dan tanpa sudut membulat, karena iOS memasang
 * topeng sudutnya sendiri. Latar dibuat penuh supaya tidak ada tepi
 * transparan yang terlihat sebagai garis aneh di layar utama.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <div
          style={{
            position: "absolute",
            inset: 10,
            border: "2px solid rgba(217,168,50,0.4)",
          }}
        />
        <svg width="118" height="118" viewBox="0 0 28 28" fill="none">
          <path
            d="M2 17c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
            stroke="#d9a832"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M2 22c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
            stroke="#f2efe8"
            strokeOpacity="0.45"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M14 4v8M10 7.5l4-3.5 4 3.5"
            stroke="#f2efe8"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
