import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogUMKM } from "@/components/katalog-umkm";
import { DAFTAR_UMKM, KATEGORI_UMKM, VARIAN_PEMPEK } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Direktori Usaha Lokal",
  description:
    "Direktori UMKM Palembang: pempek, songket, kerajinan, dan oleh-oleh. Alamat dan kontak hanya ditampilkan bila sudah diverifikasi.",
};

export default function HalamanUMKM() {
  const jumlahProduk = DAFTAR_UMKM.reduce((n, u) => n + u.produk.length, 0);

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Direktori</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Usaha yang menghidupi kota.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            {DAFTAR_UMKM.length} entri dengan {jumlahProduk} produk tercatat.
            Alamat, nomor telepon, dan akun sosial hanya ditampilkan bila sudah
            diverifikasi. Yang belum, dikatakan belum.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="meta mt-10">Memuat direktori…</p>}>
        <KatalogUMKM daftar={DAFTAR_UMKM} kategori={KATEGORI_UMKM} varian={VARIAN_PEMPEK} />
      </Suspense>

      <section className="mt-16 border-t border-garis-malam pt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="status text-ok">Rujukan umum</p>
            <p className="mt-2 max-w-[46ch] text-[0.8125rem] leading-relaxed text-terang-2">
              Nama usaha dan jenis produknya terdokumentasi di sumber publik
              seperti berita, artikel budaya, atau katalog pemerintah. Alamat
              dan kontak tetap disembunyikan sampai pengelola mengonfirmasi.
            </p>
          </div>
          <div>
            <p className="status text-warn">Demonstrasi</p>
            <p className="mt-2 max-w-[46ch] text-[0.8125rem] leading-relaxed text-terang-2">
              Entri contoh untuk menunjukkan cara kerja direktori. Diberi label
              jelas supaya tidak dikira usaha yang benar-benar ada di alamat
              tertentu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
