"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { RingkasArsip } from "@/components/isi-arsip";

/**
 * Panel ringkasan arsip untuk layar lebar.
 *
 * Dipakai di halaman asisten sebagai kolom samping: menunjukkan cakupan
 * arsip yang bisa ditanyakan, bukan sebagai dekorasi. Semua angka
 * dihitung dari data, dan setiap baris menuju halaman aslinya.
 */
export function PanelArsip({ r }: { r: RingkasArsip }) {
  const kolom = useMemo(
    () => [
      { label: "Destinasi", angka: r.destinasi, href: "/destinasi" },
      { label: "Usaha lokal", angka: r.umkm, href: "/umkm" },
      { label: "Catatan", angka: r.artikel, href: "/artikel" },
      { label: "Tonggak waktu", angka: r.peristiwa, href: "/artikel" },
    ],
    [r],
  );

  const contoh = useMemo(
    () => [
      ...r.contohDestinasi.map((d) => ({ href: `/destinasi/${d.id}`, nama: d.nama, tag: d.kategori })),
      ...r.contohArtikel.map((a) => ({ href: `/artikel/${a.id}`, nama: a.judul, tag: a.kategori })),
      ...r.contohUMKM.map((u) => ({ href: `/umkm/${u.id}`, nama: u.nama, tag: u.kategori })),
    ],
    [r],
  );

  return (
    <aside className="hidden w-64 flex-none flex-col gap-6 border-l border-garis-malam pl-6 xl:flex">
      <div>
        <p className="meta-emas">Cakupan arsip</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          {kolom.map((k) => (
            <Link key={k.label} href={k.href} className="group block">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-3 group-hover:text-terang-2">
                {k.label}
              </dt>
              <dd className="tabular mt-0.5 font-display text-2xl leading-none text-terang group-hover:text-emas">
                {k.angka}
              </dd>
            </Link>
          ))}
        </dl>
        <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-3">
          {r.rentangTahun}
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <p className="meta-emas">Bisa ditanya</p>
        <ul className="mt-2 space-y-1">
          {contoh.map((x) => (
            <li key={x.href}>
              <Link
                href={x.href}
                className="group flex items-baseline justify-between gap-3 py-1 text-[0.75rem] text-terang-2 transition-colors hover:text-emas"
              >
                <span className="truncate">{x.nama}</span>
                <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-terang-3">
                  {x.tag}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("border-t border-garis-malam pt-4")}>
        <p className="meta-emas">Cara kerja</p>
        <p className="mt-2 text-[0.75rem] leading-relaxed text-terang-3">
          Sari mencari dokumen di arsip lebih dulu, lalu merangkai jawaban hanya
          dari dokumen itu. Tanpa dokumen yang cocok, jawabannya &ldquo;belum ada
          di arsip&rdquo;. Harga, jam buka, dan kontak tidak pernah dikarang.
        </p>
      </div>
    </aside>
  );
}
