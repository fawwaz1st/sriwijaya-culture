import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogDestinasi } from "@/components/katalog-destinasi";
import { DESTINASI, KATEGORI_DESTINASI } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Destinasi",
  description:
    "Sepuluh destinasi di Kota Palembang dengan koordinat terverifikasi, sumber per klaim, dan status verifikasi tiket serta jam buka.",
};

export default function HalamanDestinasi() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Katalog</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Sepuluh tempat, sembilan koordinat.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            Setiap destinasi punya halaman sendiri: sejarah, daya tarik, tiket,
            jam buka, peta, dan daftar sumber. Angka yang belum pasti ditandai,
            bukan ditulis sebagai fakta.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="meta mt-10">Memuat katalog…</p>}>
        <KatalogDestinasi daftar={DESTINASI} kategori={KATEGORI_DESTINASI} />
      </Suspense>
    </div>
  );
}
