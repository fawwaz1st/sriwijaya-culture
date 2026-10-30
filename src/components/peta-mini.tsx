"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Foto } from "@/components/foto";
import { cn } from "@/lib/cn";
import { warnaKategori } from "@/lib/warna";
import { proyeksi } from "@/lib/geo";
import type { Destinasi, KategoriDestinasi } from "@/lib/types";

/**
 * Peta mini Palembang dari koordinat asli.
 *
 * Ini bukan pengganti Google Maps, dan tidak berusaha jadi pengganti.
 * Gunanya berbeda: memberi gambaran letak seluruh titik sekaligus,
 * dalam satu bidang yang muat di layar tanpa iframe 1 MB. Peta besar
 * tetap ada di bawahnya untuk zoom dan navigasi.
 *
 * Yang penting: posisi setiap titik dihitung dari koordinat yang sudah
 * diverifikasi lewat proyeksi linier yang sama dengan atlas. Tidak ada
 * titik yang ditebak, dan destinasi tanpa koordinat tidak digambar.
 */
export function PetaMini({
  daftar,
  kategori,
}: {
  daftar: readonly Destinasi[];
  kategori: readonly KategoriDestinasi[];
}) {
  const [aktif, setAktif] = useState<KategoriDestinasi | "">("");
  const [sorot, setSorot] = useState<string | null>(null);

  const titik = useMemo(() => {
    return daftar
      .filter((d) => d.koordinat)
      .map((d) => {
        const { x, y } = proyeksi(d.koordinat!.lng, d.koordinat!.lat);
        return { d, x, y };
      });
  }, [daftar]);

  const tampil = useMemo(
    () => (aktif ? titik.filter((t) => t.d.kategori.includes(aktif)) : titik),
    [titik, aktif],
  );

  const dipilih = tampil.find((t) => t.d.id === sorot) ?? null;

  // Kotak pandang dihitung dari titik yang benar-benar ada, bukan dari
  // angka tetap, supaya peta tidak menyisakan ruang kosong besar.
  const kotak = useMemo(() => {
    if (titik.length === 0) return { minX: 0, minY: 0, w: 1, h: 1 };
    const xs = titik.map((t) => t.x);
    const ys = titik.map((t) => t.y);
    const pad = 26;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const w = Math.max(...xs) - minX + pad;
    const h = Math.max(...ys) - minY + pad;
    return { minX, minY, w, h };
  }, [titik]);

  const jumlahPer = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of titik) for (const k of t.d.kategori) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  }, [titik]);

  return (
    <div className="border border-garis-malam bg-malam-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-garis-malam px-3 py-2.5">
        <p className="meta-emas">Peta ringkas</p>
        <div className="gulir-tipis flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAktif("")}
            aria-pressed={!aktif}
            className={cn(
              "sentuh flex-none px-2.5 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
              !aktif ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
            )}
          >
            Semua {titik.length}
          </button>
          {kategori.map((k) => {
            const n = jumlahPer.get(k) ?? 0;
            if (!n) return null;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setAktif(k)}
                aria-pressed={aktif === k}
                className={cn(
                  "sentuh flex flex-none items-center gap-1.5 px-2.5 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                  aktif === k ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
                )}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: warnaKategori(k) }} />
                {k} <span className="tabular opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="relative bg-malam-3">
          <svg
            viewBox={`${kotak.minX} ${kotak.minY} ${kotak.w} ${kotak.h}`}
            className="block h-full max-h-[26rem] w-full"
            role="img"
            aria-label={`Peta ringkas ${tampil.length} destinasi Palembang`}
          >
            {/* Kisi latar: memberi rasa peta tanpa mengklaim jalan. */}
            <defs>
              <pattern id="kisi-mini" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="#1c211f" strokeWidth="1" />
              </pattern>
            </defs>
            <rect
              x={kotak.minX}
              y={kotak.minY}
              width={kotak.w}
              height={kotak.h}
              fill="url(#kisi-mini)"
            />

            {/* Garis Sungai Musi: hanya penanda arah aliran, bukan geometri
                presisi, jadi digambar sebagai kurva halus di antara titik. */}
            <path
              d={`M ${kotak.minX} ${kotak.minY + kotak.h * 0.62} C ${kotak.minX + kotak.w * 0.3} ${kotak.minY + kotak.h * 0.5}, ${kotak.minX + kotak.w * 0.62} ${kotak.minY + kotak.h * 0.78}, ${kotak.minX + kotak.w} ${kotak.minY + kotak.h * 0.66}`}
              fill="none"
              stroke="#2b5871"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.75"
            />

            {tampil.map((t) => {
              const on = t.d.id === sorot;
              return (
                <g key={t.d.id}>
                  <circle
                    cx={t.x}
                    cy={t.y}
                    r={on ? 11 : 7}
                    fill={warnaKategori(t.d.kategori[0])}
                    stroke="#0b0d0c"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {on && (
                    <circle cx={t.x} cy={t.y} r={19} fill="none" stroke={warnaKategori(t.d.kategori[0])} strokeWidth="1.5" opacity="0.55" />
                  )}
                  <text
                    x={t.x}
                    y={t.y - (on ? 18 : 13)}
                    textAnchor="middle"
                    className="fill-terang font-mono"
                    style={{ fontSize: on ? 13 : 11 }}
                  >
                    {t.d.nama.length > 22 ? t.d.nama.slice(0, 21) + "…" : t.d.nama}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col border-t border-garis-malam md:border-l md:border-t-0">
          <p className="meta border-b border-garis-malam px-3 py-2">
            {String(tampil.length).padStart(2, "0")} titik
          </p>
          <ul className="gulir-tipis max-h-[26rem] flex-1 overflow-y-auto">
            {tampil.map((t, i) => (
              <li key={t.d.id} className="border-b border-garis-malam last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSorot(t.d.id)}
                  onMouseEnter={() => setSorot(t.d.id)}
                  aria-pressed={t.d.id === sorot}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                    t.d.id === sorot ? "bg-emas/12" : "hover:bg-malam-3",
                  )}
                >
                  <span className="w-10 flex-none overflow-hidden">
                    <Foto src={t.d.gambar[0].src} alt="" rasioPaksa="4 / 3" sizes="40px" className="w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[0.8125rem] leading-tight", t.d.id === sorot ? "text-emas" : "text-terang-2")}>
                      {t.d.nama}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[0.625rem] uppercase tracking-[0.08em] text-terang-3">
                      {String(i + 1).padStart(2, "0")} · {t.d.wilayah}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {tampil.length === 0 && (
              <li className="px-3 py-6 text-[0.8125rem] text-terang-3">
                Tidak ada destinasi berkoordinat di kategori ini.
              </li>
            )}
          </ul>
          {dipilih && (
            <div className="border-t border-garis-malam p-3">
              <p className="font-display text-[0.9375rem] leading-tight text-terang">{dipilih.d.nama}</p>
              <p className="mt-1 line-clamp-2 text-[0.75rem] leading-relaxed text-terang-3">{dipilih.d.ringkas}</p>
              <Link
                href={`/destinasi/${dipilih.d.id}`}
                className="sentuh mt-2.5 inline-flex items-center gap-1.5 bg-emas px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-malam transition-colors hover:bg-emas-muda"
              >
                Buka halaman
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <p className="border-t border-garis-malam px-3 py-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
        Digambar dari koordinat terverifikasi · bukan pengganti peta jalan
      </p>
    </div>
  );
}
