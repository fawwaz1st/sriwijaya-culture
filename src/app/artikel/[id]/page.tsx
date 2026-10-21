import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Foto } from "@/components/foto";
import { Tombol } from "@/components/ui";
import { ARTIKEL, artikelTerkait, cariArtikel, cariDestinasi } from "@/lib/arsip";
import { tanggalPanjang } from "@/lib/format";

export function generateStaticParams() {
  return ARTIKEL.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = cariArtikel(id);
  if (!a) return { title: "Artikel tidak ditemukan" };
  return {
    title: a.judul,
    description: a.ringkas,
    openGraph: { title: a.judul, description: a.ringkas, images: [{ url: a.gambar }] },
  };
}

/**
 * Artikel panjang.
 *
 * Foto pembuka penuh dengan judul menimpa. Isi memakai latar kertas dan
 * lebar baca 66 karakter. Daftar isi menempel di kiri pada layar lebar,
 * dibuat dari data bagian sehingga tidak mungkin basi.
 */
export default async function DetailArtikel({ params }: { params: Promise<{ id: string }> }) {
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
    <article>
      <header className="relative">
        <div className="relative max-h-[72svh] overflow-hidden">
          <Foto
            src={a.gambar}
            alt={a.gambarCaption}
            prioritas
            sizes="100vw"
            className="max-h-[72svh] w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-malam via-malam/30 to-malam/50" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1100px] px-5 pb-8 sm:px-8">
            <nav
              aria-label="Remah roti"
              className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-terang-2"
            >
              <Link href="/artikel" className="hover:text-terang">
                Sejarah
              </Link>
              <span aria-hidden="true">/</span>
              <span className="line-clamp-1 text-terang">{a.kategori}</span>
            </nav>
            <p className="meta-emas mt-3">
              {a.kategori} · {tanggalPanjang(a.tanggal)} · {menit} menit baca · {a.sumber.length} sumber
            </p>
            <h1 className="display mt-2 max-w-[24ch] text-[clamp(2rem,6vw,4.5rem)] text-terang">{a.judul}</h1>
          </div>
        </div>
      </header>

      <div className="kertas">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">
          <p className="baca max-w-[58ch] text-[1.125rem] leading-relaxed text-gelap">{a.ringkas}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-garis-kertas py-3">
            <p className="meta">{a.penulis}</p>
            <span className="h-3 w-px bg-garis-kertas" aria-hidden="true" />
            <p className="meta">
              {a.status === "terverifikasi-sebagian" ? "Terverifikasi sebagian" : a.status}
            </p>
            <p className="meta ml-auto">{a.gambarCaption}</p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
              <p className="meta-emas">Daftar isi</p>
              <ol className="mt-3">
                {a.bagian.map((b, i) => (
                  <li key={i}>
                    <a
                      href={`#bagian-${i + 1}`}
                      className="flex gap-2 border-b border-garis-kertas py-2 text-[0.75rem] leading-snug text-gelap-2 hover:text-gelap"
                    >
                      <span className="tabular shrink-0 font-mono text-[0.5625rem] text-emas-tinta">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {b.subjudul}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="min-w-0">
              <p className="baca text-[1.0625rem] leading-[1.75] text-gelap">{a.pendahuluan}</p>

              {a.bagian.map((b, i) => (
                <section key={i} id={`bagian-${i + 1}`} className="mt-10 scroll-mt-24">
                  <h2 className="flex items-baseline gap-3 border-t border-garis-kertas pt-5 font-display text-xl leading-tight text-gelap sm:text-2xl">
                    <span className="tabular shrink-0 font-mono text-[0.6875rem] text-emas-tinta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {b.subjudul}
                  </h2>
                  <div className="baca mt-3">
                    {b.paragraf.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="mt-10 border-l-2 border-emas pl-5">
                <p className="meta-emas">Kesimpulan</p>
                <p className="baca mt-2 text-gelap">{a.kesimpulan}</p>
              </section>

              <section id="sumber" className="mt-10 scroll-mt-24">
                <p className="meta-emas">Sumber</p>
                <ol className="mt-3 border-t border-garis-kertas">
                  {a.sumber.map((s, i) => (
                    <li key={i} className="border-b border-garis-kertas py-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tautan text-[0.875rem] font-medium text-gelap"
                      >
                        {s.judul}
                      </a>
                      <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-gelap-3">
                        {s.penulis}
                        {s.tahun ? ` · ${s.tahun}` : ""}
                      </p>
                      {s.catatan && (
                        <p className="mt-1 text-[0.75rem] leading-snug text-gelap-3">{s.catatan}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-10 flex flex-wrap gap-2 border-t border-garis-kertas pt-6">
                <Tombol href="/destinasi" varian="gelap" panah>
                  Jelajahi destinasi
                </Tombol>
                <Tombol href={`/artikel/${berikut.id}`} varian="garis-gelap">
                  Artikel berikutnya
                </Tombol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {destinasi.length > 0 && (
        <section className="border-t border-garis-malam py-14">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
            <p className="meta-emas">Destinasi yang disebut</p>
            <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {destinasi.map((d) => (
                <li key={d.id}>
                  <Link href={`/destinasi/${d.id}`} className="group block">
                    <div className="overflow-hidden">
                      <Foto
                        src={d.gambar[0].src}
                        alt={d.gambar[0].caption}
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="w-full transition-[filter] duration-700 group-hover:brightness-110"
                      />
                    </div>
                    <p className="meta mt-2">{d.kategori[0]}</p>
                    <p className="mt-0.5 font-display text-base leading-tight text-terang group-hover:text-emas">
                      {d.nama}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {terkait.length > 0 && (
        <section className="border-t border-garis-malam py-14">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
            <p className="meta-emas">Bacaan lain</p>
            <ul className="mt-5 grid gap-6 md:grid-cols-3">
              {terkait.map((t) => (
                <li key={t.id}>
                  <Link href={`/artikel/${t.id}`} className="group block">
                    <div className="overflow-hidden">
                      <Foto
                        src={t.gambar}
                        alt={t.gambarCaption}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="w-full transition-[filter] duration-700 group-hover:brightness-110"
                      />
                    </div>
                    <p className="meta mt-2">{t.kategori}</p>
                    <p className="mt-1 font-display text-lg leading-snug text-terang group-hover:text-emas">
                      {t.judul}
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
