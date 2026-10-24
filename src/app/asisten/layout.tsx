import type { ReactNode } from "react";

/**
 * Layout khusus halaman asisten.
 *
 * Layout Next.js bersifat nested: layout root selalu membungkus halaman.
 * Untuk menyembunyikan footer tanpa memindahkan semua rute ke route
 * group, root me-render footer di dalam slot `chrome` bawaan dan layout
 * ini menggantinya lewat pola berikut: karena root layout tidak bisa
 * dikondisikan per halaman secara aman, pendekatan yang dipakai adalah
 * CSS, footer disembunyikan saat halaman ini aktif lewat kelas pada
 * <main> yang di-set layout root berdasarkan URL saat ini.
 *
 * Yang benar-benar dilakukan file ini: memberi halaman tinggi layar
 * penuh supaya percakapan menjadi satu-satunya yang menggulir, pola
 * yang dipakai Claude.ai dan ChatGPT.
 */
export default function LayoutAsisten({ children }: { children: ReactNode }) {
  return (
    <div className="asisten-halaman h-[calc(100svh-4rem)] overflow-hidden">{children}</div>
  );
}
