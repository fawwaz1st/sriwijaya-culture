"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Foto } from "@/components/foto";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { tanggalPendek } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Artikel, KategoriArtikel } from "@/lib/types";

/**
 * Katalog artikel.
 *
 * Artikel utama memakai foto besar dengan judul menimpa di ruang gelap
 * foto itu. Sisanya jadi daftar bertingkat: dua artikel dengan gambar,
 * lalu sisanya sebagai baris teks. Tiga bentuk, bukan tiga kartu sama.
 */
export function KatalogArtikel({
  daftar,
  kategori,
}: {
  daftar: readonly Artikel[];
  kategori: readonly KategoriArtikel[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const aktif = params.get("kategori") ?? "";
  const [kueri, setKueri] = useState("");

  const hasil = useMemo(() => {
    let h = [...daftar];
    if (aktif) h = h.filter((a) => a.kategori === aktif);
    const q = kueri.trim().toLowerCase();
    if (q) {
      const kata = q.split(/\s+/);
      h = h.filter((a) => {
        const t = [a.judul, a.ringkas, a.kategori].join(" ").toLowerCase();
        return kata.every((k) => t.includes(k));
      });
    }
    return h;
  }, [daftar, aktif, kueri]);

  function pilih(k: string) {
    const next = new URLSearchParams(params.toString());
    if (!k || k === aktif) next.delete("kategori");
    else next.set("kategori", k);
    router.replace(next.toString() ? `/artikel?${next}` : "/artikel", { scroll: false });
  }

  const [utama, kedua, ketiga, ...sisa] = hasil;

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-2 border-y border-garis-malam py-2.5">
        <button
          type="button"
          onClick={() => pilih("")}
          aria-pressed={!aktif}
          className={cn(
            "px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
            !aktif ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
          )}
        >
          Semua <span className="tabular opacity-60">{daftar.length}</span>
        </button>
        {kategori.map((k) => {
          const n = daftar.filter((a) => a.kategori === k).length;
          if (!n) return null;
          const on = aktif === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => pilih(k)}
              aria-pressed={on}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                on ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
              )}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: warnaKategori(k) }} />
              {k} <span className="tabular opacity-60">{n}</span>
            </button>
          );
        })}

        <label className="ml-auto flex items-center gap-2">
          <span className="sr-only">Cari artikel</span>
          <input
            type="search"
            value={kueri}
            onChange={(e) => setKueri(e.target.value.slice(0, 80))}
            placeholder="Cari judul"
            className="w-40 border border-malam-5 bg-transparent px-2.5 py-1.5 text-[0.8125rem] text-terang placeholder:text-terang-3 focus:border-emas focus:outline-none sm:w-52"
          />
        </label>
      </div>

      {hasil.length === 0 ? (
        <div className="mt-8">
          <KeadaanKosong
            judul="Belum ada catatan yang cocok"
            pesan="Kategori kosong berarti kami belum menulis artikel yang bisa dipertanggungjawabkan untuk topik tersebut."
            aksi={
              <Tombol
                href="/artikel"
                varian="garis"
                panah
                onClick={(e) => {
                  e.preventDefault();
                  setKueri("");
                  pilih("");
                }}
              >
                Tampilkan semua
              </Tombol>
            }
          />
        </div>
      ) : (
        <>
          {/* Utama: dua kolom, foto dan teks berdampingan.

              Sebelumnya ini pita sinematik 1344x480 dengan foto
              object-cover. Foto utamanya potret (1119x1991), jadi rasio
              4:1 memotong 80% gambar dan subjeknya hilang. Sekarang foto
              memakai rasio 4:5 di kolom kiri dan teks berdiri sendiri di
              kolom kanan: tidak ada subjek yang dikorbankan, dan judul
              tidak perlu duduk di atas gambar yang gelap. */}
          {utama && (
            <Link
              href={`/artikel/${utama.id}`}
              className="group mt-6 grid gap-6 border-y border-garis-malam py-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10"
            >
              <div className="overflow-hidden">
                <Foto
                  src={utama.gambar}
                  alt={utama.gambarCaption}
                  prioritas
                  rasioPaksa="4 / 5"
                  posisi="top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full object-cover transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:brightness-110"
                />
              </div>
              {/* Teks disebar setinggi foto: meta di atas, tautan baca di
                  dasar. Sebelumnya seluruh teks mengumpul di tengah dan
                  menyisakan ~150px kosong di bawah kolom kanan. */}
              <div className="flex flex-col lg:py-1">
                <p className="meta-emas">
                  Utama · {utama.kategori} · {tanggalPendek(utama.tanggal)} · {utama.sumber.length} sumber
                </p>
                <h2 className="display mt-3 max-w-[24ch] text-[clamp(1.75rem,4.2vw,3.25rem)] text-terang group-hover:text-emas">
                  {utama.judul}
                </h2>
                <p className="mt-4 max-w-[52ch] text-[0.875rem] leading-relaxed text-terang-2">
                  {utama.ringkas}
                </p>

                {/*
                  Daftar isi artikel unggulan.

                  Kolom kanan setinggi foto 4:5 (679 px), sedangkan tiga
                  blok teks di atasnya hanya memakai sekitar separuhnya.
                  Sebelumnya sisa ruang itu kosong dan "Baca catatan"
                  didorong `mt-auto` ke dasar, sehingga terbaca sebagai
                  halaman yang gagal memuat. Sekarang sisa ruang diisi
                  daftar subjudul: informasi nyata dari artikel, sekaligus
                  memberi alasan untuk membuka halaman detail.
                */}
                {utama.bagian.length > 0 && (
                  <ol className="mt-6 max-w-[52ch] border-t border-garis-malam pt-4">
                    {utama.bagian.slice(0, 4).map((b, i) => (
                      <li
                        key={b.subjudul}
                        className="flex items-baseline gap-3 border-b border-garis-malam/60 py-2 last:border-b-0"
                      >
                        <span className="tabular shrink-0 font-mono text-[0.75rem] text-emas">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 text-[0.8125rem] leading-snug text-terang-2">
                          {b.subjudul}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}

                <span className="meta mt-6 inline-flex w-fit items-center gap-2 border-b border-terang-3 pb-1 text-terang-2 transition-colors group-hover:border-emas group-hover:text-emas lg:mt-auto">
                  Baca catatan
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          )}

          {/* Dua berikutnya: bingkai 3:2 seragam supaya sepasang. */}
          <div className="mt-8 grid items-start gap-6 sm:grid-cols-2">
            {[kedua, ketiga].filter(Boolean).map((a) => (
              <Link
                key={a.id}
                href={`/artikel/${a.id}`}
                className="kartu-masuk group block"
              >
                <div className="overflow-hidden">
                  <Foto
                    src={a.gambar}
                    alt={a.gambarCaption}
                    rasioPaksa="3 / 2"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full object-cover transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:brightness-110"
                  />
                </div>
                <p className="meta mt-3">
                  {a.kategori} · {tanggalPendek(a.tanggal)}
                </p>
                <h3 className="mt-1 font-display text-xl leading-snug text-terang group-hover:text-emas">
                  {a.judul}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-terang-2">
                  {a.ringkas}
                </p>
              </Link>
            ))}
          </div>

          {/* Sisanya: baris teks. Tidak perlu gambar untuk semua. */}
          {sisa.length > 0 && (
            <ul className="mt-10 border-t border-garis-malam">
              {sisa.map((a) => (
                <li key={a.id} className="border-b border-garis-malam">
                  <Link
                    href={`/artikel/${a.id}`}
                    className="group grid items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[8rem_1fr_auto]"
                  >
                    <span className="meta">{a.kategori}</span>
                    <span className="font-display text-lg leading-snug text-terang group-hover:text-emas">
                      {a.judul}
                    </span>
                    <span className="meta tabular text-terang-3">{a.sumber.length} sumber</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
