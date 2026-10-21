import Link from "next/link";
import { Foto } from "@/components/foto";
import { AtlasMap } from "@/components/atlas-map";
import { TimelineSejarah } from "@/components/timeline";
import { ARTIKEL, DAFTAR_UMKM, DESTINASI, statistikArsip } from "@/lib/arsip";

/**
 * Beranda.
 *
 * Struktur: satu foto besar yang memenuhi layar, lalu galeri yang
 * menyusun ulang diri di setiap baris. Tidak ada satu pun bagian yang
 * memakai bentuk yang sama dengan bagian sebelumnya, karena itu yang
 * membuat halaman terasa seperti formulir.
 *
 * Foto potret dipakai sebagai kolom tinggi, foto lebar sebagai pita.
 * Koleksi ini punya keduanya, jadi layout mengikuti bahan.
 */

const HERO = "/images/ampera-1.jpg";

export default function Beranda() {
  const s = statistikArsip();
  const [ampera, kemaro, bkb, masjid, museum, monpera, kapitan, musi, tpks] = DESTINASI;

  return (
    <>
      {/* ================================================================
          HERO: foto penuh. Tipe duduk di ruang gelap yang disediakan
          langit foto itu sendiri, bukan di panel terpisah.
          ================================================================ */}
      <section className="relative min-h-[92svh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Foto
            src={HERO}
            alt="Jembatan Ampera di atas Sungai Musi pada malam hari"
            prioritas
            sizes="100vw"
            className="h-full w-full object-cover object-[center_72%]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-malam via-malam/45 to-malam/65" />
        </div>

        <div className="relative mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-end px-5 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-12">
          <p className="meta-emas">Arsip digital Palembang · 2026</p>

          <h1 className="display mt-4 max-w-[13ch] text-[clamp(3rem,9vw,7.5rem)] text-terang">
            Sepuluh tempat yang membentuk sebuah kota.
          </h1>

          <div className="mt-8 flex flex-col gap-6 border-t border-terang/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="baca-malam max-w-[42ch] text-[0.9375rem]">
              Destinasi, usaha lokal, dan catatan sejarah Palembang. Setiap angka
              menunjuk sumber. Yang belum pasti ditandai belum pasti.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href="/destinasi"
                className="group inline-flex items-center gap-2 bg-terang px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-malam transition-colors hover:bg-emas"
              >
                Jelajahi destinasi
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/asisten"
                className="inline-flex items-center gap-2 border border-terang/30 px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-terang transition-colors hover:border-terang"
              >
                Tanya Sari
              </Link>
            </div>
          </div>

          {/* Angka diletakkan sebagai pita tipis di dasar foto, bukan
              kotak statistik berbingkai. */}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-terang/15 pt-5 sm:grid-cols-4 lg:grid-cols-6">
            {[
              { k: "Destinasi", v: s.destinasi },
              { k: "Berkoordinat", v: s.destinasiTerpetakan },
              { k: "Usaha lokal", v: s.umkm },
              { k: "Catatan sejarah", v: s.artikel },
              { k: "Sumber", v: s.sumber },
              { k: "Terverifikasi", v: `${s.persenTerverifikasi}%` },
            ].map((x) => (
              <div key={x.k}>
                <dt className="meta">{x.k}</dt>
                <dd className="tabular mt-1 font-display text-2xl leading-none text-terang">{x.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================================================================
          PITA FOTO: deretan horizontal yang bisa digulir. Meniru cara
          orang menelusuri kontak cetak, bukan grid kartu.
          ================================================================ */}
      <section aria-label="Sorotan foto" className="border-y border-garis-malam bg-malam-2 py-4">
        <div className="mask-kanan gulir-tipis flex gap-3 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-12">
          {[
            { src: "/images/monpera-1.jpg", label: "Monpera", href: `/destinasi/${monpera.id}` },
            { src: "/images/kemaro-2.jpg", label: "Pulau Kemaro", href: `/destinasi/${kemaro.id}` },
            { src: "/images/masjid-1.jpg", label: "Masjid Agung", href: `/destinasi/${masjid.id}` },
            { src: "/images/songket-2.jpg", label: "Songket", href: `/artikel/${ARTIKEL.find((a) => a.id.includes("songket"))?.id ?? ARTIKEL[0].id}` },
            { src: "/images/tpks-1.jpg", label: "TPKS", href: `/destinasi/${tpks.id}` },
            { src: "/images/museum-2.jpg", label: "Museum SMB II", href: `/destinasi/${museum.id}` },
            { src: "/images/bkb-1.jpg", label: "Kuto Besak", href: `/destinasi/${bkb.id}` },
            { src: "/images/kedukan-1.jpg", label: "Kedukan Bukit", href: `/artikel/${ARTIKEL.find((a) => a.id.includes("sriwijaya"))?.id ?? ARTIKEL[1].id}` },
          ].map((f) => (
            <Link
              key={f.src}
              href={f.href}
              className="group relative h-24 w-36 flex-none overflow-hidden sm:h-28 sm:w-44"
            >
              <Foto
                src={f.src}
                alt={f.label}
                sizes="176px"
                className="h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-malam/90 to-transparent px-2 pb-1.5 pt-4 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-terang">
                {f.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          GALERI ASIMETRIS: setiap baris punya bentuk berbeda.
          Baris 1: potret tinggi + teks + lanskap lebar.
          ================================================================ */}
      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.6vw,3.75rem)] text-terang">
            Mulai dari yang paling dikenal
          </h2>
          <Link
            href="/destinasi"
            className="meta hidden shrink-0 border-b border-terang-3 pb-1 text-terang-2 hover:border-emas hover:text-emas sm:block"
          >
            Semua destinasi →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
          {/* Kartu utama: potret Ampera, lebar 5 kolom, tinggi. */}
          <Link href={`/destinasi/${ampera.id}`} className="group md:col-span-5">
            <div className="relative overflow-hidden">
              <Foto
                src={ampera.gambar[0].src}
                alt={ampera.gambar[0].caption}
                sizes="(max-width: 768px) 100vw, 40vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
              <span className="absolute left-0 top-0 bg-malam/80 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-emas">
                01 · {ampera.kategori[0]}
              </span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="display text-[clamp(1.5rem,2.6vw,2rem)] text-terang group-hover:text-emas">
                  {ampera.nama}
                </h3>
                <p className="mt-1.5 max-w-[38ch] text-[0.8125rem] leading-relaxed text-terang-2">
                  {ampera.ringkas}
                </p>
              </div>
              <span className="meta mt-2 shrink-0 text-terang-3">{ampera.sumber.length} sumber</span>
            </div>
          </Link>

          {/* Kolom teks: menarik satu kutipan dari data, bukan kartu. */}
          <div className="flex flex-col justify-between border-t border-garis-malam pt-6 md:col-span-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div>
              <p className="meta-emas">Catatan</p>
              <p className="mt-3 font-display text-xl leading-snug text-terang">
                Nama Ampera adalah akronim dari Amanat Penderitaan Rakyat.
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-terang-2">
                Dibangun April 1962 dengan dana pampasan perang Jepang, mulai
                digunakan 1965. Bentang tengahnya pernah bisa diangkat.
              </p>
            </div>
            <Link href={`/artikel/${ARTIKEL[0].id}`} className="tautan meta mt-6 inline-block text-emas">
              Baca sejarahnya →
            </Link>
          </div>

          {/* Lanskap lebar: Benteng Kuto Besak. */}
          <Link href={`/destinasi/${bkb.id}`} className="group md:col-span-4">
            <div className="overflow-hidden">
              <Foto
                src={bkb.gambar[0].src}
                alt={bkb.gambar[0].caption}
                sizes="(max-width: 768px) 100vw, 32vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <div className="mt-3">
              <p className="meta">02 · {bkb.kategori.join(" · ")}</p>
              <h3 className="mt-1 font-display text-xl text-terang group-hover:text-emas">{bkb.nama}</h3>
              <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-terang-2">{bkb.ringkas}</p>
            </div>
          </Link>

          {/* Baris 2: tiga foto lanskap dengan lebar berbeda. */}
          <Link href={`/destinasi/${masjid.id}`} className="group md:col-span-4">
            <div className="overflow-hidden">
              <Foto
                src={masjid.gambar[1]?.src ?? masjid.gambar[0].src}
                alt={masjid.gambar[1]?.caption ?? masjid.gambar[0].caption}
                sizes="(max-width: 768px) 100vw, 32vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <div className="mt-3">
              <p className="meta">03 · {masjid.kategori[0]}</p>
              <h3 className="mt-1 font-display text-xl text-terang group-hover:text-emas">{masjid.nama}</h3>
            </div>
          </Link>

          <Link href={`/destinasi/${musi.id}`} className="group md:col-span-5">
            <div className="overflow-hidden">
              <Foto
                src={musi.gambar[1]?.src ?? musi.gambar[0].src}
                alt={musi.gambar[1]?.caption ?? musi.gambar[0].caption}
                sizes="(max-width: 768px) 100vw, 40vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <div className="mt-3">
              <p className="meta">04 · {musi.kategori.join(" · ")}</p>
              <h3 className="mt-1 font-display text-xl text-terang group-hover:text-emas">{musi.nama}</h3>
            </div>
          </Link>

          <Link href={`/destinasi/${kapitan.id}`} className="group md:col-span-3">
            <div className="overflow-hidden">
              <Foto
                src={kapitan.gambar[0].src}
                alt={kapitan.gambar[0].caption}
                sizes="(max-width: 768px) 100vw, 24vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <div className="mt-3">
              <p className="meta">05 · {kapitan.kategori[0]}</p>
              <h3 className="mt-1 font-display text-xl text-terang group-hover:text-emas">{kapitan.nama}</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ================================================================
          PETA: latar kertas, sengaja dibalik. Ini satu-satunya bagian
          yang butuh permukaan terang karena peta dibaca, bukan ditonton.
          ================================================================ */}
      <section className="kertas py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Atlas</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.75rem)] text-gelap">
                Posisi yang sebenarnya, bukan ilustrasi.
              </h2>
            </div>
            <p className="max-w-[40ch] text-[0.8125rem] leading-relaxed text-gelap-2">
              Jalan dan sungai digambar dari koordinat OpenStreetMap. Sembilan
              destinasi punya koordinat terverifikasi. Yang belum, tidak digambar.
            </p>
          </div>

          <div className="mt-8">
            <AtlasMap daftar={DESTINASI} />
          </div>
        </div>
      </section>

      {/* ================================================================
          GARIS WAKTU: pita gelap, angka besar.
          ================================================================ */}
      <section className="border-y border-garis-malam bg-malam-2 py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Garis waktu</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.75rem)] text-terang">
                Seribu tiga ratus tahun, diringkas.
              </h2>
            </div>
            <Link href="/artikel" className="meta border-b border-terang-3 pb-1 text-terang-2 hover:border-emas hover:text-emas">
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
      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.6vw,3.75rem)] text-terang">
            Pahami tempatnya sebelum datang.
          </h2>
          <Link href="/artikel" className="meta hidden shrink-0 border-b border-terang-3 pb-1 text-terang-2 hover:border-emas hover:text-emas sm:block">
            Semua catatan →
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Link href={`/artikel/${ARTIKEL[0].id}`} className="group">
            <div className="overflow-hidden">
              <Foto
                src={ARTIKEL[0].gambar}
                alt={ARTIKEL[0].gambarCaption}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <p className="meta mt-3">{ARTIKEL[0].kategori} · {ARTIKEL[0].sumber.length} sumber</p>
            <h3 className="display mt-1.5 text-[clamp(1.4rem,2.4vw,1.9rem)] text-terang group-hover:text-emas">
              {ARTIKEL[0].judul}
            </h3>
            <p className="mt-2 max-w-[52ch] text-[0.8125rem] leading-relaxed text-terang-2">
              {ARTIKEL[0].ringkas}
            </p>
          </Link>

          <div className="flex flex-col">
            {ARTIKEL.slice(1, 4).map((a) => (
              <Link
                key={a.id}
                href={`/artikel/${a.id}`}
                className="group flex gap-4 border-t border-garis-malam py-4 first:border-t-0 first:pt-0"
              >
                <div className="w-24 flex-none overflow-hidden sm:w-32">
                  <Foto src={a.gambar} alt={a.gambarCaption} sizes="128px" className="w-full" />
                </div>
                <div className="min-w-0">
                  <p className="meta">{a.kategori}</p>
                  <h3 className="mt-1 font-display text-lg leading-snug text-terang group-hover:text-emas">
                    {a.judul}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[0.75rem] leading-relaxed text-terang-3">
                    {a.ringkas}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          USAHA: pita horizontal, bukan grid kartu.
          ================================================================ */}
      <section className="border-t border-garis-malam bg-malam-2 py-16 lg:py-20">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Usaha lokal</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.5rem)] text-terang">
                Usaha yang menghidupi kota.
              </h2>
            </div>
            <Link href="/umkm" className="meta border-b border-terang-3 pb-1 text-terang-2 hover:border-emas hover:text-emas">
              Buka direktori →
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {DAFTAR_UMKM.slice(0, 4).map((u) => (
              <li key={u.id}>
                <Link href={`/umkm/${u.id}`} className="group block">
                  <div className="overflow-hidden">
                    <Foto
                      src={u.gambar[0].src}
                      alt={u.gambar[0].caption}
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="w-full transition-[filter] duration-700 group-hover:brightness-110"
                    />
                  </div>
                  <p className="meta mt-2">{u.kategori}</p>
                  <p className="mt-0.5 font-display text-base leading-tight text-terang group-hover:text-emas">
                    {u.nama}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
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
        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <p className="meta-emas">Asisten arsip</p>
          <h2 className="display mt-3 max-w-[18ch] text-[clamp(2.25rem,5.5vw,4.5rem)] text-terang">
            Asisten yang mengaku kalau tidak tahu.
          </h2>
          <p className="baca-malam mt-5 max-w-[46ch]">
            Sari menjawab hanya dari isi arsip, menyebut nomor rujukan, dan menolak
            pertanyaan di luar topik. Kalau jawabannya belum ada, ia mengatakannya.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/asisten"
              className="group inline-flex items-center gap-2 bg-emas px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-malam transition-colors hover:bg-emas-muda"
            >
              Tanya Asisten Sari
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/metodologi"
              className="inline-flex items-center gap-2 border border-terang/30 px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-terang transition-colors hover:border-terang"
            >
              Metodologi dan sumber
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
