import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Foto } from "@/components/foto";
import { Tombol } from "@/components/ui";
import { TombolBagikan } from "@/components/tombol-bagikan";
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
      {/*
        Header artikel.

        Sebelumnya foto dipaksa `object-cover` di dalam wadah
        `max-h-[72svh]`. Untuk artikel yang fotonya potret (1152x2048),
        bingkai 1440x720 itu memotong sekitar 75% gambar: yang terlihat
        hanya bagian tengah, dan subjeknya hilang. Karena ini foto arsip
        yang justru jadi bukti, memotongnya bukan pilihan.

        Sekarang foto ditampilkan utuh (`utuh`), dan sisa ruang di kiri
        kanan diisi salinan foto yang sama dalam keadaan gelap dan blur
        sebagai latar. Efeknya seperti cetakan foto yang dipasang di
        atas meja gelap: seluruh gambar terlihat, dan bingkai tetap penuh.
      */}
      <header className="relative">
        <div className="relative isolate max-h-[72svh] overflow-hidden bg-malam">
          {/* Latar: foto yang sama, diperbesar dan digelapkan. */}
          <Foto
            src={a.gambar}
            alt=""
            aria-hidden
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 blur-2xl"
          />
          <Foto
            src={a.gambar}
            alt={a.gambarCaption}
            prioritas
            utuh
            sizes="100vw"
            className="mx-auto max-h-[72svh] w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-malam via-malam/25 to-malam/40" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1100px] px-5 pb-8 sm:px-8">
            <nav
              aria-label="Remah roti"
              className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2"
            >
              <Link href="/artikel" className="inline-flex min-h-8 items-center hover:text-terang">
                Sejarah
              </Link>
              <span aria-hidden="true">/</span>
              <span className="line-clamp-1 inline-flex min-h-8 items-center text-terang">{a.kategori}</span>
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
          <p className="baca text-[1.125rem] leading-relaxed text-gelap">{a.ringkas}</p>

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
                      <span className="tabular shrink-0 font-mono text-[0.75rem] text-emas-tinta">
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
                    <span className="tabular shrink-0 font-mono text-[0.75rem] text-emas-tinta">
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
                        className="tautan inline-flex min-h-6 items-center text-[0.875rem] font-medium text-gelap"
                      >
                        {s.judul}
                      </a>
                      <p className="mt-0.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-gelap-3">
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

              <div className="mt-6 flex flex-wrap gap-2">
                <TombolBagikan judul={a.judul} url={`/artikel/${a.id}`} />
              </div>

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
          <div className="mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
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
          <div className="mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
            <p className="meta-emas">Bacaan lain</p>
            {/* Jumlah artikel terkait bervariasi (2 atau 3). Grid tiga
                kolom menyisakan sel kosong saat jumlahnya dua, dan
                thumbnail lanskap membuat tinggi kartu tidak sama. Daftar
                satu kolom dengan pemisah baris mengisi lebar penuh
                berapa pun jumlahnya. */}
            <ul className="mt-5 border-t border-garis-malam">
              {terkait.map((t) => (
                <li key={t.id} className="border-b border-garis-malam">
                  <Link href={`/artikel/${t.id}`} className="group flex items-center gap-5 py-4">
                    <div className="w-20 shrink-0 overflow-hidden sm:w-28">
                      <Foto
                        src={t.gambar}
                        alt={t.gambarCaption}
                        sizes="112px"
                        rasioPaksa="1 / 1"
                        className="w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="meta">{t.kategori}</p>
                      <p className="mt-1 max-w-[40rem] font-display text-lg leading-snug text-terang group-hover:text-emas sm:text-xl">
                        {t.judul}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 text-terang-3 transition-transform group-hover:translate-x-1 group-hover:text-emas sm:block"
                    >
                      →
                    </span>
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