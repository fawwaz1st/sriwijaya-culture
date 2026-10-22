"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Foto } from "@/components/foto";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { cn } from "@/lib/cn";
import { potret } from "@/lib/foto";
import type { Destinasi, KategoriDestinasi } from "@/lib/types";

/**
 * Katalog destinasi.
 *
 * Disusun sebagai galeri, bukan grid kartu. Setiap item memakai rasio
 * asli fotonya, jadi baris pertama punya tinggi berbeda dan halaman
 * terasa seperti dinding foto, bukan tabel.
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
        const t = [d.nama, d.ringkas, d.wilayah, d.kategori.join(" ")].join(" ").toLowerCase();
        return kata.every((k) => t.includes(k));
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
          const n = daftar.filter((d) => d.kategori.includes(k)).length;
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
          <span className="sr-only">Cari destinasi</span>
          <input
            type="search"
            value={kueri}
            onChange={(e) => setKueri(e.target.value.slice(0, 80))}
            placeholder="Cari nama atau wilayah"
            className="w-44 border border-malam-5 bg-transparent px-2.5 py-1.5 text-[0.8125rem] text-terang placeholder:text-terang-3 focus:border-emas focus:outline-none sm:w-56"
          />
        </label>
      </div>

      {hasil.length === 0 ? (
        <div className="mt-8">
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
        <ul className="mt-8 grid grid-cols-2 items-start gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
          {hasil.map((d, i) => {
            const p = potret(d.gambar[0].src);
            return (
              <li key={d.id}>
                <Link href={`/destinasi/${d.id}`} className="group flex h-full flex-col">
                  <div className="relative overflow-hidden">
                    <Foto
                      src={d.gambar[0].src}
                      alt={d.gambar[0].caption}
                      prioritas={i === 0}
                      // Bingkai mengikuti orientasi foto: potret 4:5,
                      // lanskap 3:2. Memaksa lanskap sempit ke 4:5
                      // memotong subjeknya sampai tidak terbaca.
                      rasioPaksa={p ? "4 / 5" : "3 / 2"}
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                    />
                    <span
                      className="absolute left-0 top-0 px-2 py-1 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-malam"
                      style={{ background: warnaKategori(d.kategori[0]) }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="meta">{d.kategori.join(" · ")}</p>
                    <h2 className="mt-1 font-display text-lg leading-tight text-terang group-hover:text-emas">
                      {d.nama}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[0.75rem] leading-relaxed text-terang-2">
                      {d.ringkas}
                    </p>
                    <p className="mt-auto pt-2 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-terang-3">
                      {d.wilayah} · {d.sumber.length} sumber
                      {!d.koordinat && " · tanpa koordinat"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
