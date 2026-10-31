"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { CariCepat, type ItemCari } from "@/components/cari-cepat";

/**
 * Navigasi galeri.
 *
 * Satu baris, tanpa baris identitas kedua. Menempel dengan latar yang
 * menggelap setelah digulir, karena di atas foto terang teks putih butuh
 * jaminan kontras.
 */

const NAV = [
  { href: "/destinasi", label: "Destinasi" },
  { href: "/jelajah", label: "Jelajah" },
  { href: "/umkm", label: "Usaha" },
  { href: "/artikel", label: "Sejarah" },
  { href: "/metodologi", label: "Sumber" },
  { href: "/tentang", label: "Tentang" },
  { href: "/favorit", label: "Favorit" },
] as const;

export function SiteHeader({ indeks }: { indeks: readonly ItemCari[] }) {
  const pathname = usePathname();
  const [gulir, setGulir] = useState(false);

  useEffect(() => {
    const onScroll = () => setGulir(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const aktif = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/*
        Latar, garis, dan blur dipasang di bilah dalam, BUKAN di <header>.
        Sebabnya konkret: backdrop-filter membuat elemen menjadi containing
        block untuk keturunan position: fixed. Bug yang pernah terjadi di
        sini: panel menu seluler memakai `fixed top-16 bottom-0` di dalam
        header ber-blur, sehingga kotaknya dihitung terhadap tinggi header
        (64 px) dan panelnya menjadi setinggi nol. Navigasi seluler sekarang
        memakai bottom nav, dan aturan ini tetap dipegang supaya bug yang
        sama tidak kembali lewat elemen fixed lain.
      */}
      <div
        className={cn(
          "transition-colors duration-500",
          gulir
            ? "border-b border-garis-malam bg-malam/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1760px] items-center gap-3 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label="Sriwijaya Culture">
          <svg viewBox="0 0 28 28" className="h-6 w-6 flex-none" aria-hidden="true">
            <path
              d="M2 17c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
              fill="none"
              stroke="#d9a832"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M2 22c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
              fill="none"
              stroke="#f2efe8"
              strokeOpacity=".35"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M14 4v8M10 7.5l4-3.5 4 3.5" fill="none" stroke="#f2efe8" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="truncate font-display text-[1.0625rem] font-medium tracking-[-0.02em] text-terang">
            Sriwijaya Culture
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:flex lg:flex-1 lg:justify-center">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={aktif(item.href) ? "page" : undefined}
                  className={cn(
                    "group/nav relative block px-3 py-2 text-[0.8125rem] transition-colors",
                    aktif(item.href)
                      ? "nav-aktif text-terang"
                      : "text-terang-2 hover:text-terang",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-px origin-left bg-emas transition-transform duration-500",
                      aktif(item.href)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/nav:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
          <CariCepat indeks={indeks} />

          <Link
            href="/asisten"
            className="flex h-9 items-center gap-2 border border-emas/50 bg-emas/10 px-2.5 text-emas-muda shadow-[0_0_18px_rgba(217,168,50,0.15)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emas hover:bg-emas hover:text-malam hover:shadow-[0_0_28px_rgba(217,168,50,0.3)] sm:px-3.5"
            aria-label="Tanya Asisten Sari"
          >
            <svg viewBox="0 0 18 18" className="h-3.5 w-3.5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M9 2.2 10.5 6.4 14.8 8 10.5 9.6 9 13.8 7.5 9.6 3.2 8 7.5 6.4z" />
            </svg>
            <span className="hidden whitespace-nowrap font-mono text-[0.75rem] uppercase tracking-[0.12em] sm:inline">
              Tanya Sari
            </span>
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}