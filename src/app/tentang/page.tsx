import type { Metadata } from "next";
import { Foto } from "@/components/foto";
import { Tombol } from "@/components/ui";
import { statistikArsip } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Sriwijaya Culture disusun oleh tim Koding Seadanya untuk ITFEST 2026. Dibangun dengan Next.js, TypeScript, dan Vercel AI SDK.",
};

export default function HalamanTentang() {
  const s = statistikArsip();

  return (
    <div className="mx-auto max-w-[1760px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Tentang</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Arsip kecil, dikerjakan dengan hati-hati.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            Sriwijaya Culture adalah arsip digital tentang Kota Palembang:{" "}
            {s.destinasi} destinasi, {s.umkm} usaha lokal, {s.artikel} catatan sejarah,
            dan {s.peristiwa} tonggak waktu. Dibuat untuk ITFEST 2026.
          </p>
        </div>
      </header>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="overflow-hidden">
            <Foto
              src="/images/musi-1.jpg"
              alt="Sungai Musi di kawasan Palembang"
              prioritas
              rasioPaksa="4 / 3"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full object-cover"
            />
          </div>
          <p className="mt-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
            Sungai Musi · Wikimedia Commons, CC BY-SA 4.0
          </p>
        </div>

        <div>
          <p className="meta-emas">Yang situs ini lakukan</p>
          <ul className="mt-3 space-y-2.5">
            {[
              "Mengumpulkan tempat, usaha, dan peristiwa yang bisa ditelusuri sumbernya.",
              "Menandai tingkat keyakinan setiap klaim, bukan menyamakan semuanya.",
              "Menyediakan asisten yang menjawab dari arsip dan menyebut rujukannya.",
              "Menampilkan peta dari koordinat asli, bukan ilustrasi dekoratif.",
            ].map((x) => (
              <li key={x} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-terang-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-ok" />
                {x}
              </li>
            ))}
          </ul>

          <p className="meta-emas mt-6 border-t border-garis-malam pt-5">Yang tidak</p>
          <ul className="mt-3 space-y-2.5">
            {[
              "Tidak menjual tiket, tidak menerima pemesanan, tidak memasang iklan.",
              "Tidak menampilkan ulasan atau rating yang tidak bisa diverifikasi.",
              "Tidak menyimpan data pribadi pengunjung.",
              "Tidak mengarang alamat, nomor telepon, atau harga.",
            ].map((x) => (
              <li key={x} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-terang-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-bahaya" />
                {x}
              </li>
            ))}
          </ul>

          {/* Isi arsip dalam angka. Semua dihitung dari data lewat
              statistikArsip(), bukan diketik. Blok ini juga menutup
              ruang kosong ~430px di bawah kolom kanan, karena foto
              4:3 di kolom kiri lebih tinggi daripada dua daftar di sini. */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-garis-malam pt-5 sm:grid-cols-4 lg:grid-cols-2">
            {[
              { k: "Destinasi", v: s.destinasi },
              { k: "Usaha lokal", v: s.umkm },
              { k: "Catatan", v: s.artikel },
              { k: "Tonggak waktu", v: s.peristiwa },
            ].map((n) => (
              <div key={n.k}>
                <dt className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
                  {n.k}
                </dt>
                <dd className="tabular mt-1 font-display text-3xl leading-none text-terang">
                  {n.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-16">
        <p className="meta-emas">Tim</p>
        <h2 className="display mt-2 text-[clamp(1.9rem,4vw,3rem)] text-terang">Koding Seadanya.</h2>
        <p className="mt-3 max-w-[56ch] text-[0.8125rem] leading-relaxed text-terang-2">
          Tiga orang, satu arsip. Nama tim dipilih karena kami lebih suka
          menyelesaikan yang kecil dengan benar daripada menjanjikan yang besar.
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { nama: "M. Izzat Al Fawaz", kode: "062640833318", peran: "Pengembang utama" },
            { nama: "Abdur Rachman Abyan", kode: "062640833308", peran: "Data dan riset" },
            { nama: "Richa Karina", kode: "062640833326", peran: "Desain dan konten" },
          ].map((p, i) => (
            <li key={p.kode} className="border-t border-garis-malam pt-4">
              <p className="tabular font-mono text-[0.75rem] text-emas">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display text-lg leading-tight text-terang">{p.nama}</p>
              <p className="mt-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">{p.peran}</p>
              <p className="tabular mt-3 font-mono text-[0.75rem] text-terang-3">{p.kode}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <p className="meta-emas">Teknologi</p>
        <h2 className="display mt-2 max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)] text-terang">
          Dibangun dengan apa.
        </h2>
        <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {[
            {
              k: "Next.js 16 · App Router",
              v: "Halaman dirender di server, jadi cepat terbuka dan mudah ditemukan mesin pencari.",
            },
            {
              k: "TypeScript",
              v: "Bentuk data diperiksa di satu tempat. Kesalahan tertangkap saat pembangunan, bukan saat pengunjung membuka halaman.",
            },
            {
              k: "Tailwind CSS v4",
              v: "Token warna, tipe, dan jarak didefinisikan sekali di CSS. Kontras teks dihitung, bukan dikira-kira.",
            },
            {
              k: "Vercel AI SDK",
              v: "Streaming jawaban asisten. Penyedia model bisa diganti lewat environment variable tanpa mengubah kode.",
            },
            {
              k: "Pencarian TF-IDF",
              v: "Pengambilan dokumen dari arsip dijalankan di server. Ringan, bisa dijelaskan, dan tidak butuh unduhan model 90 MB.",
            },
            {
              k: "SVG dari data",
              v: "Peta dan garis waktu digambar dari koordinat dan tahun asli. Tidak ada gambar statis yang bisa basi.",
            },
          ].map((t, i) => (
            <div key={t.k} className="border-t border-garis-malam pt-4">
              <p className="tabular font-mono text-[0.75rem] text-terang-3">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1.5 font-display text-base leading-tight text-terang">{t.k}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">{t.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-garis-malam pt-8">
        <div>
          <p className="meta-emas">Mulai dari sini</p>
          <p className="mt-2 font-display text-xl leading-tight text-terang">
            Buka atlas, atau tanya Sari langsung.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tombol href="/destinasi" panah>
            Katalog destinasi
          </Tombol>
          <Tombol href="/asisten" varian="garis">
            Tanya asisten
          </Tombol>
        </div>
      </section>

      <p className="mt-10 text-[0.8125rem] leading-relaxed text-terang-3">
        Data diperiksa terakhir 20 Oktober 2026. Kode sumber tersedia di repositori
        publik. Untuk koreksi data, sertakan tautan sumber agar bisa kami periksa.
      </p>
    </div>
  );
}
