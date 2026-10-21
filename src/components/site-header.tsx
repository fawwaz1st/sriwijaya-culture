"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Navigasi arsip.
 *
 * Struktur: satu baris tipis berisi identitas + nomor arsip, lalu satu
 * baris navigasi yang menempel saat digulir. Tidak ada menu mega,
 * tidak ada dropdown. Arsip yang baik punya daftar isi yang jelas.
 */

const NAV = [
  { href: "/destinasi", label: "Destinasi", kode: "01" },
  { href: "/umkm", label: "Usaha Lokal", kode: "02" },
  { href: "/artikel", label: "Sejarah", kode: "03" },
  { href: "/metodologi", label: "Metodologi", kode: "04" },
  { href: "/tentang", label: "Tentang", kode: "05" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [terbuka, setTerbuka] = useState(false);
  const [tergulir, setTergulir] = useState(false);

  useEffect(() => {
    const onScroll = () => setTergulir(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu saat rute berubah, dan kunci gulir saat menu terbuka.
  // Ditutup lewat handler navigasi (bukan effect) supaya tidak memicu
  // render berantai saat rute berubah.
  useEffect(() => {
    if (!terbuka) return;
    const asal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTerbuka(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = asal;
      window.removeEventListener("keydown", onKey);
    };
  }, [terbuka]);

  const aktif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Baris identitas. Menghilang saat digulir untuk menghemat tinggi. */}
      <div
        className={cn(
          "hidden border-b border-garis bg-hijau-950 text-kertas/70 transition-all duration-300 md:block",
          tergulir ? "h-0 overflow-hidden opacity-0" : "h-8 opacity-100",
        )}
      >
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <p className="label-arsip text-kertas/60">
            Arsip Digital · Kota Palembang · Sumatera Selatan
          </p>
          <p className="label-arsip flex items-center gap-3 text-kertas/60">
            <span className="tabular">104.75° BT</span>
            <span aria-hidden="true" className="text-kunyit/70">
              /
            </span>
            <span className="tabular">2.99° LS</span>
            <span aria-hidden="true" className="text-kunyit/70">
              /
            </span>
            <span>ITFEST 2026</span>
          </p>
        </div>
      </div>

      <div
        className={cn(
          "border-b bg-kertas/95 backdrop-blur-sm transition-shadow duration-300",
          tergulir ? "border-garis shadow-lembar" : "border-garis-2",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label="Sriwijaya Culture, ke beranda"
          >
            {/* Tanda arsip: dua garis sungai di dalam kotak. Bukan logo bulat. */}
            <span
              aria-hidden="true"
              className="relative grid h-9 w-9 flex-none place-items-center border border-hijau-800 bg-hijau-950"
            >
              <svg viewBox="0 0 36 36" className="h-9 w-9">
                <path d="M4 21c5 0 5-4 10-4s5 4 10 4 5-3 8-3" fill="none" stroke="#d4a017" strokeWidth="1.4" />
                <path d="M4 26c5 0 5-4 10-4s5 4 10 4 5-3 8-3" fill="none" stroke="#faf7f0" strokeOpacity=".5" strokeWidth="1.1" />
                <path d="M18 5v9M13 9l5-4 5 4" fill="none" stroke="#faf7f0" strokeWidth="1.2" />
              </svg>
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-tinta">
                Sriwijaya Culture
              </span>
              <span className="label-arsip mt-1 block text-[0.625rem] tracking-[0.18em]">
                Arsip Terbuka Palembang
              </span>
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="ml-auto hidden lg:block">
            <ul className="flex items-stretch">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={aktif(item.href) ? "page" : undefined}
                    className={cn(
                      "group relative flex h-16 items-center gap-1.5 px-3 text-sm transition-colors",
                      aktif(item.href)
                        ? "text-tinta"
                        : "text-tinta-2 hover:text-tinta",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "font-mono text-[0.5625rem] tracking-wider transition-colors",
                        aktif(item.href) ? "text-kunyit-ink" : "text-tinta-4 group-hover:text-tinta-3",
                      )}
                    >
                      {item.kode}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-2 bottom-0 h-[2px] origin-left bg-hijau-800 transition-transform duration-300",
                        aktif(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <Link
              href="/asisten"
              className="group flex h-9 items-center gap-2 border border-hijau-800 bg-hijau-900 px-2 text-kertas transition-colors hover:bg-hijau-700 sm:px-3"
              aria-label="Buka Asisten Sari"
            >
              <span aria-hidden="true" className="text-kunyit">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M10 2.5 11.7 7l4.5 1.7-4.5 1.7L10 15l-1.7-4.6L3.8 8.7 8.3 7z" />
                  <path d="M15.5 14.5v3M14 16h3" strokeLinecap="round" />
                </svg>
              </span>
              <span className="hidden whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.1em] sm:inline">
                Tanya Sari
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setTerbuka((v) => !v)}
              aria-expanded={terbuka}
              aria-controls="menu-mobile"
              aria-label={terbuka ? "Tutup menu" : "Buka menu"}
              className="grid h-9 w-9 place-items-center border border-garis-3 text-tinta transition-colors hover:bg-kertas-2 lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                {terbuka ? (
                  <path d="M5 5l10 10M15 5L5 15" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile: daftar isi penuh, bukan drawer melayang. */}
      {terbuka && (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-garis bg-kertas lg:hidden"
        >
          <nav aria-label="Navigasi seluler" className="mx-auto max-w-[1440px] px-4 py-6">
            <p className="label-arsip mb-3">Daftar Isi</p>
            <ul className="border-t border-garis">
              {[{ href: "/", label: "Beranda", kode: "00" }, ...NAV].map((item) => (
                <li key={item.href} className="border-b border-garis">
                  <Link
                    href={item.href}
                    aria-current={aktif(item.href) ? "page" : undefined}
                    className="flex items-baseline gap-3 py-3.5"
                  >
                    <span className="font-mono text-[0.625rem] text-tinta-3">{item.kode}</span>
                    <span
                      className={cn(
                        "font-display text-2xl",
                        aktif(item.href) ? "text-tinta" : "text-tinta-2",
                      )}
                    >
                      {item.label}
                    </span>
                    {aktif(item.href) && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-kunyit" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/asisten"
              className="mt-6 flex items-center justify-between border border-hijau-800 bg-hijau-900 px-4 py-3 text-kertas"
            >
              <span className="font-mono text-xs uppercase tracking-[0.12em]">Tanya Asisten Sari</span>
              <span aria-hidden="true" className="text-kunyit">
                →
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
