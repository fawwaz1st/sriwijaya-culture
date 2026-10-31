"use client";

import { useMemo } from "react";

/**
 * Batang verifikasi.
 *
 * Menggantikan daftar tiga kartu berteks di halaman metodologi: rasio
 * tiap tingkat dibaca dari panjang batang, bukan dari paragraf. Angka
 * tetap ditulis, tapi yang dibaca lebih dulu adalah bentuk batangnya.
 *
 * Semua nilai datang dari hitungan sumber nyata, bukan angka tetap.
 */
export function BatangVerifikasi({
  tinggi,
  sedang,
  perlu,
}: {
  tinggi: number;
  sedang: number;
  perlu: number;
}) {
  const baris = useMemo(() => {
    const total = Math.max(tinggi + sedang + perlu, 1);
    return [
      { label: "Terverifikasi", n: tinggi, warna: "var(--color-ok)" },
      { label: "Satu sumber", n: sedang, warna: "var(--color-warn)" },
      { label: "Perlu konfirmasi", n: perlu, warna: "var(--color-bahaya)" },
    ].map((x) => ({ ...x, persen: Math.round((x.n / total) * 100) }));
  }, [tinggi, sedang, perlu]);

  return (
    <div className="mt-8 space-y-4">
      {baris.map((b) => (
        <div key={b.label}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[0.8125rem] text-terang-2">{b.label}</p>
            <p className="tabular font-mono text-[0.75rem] text-terang-3">
              {b.n} · {b.persen}%
            </p>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden bg-malam-4">
            <div
              className="h-full transition-[width] duration-700 ease-out"
              style={{ width: Math.max(b.persen, 1) + "%", backgroundColor: b.warna }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
