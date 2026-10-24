import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdDestinasi } from "@/components/json-ld";
import { Foto } from "@/components/foto";
import { BadgeVerifikasi, BarisMeta } from "@/components/ui";
import { DESTINASI, artikelUntukDestinasi, cariDestinasi, destinasiTerkait } from "@/lib/arsip";
import { koordinatTeks, tanggalPanjang } from "@/lib/format";
import { potret } from "@/lib/foto";
import { PetaDestinasi } from "@/components/peta";

export function generateStaticParams() {
  return DESTINASI.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = cariDestinasi(id);
  if (!d) return { title: "Destinasi tidak ditemukan" };
  return {
    title: d.nama,
    description: d.ringkas,
    openGraph: { title: d.nama, description: d.ringkas, images: [{ url: d.gambar[0].src }] },
  };
}

/**
 * Detail destinasi.
 *
 * Foto utama memenuhi lebar layar dengan rasio aslinya, judul menimpa di
 * bagian bawah foto. Setelah itu dua kolom: isi di kiri dengan latar
 * kertas supaya teks panjang enak dibaca, data di kanan yang menempel.
 */
export default async function DetailDestinasi({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = cariDestinasi(id);
  if (!d) notFound();

  const terkait = destinasiTerkait(d);
  const artikel = artikelUntukDestinasi(d.id);
  const idx = DESTINASI.findIndex((x) => x.id === d.id);
  const berikut = DESTINASI[(idx + 1) % DESTINASI.length];
  const sebelum = DESTINASI[(idx - 1 + DESTINASI.length) % DESTINASI.length];
  const [utama] = d.gambar;
  // Foto hero: pakai foto lanskap pertama kalau ada. Foto potret ekstrem
  // (0.56) tidak punya subjek yang terbaca saat dipotong selebar layar.
  const hero = d.gambar.find((g) => !potret(g.src)) ?? utama;
  const galeri = d.gambar.filter((g) => g.src !== hero.src);
  /**
   * Kalau semua foto entri ini potret (Jembatan Ampera, misalnya),
   * memaksa hero selebar layar berarti memotong ~70% tinggi foto dan
   * menyisakan sebagian menara saja. Untuk kasus itu hero dibatasi
   * tingginya dan fotonya diposisikan di tengah, bukan dilebarkan
   * penuh. Hasilnya foto potret tetap terbaca sebagai potret.
   */
  const heroPotret = potret(hero.src);

  return (
    <article>
      <JsonLdDestinasi
        nama={d.nama}
        deskripsi={d.ringkas}
        gambar={utama.src}
        koordinat={d.koordinat ?? undefined}
        href={`/destinasi/${d.id}`}
      />
      <header className="relative">
        {/*
          Hero destinasi.

          Foto potret sudah dibatasi lebarnya (max-w-46rem) supaya tidak
          melebar, tetapi `object-cover` di dalam wadah `max-h-[78svh]`
          masih memotong bagian atas atau bawah foto ketika tingginya
          melebihi 78svh. Untuk foto arsip, bagian yang terpotong itu
          bisa saja bagian yang paling penting.

          Sekarang foto ditampilkan utuh dengan `utuh`, dan latar gelap
          di belakangnya mengisi ruang sisa supaya tepi foto tidak
          terlihat seperti kotak yang salah ukuran.
        */}
        <div
          className={
            heroPotret
              ? "relative mx-auto flex max-h-[78svh] max-w-[46rem] justify-center overflow-hidden bg-malam"
              : "relative flex max-h-[78svh] justify-center overflow-hidden bg-malam"
          }
        >
          {/*
            `h-auto` penting di sini. Sebelumnya kelas `max-h-[78svh]`
            dipasang langsung pada <img>; itu membuat tinggi gambar
            dibatasi, lalu `object-contain` mengecilkan gambar untuk
            masuk ke kotak itu dan menyisakan pita kosong di kiri-kanan.
            Dengan `h-auto`, gambar memakai tinggi alaminya dan wadah
            yang memotong lewat `overflow-hidden` bila terlalu tinggi.
          */}
          <Foto
            src={hero.src}
            alt={hero.caption}
            prioritas
            utuh
            sizes={heroPotret ? "(max-width: 768px) 100vw, 46rem" : "100vw"}
            className="h-auto max-h-[78svh] w-full"
          />
          {/* Untuk hero potret, latar di kiri-kanan diisi warna malam
              supaya tepi foto tidak terlihat seperti kotak yang salah
              ukuran. */}
          {heroPotret && (
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-terang/8" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-malam via-malam/55 to-malam/70" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1760px] px-5 pb-8 sm:px-8 lg:px-12">
            <nav
              aria-label="Remah roti"
              className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2"
            >
              <Link href="/destinasi" className="inline-flex min-h-8 items-center hover:text-terang">
                Destinasi
              </Link>
              <span aria-hidden="true">/</span>
              <span className="inline-flex min-h-8 items-center text-terang">{d.nama}</span>
            </nav>

            <p className="meta-emas mt-3">
              {d.kategori.join(" · ")} · {d.wilayah}
            </p>
            <h1 className="display mt-2 max-w-[18ch] text-[clamp(2.5rem,8vw,6rem)] text-terang">{d.nama}</h1>
            <p className="mt-2 max-w-[54ch] text-[0.875rem] leading-relaxed text-terang-2">{d.namaLengkap}</p>
          </div>
        </div>
      </header>

      <div className="border-b border-garis-malam bg-malam-2">
        <div className="mx-auto grid max-w-[1760px] grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-4 sm:px-8 lg:px-12">
          {[
            {
              k: "Koordinat",
              v: d.koordinat ? koordinatTeks(d.koordinat.lat, d.koordinat.lng) : "Belum ada",
              mono: true,
            },
            { k: "Sumber", v: `${d.sumber.length} rujukan`, mono: true },
            {
              k: "Diperbarui",
              v: d.tanggalDiperbarui ? tanggalPanjang(d.tanggalDiperbarui) : "Tidak dicatat",
            },
            { k: "Tiket", v: d.tiket.verifikasi === "tinggi" ? "Terverifikasi" : "Perlu konfirmasi" },
          ].map((x) => (
            <div key={x.k}>
              <p className="meta">{x.k}</p>
              <p className={`mt-1 text-[0.8125rem] text-terang ${x.mono ? "tabular font-mono text-xs" : ""}`}>
                {x.v}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="kertas">
        <div className="mx-auto max-w-[1760px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          {/* Galeri dulu, teks kemudian. Pengunjung datang untuk melihat
              tempatnya, bukan membaca tentangnya. */}
          {galeri.length > 0 && (
            /*
              Galeri geser horizontal.

              Sebelumnya memakai `-mx-5 px-5` untuk membleeding sampai
              tepi layar. Di lebar 320px kombinasi itu membuat dokumen
              melebar 21px: margin negatif menarik wadah keluar, sementara
              padding dalam tidak menahan tinggi kartu `78vw` ditambah
              jarak. Sekarang memakai `w-full` + `min-w-0` pada induk dan
              margin negatif hanya di layar yang cukup lebar, sehingga
              gulirannya tetap di dalam dokumen di semua ukuran.
            */
            <div className="gulir-tipis -mx-5 mb-10 flex min-w-0 max-w-full gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:mb-12">
              {galeri.map((g, i) => (
                <figure key={i} className="w-[74vw] max-w-[560px] flex-none sm:w-[44vw] lg:w-[32vw]">
                  <div className="group h-[clamp(13rem,24vw,19rem)] overflow-hidden bg-kertas-2">
                    <Foto
                      src={g.src}
                      alt={g.caption}
                      rasioPaksa="bebas"
                      sizes="(max-width: 640px) 74vw, (max-width: 1024px) 44vw, 32vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-1.5 line-clamp-1 text-[0.75rem] leading-tight text-gelap-3">
                    {g.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
            <div className="min-w-0">
              <p className="baca text-[1.0625rem] leading-relaxed text-gelap">{d.ringkas}</p>

              <div className="mt-7 border-t border-garis-kertas pt-5">
                <p className="meta-emas">Tentang tempat ini</p>
                <p className="baca mt-3">{d.deskripsi}</p>
              </div>

              <div className="mt-7 border-t border-garis-kertas pt-5">
                <p className="meta-emas">Sejarah</p>
                <p className="baca mt-3">{d.sejarah}</p>
              </div>

              {d.legenda && (
                <div className="mt-8 border-t border-garis-kertas pt-6">
                  <p className="meta-emas">Legenda rakyat, bukan peristiwa sejarah</p>
                  <p className="mt-2 font-display text-xl text-gelap">{d.legenda.judul}</p>
                  <p className="baca mt-2 text-[0.875rem]">{d.legenda.isi}</p>
                </div>
              )}

              <div className="mt-8 border-t border-garis-kertas pt-6">
                <p className="meta-emas">Daya tarik</p>
                <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                  {d.dayaTarik.map((x, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-md px-2 py-1.5 text-[0.875rem] leading-relaxed text-gelap-2 transition-colors -mx-2 hover:bg-emas/8 hover:text-gelap"
                    >
                      <span className="tabular shrink-0 font-mono text-[0.625rem] text-emas-tinta">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-garis-kertas pt-6">
                <p className="meta-emas">Aktivitas</p>
                <ul className="mt-3 space-y-1.5">
                  {d.aktivitas.map((x, i) => (
                    <li key={i} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-gelap-2">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-emas-tinta" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              {d.catatanVerifikasi && (
                <div className="mt-8 border border-warn/40 bg-warn/8 p-4">
                  <p className="status text-warn status-warn">Catatan verifikasi</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-gelap-2">{d.catatanVerifikasi}</p>
                </div>
              )}

              <div className="mt-10 border-t border-garis-kertas pt-6">
                <p className="meta-emas">Sumber</p>
                <ol className="mt-3">
                  {d.sumber.map((s, i) => (
                    <li key={i} className="border-b border-garis-kertas py-3 last:border-b-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
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
                          </p>
                        </div>
                        {s.verifikasi && <BadgeVerifikasi tingkat={s.verifikasi} />}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-6 border-t border-garis-kertas pt-4 text-[0.75rem] leading-relaxed text-gelap-3">
                {d.ulasan.pesan}
              </p>
            </div>

            <aside className="min-w-0 space-y-8 lg:sticky lg:top-20 lg:self-start">
              <div>
                <p className="meta-emas">Data tercatat</p>
                <dl className="mt-2">
                  {d.fakta.map((f, i) => (
                    <BarisMeta key={i} k={f.k} v={f.v} />
                  ))}
                </dl>
              </div>

              <div>
                <p className="meta-emas">Tiket</p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gelap">{d.tiket.teks}</p>
                <div className="mt-2">
                  <BadgeVerifikasi tingkat={d.tiket.verifikasi} />
                </div>
              </div>

              <div>
                <p className="meta-emas">Jam buka</p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gelap">{d.jam.teks}</p>
                <div className="mt-2">
                  <BadgeVerifikasi tingkat={d.jam.verifikasi} />
                </div>
              </div>

              <div>
                <p className="meta-emas">Alamat dan akses</p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gelap">{d.alamat}</p>
                <p className="mt-2 border-t border-garis-kertas pt-2 text-[0.8125rem] leading-relaxed text-gelap-2">
                  {d.akses}
                </p>
              </div>

              {d.koordinat && <PetaDestinasi destinasi={d} />}
            </aside>
          </div>
        </div>
      </div>

      {artikel.length > 0 && (
        <section className="border-t border-garis-malam bg-malam-2 py-14">
          <div className="mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
            <p className="meta-emas">Bacaan terkait</p>
            {/*
              Jumlah artikel per destinasi bervariasi: ada yang satu, dua,
              tiga. Grid dua kolom tetap menyisakan lubang besar di kanan
              bawah setiap kali jumlahnya ganjil. Daftar satu kolom dengan
              pemisah baris mengisi lebar penuh berapa pun jumlahnya, dan
              judul panjang tidak lagi terhimpit thumbnail 128px.
            */}
            <ul className="mt-5 border-t border-garis-malam">
              {artikel.map((a) => (
                <li key={a.id} className="border-b border-garis-malam">
                  <Link href={`/artikel/${a.id}`} className="group flex items-center gap-5 py-4">
                    <div className="w-20 shrink-0 overflow-hidden sm:w-28">
                      <Foto
                        src={a.gambar}
                        alt={a.gambarCaption}
                        sizes="112px"
                        rasioPaksa="1 / 1"
                        className="w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="meta">{a.kategori}</p>
                      <p className="mt-1 max-w-[40rem] font-display text-lg leading-snug text-terang group-hover:text-emas sm:text-xl">
                        {a.judul}
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

      {terkait.length > 0 && (
        <section className="border-t border-garis-malam py-14">
          <div className="mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
            <p className="meta-emas">Destinasi di sekitar</p>
            <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {terkait.map((t) => (
                <li key={t.id}>
                  <Link href={`/destinasi/${t.id}`} className="group block">
                    {/* Empat kartu dalam satu baris harus punya tinggi
                        gambar identik, kalau tidak label kategori dan nama
                        di bawahnya turun-naik. */}
                    <div className="overflow-hidden">
                      <Foto
                        src={t.gambar[0].src}
                        alt={t.gambar[0].caption}
                        sizes="(max-width: 640px) 50vw, 25vw"
                        rasioPaksa="3 / 2"
                        className="w-full transition-[filter] duration-700 group-hover:brightness-110"
                      />
                    </div>
                    <p className="meta mt-2">{t.kategori[0]}</p>
                    <p className="mt-0.5 font-display text-base leading-tight text-terang group-hover:text-emas">
                      {t.nama}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <nav aria-label="Destinasi lain" className="border-t border-garis-malam">
        <div className="mx-auto grid max-w-[1760px] gap-6 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:px-12">
          {/* `min-w-0` wajib di sini. Tanpa itu, tautan selebar induk
              (320px) ditambah gambar 80px tidak bisa menyusut, dan
              dokumen melebar 21px di layar terkecil. */}
          <Link href={`/destinasi/${sebelum.id}`} className="group flex min-w-0 items-center gap-4">
            <div className="w-16 shrink-0 overflow-hidden sm:w-20">
              <Foto src={sebelum.gambar[0].src} alt={sebelum.nama} sizes="80px" className="w-full" />
            </div>
            <div className="min-w-0">
              <p className="meta">← Sebelumnya</p>
              <p className="mt-1 truncate font-display text-lg text-terang group-hover:text-emas">{sebelum.nama}</p>
            </div>
          </Link>
          <Link href={`/destinasi/${berikut.id}`} className="group flex min-w-0 items-center justify-end gap-4 text-right">
            <div className="min-w-0">
              <p className="meta">Berikutnya →</p>
              <p className="mt-1 truncate font-display text-lg text-terang group-hover:text-emas">{berikut.nama}</p>
            </div>
            <div className="w-16 shrink-0 overflow-hidden sm:w-20">
              <Foto src={berikut.gambar[0].src} alt={berikut.nama} sizes="80px" className="w-full" />
            </div>
          </Link>
        </div>
      </nav>
    </article>
  );
}
