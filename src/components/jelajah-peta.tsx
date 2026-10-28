"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Foto } from "@/components/foto";
import { cn } from "@/lib/cn";
import { warnaKategori } from "@/lib/warna";
import type { Destinasi, KategoriDestinasi } from "@/lib/types";

/**
 * Peta jelajah dengan penyaring kategori.
 *
 * Dua panel: peta besar di kiri, daftar titik di kanan. Memilih kategori
 * menyaring keduanya sekaligus, jadi pengunjung tidak perlu menebak
 * titik mana yang termasuk kategori yang sedang dilihat.
 *
 * Peta memakai embed Google Maps tanpa kunci API. Titik yang dipilih
 * mengganti koordinat pusat, bukan menambah penanda di atas peta yang
 * sama, karena embed tanpa kunci tidak mengizinkan penanda kustom.
 */
export function JelajahPeta({
  daftar,
  kategori,
}: {
  daftar: readonly Destinasi[];
  kategori: readonly KategoriDestinasi[];
}) {
  const [aktif, setAktif] = useState<KategoriDestinasi | "">("");
  const [dipilih, setDipilih] = useState<Destinasi | null>(daftar[0] ?? null);
  const [lapisan, setLapisan] = useState<"k" | "m">("k");

  const tersaring = useMemo(() => {
    const denganKoordinat = daftar.filter((d) => d.koordinat);
    return aktif ? denganKoordinat.filter((d) => d.kategori.includes(aktif)) : denganKoordinat;
  }, [daftar, aktif]);

  const jumlahPer = useMemo(() => {
    const map = new Map<KategoriDestinasi, number>();
    for (const d of daftar) {
      if (!d.koordinat) continue;
      for (const k of d.kategori) map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [daftar]);

  // Titik yang dipilih harus tetap terlihat setelah penyaringan berubah.
  const tampil = dipilih && tersaring.some((d) => d.id === dipilih.id) ? dipilih : tersaring[0] ?? null;

  const q = tampil?.koordinat ? `${tampil.koordinat.lat},${tampil.koordinat.lng}` : "Palembang, Sumatera Selatan";
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=${lapisan}&z=${tampil ? 16 : 13}&hl=id&output=embed`;

  return (
    <div className="border border-garis-malam bg-malam-2">
      {/* Bar penyaring */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-garis-malam px-3 py-2.5">
        <div className="gulir-tipis flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAktif("")}
            aria-pressed={!aktif}
            className={cn(
              "sentuh flex-none px-3 py-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
              !aktif ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
            )}
          >
            Semua <span className="tabular opacity-60">{daftar.filter((d) => d.koordinat).length}</span>
          </button>
          {kategori.map((k) => {
            const n = jumlahPer.get(k) ?? 0;
            if (!n) return null;
            const on = aktif === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setAktif(k)}
                aria-pressed={on}
                className={cn(
                  "sentuh flex flex-none items-center gap-1.5 px-3 py-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                  on ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
                )}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: warnaKategori(k) }} />
                {k} <span className="tabular opacity-60">{n}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {(["k", "m"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setLapisan(v)}
              aria-pressed={lapisan === v}
              className={cn(
                "sentuh px-2.5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors",
                lapisan === v ? "bg-emas text-malam" : "text-terang-3 hover:text-terang",
              )}
            >
              {v === "k" ? "Satelit" : "Jalan"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative min-h-[24rem] border-b border-garis-malam bg-malam-3 lg:min-h-[34rem] lg:border-b-0 lg:border-r">
          <iframe
            key={src}
            src={src}
            title={tampil ? `Peta ${tampil.nama}` : "Peta Kota Palembang"}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col bg-malam-2">
          <p className="meta border-b border-garis-malam px-3 py-2">
            {String(tersaring.length).padStart(2, "0")} titik
          </p>
          <ul className="gulir-tipis max-h-[34rem] flex-1 overflow-y-auto">
            {tersaring.length === 0 ? (
              <li className="px-3 py-6 text-[0.8125rem] text-terang-3">
                Tidak ada destinasi berkoordinat di kategori ini.
              </li>
            ) : (
              tersaring.map((d, i) => {
                const on = tampil?.id === d.id;
                return (
                  <li key={d.id} className="border-b border-garis-malam last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setDipilih(d)}
                      aria-pressed={on}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                        on ? "bg-emas/12" : "hover:bg-malam-3",
                      )}
                    >
                      <span className="w-16 flex-none overflow-hidden">
                        <Foto
                          src={d.gambar[0].src}
                          alt=""
                          rasioPaksa="4 / 3"
                          sizes="64px"
                          className="w-full object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[0.8125rem] leading-tight",
                            on ? "text-emas" : "text-terang-2",
                          )}
                        >
                          {d.nama}
                        </span>
                        <span className="mt-0.5 block truncate font-mono text-[0.625rem] uppercase tracking-[0.08em] text-terang-3">
                          {String(i + 1).padStart(2, "0")} · {d.wilayah}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {tampil && (
            <div className="border-t border-garis-malam p-3">
              <p className="font-display text-[0.9375rem] leading-tight text-terang">{tampil.nama}</p>
              <p className="mt-1 line-clamp-2 text-[0.75rem] leading-relaxed text-terang-3">
                {tampil.ringkas}
              </p>
              <Link
                href={`/destinasi/${tampil.id}`}
                className="sentuh mt-2.5 inline-flex items-center gap-1.5 bg-emas px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-malam transition-colors hover:bg-emas-muda"
              >
                Buka halaman
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}