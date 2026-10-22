import Link from "next/link";
import { JsonLdSitus } from "@/components/json-ld";
import { Foto } from "@/components/foto";
import { Peta } from "@/components/peta";
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
  const [ampera, , bkb, masjid, museum, monpera, , musi, tpks] = DESTINASI;

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

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-8 pt-24 sm:px-8 sm:pb-10 lg:px-12">
          <p className="meta-emas">Arsip digital Palembang · 2026</p>

          <h1 className="display mt-3 max-w-[14ch] text-[clamp(2.5rem,8vw,7rem)] text-terang">
            Sepuluh tempat yang membentuk kota ini.
          </h1>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="baca-malam max-w-[38ch] text-[0.9375rem]">
              Mari jelajahi Palembang: tempat menarik, usaha lokal, dan
              kisahnya. Kami tulis apa yang kami tahu.
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
                className="inline-flex items-center gap-2 bg-malam/70 px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-terang backdrop-blur-sm transition-colors hover:bg-malam"
              >
                Tanya Sari
              </Link>
            </div>
          </div>

          {/* Pita angka. Empat kolom, dua baris di ponsel, tanpa risiko
              terpotong karena section boleh tumbuh. */}
          <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-terang/20 pt-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { k: "Destinasi", v: s.destinasi },
              { k: "Berkoordinat", v: s.destinasiTerpetakan },
              { k: "Usaha lokal", v: s.umkm },
              { k: "Catatan", v: s.artikel },
              { k: "Sumber", v: s.sumber },
              { k: "Terverifikasi", v: `${s.persenTerverifikasi}%` },
            ].map((x) => (
              <div key={x.k}>
                <dt className="meta">{x.k}</dt>
                <dd className="tabular mt-0.5 font-display text-xl leading-none text-terang">{x.v}</dd>
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
            { src: "/images/kemaro-2.jpg", label: "Pulau Kemaro", href: `/destinasi/${DESTINASI.find((d) => d.id === "pulau-kemaro")?.id ?? DESTINASI[1].id}` },
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
      <section className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.6vw,3.75rem)] text-terang">
            Mulai dari yang paling dikenal
          </h2>
          <Link
            href="/destinasi"
            className="meta hidden min-h-8 shrink-0 items-center border-b border-terang-3 text-terang-2 hover:border-emas hover:text-emas sm:inline-flex"
          >
            Semua destinasi →
          </Link>
        </div>

        {/*
          Grid 12 kolom. Setiap baris dijumlahkan tepat 12 supaya tidak ada
          kartu yang melompat ke baris berikutnya secara tak terduga.
            Baris 1: 5 (potret) + 4 (teks) + 3 (lanskap) = 12
            Baris 2: 4 + 4 + 4                              = 12
        */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
          {/* Baris 1, kolom 1-5: potret Ampera. */}
          <Link href={`/destinasi/${ampera.id}`} className="group md:col-span-5">
            <div className="relative overflow-hidden">
              <Foto
                src={ampera.gambar[0].src}
                alt={ampera.gambar[0].caption}
                rasioPaksa="4 / 5"
                posisi="top"
                sizes="(max-width: 768px) 100vw, 40vw"
                className="w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
              />
              <span className="absolute left-0 top-0 bg-malam/80 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-emas">
                01 · {ampera.kategori[0]}
              </span>
            </div>
            <h3 className="display mt-3 text-[clamp(1.4rem,2.4vw,1.9rem)] text-terang group-hover:text-emas">
              {ampera.nama}
            </h3>
            <p className="mt-1.5 line-clamp-3 max-w-[38ch] text-[0.8125rem] leading-relaxed text-terang-2">
              {ampera.ringkas}
            </p>
          </Link>

          {/* Baris 1, kolom 6-9: kutipan + dua destinasi kecil bertumpuk.
              Dulu kolom ini hanya berisi tiga baris teks, jadi menyisakan
              ruang kosong setinggi foto potret di sebelahnya. Sekarang
              diisi dua entri lagi supaya tingginya seimbang. */}
          <div className="border-t border-garis-malam pt-5 md:col-span-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="meta-emas">Catatan</p>
            <p className="mt-3 font-display text-lg leading-snug text-terang sm:text-xl">
              Nama Ampera adalah akronim dari Amanat Penderitaan Rakyat.
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-terang-2">
              Dibangun April 1962 dengan dana pampasan perang Jepang, mulai
              digunakan 1965. Bentang tengahnya pernah bisa diangkat.
            </p>
            <Link href={`/artikel/${ARTIKEL[0].id}`} className="tautan meta mt-4 inline-flex min-h-8 items-center text-emas">
              Baca sejarahnya →
            </Link>

            <ul className="mt-6 space-y-3 border-t border-garis-malam pt-5">
              {[masjid, musi].map((d) => (
                <li key={d.id}>
                  <Link href={`/destinasi/${d.id}`} className="group flex items-center gap-3">
                    <div className="h-12 w-16 shrink-0 overflow-hidden">
                      <Foto
                        src={d.gambar[0].src}
                        alt={d.gambar[0].caption}
                        rasioPaksa="4 / 3"
                        sizes="64px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="meta text-[0.5rem]">{d.kategori[0]}</p>
                      <p className="truncate font-display text-sm leading-tight text-terang group-hover:text-emas">
                        {d.nama}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Baris 1, kolom 10-12: Benteng Kuto Besak. Rasio lanskap
              karena subjeknya dinding benteng, bukan menara vertikal. */}
          <Link href={`/destinasi/${bkb.id}`} className="group md:col-span-3">
            <div className="overflow-hidden">
              <Foto
                src={bkb.gambar[1]?.src ?? bkb.gambar[0].src}
                alt={bkb.gambar[1]?.caption ?? bkb.gambar[0].caption}
                rasioPaksa="4 / 3"
                sizes="(max-width: 768px) 100vw, 24vw"
                className="w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
              />
            </div>
            <p className="meta mt-3">02 · {bkb.kategori[0]}</p>
            <h3 className="mt-1 font-display text-lg leading-tight text-terang group-hover:text-emas">
              {bkb.nama}
            </h3>
            <p className="mt-1.5 line-clamp-3 text-[0.75rem] leading-relaxed text-terang-3">
              {bkb.ringkas}
            </p>
          </Link>

          {/* Baris 2: tiga lanskap sama lebar. */}
          {[monpera, museum, tpks].map((d, i) => (
            <Link key={d.id} href={`/destinasi/${d.id}`} className="group md:col-span-4">
              <div className="overflow-hidden">
                <Foto
                  src={d.gambar[1]?.src ?? d.gambar[0].src}
                  alt={d.gambar[1]?.caption ?? d.gambar[0].caption}
                  rasioPaksa="3 / 2"
                  sizes="(max-width: 768px) 100vw, 32vw"
                  className="w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                />
              </div>
              <p className="meta mt-3">
                {String(i + 3).padStart(2, "0")} · {d.kategori[0]}
              </p>
              <h3 className="mt-1 font-display text-lg leading-tight text-terang group-hover:text-emas">
                {d.nama}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          PETA: latar kertas, sengaja dibalik. Ini satu-satunya bagian
          yang butuh permukaan terang karena peta dibaca, bukan ditonton.
          ================================================================ */}
      <section className="kertas py-14 lg:py-16">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Peta</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.5rem)] text-gelap">
                Lihat sendiri bentuk kotanya.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-gelap-2">
              Satelit asli, bisa di-zoom. Sembilan titik sudah terverifikasi.
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
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
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
      <section className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.6vw,3.5rem)] text-terang">
            Kenali dulu, baru datang.
          </h2>
          <Link href="/artikel" className="meta hidden min-h-8 shrink-0 items-center border-b border-terang-3 text-terang-2 hover:border-emas hover:text-emas sm:inline-flex">
            Semua catatan →
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
          </Link>

          <div className="flex flex-col justify-center">
            {ARTIKEL.slice(1, 4).map((a) => (
              <Link
                key={a.id}
                href={`/artikel/${a.id}`}
                className="group flex gap-4 border-t border-garis-malam py-4 first:border-t-0 first:pt-0"
              >
                <div className="w-20 flex-none overflow-hidden sm:w-28">
                  <Foto src={a.gambar} alt={a.gambarCaption} rasioPaksa="1 / 1" sizes="112px" className="w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="meta">{a.kategori}</p>
                  <h3 className="mt-1 font-display text-lg leading-snug text-terang group-hover:text-emas">
                    {a.judul}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          USAHA: pita horizontal, bukan grid kartu.
          ================================================================ */}
      <section className="border-t border-garis-malam bg-malam-2 py-14 lg:py-16">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-emas">Usaha lokal</p>
              <h2 className="display mt-2 max-w-[18ch] text-[clamp(2rem,4.6vw,3.5rem)] text-terang">
                Usaha yang menghidupi kota.
              </h2>
            </div>
            <Link href="/umkm" className="meta inline-flex min-h-8 items-center border-b border-terang-3 text-terang-2 hover:border-emas hover:text-emas">
              Buka direktori →
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {DAFTAR_UMKM.slice(0, 4).map((u) => (
              <li key={u.id}>
                <Link href={`/umkm/${u.id}`} className="group block">
                  <div className="overflow-hidden">
                    <Foto
                      src={u.gambar[0].src}
                      alt={u.gambar[0].caption}
                      rasioPaksa="1 / 1"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
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
        <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
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
