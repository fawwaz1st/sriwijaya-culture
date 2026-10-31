"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Navigasi bawah untuk layar kecil.
 *
 * Pola ini dipilih setelah riset 2026 (Dribbble, Mobbin, Apple HIG,
 * Material 3): untuk lima tujuan atau kurang, tab bar bawah lebih cepat
 * dijangkau ibu jari daripada drawer, dan selalu menunjukkan di mana
 * pengguna berada tanpa membuka apa pun.
 *
 * Aturan yang dipegang:
 * - Lima item saja. Lebih dari itu, tab bar berubah jadi teka-teki.
 * - Label selalu terlihat, bukan hanya ikon.
 * - Item aktif memakai pil + warna, bukan hanya garis tipis.
 * - Tinggi aman untuk iPhone: memakai env(safe-area-inset-bottom).
 * - Tombol Cari dan Asisten tetap di header, tidak di sini, supaya
 *   tidak ada dua akses yang sama di dua tempat.
 */
const ITEM = [
  { href: "/", label: "Beranda", ikon: "M3 10.5 10 4l7 6.5V16a1 1 0 0 1-1 1h-4v-5H9v5H4a1 1 0 0 1-1-1Z" },
  { href: "/destinasi", label: "Destinasi", ikon: "M10 17s6-5.2 6-9.2A6 6 0 1 0 4 7.8C4 11.8 10 17 10 17Z" },
  { href: "/jelajah", label: "Jelajah", ikon: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm3.5 4.5-2.2 4.7-4.7 2.2 2.2-4.7 4.7-2.2Z" },
  { href: "/umkm", label: "Usaha", ikon: "M4 7h12l-1 10H5L4 7Zm2 0V5a4 4 0 0 1 8 0v2" },
  { href: "/asisten", label: "Sari", ikon: "M9 2.2 10.5 6.4 14.8 8 10.5 9.6 9 13.8 7.5 9.6 3.2 8 7.5 6.4z" },
] as const;

export function NavBawah() {
  const path = usePathname();
  const aktif = (href: string) =>
    href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

  return (
    <nav
      aria-label="Navigasi utama bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-garis-malam bg-malam/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[640px] items-stretch">
        {ITEM.map((x) => {
          const on = aktif(x.href);
          return (
            <li key={x.href} className="flex-1">
              <Link
                href={x.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                  on ? "text-emas" : "text-terang-2",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors duration-300",
                    on && "bg-emas/15",
                  )}
                >
                  <svg viewBox="0 0 20 20" className="h-[1.125rem] w-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d={x.ikon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em]">{x.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
