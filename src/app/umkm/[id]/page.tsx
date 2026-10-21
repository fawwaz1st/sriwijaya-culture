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
import { DAFTAR_UMKM, cariUMKM, umkmTerkaitDari } from "@/lib/arsip";
import { koordinatTeks } from "@/lib/format";
import { warnaKategori } from "@/lib/warna";

export function generateStaticParams() {
  return DAFTAR_UMKM.map((u) => ({ id: u.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const u = cariUMKM(id);
  if (!u) return { title: "Usaha tidak ditemukan" };
  return { title: u.nama, description: u.ringkas };
}

export default async function DetailUMKM({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = cariUMKM(id);
  if (!u) notFound();

  const terkait = umkmTerkaitDari(u.id);
  const idx = DAFTAR_UMKM.findIndex((x) => x.id === u.id);
  const kontakAda = Object.values(u.kontak).some(Boolean);
  const sosialAda = u.sosial.length > 0;

  return (
    <article className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
      <nav
        aria-label="Remah roti"
        className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-wider text-tinta-3"
      >
        <Link href="/umkm" className="hover:text-tinta">
          Usaha lokal
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-tinta">{u.nama}</span>
      </nav>

      <header className="mt-4 grid gap-4 border-t border-tinta pt-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="label-arsip">
            <span className="mr-2 text-kunyit-ink">No. {String(idx + 1).padStart(3, "0")}</span>
            {u.kategori}
          </p>
          <h1 className="judul-arsip mt-2 text-[clamp(2.25rem,5vw,3.75rem)]">{u.nama}</h1>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-tinta-2">{u.ringkas}</p>
        </div>
        <dl className="self-start border border-garis bg-kertas-2 px-3 py-2">
          <BarisMeta k="Wilayah" v={u.wilayah} />
          <BarisMeta k="Kategori" v={u.kategori} />
          <BarisMeta k="Produk" v={`${u.produk.length} varian`} mono />
          <BarisMeta k="Sumber" v={`${u.sumber.length} rujukan`} mono />
          <BarisMeta
            k="Koordinat"
            v={u.koordinat ? koordinatTeks(u.koordinat.lat, u.koordinat.lng) : "Belum diverifikasi"}
            mono={Boolean(u.koordinat)}
          />
        </dl>
      </header>

      <div className="mt-4 grid gap-6 border-t border-garis-2 pt-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <figure className="min-w-0">
          <div className="grup-foto relative aspect-[16/10] overflow-hidden border border-garis bg-kertas-3">
            <Image
              src={u.gambar[0].src}
              alt={u.gambar[0].caption}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="foto-arsip object-cover"
            />
            <span
              className="absolute left-0 top-0 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-wider text-kertas"
              style={{ background: warnaKategori(u.kategori) }}
            >
              {u.kategori}
            </span>
          </div>
          <figcaption className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
            <span>{u.gambar[0].caption}</span>
            <span>{u.gambar[0].kredit}</span>
          </figcaption>
        </figure>

        <div className="min-w-0">
          <div className="border border-garis p-3">
            <p className="label-arsip">Status data</p>
            <p className="mt-1.5">
              <span className={u.statusData === "rujukan-umum" ? "status text-ok" : "status text-warn"}>
                {u.statusData === "rujukan-umum" ? "Rujukan umum" : "Data demonstrasi"}
              </span>
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-tinta-2">
              {u.statusData === "rujukan-umum"
                ? "Nama dan jenis produk terdokumentasi di sumber publik. Alamat dan kontak belum dikonfirmasi pengelola."
                : "Entri ini adalah contoh untuk menunjukkan cara kerja direktori, bukan usaha yang bisa dikunjungi."}
            </p>
          </div>

          {/* Kontak: kalau tidak ada, katakan tidak ada. */}
          <div className="mt-4 border border-garis p-3">
            <p className="label-arsip">Kontak dan lokasi</p>
            {kontakAda || sosialAda ? (
              <dl className="mt-2">
                {u.kontak.telepon && <BarisMeta k="Telepon" v={u.kontak.telepon} mono />}
                {u.kontak.whatsapp && <BarisMeta k="WhatsApp" v={u.kontak.whatsapp} mono />}
                {u.kontak.email && <BarisMeta k="Email" v={u.kontak.email} mono />}
                {u.kontak.website && <BarisMeta k="Situs" v={u.kontak.website} />}
                {u.sosial.map((s) => (
                  <BarisMeta key={s.url} k={s.platform} v={s.url} />
                ))}
              </dl>
            ) : (
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta-2">
                Nomor telepon, akun sosial, dan alamat belum diverifikasi, jadi
                tidak ditampilkan. Website ini tidak mengisi kontak dengan
                perkiraan.
              </p>
            )}
            {u.alamat && (
              <p className="mt-2 border-t border-garis-2 pt-2 text-[0.8125rem] leading-relaxed text-tinta">
                {u.alamat}
              </p>
            )}
            {u.mapsQuery && (
              <div className="mt-3">
                <Tombol
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.mapsQuery)}`}
                  varian="garis"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cari di peta
                </Tombol>
              </div>
            )}
          </div>

          {u.jam && (
            <div className="mt-4 border-l-2 border-garis-3 pl-3">
              <p className="label-arsip">Jam operasional</p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-tinta">{u.jam.teks}</p>
              <div className="mt-2">
                <BadgeVerifikasi tingkat={u.jam.verifikasi} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <PenandaBagian nomor="01" teks="Profil usaha" />
          <p className="prosa mt-3">{u.profil}</p>

          {u.sejarah && (
            <>
              <PenandaBagian nomor="02" teks="Sejarah" />
              <p className="prosa mt-3">{u.sejarah}</p>
            </>
          )}

          <PenandaBagian nomor={u.sejarah ? "03" : "02"} teks="Produk unggulan" />
          <ul className="mt-3 grid gap-0 border-t border-garis-2 sm:grid-cols-2">
            {u.produk.map((p, i) => (
              <li
                key={p.nama}
                className="border-b border-garis-2 py-3 sm:odd:pr-4 sm:even:border-l sm:even:pl-4"
              >
                <p className="flex items-baseline gap-2">
                  <span className="tabular font-mono text-[0.5625rem] text-kunyit-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-base leading-tight text-tinta">{p.nama}</span>
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-tinta-2">{p.deskripsi}</p>
              </li>
            ))}
          </ul>

          {u.catatanVerifikasi && (
            <div className="mt-8">
              <CatatanBelumPasti>{u.catatanVerifikasi}</CatatanBelumPasti>
            </div>
          )}

          <PenandaBagian nomor={u.sejarah ? "04" : "03"} teks="Sumber" />
          <ol className="mt-3 border-t border-garis-2">
            {u.sumber.map((s, i) => (
              <li key={i} className="border-b border-garis-2 py-3">
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
              </li>
            ))}
          </ol>

          <div className="mt-6 border border-garis bg-kertas-3/40 p-4">
            <p className="label-arsip">Ulasan</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-tinta-2">{u.ulasan.pesan}</p>
          </div>
        </div>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-[4.5rem] lg:self-start">
          {u.gambar.length > 1 && (
            <div>
              <p className="label-arsip mb-2">Galeri</p>
              <div className="grid grid-cols-2 gap-1.5">
                {u.gambar.slice(1).map((g, i) => (
                  <figure key={i}>
                    <div className="relative aspect-square overflow-hidden border border-garis">
                      <Image src={g.src} alt={g.caption} fill sizes="240px" className="object-cover" />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {terkait.length > 0 && (
            <div className="border-t border-garis pt-3">
              <p className="label-arsip">Usaha terkait</p>
              <ul className="mt-2">
                {terkait.map((t) => (
                  <li key={t.id} className="border-b border-garis-2">
                    <Link
                      href={`/umkm/${t.id}`}
                      className="group flex items-center justify-between gap-3 py-2 text-[0.8125rem] text-tinta-2 hover:text-tinta"
                    >
                      <span className="min-w-0 truncate">{t.nama}</span>
                      <span aria-hidden="true" className="text-tinta-4 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
