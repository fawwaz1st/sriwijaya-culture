import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogArtikel } from "@/components/katalog-artikel";
import { ARTIKEL, KATEGORI_ARTIKEL } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Sejarah dan Budaya",
  description:
    "Delapan catatan sejarah dan budaya Palembang: Sriwijaya, Ampera, Benteng Kuto Besak, songket, dan Sungai Musi. Setiap artikel mencantumkan sumber.",
};

export default function HalamanArtikel() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Catatan</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Kota ini punya lebih dari satu lapisan waktu.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            Dari prasasti abad ke-7 sampai pemugaran museum pada 2023. Setiap
            artikel mencantumkan sumber, dan perbedaan pendapat antar sejarawan
            ditulis sebagai perbedaan.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="meta mt-10">Memuat katalog…</p>}>
        <KatalogArtikel daftar={ARTIKEL} kategori={KATEGORI_ARTIKEL} />
      </Suspense>
    </div>
  );
}
