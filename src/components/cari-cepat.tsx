"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Pencarian cepat lintas arsip.
 *
 * Dibuka dengan Ctrl+K (Windows/Linux) atau Cmd+K (macOS), atau dengan
 * menekan tombol cari di header. Ini pola yang sudah dikenal pengguna
 * aplikasi modern, dan untuk arsip 25 entri ia mengalahkan halaman
 * pencarian tersendiri: satu pintu, tanpa pindah halaman.
 *
 * Indeks dikirim dari server sebagai prop, bukan diambil lewat API.
 * Ukurannya kecil (25 baris) dan sudah tersedia saat halaman dirender,
 * jadi pencarian berjalan seketika tanpa permintaan jaringan.
 */

export interface ItemCari {
  id: string;
  jenis: "destinasi" | "artikel" | "usaha";
  judul: string;
  keterangan: string;
  href: string;
}

/** Normalisasi sederhana: huruf kecil, tanpa tanda baca. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}

/**
 * Skor kecocokan.
 *
 * Bukan TF-IDF: untuk 25 entri, pencocokan substring dengan bobot
 * posisi sudah cukup dan bisa dijelaskan dalam satu kalimat. Judul yang
 * diawali kata kunci mendapat skor tertinggi karena itu yang paling
 * mungkin dimaksud pengguna.
 */
function skor(item: ItemCari, kueri: string): number {
  const q = norm(kueri).trim();
  if (!q) return 1;
  const kata = q.split(/\s+/).filter(Boolean);
  const judul = norm(item.judul);
  const ket = norm(item.keterangan);

  let total = 0;
  for (const k of kata) {
    if (judul.startsWith(k)) total += 10;
    else if (judul.includes(k)) total += 6;
    else if (ket.includes(k)) total += 2;
    else total -= 4;
  }
  return total;
}

export function CariCepat({ indeks }: { indeks: readonly ItemCari[] }) {
  const [buka, setBuka] = useState(false);
  const [kueri, setKueri] = useState("");
  const [sorot, setSorot] = useState(0);
  const kotak = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Pintasan papan ketik. Didaftarkan sekali, dilepas saat komponen hilang.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setBuka((v) => !v);
      }
      if (e.key === "Escape") setBuka(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fokus otomatis saat panel terbuka, dan kunci gulir latar.
  useEffect(() => {
    if (!buka) return;
    const asal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => kotak.current?.focus());
    return () => {
      document.body.style.overflow = asal;
      cancelAnimationFrame(id);
    };
  }, [buka]);

  const hasil = useMemo(() => {
    return indeks
      .map((i) => ({ i, s: skor(i, kueri) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.i);
  }, [indeks, kueri]);

  /*
   * Sorotan dijaga agar tidak menunjuk baris yang sudah tidak ada.
   *
   * Versi sebelumnya memakai effect yang memanggil setSorot(0) setiap
   * kueri berubah. Itu memicu render berantai dan ditandai eslint.
   * Yang dipakai sekarang: nilai sorot dibatasi saat render, tanpa
   * setState sama sekali. Kalau hasil menyusut, sorotan otomatis
   * menempel ke baris terakhir yang masih ada.
   */
  const sorotAman = Math.min(sorot, Math.max(0, hasil.length - 1));

  function pilih(item: ItemCari) {
    setBuka(false);
    setKueri("");
    router.push(item.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setBuka(true)}
        aria-label="Cari di arsip"
        className="sentuh flex h-9 items-center gap-2 border border-garis-malam px-2.5 text-terang-2 transition-colors hover:border-terang-3 hover:text-terang"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" strokeLinecap="round" />
        </svg>
        <span className="hidden font-mono text-[0.75rem] uppercase tracking-[0.1em] lg:inline">
          Cari
        </span>
        <kbd className="hidden rounded-sm border border-garis-malam px-1 py-0.5 font-mono text-[0.625rem] text-terang-3 lg:inline">
          Ctrl K
        </kbd>
      </button>

      {buka && (
        <div
          className="fixed inset-0 z-100 flex items-start justify-center bg-malam/85 px-4 pt-[12vh] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian arsip"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBuka(false);
          }}
        >
          <div className="w-full max-w-[34rem] border border-garis-malam bg-malam-2 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-garis-malam px-3">
              <svg viewBox="0 0 16 16" className="h-4 w-4 flex-none text-terang-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 3 3" strokeLinecap="round" />
              </svg>
              <input
                ref={kotak}
                type="text"
                value={kueri}
                onChange={(e) => setKueri(e.target.value.slice(0, 60))}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSorot((v) => Math.min(v + 1, hasil.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSorot((v) => Math.max(v - 1, 0));
                  }
                  if (e.key === "Enter" && hasil[sorotAman]) {
                    e.preventDefault();
                    pilih(hasil[sorotAman]);
                  }
                }}
                placeholder="Cari destinasi, catatan, atau usaha"
                aria-label="Kata kunci pencarian"
                className="min-h-12 flex-1 bg-transparent text-[0.9375rem] text-terang placeholder:text-terang-3 focus:outline-none"
              />
              <kbd className="flex-none rounded-sm border border-garis-malam px-1.5 py-0.5 font-mono text-[0.625rem] text-terang-3">
                Esc
              </kbd>
            </div>

            <ul className="gulir-tipis max-h-[52vh] overflow-y-auto">
              {hasil.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <p className="text-[0.875rem] text-terang-2">Tidak ada yang cocok.</p>
                  <p className="mt-1 text-[0.8125rem] text-terang-3">
                    Coba kata lain, misalnya &ldquo;songket&rdquo; atau &ldquo;Ampera&rdquo;.
                  </p>
                </li>
              ) : (
                hasil.map((item, i) => (
                  <li key={item.href} className="border-b border-garis-malam last:border-b-0">
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        pilih(item);
                      }}
                      onMouseEnter={() => setSorot(i)}
                      className={cn(
                        "flex items-baseline gap-3 px-4 py-3 transition-colors",
                        i === sorotAman ? "bg-emas/10" : "hover:bg-malam-3",
                      )}
                    >
                      <span className="w-14 flex-none font-mono text-[0.625rem] uppercase tracking-[0.08em] text-terang-3">
                        {item.jenis}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate text-[0.875rem]", i === sorotAman ? "text-emas" : "text-terang")}>
                          {item.judul}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.75rem] text-terang-3">
                          {item.keterangan}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>

            <p className="border-t border-garis-malam px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-3">
              {indeks.length} entri di arsip · ↑↓ pilih · Enter buka
            </p>
          </div>
        </div>
      )}
    </>
  );
}
