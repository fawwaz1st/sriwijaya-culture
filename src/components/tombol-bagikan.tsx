"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Tombol bagikan yang memakai Web Share API bila tersedia, dan jatuh
 * ke penyalinan tautan bila tidak. Tidak ada layanan pihak ketiga.
 */
export function TombolBagikan({
  judul,
  url,
  ringkas = false,
  className,
}: {
  judul: string;
  url: string;
  ringkas?: boolean;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "salin" | "gagal">("idle");

  async function klik() {
    const tautan = typeof window !== "undefined" ? window.location.origin + url : url;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: judul, url: tautan });
        setStatus("idle");
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(tautan);
      setStatus("salin");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("gagal");
      window.setTimeout(() => setStatus("idle"), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={klik}
      aria-label="Bagikan tautan halaman ini"
      className={cn(
        "sentuh inline-flex items-center gap-2 border border-garis-malam px-3 py-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-2 transition-colors hover:border-emas hover:text-emas",
        ringkas && "px-2.5 py-1.5",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <circle cx="12" cy="3.5" r="1.6" />
        <circle cx="4" cy="8" r="1.6" />
        <circle cx="12" cy="12.5" r="1.6" />
        <path d="M5.4 7.2 10.6 4.3M5.4 8.8 10.6 11.7" strokeLinecap="round" />
      </svg>
      {status === "salin" ? "Tautan disalin" : status === "gagal" ? "Gagal menyalin" : "Bagikan"}
    </button>
  );
}
