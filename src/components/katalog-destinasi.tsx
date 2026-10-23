"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Foto } from "@/components/foto";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { cn } from "@/lib/cn";
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
      {/* Filter: gulir horizontal di ponsel, tidak bungkus jadi tumpukan
          chip yang membentur pencarian. Pencarian pindah ke baris sendiri. */}
      <div className="gulir-tipis mt-8 flex items-center gap-x-1 overflow-x-auto border-y border-garis-malam py-2.5">
        <button
          type="button"
          onClick={() => pilih("")}
          aria-pressed={!aktif}
          className={cn(
            // py-2.5 + teks 10px memberi tinggi ~34px; area sentuh
            // diperluas ke 44px lewat pseudo-elemen di lapisan CSS.
            "sentuh flex-none px-3 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
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
                "sentuh flex flex-none items-center gap-1.5 px-3 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                on ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
              )}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: warnaKategori(k) }} />
              {k} <span className="tabular opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <label className="mt-3 flex items-center sm:justify-end">
        <span className="sr-only">Cari destinasi</span>
        <input
          type="search"
          value={kueri}
          onChange={(e) => setKueri(e.target.value.slice(0, 80))}
          placeholder="Cari nama atau wilayah"
          className="w-full border border-malam-5 bg-transparent px-2.5 py-2 text-[0.8125rem] text-terang placeholder:text-terang-3 focus:border-emas focus:outline-none sm:w-56"
        />
      </label>

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
        <ul className="mt-8 grid grid-cols-2 items-stretch gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
          {hasil.map((d, i) => {
            return (
              <li key={d.id} className="kartu-masuk h-full">
                <Link
                  href={`/destinasi/${d.id}`}
                  className="group kartu flex h-full flex-col p-2.5"
                >
                  <div className="relative overflow-hidden">
                    <Foto
                      src={d.gambar[0].src}
                      alt={d.gambar[0].caption}
                      prioritas={i === 0}
                      // Satu bingkai untuk semua kartu. Sebelumnya rasio
                      // mengikuti orientasi foto, jadi kartu potret 513px
                      // dan kartu lanskap 273px duduk di baris yang sama:
                      // judul dan ringkasan tidak pernah sejajar, dan grid
                      // terbaca sebagai kolom yang berantakan. Bingkai
                      // seragam membuat garis baca horizontal tetap utuh,
                      // sementara rasio asli tetap dipakai di halaman detail.
                      rasioPaksa="4 / 5"
                      posisi="center"
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span
                      className="absolute left-0 top-0 px-2 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-malam"
                      style={{ background: warnaKategori(d.kategori[0]) }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
                    <p className="meta">{d.kategori.join(" · ")}</p>
                    <h2 className="mt-1 line-clamp-2 font-display text-lg leading-tight text-terang transition-colors group-hover:text-emas">
                      {d.nama}
                    </h2>
                    {/*
                      Di 390px, kartu hanya selebar 143px. Ringkasan dua
                      baris di lebar itu selalu berakhir dengan elipsis,
                      sehingga sepuluh kartu terbaca identik dan tidak ada
                      satu pun informasi yang bisa dipakai memilih.
                      Di layar kecil ringkasan diganti metadata yang utuh:
                      wilayah dan ketersediaan titik peta. Ringkasan penuh
                      tetap ada di layar >=sm dan di halaman detail.
                    */}
                    <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-terang-2 max-sm:hidden">
                      {d.ringkas}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] leading-snug text-terang-3 sm:hidden">
                      <span className="truncate">{d.wilayah}</span>
                      {d.koordinat && (
                        <span className="flex flex-none items-center gap-1 text-emas/70">
                          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                            <path d="M6 11s4-3.6 4-6.4A4 4 0 0 0 2 4.6C2 7.4 6 11 6 11Z" />
                            <circle cx="6" cy="4.6" r="1.3" />
                          </svg>
                          peta
                        </span>
                      )}
                    </p>
                    <p className="mt-auto pt-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
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
