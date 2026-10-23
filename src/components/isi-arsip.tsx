/**
 * Panel isi arsip pada empty state asisten.
 *
 * Diambil dari data nyata lewat props (server component yang menghitung),
 * bukan angka yang diketik. Tujuannya mengisi ruang kosong di layar
 * tinggi dengan sesuatu yang bisa diklik, sekaligus menunjukkan cakupan
 * arsip sebelum orang mengetik pertanyaan.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface RingkasArsip {
  destinasi: number;
  umkm: number;
  artikel: number;
  peristiwa: number;
  rentangTahun: string;
  contohDestinasi: { id: string; nama: string; kategori: string }[];
  contohArtikel: { id: string; judul: string; kategori: string }[];
  contohUMKM: { id: string; nama: string; kategori: string }[];
}

export function IsiArsip({ r }: { r: RingkasArsip }) {
  const kolom = [
    { label: "Destinasi", angka: r.destinasi, href: "/destinasi", kelas: "text-ok" },
    { label: "Usaha lokal", angka: r.umkm, href: "/umkm", kelas: "text-warn" },
    { label: "Catatan", angka: r.artikel, href: "/artikel", kelas: "text-emas" },
    { label: "Tonggak waktu", angka: r.peristiwa, href: "/artikel", kelas: "text-terang-2" },
  ];

  return (
    <div className="mt-8 border-t border-garis-malam pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="meta">Yang Sari punya</p>
        <p className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-terang-3">
          {r.rentangTahun}
        </p>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {kolom.map((k) => (
          <Link key={k.label} href={k.href} className="group">
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-terang-3 group-hover:text-terang-2">
              {k.label}
            </dt>
            <dd className={cn("tabular mt-1 font-display text-2xl leading-none", k.kelas)}>
              {k.angka}
            </dd>
          </Link>
        ))}
      </dl>

      <ul className="mt-5 space-y-1.5 border-t border-garis-malam pt-4">
        {[...r.contohDestinasi.map((d) => ({ href: `/destinasi/${d.id}`, nama: d.nama, tag: d.kategori })),
          ...r.contohArtikel.map((a) => ({ href: `/artikel/${a.id}`, nama: a.judul, tag: a.kategori })),
          ...r.contohUMKM.map((u) => ({ href: `/umkm/${u.id}`, nama: u.nama, tag: u.kategori }))].map((x) => (
          <li key={x.href}>
            <Link
              href={x.href}
              className="group flex items-baseline justify-between gap-4 py-0.5 text-[0.8125rem] text-terang-2 transition-colors hover:text-emas"
            >
              <span className="truncate">{x.nama}</span>
              <span className="shrink-0 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-terang-3">
                {x.tag}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
