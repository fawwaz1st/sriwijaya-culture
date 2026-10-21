"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { cn } from "@/lib/cn";
import type { Destinasi, KategoriDestinasi } from "@/lib/types";

/**
 * Katalog destinasi dengan penyaringan di klien.
 *
 * Kenapa di klien: seluruh data sudah ada di halaman (25 rekaman, satu
 * muatan kecil). Menyaring di klien membuat filter terasa instan tanpa
 * memuat ulang halaman, dan halaman katalog tetap bisa diprerender
 * statis. URL tetap diperbarui supaya hasil filter bisa dibagikan.
 */
export function KatalogDestinasi({
  daftar,
  kategori,
}: {
  daftar: readonly Destinasi[];
  kategori: readonly KategoriDestinasi[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const aktif = params.get("kategori") ?? "";
  const [kueri, setKueri] = useState("");

  const hasil = useMemo(() => {
    let h = [...daftar];
    if (aktif) h = h.filter((d) => d.kategori.includes(aktif as KategoriDestinasi));
    const q = kueri.trim().toLowerCase();
    if (q) {
      const kata = q.split(/\s+/);
      h = h.filter((d) => {
        const teks = [d.nama, d.ringkas, d.wilayah, d.kategori.join(" ")].join(" ").toLowerCase();
        return kata.every((k) => teks.includes(k));
      });
    }
    return h;
  }, [daftar, aktif, kueri]);

  function pilih(k: string) {
    const next = new URLSearchParams(params.toString());
    if (!k || k === aktif) next.delete("kategori");
    else next.set("kategori", k);
    router.replace(next.toString() ? `/destinasi?${next}` : "/destinasi", { scroll: false });
  }

  return (
    <>
      {/* Filter sebagai daftar tombol. Semua pilihan terlihat sekaligus. */}
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
            const n = daftar.filter((d) => d.kategori.includes(k)).length;
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
          Menampilkan <span className="tabular text-tinta">{hasil.length}</span> dari{" "}
          <span className="tabular">{daftar.length}</span> destinasi
          {aktif && ` · ${aktif}`}
        </p>
        <label className="flex items-center gap-2">
          <span className="sr-only">Cari destinasi</span>
          <input
            type="search"
            value={kueri}
            onChange={(e) => setKueri(e.target.value.slice(0, 80))}
            placeholder="Cari nama atau wilayah"
            className="w-52 border border-garis-3 bg-kertas px-2 py-1 text-[0.8125rem] text-tinta placeholder:text-tinta-4 focus:border-hijau-700 focus:outline-none"
          />
        </label>
      </div>

      {hasil.length === 0 ? (
        <div className="mt-4">
          <KeadaanKosong
            judul="Tidak ada destinasi yang cocok"
            pesan="Arsip ini hanya memuat destinasi yang sudah kami verifikasi. Coba hapus kata kunci atau pilih kategori lain."
            aksi={
              <Tombol
                href="/destinasi"
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
        <ul className="mt-4 grid gap-0 border border-garis sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((d, i) => (
            <li
              key={d.id}
              className="border-b border-garis sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <Link href={`/destinasi/${d.id}`} className="group flex h-full flex-col">
                <div className="relative aspect-4/3 overflow-hidden bg-kertas-3">
                  <Image
                    src={d.gambar[0].src}
                    alt={d.gambar[0].caption}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="foto-arsip object-cover"
                  />
                  <span className="absolute left-0 top-0 flex items-center gap-1.5 bg-hijau-950/90 px-1.5 py-1 font-mono text-[0.5625rem] uppercase tracking-wider text-kertas">
                    <span className="tabular text-kunyit-muda">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {d.koordinat ? "berkoordinat" : "tanpa koordinat"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="label-arsip text-[0.5625rem]">{d.kategori.join(" · ")}</p>
                  <p className="mt-1 font-display text-xl leading-tight text-tinta group-hover:text-hijau-700">
                    {d.nama}
                  </p>
                  <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                    {d.wilayah}
                  </p>
                  <p className="mt-2 line-clamp-3 flex-1 text-[0.8125rem] leading-relaxed text-tinta-2">
                    {d.ringkas}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-garis-2 pt-2">
                    <span className="tabular font-mono text-[0.5625rem] text-tinta-3">
                      {d.sumber.length} sumber
                    </span>
                    <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-hijau-700">
                      Buka →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
