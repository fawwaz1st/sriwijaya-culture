"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  daftarFavorit,
  hapusFavorit,
  langgananFavorit,
  type EntitasFavorit,
} from "@/lib/favorit";

/**
 * Panel favorit.
 *
 * Favorit disimpan di peramban pengunjung. Halaman ini hanya membaca
 * simpanan itu dan menautkannya ke rekaman arsip yang nyata. Kalau
 * sebuah entri arsip dihapus, tautannya tetap hidup (404 jujur) daripada
 * menampilkan data palsu.
 */
const KOSONG: readonly EntitasFavorit[] = [];

export function PanelFavorit() {
  const daftar = useSyncExternalStore(
    langgananFavorit,
    daftarFavorit,
    () => KOSONG,
  );

  if (daftar.length === 0) {
    return (
      <div className="mt-8 border border-garis-malam px-6 py-12">
        <p className="meta">Hasil kosong</p>
        <p className="mt-2 font-display text-xl text-terang">Belum ada yang disimpan.</p>
        <p className="mt-2 max-w-[48ch] text-[0.8125rem] leading-relaxed text-terang-2">
          Tandai destinasi, catatan, atau usaha dengan ikon hati. Daftarnya
          tersimpan di perangkat ini, tanpa akun dan tanpa server.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/destinasi" className="inline-flex min-h-9 items-center border border-garis-malam px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2 hover:border-terang">
            Buka destinasi
          </Link>
          <Link href="/artikel" className="inline-flex min-h-9 items-center border border-garis-malam px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2 hover:border-terang">
            Buka catatan
          </Link>
          <Link href="/umkm" className="inline-flex min-h-9 items-center border border-garis-malam px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-terang-2 hover:border-terang">
            Buka usaha
          </Link>
        </div>
      </div>
    );
  }

  const kelompok: Record<string, { nama: string; href: string }[]> = {
    destinasi: [],
    artikel: [],
    usaha: [],
  };
  for (const f of daftar) {
    if (!kelompok[f.jenis]) kelompok[f.jenis] = [];
    kelompok[f.jenis].push({ nama: f.nama, href: f.href });
  }

  const label: Record<string, string> = {
    destinasi: "Destinasi",
    artikel: "Catatan",
    usaha: "Usaha lokal",
  };

  return (
    <div className="mt-8 space-y-8">
      {Object.entries(kelompok).map(([jenis, items]) => {
        if (!items.length) return null;
        return (
          <section key={jenis}>
            <p className="meta-emas">{label[jenis] ?? jenis}</p>
            <ul className="mt-3 border-t border-garis-malam">
              {items.map((it) => {
                const f = daftar.find((x) => x.href === it.href && x.jenis === jenis);
                if (!f) return null;
                return (
                  <li key={f.id + f.jenis} className="border-b border-garis-malam">
                    <div className="flex items-center gap-3 py-3">
                      <Link href={it.href} className="min-w-0 flex-1 text-[0.875rem] text-terang hover:text-emas">
                        <span className="truncate">{it.nama}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => hapusFavorit(f.id, f.jenis)}
                        aria-label="Hapus dari favorit"
                        className="sentuh grid h-8 w-8 place-items-center text-terang-3 hover:text-bahaya"
                      >
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                          <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className="text-[0.75rem] leading-relaxed text-terang-3">
        Daftar ini hanya ada di peramban ini. Menghapus data situs atau
        membuka di perangkat lain akan mengosongkannya.
      </p>
    </div>
  );
}
