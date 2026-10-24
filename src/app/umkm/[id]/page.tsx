import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Foto } from "@/components/foto";
import { BadgeVerifikasi, BarisMeta, Tombol } from "@/components/ui";
import { DAFTAR_UMKM, cariUMKM, umkmTerkaitDari } from "@/lib/arsip";
import { koordinatTeks } from "@/lib/format";

export function generateStaticParams() {
  return DAFTAR_UMKM.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const u = cariUMKM(id);
  if (!u) return { title: "Usaha tidak ditemukan" };
  return { title: u.nama, description: u.ringkas };
}

export default async function DetailUMKM({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = cariUMKM(id);
  if (!u) notFound();

  const terkait = umkmTerkaitDari(u.id);
  const kontakAda = Object.values(u.kontak).some(Boolean);
  const sosialAda = u.sosial.length > 0;

  return (
    <article>
      <header className="relative">
        {/*
          Hero UMKM.

          Sama seperti hero artikel: `object-cover` di wadah
          `max-h-[62svh]` memotong foto lanskap 1152x864 menjadi pita
          1440x620, dan sekitar 74% isinya hilang. Foto produk dan
          tempat usaha adalah bukti utama di halaman ini, jadi sekarang
          ditampilkan utuh dengan latar blur sebagai pengisi.
        */}
        <div className="relative isolate max-h-[62svh] overflow-hidden bg-malam">
          <Foto
            src={u.gambar[0].src}
            alt=""
            aria-hidden
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
          />
          <Foto
            src={u.gambar[0].src}
            alt={u.gambar[0].caption}
            prioritas
            utuh
            sizes="100vw"
            className="mx-auto max-h-[62svh] w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-malam via-malam/20 to-malam/35" />
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1760px] px-5 pb-8 sm:px-8 lg:px-12">
            <nav
              aria-label="Remah roti"
              className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2"
            >
              <Link href="/umkm" className="inline-flex min-h-8 items-center hover:text-terang">
                Usaha
              </Link>
              <span aria-hidden="true">/</span>
              <span className="inline-flex min-h-8 items-center text-terang">{u.nama}</span>
            </nav>
            <p className="meta-emas mt-3">
              {u.kategori} · {u.wilayah}
            </p>
            <h1 className="display mt-2 max-w-[18ch] text-[clamp(2.25rem,7vw,5rem)] text-terang">{u.nama}</h1>
            <p className="mt-2 max-w-[52ch] text-[0.875rem] leading-relaxed text-terang-2">{u.ringkas}</p>
          </div>
        </div>
      </header>

      <div className="kertas">
        <div className="mx-auto max-w-[1760px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
            <div className="min-w-0">
              <div
                className={
                  u.statusData === "rujukan-umum"
                    ? "border border-ok/40 bg-ok/8 p-4"
                    : "border border-warn/40 bg-warn/8 p-4"
                }
              >
                <p className={`status ${u.statusData === "rujukan-umum" ? "text-ok status-ok" : "text-warn status-warn"}`}>
                  {u.statusData === "rujukan-umum" ? "Asli, sudah dicek" : "Contoh"}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-gelap-2">
                  {u.statusData === "rujukan-umum"
                    ? "Usaha nyata, tercatat di sumber publik. Kontak belum dikonfirmasi pengelola."
                    : "Ini contoh, bukan toko sungguhan. Tidak bisa dikunjungi."}
                </p>
              </div>

              <div className="mt-8 border-t border-garis-kertas pt-6">
                <p className="meta-emas">Profil usaha</p>
                <p className="baca mt-3">{u.profil}</p>
              </div>

              {u.sejarah && (
                <div className="mt-8 border-t border-garis-kertas pt-6">
                  <p className="meta-emas">Sejarah</p>
                  <p className="baca mt-3">{u.sejarah}</p>
                </div>
              )}

              <div className="mt-8 border-t border-garis-kertas pt-6">
                <p className="meta-emas">Produk unggulan</p>
                <ul className="mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {u.produk.map((p, i) => (
                    <li key={p.nama}>
                      <p className="flex items-baseline gap-2">
                        <span className="tabular font-mono text-[0.75rem] text-emas-tinta">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-base leading-tight text-gelap">{p.nama}</span>
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-gelap-2">{p.deskripsi}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {u.catatanVerifikasi && (
                <div className="mt-8 border border-warn/40 bg-warn/8 p-4">
                  <p className="status text-warn status-warn">Catatan verifikasi</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-gelap-2">{u.catatanVerifikasi}</p>
                </div>
              )}

              <div className="mt-10 border-t border-garis-kertas pt-6">
                <p className="meta-emas">Sumber</p>
                <ol className="mt-3">
                  {u.sumber.map((s, i) => (
                    <li key={i} className="border-b border-garis-kertas py-3 last:border-b-0">
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
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-6 border-t border-garis-kertas pt-4 text-[0.75rem] leading-relaxed text-gelap-3">
                {u.ulasan.pesan}
              </p>
            </div>

            <aside className="min-w-0 space-y-8 lg:sticky lg:top-20 lg:self-start">
              <div>
                <p className="meta-emas">Kontak dan lokasi</p>
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
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gelap-2">
                    Nomor telepon, akun sosial, dan alamat belum diverifikasi, jadi
                    tidak ditampilkan. Website ini tidak mengisi kontak dengan
                    perkiraan.
                  </p>
                )}
                {u.alamat && (
                  <p className="mt-2 border-t border-garis-kertas pt-2 text-[0.8125rem] leading-relaxed text-gelap">
                    {u.alamat}
                  </p>
                )}
                {u.mapsQuery && (
                  <div className="mt-3">
                    <Tombol
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.mapsQuery)}`}
                      varian="garis-gelap"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cari di peta
                    </Tombol>
                  </div>
                )}
              </div>

              <div>
                <p className="meta-emas">Ringkasan</p>
                <dl className="mt-2">
                  <BarisMeta k="Kategori" v={u.kategori} />
                  <BarisMeta k="Produk" v={`${u.produk.length} varian`} mono />
                  <BarisMeta k="Sumber" v={`${u.sumber.length} rujukan`} mono />
                  <BarisMeta
                    k="Koordinat"
                    v={u.koordinat ? koordinatTeks(u.koordinat.lat, u.koordinat.lng) : "Belum diverifikasi"}
                    mono={Boolean(u.koordinat)}
                  />
                </dl>
              </div>

              {u.jam && (
                <div>
                  <p className="meta-emas">Jam operasional</p>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gelap">{u.jam.teks}</p>
                  <div className="mt-2">
                    <BadgeVerifikasi tingkat={u.jam.verifikasi} />
                  </div>
                </div>
              )}

              {u.gambar.length > 1 && (
                <div>
                  <p className="meta-emas">Galeri</p>
                  <div className="mt-2 space-y-2">
                    {u.gambar.slice(1).map((g, i) => (
                      <figure key={i}>
                        <div className="overflow-hidden">
                          <Foto src={g.src} alt={g.caption} sizes="380px" className="w-full" />
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {terkait.length > 0 && (
        <section className="border-t border-garis-malam py-14">
          <div className="mx-auto max-w-[1760px] px-5 sm:px-8 lg:px-12">
            <p className="meta-emas">Usaha terkait</p>
            {/* Jumlah usaha terkait bervariasi (1 sampai 4). Grid empat
                kolom menyisakan satu sel kosong setiap kali jumlahnya
                bukan kelipatan empat. Daftar satu kolom dengan pemisah
                baris mengisi lebar penuh berapa pun jumlahnya. */}
            <ul className="mt-5 border-t border-garis-malam">
              {terkait.map((t) => (
                <li key={t.id} className="border-b border-garis-malam">
                  <Link href={`/umkm/${t.id}`} className="group flex items-center gap-5 py-4">
                    <div className="w-20 shrink-0 overflow-hidden sm:w-28">
                      <Foto
                        src={t.gambar[0].src}
                        alt={t.gambar[0].caption}
                        sizes="112px"
                        rasioPaksa="1 / 1"
                        className="w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="meta">{t.kategori}</p>
                      <p className="mt-1 max-w-[40rem] font-display text-lg leading-snug text-terang group-hover:text-emas sm:text-xl">
                        {t.nama}
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
