"use client";

import { useEffect, useRef, useState } from "react";

interface DataGempa {
  tanggal: string;
  jam: string;
  waktu: string;
  magnitudo: string;
  kedalaman: string;
  wilayah: string;
  potensi: string;
  koordinat: string;
  shakemap: string | null;
  sumber: string;
}

export function GempaTerkini({ ringkas = false }: { ringkas?: boolean }) {
  const [muat, setMuat] = useState(true);
  const [data, setData] = useState<DataGempa | null>(null);
  const [galat, setGalat] = useState(false);
  const kendali = useRef<AbortController | null>(null);

  const ambil = async () => {
    kendali.current?.abort();
    const c = new AbortController();
    kendali.current = c;
    try {
      const res = await fetch("/api/gempa", { signal: c.signal, cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = (await res.json()) as DataGempa & { error?: string };
      if (json.error) throw new Error(json.error);
      setData(json);
      setGalat(false);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setGalat(true);
    } finally {
      setMuat(false);
    }
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      void ambil();
    });
    const id = window.setInterval(ambil, 5 * 60 * 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
      kendali.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ringkas) {
    if (muat) return <span className="meta denyut">memuat gempa</span>;
    if (galat || !data) return <span className="meta text-terang-3">gempa belum tersedia</span>;
    return (
      <span className="inline-flex min-h-6 items-center gap-1.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-2">
        <span aria-hidden="true">‣</span>
        <span className="tabular">M {data.magnitudo}</span>
        <span className="text-terang-3">·</span>
        <span className="normal-case tracking-normal text-terang-3 truncate max-w-[18ch]">
          {data.wilayah}
        </span>
      </span>
    );
  }

  return (
    <div className="border border-garis-malam bg-malam-2/60 px-3.5 py-2.5" role="status" aria-live="polite">
      <p className="meta-emas">Gempa terkini (BMKG)</p>
      {muat ? (
        <p className="meta mt-1 denyut">memuat dari BMKG</p>
      ) : galat || !data ? (
        <p className="mt-1 text-[0.8125rem] text-terang-3">
          Data gempa belum tersedia. Sumber BMKG tidak bisa diambil sekarang.
        </p>
      ) : (
        <div className="mt-1 space-y-1.5">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tabular font-display text-2xl leading-none text-terang">M {data.magnitudo}</span>
            <span className="text-[0.8125rem] leading-tight text-terang-2">{data.wilayah}</span>
          </p>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
            Kedalaman {data.kedalaman} · {data.tanggal} {data.jam}
          </p>
          <p className="text-[0.8125rem] leading-relaxed text-terang-2">{data.potensi}</p>
          <p className="meta normal-case tracking-normal text-terang-3">
            Sumber: BMKG (data.bmkg.go.id) · koordinat {data.koordinat}
          </p>
        </div>
      )}
    </div>
  );
}
