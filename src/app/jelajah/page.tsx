import type { Metadata } from "next";
import { JelajahPeta } from "@/components/jelajah-peta";
import { CuacaPalembang } from "@/components/cuaca-palembang";
import { GempaTerkini } from "@/components/gempa-terkini";
import { DESTINASI, KATEGORI_DESTINASI, statistikArsip } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Jelajah peta",
  description:
    `Lihat ${DESTINASI.length} destinasi Palembang di peta satelit yang bisa di-zoom, saring menurut kategori, lalu buka halamannya.`,
};

/**
 * Halaman jelajah peta.
 *
 * Berbeda dari /destinasi yang berbentuk katalog kartu, halaman ini
 * memberi peta sebagai fokus utama. Dua cara membaca arsip yang sama:
 * lewat daftar untuk membandingkan, lewat peta untuk memahami letak.
 */
export default function HalamanJelajah() {
  const s = statistikArsip();

  return (
    <div className="masuk-detail mx-auto max-w-[1760px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Jelajah</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[18ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Kota ini dibaca dari aliran sungainya.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            {s.destinasiTerpetakan} titik terverifikasi. Saring menurut kategori,
            pilih titik di peta, lalu buka halamannya.
          </p>
        </div>
      </header>

      <div className="mt-10">
        <JelajahPeta daftar={DESTINASI} kategori={KATEGORI_DESTINASI} />
      </div>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <CuacaPalembang />
        <GempaTerkini />
      </section>

      <section className="mt-12 border-t border-garis-malam pt-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              k: "Kenapa peta, bukan daftar",
              v: "Sungai Musi menjelaskan letak jembatan, kampung tua, dan pusat kota.",
            },
            {
              k: "Apa arti titiknya",
              v: "Titik hanya dari koordinat terverifikasi. Tanpa koordinat, tidak ditebak.",
            },
            {
              k: "Cara memakainya",
              v: "Pilih kategori, klik titik, lalu buka halamannya.",
            },
          ].map((x) => (
            <div key={x.k}>
              <p className="meta-emas">{x.k}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-terang-2">{x.v}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}