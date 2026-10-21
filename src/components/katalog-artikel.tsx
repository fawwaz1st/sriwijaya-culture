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
            "px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors",
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
                "flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors",
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
          {/* Utama: foto besar, judul menimpa di dasar foto. */}
          {utama && (
            <Link href={`/artikel/${utama.id}`} className="group relative mt-6 block overflow-hidden">
              <Foto
                src={utama.gambar}
                alt={utama.gambarCaption}
                prioritas
                sizes="100vw"
                className="w-full transition-[filter] duration-700 group-hover:brightness-110"
              />
              <div className="absolute inset-x-0 bottom-0 gradasi-bawah px-4 pb-5 pt-24 sm:px-8 sm:pb-8">
                <p className="meta-emas">
                  {utama.kategori} · {tanggalPendek(utama.tanggal)} · {utama.sumber.length} sumber
                </p>
                <h2 className="display mt-2 max-w-[26ch] text-[clamp(1.75rem,4.5vw,3.25rem)] text-terang group-hover:text-emas">
                  {utama.judul}
                </h2>
                <p className="mt-2 max-w-[52ch] text-[0.8125rem] leading-relaxed text-terang-2">
                  {utama.ringkas}
                </p>
              </div>
            </Link>
          )}

          {/* Dua berikutnya: gambar sedang, bersebelahan. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[kedua, ketiga].filter(Boolean).map((a) => (
              <Link key={a.id} href={`/artikel/${a.id}`} className="group block">
                <div className="overflow-hidden">
                  <Foto
                    src={a.gambar}
                    alt={a.gambarCaption}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full transition-[filter] duration-700 group-hover:brightness-110"
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
