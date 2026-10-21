"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import type { Destinasi } from "@/lib/types";
import { ATLAS, titikPeta, tanpaKoordinat } from "@/lib/geo";
import { warnaKategori } from "@/lib/warna";
import { koordinatTeks } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Atlas posisi destinasi.
 *
 * Bukan ilustrasi. Geometri jalan dan sungai berasal dari OpenStreetMap
 * dan diproyeksikan linier dari koordinat asli. Pin bernomor karena
 * empat destinasi berdekatan di kawasan Bukit Kecil, dan label nama
 * panjang akan bertumpuk.
 *
 * Versi ini berlatarkan kertas terang, karena peta dibaca, bukan
 * ditonton. Itu juga yang membuatnya tidak tenggelam di halaman gelap.
 */
export function AtlasMap({ daftar }: { daftar: readonly Destinasi[] }) {
  const titik = useMemo(() => titikPeta(daftar), [daftar]);
  const tanpa = useMemo(() => tanpaKoordinat(daftar), [daftar]);
  const [dipilih, setDipilih] = useState<number | null>(titik[0]?.no ?? null);
  const uid = useId();

  const aktif = titik.find((t) => t.no === dipilih) ?? null;

  return (
    <div className="grid border border-garis-kertas bg-kertas lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="relative min-w-0 border-b border-garis-kertas bg-[#e9e5d9] lg:border-b-0 lg:border-r">
        <svg
          viewBox={ATLAS.viewBox}
          className="block h-auto w-full"
          role="group"
          aria-label={`Peta Kota Palembang dengan ${titik.length} destinasi bernomor. ${tanpa.length} destinasi belum punya koordinat sehingga tidak digambar.`}
        >
          <defs>
            <pattern id={`${uid}-grid`} width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0H0V44" fill="none" stroke="#14170f" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
            <radialGradient id={`${uid}-v`} cx="50%" cy="45%" r="75%">
              <stop offset="55%" stopColor="#e9e5d9" stopOpacity="0" />
              <stop offset="100%" stopColor="#cfc9b8" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          <rect width={ATLAS.width} height={ATLAS.height} fill="#e9e5d9" />
          <rect width={ATLAS.width} height={ATLAS.height} fill={`url(#${uid}-grid)`} />

          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {ATLAS.jalan.map((r, i) => (
              <path
                key={i}
                d={r.d}
                stroke={r.cls === "trunk" ? "#c4bda9" : r.cls === "primary" ? "#d1cab7" : "#dad4c3"}
                strokeWidth={r.cls === "trunk" ? 3.6 : r.cls === "primary" ? 2.2 : 1.4}
              />
            ))}
          </g>

          <g>
            {ATLAS.sungai.map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill="none"
                stroke="#a9c6d4"
                strokeWidth={s.nama === "Sungai Musi" ? 28 : 9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {ATLAS.sungai.map((s, i) => (
              <path
                key={`t${i}`}
                d={s.d}
                fill="none"
                stroke="#6f9db5"
                strokeWidth={s.nama === "Sungai Musi" ? 1.2 : 0.8}
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
            ))}
          </g>

          <g fill="#2b5871" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="2.4" opacity="0.8">
            <text x="352" y="336" transform="rotate(-42 352 336)">
              SUNGAI MUSI
            </text>
            <text x="702" y="252" transform="rotate(66 702 252)" fontSize="7" opacity="0.75">
              SUNGAI BENDEM
            </text>
          </g>

          <rect width={ATLAS.width} height={ATLAS.height} fill={`url(#${uid}-v)`} pointerEvents="none" />

          <g>
            {titik.map((t) => {
              const on = t.no === dipilih;
              const w = warnaKategori(t.kategoriUtama);
              return (
                <g
                  key={t.destinasi.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t.no}. ${t.destinasi.nama}, ${t.destinasi.wilayah}`}
                  aria-pressed={on}
                  onClick={() => setDipilih(t.no)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDipilih(t.no);
                    }
                  }}
                  onMouseEnter={() => setDipilih(t.no)}
                  className="cursor-pointer focus:outline-none"
                >
                  {on && <circle cx={t.x} cy={t.y} r="22" fill={w} fillOpacity="0.15" className="denyut" />}
                  <circle
                    cx={t.x}
                    cy={t.y}
                    r={on ? 11 : 8}
                    fill={on ? "#14170f" : w}
                    stroke="#f4f2ec"
                    strokeWidth={on ? 2.2 : 1.5}
                    className="transition-all duration-200"
                  />
                  <text
                    x={t.x}
                    y={t.y + (on ? 3.4 : 2.9)}
                    textAnchor="middle"
                    fill={on ? "#d9a832" : "#f4f2ec"}
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize={on ? 9.5 : 8}
                    fontWeight="500"
                    pointerEvents="none"
                  >
                    {t.no}
                  </text>
                  {on && (
                    <text
                      x={t.x + 16}
                      y={t.y + 3.5}
                      fill="#14170f"
                      fontFamily="var(--font-instrument), sans-serif"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="#f4f2ec"
                      strokeWidth="3.4"
                      paintOrder="stroke"
                      pointerEvents="none"
                    >
                      {t.destinasi.nama}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {aktif && (
          <div className="absolute inset-x-0 bottom-0 border-t border-garis-kertas bg-kertas/95 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5">
              <span className="tabular font-mono text-[0.625rem] text-gelap-3">
                {String(aktif.no).padStart(2, "0")}
              </span>
              <span className="font-display text-[1.0625rem] font-medium leading-tight text-gelap">
                {aktif.destinasi.nama}
              </span>
              <span className="hidden font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-gelap-3 sm:inline">
                {aktif.destinasi.wilayah}
              </span>
              <span className="ml-auto flex items-center gap-3">
                <span className="tabular hidden font-mono text-[0.5625rem] text-gelap-3 md:inline">
                  {aktif.destinasi.koordinat
                    ? koordinatTeks(aktif.destinasi.koordinat.lat, aktif.destinasi.koordinat.lng)
                    : ""}
                </span>
                <Link
                  href={`/destinasi/${aktif.destinasi.id}`}
                  className="group flex items-center gap-1.5 bg-gelap px-2.5 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-kertas"
                >
                  Buka
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-col bg-kertas">
        <div className="flex items-center justify-between border-b border-garis-kertas px-3 py-2.5">
          <p className="meta">Indeks lokasi</p>
          <p className="tabular font-mono text-[0.5625rem] text-gelap-3">
            {String(titik.length).padStart(2, "0")}
          </p>
        </div>
        <ul className="gulir-tipis min-h-0 flex-1 overflow-y-auto">
          {titik.map((t) => {
            const on = t.no === dipilih;
            return (
              <li key={t.destinasi.id} className="border-b border-garis-kertas/60 last:border-b-0">
                <button
                  type="button"
                  onMouseEnter={() => setDipilih(t.no)}
                  onFocus={() => setDipilih(t.no)}
                  onClick={() => setDipilih(t.no)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                    on ? "bg-emas/12" : "hover:bg-kertas-2",
                  )}
                >
                  <span
                    className="grid h-5 w-5 flex-none place-items-center font-mono text-[0.5625rem] font-medium text-kertas"
                    style={{ background: warnaKategori(t.kategoriUtama) }}
                    aria-hidden="true"
                  >
                    {t.no}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-medium leading-tight text-gelap">
                      {t.destinasi.nama}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[0.5rem] uppercase tracking-[0.1em] text-gelap-3">
                      {t.destinasi.wilayah}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {tanpa.length > 0 && (
          <div className="border-t border-garis-kertas bg-kertas-2 px-3 py-2.5">
            <p className="meta">Tanpa koordinat</p>
            <p className="mt-1 text-[0.6875rem] leading-snug text-gelap-2">
              {tanpa.map((d) => d.nama).join(", ")}. Tidak digambar karena koordinatnya
              belum diverifikasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
