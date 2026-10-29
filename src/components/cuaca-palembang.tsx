"use client";

import { useEffect, useRef, useState } from "react";
import { ringkasanKode, type RingkasanCuaca } from "@/lib/cuaca";

/**
 * Cuaca Palembang saat ini, dari Open-Meteo.
 *
 * Data nyata, tanpa kunci API (Open-Meteo bebas untuk penggunaan
 * komersial ringan). Dipanggil lewat rute internal supaya tidak ada
 * kunci atau endpoint pihak ketiga yang terbuka di peramban. Dimuat
 * ulang setiap sepuluh menit. Kalau jaringan gagal, tampil pesan
 * jujur, bukan angka perkiraan.
 */

interface DataCuaca {
  temperatur: number;
  kelembapan: number;
  angin: number;
  kode: number;
  diperbarui: string;
}

const URL = "/api/cuaca";
const SEPULUH_MENIT = 10 * 60 * 1000;

export function CuacaPalembang({ ringkas = false }: { ringkas?: boolean }) {
  const [muat, setMuat] = useState(true);
  const [data, setData] = useState<DataCuaca | null>(null);
  const [galat, setGalat] = useState(false);
  const kendali = useRef<AbortController | null>(null);

  const ambil = async () => {
    kendali.current?.abort();
    const c = new AbortController();
    kendali.current = c;
    try {
      const res = await fetch(URL, { signal: c.signal, cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = (await res.json()) as DataCuaca & { error?: string };
      if (json.error) throw new Error(json.error);
      setData({
        temperatur: json.temperatur,
        kelembapan: json.kelembapan,
        angin: json.angin,
        kode: json.kode,
        diperbarui: json.diperbarui,
      });
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
    const id = window.setInterval(ambil, SEPULUH_MENIT);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
      kendali.current?.abort();
    };
    // ambil bersifat stabil dalam komponen ini (tanpa dependensi state)
  }, []);

  const r: RingkasanCuaca | null = data ? ringkasanKode(data.kode) : null;
  const jam = data ? data.diperbarui.slice(11, 16) : "";

  if (ringkas) {
    return (
      <span
        className="inline-flex min-h-6 items-center gap-1.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-2"
        aria-live="polite"
      >
        {muat ? (
          <span className="denyut">memuat cuaca</span>
        ) : galat ? (
          <span className="text-terang-3">cuaca belum tersedia</span>
        ) : data && r ? (
          <>
            <span aria-hidden="true">{r.ikon}</span>
            <span className="tabular">{Math.round(data.temperatur)}°C</span>
            <span className="text-terang-3">·</span>
            <span className="normal-case tracking-normal text-terang-3">{r.teks}</span>
          </>
        ) : null}
      </span>
    );
  }

  return (
    <div
      className="border border-garis-malam bg-malam-2/60 px-3.5 py-2.5"
      role="status"
      aria-live="polite"
    >
      <p className="meta-emas">Cuaca Palembang saat ini</p>
      {muat ? (
        <p className="meta mt-1 denyut">memuat dari Open-Meteo</p>
      ) : galat || !data || !r ? (
        <p className="mt-1 text-[0.8125rem] text-terang-3">
          Cuaca belum tersedia. Data live dari Open-Meteo tidak bisa diambil sekarang.
        </p>
      ) : (
        <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-1">
          <p className="flex items-baseline gap-1.5">
            <span aria-hidden="true" className="text-lg leading-none">{r.ikon}</span>
            <span className="tabular font-display text-2xl leading-none text-terang">{Math.round(data.temperatur)}°</span>
            <span className="text-[0.75rem] text-terang-3">C</span>
          </p>
          <p className="text-[0.8125rem] leading-tight text-terang-2">{r.teks}</p>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
            Lembap {data.kelembapan}% · Angin {Math.round(data.angin)} km/j
          </p>
          <p className="meta normal-case tracking-normal text-terang-3">
            Sumber: Open-Meteo · diperbarui {jam} WIB
          </p>
        </div>
      )}
    </div>
  );
}