import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeVerifikasi,
  BarisMeta,
  CatatanBelumPasti,
  PenandaBagian,
  Tombol,
} from "@/components/ui";
import {
  DESTINASI,
  artikelUntukDestinasi,
  cariDestinasi,
  destinasiTerkait,
} from "@/lib/arsip";
import { koordinatTeks, tanggalPanjang } from "@/lib/format";
import { warnaKategori } from "@/lib/warna";

export function generateStaticParams() {
  return DESTINASI.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const d = cariDestinasi(id);
  if (!d) return { title: "Destinasi tidak ditemukan" };
  return {
    title: d.nama,
    description: d.ringkas,
    openGraph: {
      title: `${d.nama} — Sriwijaya Culture`,
      description: d.ringkas,
      images: [{ url: d.gambar[0].src, alt: d.gambar[0].caption }],
    },
  };
}

/**
 * Halaman detail destinasi.
 *
 * Susunan mengikuti lembar katalog museum: identitas di kiri (foto,
 * nomor, koordinat), isi di kanan, dan kolom data yang menempel saat
 * digulir. Yang penting: metadata ditempatkan sebagai elemen visual,
 * bukan disembunyikan di paragraf.
 */
export default async function DetailDestinasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = cariDestinasi(id);
  if (!d) notFound();

  const terkait = destinasiTerkait(d);
  const artikel = artikelUntukDestinasi(d.id);
  const idx = DESTINASI.findIndex((x) => x.id === d.id);
  const berikut = DESTINASI[(idx + 1) % DESTINASI.length];
  const sebelum = DESTINASI[(idx - 1 + DESTINASI.length) % DESTINASI.length];
  const [utama, ...lain] = d.gambar;

  return (
    <article className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
      {/* --- Kepala lembar --- */}
      <nav aria-label="Remah roti" className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-wider text-tinta-3">
        <Link href="/destinasi" className="hover:text-tinta">
          Destinasi
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-tinta">{d.nama}</span>
      </nav>

      <header className="mt-4 grid gap-4 border-t border-tinta pt-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="label-arsip">
            <span className="mr-2 text-kunyit-ink">
              No. {String(idx + 1).padStart(3, "0")}
            </span>
            {d.kategori.join(" · ")}
          </p>
          <h1 className="judul-arsip mt-2 text-[clamp(2.25rem,5.4vw,4rem)]">{d.nama}</h1>
          <p className="mt-2 max-w-[52ch] font-display text-lg leading-snug text-tinta-2 sm:text-xl">
            {d.namaLengkap}
          </p>
        </div>

        {/* Kolom data ringkas: terbaca sekilas, tanpa perlu menggulir. */}
        <dl className="self-start border border-garis bg-kertas-2 px-3 py-2">
          <BarisMeta k="Wilayah" v={d.wilayah} />
          <BarisMeta
            k="Koordinat"
            v={d.koordinat ? koordinatTeks(d.koordinat.lat, d.koordinat.lng) : "Belum diverifikasi"}
            mono={Boolean(d.koordinat)}
          />
          <BarisMeta k="Kategori" v={d.kategori.join(", ")} />
          <BarisMeta k="Sumber" v={`${d.sumber.length} rujukan`} mono />
          <BarisMeta
            k="Diperbarui"
            v={d.tanggalDiperbarui ? tanggalPanjang(d.tanggalDiperbarui) : "Tidak dicatat"}
          />
        </dl>
      </header>

      {/* --- Foto utama + ringkasan --- */}
      <div className="mt-4 grid gap-6 border-t border-garis-2 pt-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <figure className="min-w-0">
          <div className="grup-foto relative aspect-[16/10] overflow-hidden border border-garis bg-kertas-3">
            <Image
              src={utama.src}
              alt={utama.caption}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="foto-arsip object-cover"
            />
            <span
              className="absolute left-0 top-0 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-wider text-kertas"
              style={{ background: warnaKategori(d.kategori[0]) }}
            >
              {d.kategori[0]}
            </span>
          </div>
          <figcaption className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
            <span>{utama.caption}</span>
            <span>{utama.kredit}</span>
          </figcaption>
        </figure>

        <div className="min-w-0">
          <p className="prosa text-[1.0625rem] leading-relaxed text-tinta">{d.ringkas}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {d.koordinat && (
              <Tombol
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.mapsQuery)}`}
                varian="garis"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka di peta
              </Tombol>
            )}
            <Tombol
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d.mapsQuery)}`}
              varian="garis"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rute perjalanan
            </Tombol>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="border-l-2 border-garis-3 pl-3">
              <p className="label-arsip">Tiket</p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-tinta">{d.tiket.teks}</p>
              <div className="mt-2">
                <BadgeVerifikasi tingkat={d.tiket.verifikasi} />
              </div>
            </div>
            <div className="border-l-2 border-garis-3 pl-3">
              <p className="label-arsip">Jam buka</p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-tinta">{d.jam.teks}</p>
              <div className="mt-2">
                <BadgeVerifikasi tingkat={d.jam.verifikasi} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Isi utama + kolom data menempel --- */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <PenandaBagian nomor="01" teks="Deskripsi" />
          <p className="prosa mt-3">{d.deskripsi}</p>

          <PenandaBagian nomor="02" teks="Sejarah" />
          <p className="prosa mt-3">{d.sejarah}</p>

          {d.legenda && (
            <>
              <PenandaBagian nomor="03" teks="Legenda rakyat" />
              <div className="mt-3 border border-garis bg-kertas-2 p-4">
                <p className="label-arsip-kuat">Legenda, bukan peristiwa sejarah</p>
                <p className="mt-1.5 font-display text-lg text-tinta">{d.legenda.judul}</p>
                <p className="prosa mt-2 text-[0.875rem]">{d.legenda.isi}</p>
              </div>
            </>
          )}

          <PenandaBagian nomor={d.legenda ? "04" : "03"} teks="Daya tarik" />
          <ul className="mt-3 grid gap-0 border-t border-garis-2 sm:grid-cols-2">
            {d.dayaTarik.map((x, i) => (
              <li
                key={i}
                className="flex gap-3 border-b border-garis-2 py-2.5 sm:odd:pr-4 sm:even:border-l sm:even:pl-4"
              >
                <span className="tabular flex-none font-mono text-[0.625rem] text-kunyit-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.8125rem] leading-relaxed text-tinta-2">{x}</span>
              </li>
            ))}
          </ul>

          <PenandaBagian nomor={d.legenda ? "05" : "04"} teks="Aktivitas" />
          <ul className="mt-3 space-y-2">
            {d.aktivitas.map((x, i) => (
              <li key={i} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-tinta-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none bg-kunyit" />
                {x}
              </li>
            ))}
          </ul>

          {d.catatanVerifikasi && (
            <div className="mt-8">
              <CatatanBelumPasti judul="Catatan verifikasi">{d.catatanVerifikasi}</CatatanBelumPasti>
            </div>
          )}

          {/* Sumber: bagian yang membuat klaim bisa diperiksa. */}
          <PenandaBagian nomor={d.legenda ? "06" : "05"} teks="Sumber" />
          <ol className="mt-3 border-t border-garis-2">
            {d.sumber.map((s, i) => (
              <li key={i} className="border-b border-garis-2 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tautan-arsip text-[0.875rem] font-medium text-tinta"
                    >
                      {s.judul}
                    </a>
                    <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                      {s.penulis}
                    </p>
                  </div>
                  {s.verifikasi && <BadgeVerifikasi tingkat={s.verifikasi} />}
                </div>
              </li>
            ))}
          </ol>

          {/* Ulasan: dinyatakan belum ada, bukan dikarang. */}
          <div className="mt-6 border border-garis bg-kertas-3/40 p-4">
            <p className="label-arsip">Ulasan pengunjung</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-tinta-2">{d.ulasan.pesan}</p>
          </div>
        </div>

        {/* Kolom kanan menempel: fakta, akses, galeri. */}
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-[4.5rem] lg:self-start">
          <div className="border border-garis bg-kertas-2">
            <p className="label-arsip border-b border-garis px-3 py-2">Data tercatat</p>
            <dl className="px-3 py-1">
              {d.fakta.map((f, i) => (
                <BarisMeta key={i} k={f.k} v={f.v} />
              ))}
            </dl>
          </div>

          <div className="border border-garis p-3">
            <p className="label-arsip">Alamat dan akses</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta">{d.alamat}</p>
            <p className="mt-2 border-t border-garis-2 pt-2 text-[0.8125rem] leading-relaxed text-tinta-2">
              {d.akses}
            </p>
          </div>

          {lain.length > 0 && (
            <div>
              <p className="label-arsip mb-2">Galeri · {lain.length} foto</p>
              <div className="grid grid-cols-2 gap-1.5">
                {lain.map((g, i) => (
                  <figure key={i} className={i === 0 && lain.length % 2 === 1 ? "col-span-2" : ""}>
                    <div className="relative aspect-[4/3] overflow-hidden border border-garis">
                      <Image
                        src={g.src}
                        alt={g.caption}
                        fill
                        sizes="(max-width: 1024px) 50vw, 240px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-1 text-[0.5625rem] leading-tight text-tinta-3">
                      {g.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-garis pt-3">
            <p className="label-arsip">Navigasi lembar</p>
            <div className="mt-2 space-y-1">
              <Link
                href={`/destinasi/${sebelum.id}`}
                className="group flex items-center justify-between gap-3 py-1.5 text-[0.8125rem] text-tinta-2 hover:text-tinta"
              >
                <span aria-hidden="true">←</span>
                <span className="min-w-0 flex-1 truncate text-right">{sebelum.nama}</span>
              </Link>
              <Link
                href={`/destinasi/${berikut.id}`}
                className="group flex items-center justify-between gap-3 py-1.5 text-[0.8125rem] text-tinta-2 hover:text-tinta"
              >
                <span className="min-w-0 flex-1 truncate">{berikut.nama}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* --- Artikel terkait --- */}
      {artikel.length > 0 && (
        <section className="mt-14">
          <div className="border-t border-tinta pt-4">
            <p className="label-arsip">
              <span className="mr-2 text-kunyit-ink">07</span>Bacaan terkait
            </p>
            <ul className="mt-4 grid gap-0 border border-garis md:grid-cols-2">
              {artikel.map((a) => (
                <li key={a.id} className="border-b border-garis md:border-b-0 md:border-r md:last:border-r-0">
                  <Link href={`/artikel/${a.id}`} className="group flex h-full items-start gap-3 p-4">
                    <div className="relative h-16 w-20 flex-none overflow-hidden border border-garis">
                      <Image src={a.gambar} alt={a.gambarCaption} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="label-arsip text-[0.5625rem]">{a.kategori}</p>
                      <p className="mt-0.5 font-display text-base leading-snug text-tinta group-hover:text-hijau-700">
                        {a.judul}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* --- Destinasi lain --- */}
      {terkait.length > 0 && (
        <section className="mt-14">
          <div className="border-t border-tinta pt-4">
            <p className="label-arsip">
              <span className="mr-2 text-kunyit-ink">08</span>Destinasi di sekitar
            </p>
            <ul className="mt-4 grid gap-0 border border-garis sm:grid-cols-2 lg:grid-cols-4">
              {terkait.map((t) => (
                <li
                  key={t.id}
                  className="border-b border-garis sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
                >
                  <Link href={`/destinasi/${t.id}`} className="group block">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={t.gambar[0].src}
                        alt={t.gambar[0].caption}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="label-arsip text-[0.5625rem]">{t.kategori[0]}</p>
                      <p className="mt-0.5 font-display text-base leading-tight text-tinta">{t.nama}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
