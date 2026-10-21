import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogArtikel } from "@/components/katalog-artikel";
import { ARTIKEL, KATEGORI_ARTIKEL } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Sejarah dan Budaya",
  description:
    "Delapan catatan sejarah dan budaya Palembang: Sriwijaya, Ampera, Benteng Kuto Besak, songket, dan Sungai Musi. Setiap artikel mencantumkan sumber.",
};

/**
 * Katalog artikel. Statis, penyaringan di klien.
 */
export default function HalamanArtikel() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="border-t border-tinta pt-4">
        <p className="label-arsip">
          <span className="mr-2 text-kunyit-ink">03</span>Sejarah dan budaya
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h1 className="judul-arsip max-w-[22ch] text-[clamp(2.25rem,5vw,3.75rem)]">
            Kota ini punya lebih dari satu lapisan waktu.
          </h1>
          <p className="max-w-[46ch] pb-1 text-sm leading-relaxed text-tinta-2">
            Dari prasasti abad ke-7 sampai pemugaran museum pada 2023. Setiap
            artikel mencantumkan sumber, dan perbedaan pendapat antar sejarawan
            ditulis sebagai perbedaan.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="label-arsip mt-8 py-6">Memuat katalog…</p>}>
        <KatalogArtikel daftar={ARTIKEL} kategori={KATEGORI_ARTIKEL} />
      </Suspense>
    </div>
  );
}
