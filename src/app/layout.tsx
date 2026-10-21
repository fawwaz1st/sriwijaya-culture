import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Fraunces dipakai dengan dua sumbu variabel (SOFT dan WONK).
 * WONK 1 memberi bentuk huruf yang sedikit "salah" pada g, a, dan y,
 * yang membuat judul terasa dicetak, bukan dirender. Itu satu-satunya
 * alasan font ini dipilih; bukan karena sedang tren.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
});

const SITE = "Sriwijaya Culture";
const DESKRIPSI =
  "Arsip digital destinasi, usaha lokal, dan sejarah budaya Kota Palembang. Setiap angka disertai sumber, dan yang belum pasti ditandai belum pasti.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sriwijaya-culture.vercel.app"),
  title: {
    default: `${SITE} — Arsip Digital Palembang`,
    template: `%s — ${SITE}`,
  },
  description: DESKRIPSI,
  applicationName: SITE,
  authors: [{ name: "Koding Seadanya" }],
  creator: "Koding Seadanya",
  keywords: [
    "Palembang",
    "Sriwijaya",
    "arsip budaya",
    "destinasi wisata",
    "UMKM Palembang",
    "sejarah Sumatera Selatan",
    "Sungai Musi",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE,
    title: `${SITE} — Arsip Digital Palembang`,
    description: DESKRIPSI,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE} — Arsip Digital Palembang`,
    description: DESKRIPSI,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#071c13" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-hijau-900 focus:px-4 focus:py-2 focus:text-kertas"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <main id="konten">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
