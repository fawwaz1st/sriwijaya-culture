"use client";

import { useState } from "react";

/**
 * Jarak dari posisi pengunjung ke destinasi.
 *
 * Peramban meminta izin lokasi. Kalau ditolak, tidak ada angka palsu:
 * tampil pesan bahwa lokasi tidak tersedia. Jarak dihitung dengan
 * rumus haversine (bola bumi), lalu estimasi waktu tempuh kasar
 * ditampilkan sebagai perkiraan, bukan janji.
 */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function JarakDariSaya({ lat, lng }: { lat: number; lng: number }) {
  const [status, setStatus] = useState<"idle" | "muat" | "ok" | "tolak" | "gagal">("idle");
  const [jarak, setJarak] = useState<number | null>(null);

  function hitung() {
    if (!navigator.geolocation) {
      setStatus("gagal");
      return;
    }
    setStatus("muat");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setJarak(haversine(pos.coords.latitude, pos.coords.longitude, lat, lng));
        setStatus("ok");
      },
      () => setStatus("tolak"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  const jalan = jarak !== null ? Math.max(1, Math.round((jarak / 5) * 60)) : null;
  const mobil = jarak !== null ? Math.max(1, Math.round((jarak / 30) * 60)) : null;

  return (
    <div className="border border-garis-kertas bg-kertas-2 p-3">
      <p className="meta-emas">Jarak dari Anda</p>
      {status === "idle" && (
        <button
          type="button"
          onClick={hitung}
          className="sentuh mt-2 inline-flex min-h-8 items-center gap-2 border border-garis-kertas px-3 py-1.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-gelap-2 hover:border-gelap hover:text-gelap"
        >
          Hitung jarak
        </button>
      )}
      {status === "muat" && <p className="meta mt-2 denyut">mencari posisi</p>}
      {status === "tolak" && (
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-gelap-2">
          Izin lokasi ditolak. Jarak tidak bisa dihitung tanpa posisi Anda.
        </p>
      )}
      {status === "gagal" && (
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-gelap-2">
          Peramban ini tidak mendukung geolokasi.
        </p>
      )}
      {status === "ok" && jarak !== null && (
        <div className="mt-2 space-y-1">
          <p className="tabular font-display text-2xl leading-none text-gelap">
            {jarak < 1 ? Math.round(jarak * 1000) + " m" : jarak.toFixed(1) + " km"}
          </p>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-gelap-3">
            Jalan kaki ~{jalan} menit · Mobil ~{mobil} menit
          </p>
          <p className="text-[0.75rem] leading-snug text-gelap-3">
            Perkiraan kasar dari garis lurus, bukan rute jalan.
          </p>
        </div>
      )}
    </div>
  );
}