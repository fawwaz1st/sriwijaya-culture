import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogUMKM } from "@/components/katalog-umkm";
import { JudulBagian } from "@/components/ui";
import { DAFTAR_UMKM, KATEGORI_UMKM, VARIAN_PEMPEK } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Direktori Usaha Lokal",
  description:
    "Direktori UMKM Palembang: pempek, songket, kerajinan, dan oleh-oleh. Alamat dan kontak hanya ditampilkan bila sudah diverifikasi.",
};

/**
 * Direktori UMKM.
 *
 * Statis, dengan penyaringan di klien. Alamat dan kontak hanya muncul
 * bila sudah diverifikasi, dan statusnya selalu terlihat di kartu.
 */
export default function HalamanUMKM() {
  const jumlahProduk = DAFTAR_UMKM.reduce((n, u) => n + u.produk.length, 0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="border-t border-tinta pt-4">
        <p className="label-arsip">
          <span className="mr-2 text-kunyit-ink">02</span>Direktori usaha lokal
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h1 className="judul-arsip max-w-[20ch] text-[clamp(2.25rem,5vw,3.75rem)]">
            Usaha yang menghidupi kota.
          </h1>
          <p className="max-w-[46ch] pb-1 text-sm leading-relaxed text-tinta-2">
            {DAFTAR_UMKM.length} entri dengan {jumlahProduk} produk tercatat.
            Alamat, nomor telepon, dan akun sosial hanya ditampilkan bila sudah
            diverifikasi. Yang belum, dikatakan belum.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="label-arsip mt-8 py-6">Memuat direktori…</p>}>
        <KatalogUMKM
          daftar={DAFTAR_UMKM}
          kategori={KATEGORI_UMKM}
          varian={VARIAN_PEMPEK}
        />
      </Suspense>

      <section className="mt-14">
        <JudulBagian
          nomor="03"
          judul="Kenapa kontak banyak yang kosong"
          keterangan="Verifikasi lapangan tidak bisa dilakukan lewat kode. Menampilkan nomor telepon tebakan lebih berbahaya daripada tidak menampilkannya."
        />
        <div className="mt-5 grid gap-0 border border-garis sm:grid-cols-2">
          <div className="border-b border-garis p-4 sm:border-b-0 sm:border-r">
            <p className="status text-ok">Rujukan umum</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-tinta-2">
              Nama usaha dan jenis produknya terdokumentasi di sumber publik
              seperti berita, artikel budaya, atau katalog pemerintah. Alamat
              dan kontak tetap disembunyikan sampai pengelola mengonfirmasi.
            </p>
          </div>
          <div className="p-4">
            <p className="status text-warn">Demonstrasi</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-tinta-2">
              Entri contoh untuk menunjukkan cara kerja direktori. Diberi label
              jelas di antarmuka supaya tidak dikira usaha yang benar-benar ada
              di alamat tertentu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
