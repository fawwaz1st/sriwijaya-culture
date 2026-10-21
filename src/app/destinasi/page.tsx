import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogDestinasi } from "@/components/katalog-destinasi";
import { JudulBagian } from "@/components/ui";
import { DESTINASI, KATEGORI_DESTINASI } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Destinasi",
  description:
    "Sepuluh destinasi di Kota Palembang dengan koordinat terverifikasi, sumber per klaim, dan status verifikasi tiket serta jam buka.",
};

/**
 * Katalog destinasi.
 *
 * Halaman ini statis. Penyaringan dilakukan di klien karena seluruh
 * data sudah ada di muatan halaman, sehingga filter terasa instan dan
 * halaman tetap bisa diprerender. URL tetap mencerminkan filter aktif
 * lewat query string, jadi hasilnya bisa dibagikan.
 */
export default function HalamanDestinasi() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="border-t border-tinta pt-4">
        <p className="label-arsip">
          <span className="mr-2 text-kunyit-ink">01</span>Katalog destinasi
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h1 className="judul-arsip max-w-[18ch] text-[clamp(2.25rem,5vw,3.75rem)]">
            Sepuluh tempat, sembilan koordinat.
          </h1>
          <p className="max-w-[46ch] pb-1 text-sm leading-relaxed text-tinta-2">
            Setiap destinasi punya halaman sendiri: sejarah, daya tarik, tiket,
            jam buka, peta, dan daftar sumber. Angka yang belum pasti ditandai,
            bukan ditulis sebagai fakta.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="label-arsip mt-8 py-6">Memuat katalog…</p>}>
        <KatalogDestinasi daftar={DESTINASI} kategori={KATEGORI_DESTINASI} />
      </Suspense>

      <section className="mt-14">
        <JudulBagian
          nomor="02"
          judul="Kenapa hanya sepuluh"
          keterangan="Daftar pendek yang bisa dipertanggungjawabkan lebih berguna daripada daftar panjang berisi angka tanpa sumber. Setiap entri di sini punya minimal satu rujukan yang bisa dibuka, dan koordinat yang bisa diperiksa di peta."
        />
      </section>
    </div>
  );
}
