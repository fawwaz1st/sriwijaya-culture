import type { Metadata } from "next";
import Image from "next/image";
import { JudulBagian, Tombol } from "@/components/ui";
import { statistikArsip } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Sriwijaya Culture disusun oleh tim Koding Seadanya untuk ITFEST 2026. Dibangun dengan Next.js, TypeScript, dan AI SDK.",
};

/**
 * Halaman tentang.
 *
 * Dua bagian: apa yang situs ini (dan tidak) lakukan, lalu siapa yang
 * membuatnya. Tanpa foto tim berpose, tanpa "visi misi" yang bisa
 * dipakai proyek apa pun.
 */
export default function HalamanTentang() {
  const s = statistikArsip();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="border-t border-tinta pt-4">
        <p className="label-arsip">
          <span className="mr-2 text-kunyit-ink">07</span>Tentang
        </p>
        <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
          <h1 className="judul-arsip max-w-[20ch] text-[clamp(2.25rem,5vw,3.75rem)]">
            Arsip kecil, dikerjakan dengan hati-hati.
          </h1>
          <div className="self-end">
            <p className="max-w-[46ch] text-sm leading-relaxed text-tinta-2">
              Sriwijaya Culture adalah arsip digital tentang Kota Palembang:
              {" "}{s.destinasi} destinasi, {s.umkm} usaha lokal, {s.artikel} catatan
              sejarah, dan {s.peristiwa} tonggak waktu. Dibuat untuk ITFEST 2026,
              tema Empowering Culture Through AI-Driven Innovation.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-0 border border-garis lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] border-b border-garis lg:aspect-auto lg:border-b-0 lg:border-r">
          <Image
            src="/images/musi-1.jpg"
            alt="Sungai Musi di kawasan Palembang"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="foto-arsip object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-hijau-950/70 to-transparent" />
          <p className="absolute bottom-3 left-3 right-3 font-display text-lg leading-tight text-kertas">
            Kota ini dimulai dari sungai, dan masih dijelaskan oleh sungai.
          </p>
        </div>
        <div className="p-5 sm:p-7">
          <p className="label-arsip">Yang situs ini lakukan</p>
          <ul className="mt-3 space-y-2.5">
            {[
              "Mengumpulkan tempat, usaha, dan peristiwa yang bisa ditelusuri sumbernya.",
              "Menandai tingkat keyakinan setiap klaim, bukan menyamakan semuanya.",
              "Menyediakan asisten yang menjawab dari arsip dan menyebut rujukannya.",
              "Menampilkan peta dari koordinat asli, bukan ilustrasi dekoratif.",
            ].map((x) => (
              <li key={x} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-tinta-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none bg-ok" />
                {x}
              </li>
            ))}
          </ul>

          <p className="label-arsip mt-5 border-t border-garis-2 pt-4">Yang tidak</p>
          <ul className="mt-3 space-y-2.5">
            {[
              "Tidak menjual tiket, tidak menerima pemesanan, tidak memasang iklan.",
              "Tidak menampilkan ulasan atau rating yang tidak bisa diverifikasi.",
              "Tidak menyimpan data pribadi pengunjung.",
              "Tidak mengarang alamat, nomor telepon, atau harga.",
            ].map((x) => (
              <li key={x} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-tinta-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none bg-bahaya" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-12">
        <JudulBagian
          nomor="01"
          judul="Koding Seadanya"
          keterangan="Tiga orang, satu arsip. Nama tim dipilih karena kami lebih suka menyelesaikan yang kecil dengan benar daripada menjanjikan yang besar."
        />
        <ul className="mt-5 grid gap-0 border border-garis sm:grid-cols-3">
          {[
            { nama: "M. Izzat Al Fawaz", kode: "062640833318", peran: "Pengembang utama" },
            { nama: "Abdur Rachman Abyan", kode: "062640833308", peran: "Data dan riset" },
            { nama: "Richa Karina", kode: "062640833326", peran: "Desain dan konten" },
          ].map((p, i) => (
            <li
              key={p.kode}
              className={`border-b border-garis p-4 sm:border-b-0 ${i < 2 ? "sm:border-r" : ""}`}
            >
              <p className="tabular font-mono text-[0.625rem] text-kunyit-ink">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-display text-lg leading-tight text-tinta">{p.nama}</p>
              <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                {p.peran}
              </p>
              <p className="tabular mt-2 border-t border-garis-2 pt-2 font-mono text-[0.5625rem] text-tinta-4">
                {p.kode}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <JudulBagian
          nomor="02"
          judul="Dibangun dengan apa"
          keterangan="Daftar ini jujur: semua yang tertulis di sini benar-benar dipakai, bukan daftar panjang untuk terlihat canggih."
        />
        <div className="mt-5 grid gap-0 border border-garis md:grid-cols-2">
          {[
            {
              k: "Next.js 16 · App Router",
              v: "Server component untuk katalog dan detail, sehingga halaman cepat dan bisa dibaca mesin pencari. Rute dinamis untuk 25 rekaman.",
            },
            {
              k: "TypeScript",
              v: "Skema data ditegakkan di satu tempat. Kesalahan seperti field hilang atau tipe salah tertangkap saat build, bukan saat juri membuka halaman.",
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
            <div
              key={t.k}
              className="border-b border-garis p-4 md:border-r md:[&:nth-child(2n)]:border-r-0"
            >
              <p className="tabular font-mono text-[0.5625rem] text-tinta-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-display text-base leading-tight text-tinta">{t.k}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta-2">{t.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-garis pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label-arsip">Mulai dari sini</p>
            <p className="mt-1 font-display text-xl leading-tight text-tinta">
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
        </div>
        <p className="mt-6 text-[0.75rem] leading-relaxed text-tinta-3">
          Data diperiksa terakhir 20 Oktober 2026. Kode sumber tersedia di
          repositori publik. Untuk koreksi data, sertakan tautan sumber agar bisa
          kami periksa.
        </p>
      </section>
    </div>
  );
}

