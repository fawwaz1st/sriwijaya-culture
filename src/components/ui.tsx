import Link from "next/link";
import { cn } from "@/lib/cn";
import { labelVerifikasi } from "@/lib/format";

/* ============================================================================
   Kepingan antarmuka.
   Semua tanpa state, jadi bisa dirender di server.
   ========================================================================== */

/**
 * Kepala bagian.
 *
 * Tidak memakai eyebrow bernomor di setiap bagian. Kalau sebuah bagian
 * memang bagian dari urutan, `nomor` diisi. Kalau tidak, biarkan kosong
 * dan judulnya berdiri sendiri.
 */
export function KepalaBagian({
  judul,
  keterangan,
  aksi,
  nomor,
  terang = true,
}: {
  judul: string;
  keterangan?: string;
  aksi?: React.ReactNode;
  nomor?: string;
  terang?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="min-w-0">
        {nomor && (
          <p className={cn("meta mb-2", terang ? "text-emas" : "text-emas-tinta")}>{nomor}</p>
        )}
        <h2
          className={cn(
            "display max-w-[22ch] text-[clamp(1.9rem,4.2vw,3.5rem)]",
            terang ? "text-terang" : "text-gelap",
          )}
        >
          {judul}
        </h2>
        {keterangan && (
          <p
            className={cn(
              "mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed",
              terang ? "text-terang-2" : "text-gelap-2",
            )}
          >
            {keterangan}
          </p>
        )}
      </div>
      {aksi && <div className="shrink-0">{aksi}</div>}
    </div>
  );
}

/** Tombol. Dua varian di latar gelap, dua di latar kertas. */
export function Tombol({
  href,
  children,
  varian = "terang",
  className,
  panah = false,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  varian?: "terang" | "garis" | "gelap" | "garis-gelap";
  className?: string;
  panah?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const dasar =
    "group inline-flex min-h-11 items-center justify-center gap-2 px-5 py-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-300";
  const gaya = {
    terang:
      "bg-terang text-malam shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 hover:bg-emas",
    garis:
      "border border-terang/30 text-terang hover:-translate-y-0.5 hover:border-terang/70 hover:bg-terang/5",
    gelap:
      "bg-gelap text-kertas shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:bg-emas-tinta",
    "garis-gelap":
      "border border-gelap/25 text-gelap hover:-translate-y-0.5 hover:border-gelap/60 hover:bg-gelap/5",
  }[varian];

  return (
    <Link href={href} className={cn(dasar, gaya, className)} {...rest}>
      {children}
      {panah && (
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      )}
    </Link>
  );
}

/** Badge status verifikasi. */
export function BadgeVerifikasi({ tingkat }: { tingkat: string }) {
  const warna =
    tingkat === "tinggi"
      ? "text-ok status-ok"
      : tingkat === "sedang"
        ? "text-warn status-warn"
        : "text-bahaya status-bahaya";
  return <span className={cn("status", warna)}>{labelVerifikasi(tingkat)}</span>;
}

/** Angka besar dengan label, untuk pita statistik. */
export function Angka({
  nilai,
  label,
  satuan,
  terang = true,
}: {
  nilai: string | number;
  label: string;
  satuan?: string;
  terang?: boolean;
}) {
  return (
    <div>
      <p className={cn("meta", terang ? "text-terang-3" : "text-gelap-3")}>{label}</p>
      <p
        className={cn(
          "tabular mt-1 flex items-baseline gap-1 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none",
          terang ? "text-terang" : "text-gelap",
        )}
      >
        {nilai}
        {satuan && <span className="font-mono text-[0.75rem] tracking-normal opacity-60">{satuan}</span>}
      </p>
    </div>
  );
}

/** Baris metadata: kunci kiri, nilai kanan, garis rambut. */
export function BarisMeta({
  k,
  v,
  mono = false,
  terang = false,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
  terang?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0",
        terang ? "border-garis-malam" : "border-garis-kertas",
      )}
    >
      <dt className={cn("meta shrink-0", terang ? "text-terang-3" : "text-gelap-3")}>{k}</dt>
      <dd
        className={cn(
          "text-right text-[0.8125rem]",
          terang ? "text-terang" : "text-gelap",
          mono && "tabular font-mono text-xs",
        )}
      >
        {v}
      </dd>
    </div>
  );
}

/**
 * Catatan ketidakpastian. Elemen inti produk: arsip yang jujur harus
 * punya tempat untuk mengatakan "kami belum tahu".
 */
export function CatatanPasti({
  judul = "Belum terverifikasi",
  children,
}: {
  judul?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="border border-warn/35 bg-warn/8 p-4">
      <p className="status text-warn">{judul}</p>
      <div className="mt-2 text-[0.8125rem] leading-relaxed text-terang-2">{children}</div>
    </aside>
  );
}

/** Keadaan kosong: selalu menjelaskan kenapa dan apa langkah berikutnya. */
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
    <div className="border border-garis-malam px-6 py-12">
      <p className="meta">Hasil kosong</p>
      <p className="mt-2 font-display text-xl text-terang">{judul}</p>
      <p className="mt-2 max-w-[48ch] text-[0.8125rem] leading-relaxed text-terang-2">{pesan}</p>
      {aksi && <div className="mt-5">{aksi}</div>}
    </div>
  );
}
