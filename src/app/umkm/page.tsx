import type { Metadata } from "next";
import { Suspense } from "react";
import { KatalogUMKM } from "@/components/katalog-umkm";
import { DAFTAR_UMKM, KATEGORI_UMKM, UMKM_PUBLIK } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Direktori Usaha Lokal",
  description:
    "Direktori UMKM Palembang: pempek, songket, kerajinan, dan oleh-oleh. Alamat dan kontak hanya ditampilkan bila sudah diverifikasi.",
};

export default function HalamanUMKM() {
  const jumlahProduk = UMKM_PUBLIK.reduce((n, u) => n + u.produk.length, 0);
  const jumlahDemonstrasi = DAFTAR_UMKM.length - UMKM_PUBLIK.length;

  return (
    <div className="mx-auto max-w-[1760px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Direktori</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Usaha yang menghidupi kota.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            {UMKM_PUBLIK.length} usaha, {jumlahProduk} produk. Kontak hanya
            tampil kalau sudah kami verifikasi.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="meta mt-10">Memuat direktori…</p>}>
        <KatalogUMKM daftar={UMKM_PUBLIK} kategori={KATEGORI_UMKM} />
      </Suspense>

      <section className="mt-16 border-t border-garis-malam pt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="status text-ok">Rujukan umum — sudah dicek</p>
            <p className="mt-2 max-w-[46ch] text-[0.8125rem] leading-relaxed text-terang-2">
              Usaha nyata yang tercatat di sumber publik. Alamat baru tampil
              setelah pengelolanya mengonfirmasi.
            </p>
          </div>
          <div>
            <p className="status text-warn">{jumlahDemonstrasi} entri ditahan</p>
            <p className="mt-2 max-w-[46ch] text-[0.8125rem] leading-relaxed text-terang-2">
              Entri contoh tidak ditampilkan di direktori sampai alamat dan
              kontaknya diverifikasi. Kami lebih memilih direktori pendek yang
              jujur daripada daftar panjang yang setengah karangan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
