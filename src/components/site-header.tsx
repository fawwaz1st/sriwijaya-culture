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

/** Ikon sederhana untuk menu seluler. Garis tipis, satu bahasa visual. */
const IKON_NAV: Record<string, string> = {
  "/": "M3 10.5 10 4l7 6.5V16a1 1 0 0 1-1 1h-4v-5H9v5H4a1 1 0 0 1-1-1Z",
  "/destinasi": "M10 17s6-5.2 6-9.2A6 6 0 1 0 4 7.8C4 11.8 10 17 10 17Z",
  "/jelajah": "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.5 4.5-2.2 4.7-4.7 2.2 2.2-4.7 4.7-2.2Z",
  "/umkm": "M4 7h12l-1 10H5L4 7Zm2 0V5a4 4 0 0 1 8 0v2",
  "/artikel": "M4 4h6a2 2 0 0 1 2 2v12a4 4 0 0 0-4-4H4V4Zm12 0h-4a2 2 0 0 0-2 2v12a4 4 0 0 1 4-4h2V4Z",
  "/metodologi": "M9 15a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm4.5-1.5L17 17",
  "/tentang": "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 4v5m0 3h.01",
  "/favorit": "M10 16s-6-3.8-6-7.2A3.2 3.2 0 0 1 10 7a3.2 3.2 0 0 1 6 1.8C16 12.2 10 16 10 16Z",
};

function IkonNav({ href }: { href: string }) {
  const d = IKON_NAV[href];
  if (!d) return null;
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader({ indeks }: { indeks: readonly ItemCari[] }) {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);
  const [gulir, setGulir] = useState(false);

  useEffect(() => {
    const onScroll = () => setGulir(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!buka) return;
    const asal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = asal;
      window.removeEventListener("keydown", onKey);
    };
  }, [buka]);

  const aktif = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        gulir || buka
          ? "border-b border-garis-malam bg-malam/90 backdrop-blur-md"
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

          <button
            type="button"
            onClick={() => setBuka((v) => !v)}
            aria-expanded={buka}
            aria-controls="menu-mobile"
            aria-label={buka ? "Tutup menu" : "Buka menu"}
            className="grid h-9 w-9 place-items-center border border-malam-5 text-terang transition-colors hover:border-terang-3 lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              {buka ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      {buka && (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-malam lg:hidden"
        >
          <nav aria-label="Navigasi seluler" className="px-5 py-8">
            <ul>
              {[{ href: "/", label: "Beranda" }, ...NAV].map((item) => (
                <li key={item.href} className="border-b border-garis-malam">
                  <Link
                    href={item.href}
                    onClick={() => setBuka(false)}
                    aria-current={aktif(item.href) ? "page" : undefined}
                    className="flex items-center gap-4 py-4"
                  >
                    <span
                      className={cn(
                        "flex items-center gap-4",
                        aktif(item.href) ? "text-emas" : "text-terang",
                      )}
                    >
                      <IkonNav href={item.href} />
                      <span className="font-display text-[1.75rem] leading-none">{item.label}</span>
                    </span>
                    {aktif(item.href) && (
                      <span className="h-1.5 w-1.5 flex-none rounded-full bg-emas" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/asisten"
              onClick={() => setBuka(false)}
              className="mt-8 flex items-center justify-between border border-emas/40 px-4 py-3 text-emas"
            >
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em]">Tanya Asisten Sari</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}