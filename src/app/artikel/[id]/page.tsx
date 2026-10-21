import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PenandaBagian, Tombol } from "@/components/ui";
import { ARTIKEL, artikelTerkait, cariArtikel, cariDestinasi } from "@/lib/arsip";
import { tanggalPanjang } from "@/lib/format";
import { warnaKategori } from "@/lib/warna";

export function generateStaticParams() {
  return ARTIKEL.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const a = cariArtikel(id);
  if (!a) return { title: "Artikel tidak ditemukan" };
  return {
    title: a.judul,
    description: a.ringkas,
    openGraph: {
      title: a.judul,
      description: a.ringkas,
      images: [{ url: a.gambar, alt: a.gambarCaption }],
    },
  };
}

/**
 * Artikel panjang.
 *
 * Lebar baca dikunci 68 karakter. Judul bagian bernomor supaya pembaca
 * bisa kembali ke posisi tertentu. Daftar isi dibuat dari data bagian,
 * jadi tidak mungkin basi.
 */
export default async function DetailArtikel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = cariArtikel(id);
  if (!a) notFound();

  const terkait = artikelTerkait(a);
  const destinasi = a.destinasiTerkait
    .map((x) => cariDestinasi(x))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const idx = ARTIKEL.findIndex((x) => x.id === a.id);
  const berikut = ARTIKEL[(idx + 1) % ARTIKEL.length];
  const kata = a.bagian.reduce(
    (n, b) => n + b.paragraf.join(" ").split(/\s+/).length,
    a.pendahuluan.split(/\s+/).length + a.kesimpulan.split(/\s+/).length,
  );
  const menit = Math.max(1, Math.round(kata / 200));

  return (
    <article className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
      <nav
        aria-label="Remah roti"
        className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-wider text-tinta-3"
      >
        <Link href="/artikel" className="hover:text-tinta">
          Sejarah
        </Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1 text-tinta">{a.judul}</span>
      </nav>

      <header className="mt-4 border-t border-tinta pt-4">
        <p className="label-arsip">
          <span
            className="mr-2 inline-block px-1.5 py-0.5 text-kertas"
            style={{ background: warnaKategori(a.kategori) }}
          >
            {a.kategori}
          </span>
          {tanggalPanjang(a.tanggal)} · {menit} menit baca · {a.sumber.length} sumber
        </p>
        <h1 className="judul-arsip mt-3 max-w-[26ch] text-[clamp(2rem,4.6vw,3.5rem)]">{a.judul}</h1>
        <p className="prosa mt-4 max-w-[62ch] text-lg text-tinta-2">{a.ringkas}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-garis-2 pt-3">
          <p className="font-mono text-[0.625rem] uppercase tracking-wider text-tinta-3">
            {a.penulis}
          </p>
          <span className="h-3 w-px bg-garis" aria-hidden="true" />
          <p className="font-mono text-[0.625rem] uppercase tracking-wider text-tinta-3">
            Status: {a.status === "terverifikasi-sebagian" ? "Terverifikasi sebagian" : a.status}
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
        {/* Daftar isi menempel. */}
        <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
          <p className="label-arsip border-b border-garis pb-2">Daftar isi</p>
          <ol className="mt-2">
            {a.bagian.map((b, i) => (
              <li key={i}>
                <a
                  href={`#bagian-${i + 1}`}
                  className="group flex gap-2 border-b border-garis-2 py-1.5 text-[0.75rem] leading-snug text-tinta-2 hover:text-tinta"
                >
                  <span className="tabular flex-none font-mono text-[0.5625rem] text-kunyit-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">{b.subjudul}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="#sumber"
                className="flex gap-2 py-1.5 text-[0.75rem] leading-snug text-tinta-2 hover:text-tinta"
              >
                <span className="tabular flex-none font-mono text-[0.5625rem] text-kunyit-ink">•</span>
                Sumber
              </a>
            </li>
          </ol>
        </aside>

        <div className="min-w-0">
          <figure className="mb-6">
            <div className="relative aspect-[16/9] overflow-hidden border border-garis">
              <Image
                src={a.gambar}
                alt={a.gambarCaption}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
              {a.gambarCaption}
            </figcaption>
          </figure>

          <p className="prosa text-[1.0625rem] leading-[1.75] text-tinta">{a.pendahuluan}</p>

          {a.bagian.map((b, i) => (
            <section key={i} id={`bagian-${i + 1}`} className="mt-8 scroll-mt-24">
              <h2 className="flex items-baseline gap-2 border-t border-garis pt-4 font-display text-xl leading-tight text-tinta sm:text-2xl">
                <span className="tabular font-mono text-[0.6875rem] text-kunyit-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {b.subjudul}
              </h2>
              <div className="prosa mt-2">
                {b.paragraf.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="mt-10 border-l-2 border-kunyit bg-kertas-2 py-3 pl-4 pr-3">
            <p className="label-arsip-kuat">Kesimpulan</p>
            <p className="prosa mt-2 text-tinta">{a.kesimpulan}</p>
          </section>

          <section id="sumber" className="mt-10 scroll-mt-24">
            <PenandaBagian nomor="—" teks="Sumber" />
            <ol className="border-t border-garis-2">
              {a.sumber.map((s, i) => (
                <li key={i} className="border-b border-garis-2 py-2.5">
                  <div className="flex items-start justify-between gap-3">
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
                        {s.tahun ? ` · ${s.tahun}` : ""}
                      </p>
                      {s.catatan && (
                        <p className="mt-1 text-[0.75rem] leading-snug text-tinta-3">{s.catatan}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-garis pt-4">
            <Tombol href="/destinasi" panah>
              Jelajahi destinasi
            </Tombol>
            <Tombol href={`/artikel/${berikut.id}`} varian="garis">
              Artikel berikutnya
            </Tombol>
          </div>
        </div>

        {/* Kolom kanan: destinasi yang disebut artikel ini. */}
        <aside className="hidden lg:block">
          {destinasi.length > 0 && (
            <div className="lg:sticky lg:top-20">
              <p className="label-arsip border-b border-garis pb-2">Destinasi terkait</p>
              <ul className="mt-2 space-y-2">
                {destinasi.map((d) => (
                  <li key={d.id}>
                    <Link href={`/destinasi/${d.id}`} className="group block">
                      <div className="relative aspect-[3/2] overflow-hidden border border-garis">
                        <Image
                          src={d.gambar[0].src}
                          alt={d.gambar[0].caption}
                          fill
                          sizes="240px"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-[0.75rem] font-medium leading-tight text-tinta group-hover:text-hijau-700">
                        {d.nama}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {terkait.length > 0 && (
        <section className="mt-14">
          <div className="border-t border-tinta pt-4">
            <p className="label-arsip">
              <span className="mr-2 text-kunyit-ink">04</span>Bacaan lain
            </p>
            <ul className="mt-4 grid gap-0 border border-garis md:grid-cols-3">
              {terkait.map((t) => (
                <li
                  key={t.id}
                  className="border-b border-garis md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <Link href={`/artikel/${t.id}`} className="group flex h-full flex-col p-4">
                    <p className="label-arsip text-[0.5625rem]">{t.kategori}</p>
                    <p className="mt-1 font-display text-base leading-snug text-tinta group-hover:text-hijau-700">
                      {t.judul}
                    </p>
                    <p className="mt-auto pt-2 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                      {tanggalPanjang(t.tanggal)}
                    </p>
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
