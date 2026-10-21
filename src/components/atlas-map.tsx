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
 * panjang akan bertumpuk. Nama lengkap ada di indeks di samping peta.
 *
 * Interaksi: memilih pin menyorot baris indeks dan menampilkan satu
 * panel keterangan. Tidak ada tooltip yang mengikuti kursor, karena
 * itu tidak bisa dipakai dengan papan tombol.
 */
export function AtlasMap({
  daftar,
  kompak = false,
}: {
  daftar: readonly Destinasi[];
  kompak?: boolean;
}) {
  const titik = useMemo(() => titikPeta(daftar), [daftar]);
  const tanpa = useMemo(() => tanpaKoordinat(daftar), [daftar]);
  const [dipilih, setDipilih] = useState<number | null>(titik[0]?.no ?? null);
  const idGradien = useId();

  const aktif = titik.find((t) => t.no === dipilih) ?? null;

  return (
    <div className="grid gap-0 border border-garis bg-kertas-2 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* --- Peta --- */}
      <div className="relative min-w-0 border-b border-garis bg-[#efe9da] lg:border-b-0 lg:border-r">
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1">
          <span className="label-arsip bg-kertas/85 px-1.5 py-0.5 text-[0.5625rem]">
            Peta 01 · Pusat Kota
          </span>
          <span className="label-arsip bg-kertas/85 px-1.5 py-0.5 text-[0.5625rem] text-tinta-4">
            OpenStreetMap · ODbL
          </span>
        </div>

        <svg
          viewBox={ATLAS.viewBox}
          className="block h-auto w-full"
          role="group"
          aria-label={`Peta Kota Palembang dengan ${titik.length} destinasi bernomor. ${tanpa.length} destinasi belum memiliki koordinat terverifikasi sehingga tidak digambar.`}
        >
          <defs>
            <pattern id={`${idGradien}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="#16211b" strokeOpacity="0.045" strokeWidth="1" />
            </pattern>
            <radialGradient id={`${idGradien}-vignette`} cx="50%" cy="45%" r="72%">
              <stop offset="60%" stopColor="#efe9da" stopOpacity="0" />
              <stop offset="100%" stopColor="#d9d0b9" stopOpacity="0.55" />
            </radialGradient>
          </defs>

          <rect width={ATLAS.width} height={ATLAS.height} fill="#efe9da" />
          <rect width={ATLAS.width} height={ATLAS.height} fill={`url(#${idGradien}-grid)`} />

          {/* Jalan: tiga bobot, bukan satu warna seragam. */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {ATLAS.jalan.map((r, i) => (
              <path
                key={i}
                d={r.d}
                stroke={r.cls === "trunk" ? "#c9bfa6" : r.cls === "primary" ? "#d5ccb6" : "#ded6c3"}
                strokeWidth={r.cls === "trunk" ? 3.4 : r.cls === "primary" ? 2.2 : 1.4}
              />
            ))}
          </g>

          {/* Sungai digambar di atas jalan, seperti di peta sungguhan. */}
          <g>
            {ATLAS.sungai.map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill="none"
                stroke="#b9d2df"
                strokeWidth={s.nama === "Sungai Musi" ? 26 : 9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {ATLAS.sungai.map((s, i) => (
              <path
                key={`t${i}`}
                d={s.d}
                fill="none"
                stroke="#8fb4c8"
                strokeWidth={s.nama === "Sungai Musi" ? 1.1 : 0.8}
                strokeOpacity="0.5"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Label sungai mengikuti arah aliran, bukan horizontal. */}
          <g
            fill="#3f6b85"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="9.5"
            letterSpacing="2.2"
            opacity="0.85"
          >
            <text x="360" y="330" transform="rotate(-42 360 330)">
              SUNGAI MUSI
            </text>
            <text x="700" y="250" transform="rotate(66 700 250)" fontSize="7.5" opacity="0.8">
              SUNGAI BENDEM
            </text>
          </g>

          <rect width={ATLAS.width} height={ATLAS.height} fill={`url(#${idGradien}-vignette)`} pointerEvents="none" />

          {/* Pin bernomor */}
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
                  {on && (
                    <circle cx={t.x} cy={t.y} r="20" fill={w} fillOpacity="0.16" className="denyut" />
                  )}
                  <circle
                    cx={t.x}
                    cy={t.y}
                    r={on ? 11 : 8.5}
                    fill={on ? "#16211b" : w}
                    stroke="#faf7f0"
                    strokeWidth={on ? 2 : 1.4}
                    className="transition-all duration-200"
                  />
                  <text
                    x={t.x}
                    y={t.y + (on ? 3.4 : 3)}
                    textAnchor="middle"
                    fill={on ? "#e6c25a" : "#faf7f0"}
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize={on ? 9.5 : 8.5}
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {t.no}
                  </text>
                  {on && (
                    <text
                      x={t.x + 15}
                      y={t.y + 3}
                      fill="#16211b"
                      fontFamily="var(--font-instrument), sans-serif"
                      fontSize="10"
                      fontWeight="600"
                      stroke="#faf7f0"
                      strokeWidth="3"
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

        {/* Panel keterangan: satu destinasi aktif, tanpa tooltip melayang. */}
        {aktif && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-garis bg-kertas/95 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2">
              <span className="font-mono text-[0.625rem] text-tinta-3">
                {String(aktif.no).padStart(2, "0")}
              </span>
              <span className="font-display text-base font-semibold leading-tight text-tinta">
                {aktif.destinasi.nama}
              </span>
              <span className="hidden font-mono text-[0.625rem] text-tinta-3 sm:inline">
                {aktif.destinasi.wilayah}
              </span>
              <span className="ml-auto flex items-center gap-3">
                <span className="tabular hidden font-mono text-[0.625rem] text-tinta-3 md:inline">
                  {aktif.destinasi.koordinat
                    ? koordinatTeks(aktif.destinasi.koordinat.lat, aktif.destinasi.koordinat.lng)
                    : ""}
                </span>
                <Link
                  href={`/destinasi/${aktif.destinasi.id}`}
                  className="group flex items-center gap-1.5 border border-hijau-800 bg-hijau-900 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-kertas"
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

      {/* --- Indeks: daftar ini juga legenda --- */}
      <div className={cn("flex min-h-0 flex-col bg-kertas", kompak && "max-h-[420px]")}>
        <div className="flex items-center justify-between border-b border-garis px-3 py-2">
          <p className="label-arsip">Indeks Lokasi</p>
          <p className="tabular font-mono text-[0.625rem] text-tinta-3">
            {String(titik.length).padStart(2, "0")} titik
          </p>
        </div>
        <ul className="gulir-tipis min-h-0 flex-1 overflow-y-auto">
          {titik.map((t) => {
            const on = t.no === dipilih;
            return (
              <li key={t.destinasi.id} className="border-b border-garis-2 last:border-b-0">
                <button
                  type="button"
                  onMouseEnter={() => setDipilih(t.no)}
                  onFocus={() => setDipilih(t.no)}
                  onClick={() => setDipilih(t.no)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                    on ? "bg-kunyit-tipis" : "hover:bg-kertas-2",
                  )}
                >
                  <span
                    className="grid h-5 w-5 flex-none place-items-center font-mono text-[0.5625rem] font-semibold text-kertas"
                    style={{ background: warnaKategori(t.kategoriUtama) }}
                    aria-hidden="true"
                  >
                    {t.no}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-medium leading-tight text-tinta">
                      {t.destinasi.nama}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                      {t.destinasi.wilayah}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {tanpa.length > 0 && (
          <div className="border-t border-garis bg-kertas-3/50 px-3 py-2">
            <p className="label-arsip text-tinta-3">Tanpa koordinat</p>
            <p className="mt-1 text-[0.6875rem] leading-snug text-tinta-3">
              {tanpa.map((d) => d.nama).join(", ")}. Tidak digambar karena
              koordinatnya belum diverifikasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
