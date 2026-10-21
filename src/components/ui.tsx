import Link from "next/link";
import { cn } from "@/lib/cn";
import { labelVerifikasi } from "@/lib/format";

/* ============================================================================
   Kepingan antarmuka yang dipakai berulang.

   Semua di sini sengaja tanpa state supaya bisa dirender di server.
   Kalau sebuah komponen butuh state, komponen itu punya berkas sendiri
   dengan "use client" di atasnya.
   ========================================================================== */

/**
 * Judul bagian.
 *
 * Bukan eyebrow kecil di atas judul. Nomor diletakkan besar di kolom
 * kiri dan berfungsi sebagai nomor halaman arsip, dengan judul
 * mengalir di sebelahnya. Jadi nomor itu membawa informasi posisi,
 * bukan hiasan yang bisa ditempel di bagian mana pun.
 *
 * `kode` dipakai sebagai penanda nyata: ia muncul di navigasi dan di
 * daftar isi, sehingga angkanya konsisten di seluruh situs.
 */
export function JudulBagian({
  nomor,
  judul,
  keterangan,
  aksi,
  terang = false,
}: {
  nomor: string;
  judul: string;
  keterangan?: string;
  aksi?: React.ReactNode;
  terang?: boolean;
}) {
  return (
    <div className={cn("border-t pt-5", terang ? "border-kertas/25" : "border-tinta")}>
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4 sm:flex-nowrap">
        {/* Nomor halaman arsip: besar, tabular, rata garis atas. */}
        <p
          aria-hidden="true"
          className={cn(
            "tabular flex-none font-mono text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-none tracking-[-0.04em]",
            terang ? "text-kertas/25" : "text-kertas-4",
          )}
        >
          {nomor}
        </p>

        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              "judul-arsip text-[clamp(1.6rem,3vw,2.4rem)]",
              terang ? "text-kertas" : "text-tinta",
            )}
          >
            {judul}
          </h2>
          {keterangan && (
            <p
              className={cn(
                "mt-2 max-w-[62ch] text-sm leading-relaxed",
                terang ? "text-kertas/60" : "text-tinta-2",
              )}
            >
              {keterangan}
            </p>
          )}
        </div>

        {aksi && <div className="flex-none self-end sm:self-start">{aksi}</div>}
      </div>
    </div>
  );
}

/** Tombol. Tiga varian saja, supaya hierarki tetap terbaca. */
export function Tombol({
  href,
  children,
  varian = "utama",
  className,
  panah = false,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  varian?: "utama" | "garis" | "teks";
  className?: string;
  panah?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const dasar =
    "group inline-flex items-center justify-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-colors duration-200";
  const gaya = {
    utama: "bg-hijau-900 px-4 py-2.5 text-kertas hover:bg-hijau-700 border border-hijau-900",
    garis: "border border-garis-3 px-4 py-2.5 text-tinta hover:border-hijau-800 hover:bg-kertas-2",
    teks: "text-hijau-800 hover:text-hijau-600 underline-offset-4 hover:underline",
  }[varian];

  return (
    <Link href={href} className={cn(dasar, gaya, className)} {...rest}>
      {children}
      {panah && (
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      )}
    </Link>
  );
}

/** Badge status verifikasi. Warna mengikuti tingkat keyakinan sumber. */
export function BadgeVerifikasi({ tingkat }: { tingkat: string }) {
  const warna =
    tingkat === "tinggi"
      ? "text-ok"
      : tingkat === "sedang"
        ? "text-warn"
        : "text-bahaya";
  return <span className={cn("status", warna)}>{labelVerifikasi(tingkat)}</span>;
}

/**
 * Angka besar dengan label. Dipakai di beranda dan metodologi.
 * Angka selalu berasal dari data, tidak pernah ditulis manual di JSX.
 */
export function AngkaBesar({
  nilai,
  label,
  satuan,
  catatan,
}: {
  nilai: string | number;
  label: string;
  satuan?: string;
  catatan?: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-2 border-l border-garis-3 pl-3">
      <p className="label-arsip">{label}</p>
      <p className="tabular flex items-baseline gap-1 font-display text-[clamp(2rem,3.6vw,2.9rem)] font-semibold leading-none tracking-[-0.03em] text-tinta">
        {nilai}
        {satuan && (
          <span className="font-mono text-[0.6875rem] font-normal tracking-normal text-tinta-3">
            {satuan}
          </span>
        )}
      </p>
      {catatan && <p className="text-[0.6875rem] leading-snug text-tinta-3">{catatan}</p>}
    </div>
  );
}

/** Baris metadata: kunci di kiri, nilai di kanan, garis rambut. */
export function BarisMeta({
  k,
  v,
  mono = false,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-garis-2 py-2 last:border-b-0">
      <dt className="label-arsip flex-none text-[0.625rem]">{k}</dt>
      <dd className={cn("text-right text-[0.8125rem] text-tinta", mono && "tabular font-mono text-xs")}>
        {v}
      </dd>
    </div>
  );
}

/**
 * Kotak catatan untuk hal yang belum pasti.
 *
 * Ini elemen inti produk, bukan komponen pelengkap: arsip yang jujur
 * harus punya tempat untuk mengatakan "kami belum tahu".
 */
export function CatatanBelumPasti({
  judul = "Belum terverifikasi",
  children,
}: {
  judul?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="border border-warn/40 bg-[#fbf4e2] p-3">
      <p className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-warn">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="8" cy="8" r="6.4" />
          <path d="M8 4.6v4.2M8 11.2v.6" strokeLinecap="round" />
        </svg>
        {judul}
      </p>
      <div className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta-2">{children}</div>
    </aside>
  );
}

/** Keadaan kosong: selalu menjelaskan kenapa kosong dan apa langkah berikutnya. */
export function KeadaanKosong({
  judul,
  pesan,
  aksi,
}: {
  judul: string;
  pesan: string;
  aksi?: React.ReactNode;
}) {
  return (
    <div className="tekstur-silang flex flex-col items-start gap-3 border border-garis px-5 py-10">
      <p className="label-arsip">Hasil kosong</p>
      <p className="font-display text-xl text-tinta">{judul}</p>
      <p className="max-w-[48ch] text-sm text-tinta-2">{pesan}</p>
      {aksi}
    </div>
  );
}

/** Pemecah halaman bernomor, gaya daftar isi cetak. */
export function PenandaBagian({ nomor, teks }: { nomor: string; teks: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="tabular font-mono text-[0.625rem] text-kunyit-ink">{nomor}</span>
      <span className="h-px flex-1 bg-garis" aria-hidden="true" />
      <span className="label-arsip text-[0.5625rem]">{teks}</span>
    </div>
  );
}
