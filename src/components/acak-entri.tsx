"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Tombol "buka satu entri acak".
 *
 * Gunanya bukan hiburan, tetapi membongkar kebiasaan: pengunjung arsip
 * hampir selalu membuka tiga entri teratas lalu pergi. Tombol ini
 * menawarkan entri yang tidak akan ia pilih sendiri.
 *
 * Pemilihan dilakukan di klien agar tidak perlu permintaan server, dan
 * entri yang sedang dibuka tidak dipilih ulang (kecuali hanya ada satu).
 */
export function AcakEntri({
  daftar,
  label = "Buka satu entri acak",
  className,
}: {
  daftar: readonly { href: string; judul: string; jenis: string }[];
  label?: string;
  className?: string;
}) {
  const [pilihan, setPilihan] = useState<(typeof daftar)[number] | null>(null);

  function pilih() {
    if (daftar.length === 0) return;
    if (daftar.length === 1) {
      setPilihan(daftar[0]);
      return;
    }
    let berikut = pilihan;
    // Batas percobaan: kalau daftar berisi entri identik, jangan berputar
    // tanpa akhir.
    for (let i = 0; i < 8 && berikut?.href === pilihan?.href; i += 1) {
      berikut = daftar[Math.floor(Math.random() * daftar.length)];
    }
    setPilihan(berikut);
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <button
        type="button"
        onClick={pilih}
        className="sentuh inline-flex items-center gap-2 border border-terang/25 px-4 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2 transition-colors hover:border-emas hover:text-emas"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="2" y="2" width="12" height="12" />
          <circle cx="5.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="10.5" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
        {label}
      </button>

      {pilihan && (
        <Link
          href={pilihan.href}
          className="group inline-flex min-w-0 items-center gap-2 text-[0.8125rem] text-terang-2 transition-colors hover:text-emas"
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-3">
            {pilihan.jenis}
          </span>
          <span className="truncate underline decoration-terang-3/40 underline-offset-4 group-hover:decoration-emas">
            {pilihan.judul}
          </span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
