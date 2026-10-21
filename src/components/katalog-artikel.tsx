"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { tanggalPendek } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Artikel, KategoriArtikel } from "@/lib/types";

/**
 * Katalog artikel dengan penyaringan di klien.
 *
 * Artikel utama diberi satu perhatian penuh, sisanya dalam daftar.
 * Semua kartu memakai ukuran yang sama karena isinya memang setara;
 * membedakan ukuran tanpa alasan hanya menambah kebisingan.
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
        const teks = [a.judul, a.ringkas, a.kategori].join(" ").toLowerCase();
        return kata.every((k) => teks.includes(k));
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

  const [utama, ...sisa] = hasil;

  return (
    <>
      <div className="mt-8 border-y border-garis">
        <ul className="flex flex-wrap items-stretch">
          <li>
            <button
              type="button"
              onClick={() => pilih("")}
              aria-pressed={!aktif}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors",
                !aktif ? "bg-hijau-900 text-kertas" : "text-tinta-2 hover:bg-kertas-2",
              )}
            >
              Semua
              <span className={cn("tabular", !aktif ? "text-kunyit-muda" : "text-tinta-3")}>
                {daftar.length}
              </span>
            </button>
          </li>
          {kategori.map((k) => {
            const n = daftar.filter((a) => a.kategori === k).length;
            if (!n) return null;
            const on = aktif === k;
            return (
              <li key={k} className="border-l border-garis">
                <button
                  type="button"
                  onClick={() => pilih(k)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors",
                    on ? "bg-hijau-900 text-kertas" : "text-tinta-2 hover:bg-kertas-2",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 flex-none"
                    style={{ background: warnaKategori(k) }}
                  />
                  {k}
                  <span className={cn("tabular", on ? "text-kunyit-muda" : "text-tinta-3")}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="label-arsip">
          <span className="tabular text-tinta">{hasil.length}</span> catatan
          {aktif && ` · ${aktif}`}
        </p>
        <label className="flex items-center gap-2">
          <span className="sr-only">Cari artikel</span>
          <input
            type="search"
            value={kueri}
            onChange={(e) => setKueri(e.target.value.slice(0, 80))}
            placeholder="Cari judul"
            className="w-52 border border-garis-3 bg-kertas px-2 py-1 text-[0.8125rem] text-tinta placeholder:text-tinta-4 focus:border-hijau-700 focus:outline-none"
          />
        </label>
      </div>

      {hasil.length === 0 ? (
        <div className="mt-4">
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
          <article className="mt-4 border border-garis">
            <Link
              href={`/artikel/${utama.id}`}
              className="group grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
            >
              <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto lg:min-h-90">
                <Image
                  src={utama.gambar}
                  alt={utama.gambarCaption}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="foto-arsip object-cover"
                />
                <span
                  className="absolute left-0 top-0 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-wider text-kertas"
                  style={{ background: warnaKategori(utama.kategori) }}
                >
                  Utama
                </span>
              </div>
              <div className="flex flex-col justify-between gap-6 border-t border-garis p-5 sm:p-7 lg:border-l lg:border-t-0">
                <div>
                  <p className="label-arsip">
                    {utama.kategori} · {tanggalPendek(utama.tanggal)}
                  </p>
                  <h2 className="judul-arsip mt-2 text-[clamp(1.6rem,2.8vw,2.4rem)] group-hover:text-hijau-700">
                    {utama.judul}
                  </h2>
                  <p className="mt-3 max-w-[46ch] text-[0.875rem] leading-relaxed text-tinta-2">
                    {utama.ringkas}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-garis-2 pt-3">
                  <span className="tabular font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                    {utama.sumber.length} sumber · {utama.bagian.length} bagian
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-wider text-hijau-700">
                    Baca →
                  </span>
                </div>
              </div>
            </Link>
          </article>

          <ul className="grid gap-0 border border-t-0 border-garis md:grid-cols-2 lg:grid-cols-3">
            {sisa.map((a) => (
              <li
                key={a.id}
                className="border-b border-garis md:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <Link href={`/artikel/${a.id}`} className="group flex h-full flex-col">
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={a.gambar}
                      alt={a.gambarCaption}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="label-arsip text-[0.5625rem]">
                      {a.kategori} · {tanggalPendek(a.tanggal)}
                    </p>
                    <p className="mt-1 font-display text-lg leading-snug text-tinta group-hover:text-hijau-700">
                      {a.judul}
                    </p>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-tinta-2">
                      {a.ringkas}
                    </p>
                    <p className="mt-2 border-t border-garis-2 pt-2 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                      {a.sumber.length} sumber
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
