import Link from "next/link";
import { JsonLdSitus } from "@/components/json-ld";
import { Foto } from "@/components/foto";
import { Peta } from "@/components/peta";
import { TimelineSejarah } from "@/components/timeline";
import { PitaFoto } from "@/components/pita-foto";
import { CuacaPalembang } from "@/components/cuaca-palembang";
import { ARTIKEL, DESTINASI, statistikArsip } from "@/lib/arsip";

/**
 * Beranda.
 *
 * Struktur sengaja dibuat pendek: hero, keadaan kota, pita foto, peta,
 * garis waktu, lalu ajakan ke asisten. Bagian yang dulu memuat galeri
 * asimetris dan deretan usaha sudah dihapus karena mengulang isi katalog
 * dan membuat halaman terasa seperti formulir.
 *
 * Prinsipnya: satu halaman, satu alur. Pengunjung yang ingin membandingkan
 * punya halaman katalog; yang ingin tahu letak punya peta; yang ingin
 * bertanya punya asisten.
 */

const HERO = "/images/ampera-1.jpg";

export default function Beranda() {
  const s = statistikArsip();

  return (
    <>
      <JsonLdSitus />
      {/* ================================================================
          HERO

          Mengikuti pola Rijksmuseum dan V&A: foto penuh, tipe langsung di
          atasnya, tanpa lapisan gelap tebal. Scrim hanya di kaki foto,
          setinggi yang benar-benar dibutuhkan teks, supaya satelit dan
          lampu jembatan tetap terlihat.

          Penting: section memakai min-height, bukan height. Sebelumnya
          `overflow-hidden` + tinggi tetap memotong baris statistik di
          layar pendek.
          ================================================================ */}
      <section className="relative flex min-h-[88svh] w-full flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <Foto
            src={HERO}
            alt="Jembatan Ampera di atas Sungai Musi pada malam hari"
            prioritas
            sizes="100vw"
            className="h-full w-full object-cover object-[center_62%]"
          />
          {/* Scrim hanya di kaki foto, bukan seluruh gambar. */}
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-malam via-malam/70 to-transparent" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1760px] flex-1 flex-col justify-end px-5 pb-8 pt-24 sm:px-8 sm:pb-10 lg:px-12">
          <div className="kilau pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true" />
          <p className="meta-emas relative">Arsip digital Palembang · 2026</p>

          <h1 className="display mt-3 max-w-[14ch] text-[clamp(2.5rem,8vw,7rem)] text-terang">
            {DESTINASI.length} tempat yang membentuk kota ini.
          </h1>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="baca-malam max-w-[38ch] text-[0.9375rem]">
              Tempat, usaha, kisah. Semua bersumber.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href="/destinasi"
                className="group inline-flex items-center gap-2 bg-terang px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-malam transition-colors hover:bg-emas"
              >
                Jelajahi destinasi
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/asisten"
                className="inline-flex items-center gap-2 bg-malam/70 px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang backdrop-blur-sm transition-colors hover:bg-malam"
              >
                Tanya Sari
              </Link>
            </div>
          </div>

          {/* Pita angka.

              Sebelumnya kolom terakhir berbunyi "Terverifikasi 15%".
              Angka itu jujur tetapi salah tempat: di posisi paling
              menonjol di halaman, ia terbaca sebagai "85% sisanya tidak
              dipercaya". Yang ditampilkan sekarang adalah ukuran arsip
              yang bisa dipakai pengunjung, dan status verifikasi tetap
              dijelaskan di halaman Metodologi tempat ia memang dibahas. */}
          <dl className="mt-7 grid grid-cols-4 gap-x-4 border-t border-terang/20 pt-4">
            {[
              { k: "Destinasi", v: s.destinasi },
              { k: "Usaha", v: s.umkm },
              { k: "Catatan", v: s.artikel },
              { k: "Sumber", v: s.sumber },
            ].map((x, i) => (
              /*
                Jeda maksimum 2 langkah, bukan 6. Dengan 6 langkah
                (60 ms each) angka terakhir baru terbaca 396 ms setelah
                LCP. Dua langkah sudah memberi kesan berurutan tanpa
                menunda keterbacaan.
              */
              <div key={x.k} className="angka-naik min-w-0" style={{ animationDelay: `${Math.min(i, 1) * 70}ms` }}>
                <dt className="meta truncate">{x.k}</dt>
                <dd className="tabular mt-0.5 font-display text-xl leading-none text-terang sm:text-2xl">{x.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================================================================
          KEADAAN KOTA: cuaca nyata, bukan ilustrasi.
          ================================================================ */}
      <section aria-label="Keadaan Palembang hari ini" className="border-y border-garis-malam bg-malam-2 py-5">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="max-w-[46ch]">
            <p className="meta-emas">Cuaca hari ini</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-terang-2">
              Angka di bawah ini diambil langsung dari stasiun meteorologi
              terdekat, bukan perkiraan. Cuaca berubah, jadi angkanya ikut
              berubah saat halaman dibuka.
            </p>
          </div>
          <CuacaPalembang />
        </div>
      </section>

      {/* ================================================================
          PITA FOTO: deretan horizontal yang bisa digeser, dibuat dari
          data destinasi nyata. Meniru cara orang menelusuri kontak cetak,
          bukan grid kartu.
          ================================================================ */}
      <section aria-label="Sorotan foto" className="border-b border-garis-malam bg-malam-2 py-4">
        <PitaFoto daftar={DESTINASI} judul="Sorotan foto" />
      </section>

      {/* ================================================================
          PETA: latar kertas, sengaja dibalik. Ini satu-satunya bagian
          yang butuh permukaan terang karena peta dibaca, bukan ditonton.
          ================================================================ */}
      <section className="kertas relative py-14 lg:py-16">
        <div className="relative mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Peta</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.5rem)] text-gelap">
                Lihat sendiri bentuk kotanya.
              </h2>
            </div>
            {/* Angka diambil dari data, bukan ditulis tetap. Sebelumnya
                teks ini berbunyi "Sembilan titik" padahal ada sepuluh
                destinasi berkoordinat: angka yang tidak ikut berubah
                saat data berubah adalah cara tercepat kehilangan
                kepercayaan pembaca. */}
            <p className="max-w-[38ch] text-[0.875rem] leading-relaxed text-gelap-2">
              Satelit asli, bisa di-zoom. {s.destinasiTerpetakan} titik sudah
              terverifikasi dan bisa dibuka satu per satu.
            </p>
          </div>

          <div className="mt-8">
            <Peta daftar={DESTINASI} tinggi="560px" />
          </div>
        </div>
      </section>

      {/* ================================================================
          GARIS WAKTU: pita gelap, angka besar.
          ================================================================ */}
      <section className="border-y border-garis-malam bg-malam-2 py-14 lg:py-20">
        <div className="mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Garis waktu</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.75rem)] text-terang">
                Seribu tiga ratus tahun, diringkas.
              </h2>
            </div>
            <Link href="/artikel" className="meta inline-flex min-h-8 items-center border-b border-terang-3 text-terang-2 hover:border-emas hover:text-emas">
              Baca catatan sejarah →
            </Link>
          </div>
          <div className="mt-8">
            <TimelineSejarah />
          </div>
        </div>
      </section>

      {/* ================================================================
          ARTIKEL: satu besar, dua kecil. Bukan tiga kartu sama.
          ================================================================ */}
      <section className="mx-auto max-w-[1760px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.6vw,3.5rem)] text-terang">
            Kenali dulu, baru datang.
          </h2>
          <Link href="/artikel" className="meta hidden min-h-8 shrink-0 items-center border-b border-terang-3 text-terang-2 hover:border-emas hover:text-emas sm:inline-flex">
            Semua catatan →
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Foto unggulan memakai rasio tetap 16:10. Sebelumnya kolom ini
              diberi flex-1, dan karena pasangan kolomnya bertumpuk panjang,
              fotonya melar jadi potret raksasa. Rasio tetap lebih penting
              daripada mengisi tinggi baris. Ringkasan di bawah judul yang
              menutup sisa ruang. */}
          <Link href={`/artikel/${ARTIKEL[0].id}`} className="group">
            <div className="overflow-hidden">
              <Foto
                src={ARTIKEL[0].gambar}
                alt={ARTIKEL[0].gambarCaption}
                rasioPaksa="16 / 10"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <p className="meta mt-3">{ARTIKEL[0].kategori} · {ARTIKEL[0].sumber.length} sumber</p>
            <h3 className="display mt-1.5 text-[clamp(1.4rem,2.4vw,1.9rem)] text-terang group-hover:text-emas">
              {ARTIKEL[0].judul}
            </h3>
            <p className="mt-2 max-w-[48ch] text-[0.8125rem] leading-relaxed text-terang-2">
              {ARTIKEL[0].ringkas}
            </p>
          </Link>

          {/* Tiga catatan lain: daftar rapat dengan garis pemisah.
              `justify-between` sempat dipakai dan hasilnya celah
              menggantung di antara baris, jadi sekarang mengalir
              dari atas. */}
          <div>
            {ARTIKEL.slice(1, 4).map((a) => (
              <Link
                key={a.id}
                href={`/artikel/${a.id}`}
                className="group flex gap-4 border-b border-garis-malam py-4 first:pt-0 last:border-b-0"
              >
                <div className="w-20 flex-none self-start overflow-hidden sm:w-28">
                  <Foto src={a.gambar} alt={a.gambarCaption} rasioPaksa="1 / 1" sizes="112px" className="w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="meta">{a.kategori}</p>
                  <h3 className="mt-1 font-display text-lg leading-snug text-terang group-hover:text-emas">
                    {a.judul}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-terang-3">
                    {a.ringkas}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PENUTUP: ajakan ke asisten, dengan foto potret sebagai latar.
          ================================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Foto
            src="/images/monpera-1.jpg"
            alt="Relief Garuda di Monumen Perjuangan Rakyat"
            sizes="100vw"
            className="h-full w-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-malam/82" />
        </div>
        <div className="relative mx-auto max-w-[1760px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <p className="meta-emas">Asisten arsip</p>
          <h2 className="display mt-3 max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.5rem)] text-terang">
            Tanya Sari. Ia jujur kalau tidak tahu.
          </h2>
          <p className="baca-malam mt-5 max-w-[44ch]">
            Sari menjawab dari arsip situs ini dan menyertakan sumbernya.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/asisten"
              className="group inline-flex items-center gap-2 bg-emas px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-malam transition-colors hover:bg-emas-muda"
            >
              Tanya Asisten Sari
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/metodologi"
              className="inline-flex items-center gap-2 border border-terang/30 px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang transition-colors hover:border-terang"
            >
              Metodologi dan sumber
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}