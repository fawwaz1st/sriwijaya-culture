"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import {
  adalahFavorit,
  langgananFavorit,
  toggleFavorit,
  type EntitasFavorit,
} from "@/lib/favorit";

/**
 * Tombol simpan (favorit) yang bekerja sepenuhnya di peramban.
 *
 * Tidak ada server, tidak ada akun, tidak ada data palsu. Tandanya
 * hanya mengingat pilihan pengunjung di perangkat ini. State dibaca
 * dari penyimpanan lokal lewat useSyncExternalStore supaya beberapa
 * komponen saling sinkron tanpa useEffect yang memicu render berantai.
 */
export function TombolSimpan({
  id,
  jenis,
  nama,
  href,
  ringkas = false,
  lat = "malam",
  className,
}: {
  id: string;
  jenis: EntitasFavorit["jenis"];
  nama: string;
  href: string;
  ringkas?: boolean;
  lat?: "malam" | "kertas";
  className?: string;
}) {
  const tersimpan = useSyncExternalStore(
    langgananFavorit,
    () => adalahFavorit(id, jenis),
    () => false,
  );

  function klik(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorit({ id, jenis, nama, href });
  }

  return (
    <button
      type="button"
      onClick={klik}
      aria-pressed={tersimpan}
      aria-label={tersimpan ? "Hapus dari favorit" : "Simpan ke favorit"}
      className={cn(
        "sentuh grid place-items-center transition-colors",
        ringkas ? "h-8 w-8" : "h-9 w-9",
        lat === "kertas"
          ? "border-garis-kertas text-gelap-2 hover:border-gelap hover:text-gelap"
          : "border-garis-malam text-terang-2 hover:border-emas hover:text-emas",
        tersimpan && (lat === "kertas" ? "border-emas-tinta bg-emas-tinta/10 text-emas-tinta" : "border-emas bg-emas/10 text-emas"),
        className,
      )}
      title={tersimpan ? "Tersimpan" : "Simpan"}
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill={tersimpan ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M8 14.2 2.6 9a3.3 3.3 0 0 1 4.7-4.7L8 5l.7-.7a3.3 3.3 0 1 1 4.7 4.7L8 14.2Z" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{tersimpan ? "tersimpan" : "simpan"}</span>
    </button>
  );
}