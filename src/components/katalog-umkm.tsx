"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { cn } from "@/lib/cn";
import type { KategoriUMKM, UMKM } from "@/lib/types";

/**
 * Direktori UMKM dengan penyaringan di klien.
 *
 * Aturan yang dipegang: nama usaha dan jenis produk boleh tampil karena
 * terdokumentasi di sumber publik, tetapi alamat, telepon, dan akun
 * sosial tidak ditampilkan sampai diverifikasi. Karena itu setiap kartu
 * membawa status datanya, bukan hanya nama.
 */
export function KatalogUMKM({
  daftar,
  kategori,
  varian,
}: {
  daftar: readonly UMKM[];
  kategori: readonly KategoriUMKM[];
  varian: readonly string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const aktif = params.get("kategori") ?? "";
  const [kueri, setKueri] = useState("");

  const hasil = useMemo(() => {
    let h = [...daftar];
    if (aktif) h = h.filter((u) => u.kategori === aktif);
    const q = kueri.trim().toLowerCase();
    if (q) {
      const kata = q.split(/\s+/);
      h = h.filter((u) => {
        const teks = [u.nama, u.ringkas, u.wilayah, u.kategori].join(" ").toLowerCase();
        return kata.every((k) => teks.includes(k));
      });
    }
    return h;
  }, [daftar, aktif, kueri]);

  const jumlahProduk = daftar.reduce((n, u) => n + u.produk.length, 0);

  function pilih(k: string) {
    const next = new URLSearchParams(params.toString());
    if (!k || k === aktif) next.delete("kategori");
    else next.set("kategori", k);
    router.replace(next.toString() ? `/umkm?${next}` : "/umkm", { scroll: false });
  }

  return (
    <>
      <div className="mt-8 border-y border-garis">
        <ul className="flex flex-wrap items-stretch">
          <li>
            <button
              type="button"
              onClick={() => pilih("")}
              aria-pressed={!aktif}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors",
                !aktif ? "bg-hijau-900 text-kertas" : "text-tinta-2 hover:bg-kertas-2",
              )}
            >
              Semua
              <span className={cn("tabular", !aktif ? "text-kunyit-muda" : "text-tinta-3")}>
                {daftar.length}
              </span>
            </button>
          </li>
          {kategori.map((k) => {
            const n = daftar.filter((u) => u.kategori === k).length;
            if (!n) return null;
            const on = aktif === k;
            return (
              <li key={k} className="border-l border-garis">
                <button
                  type="button"
                  onClick={() => pilih(k)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] transition-colors",
                    on ? "bg-hijau-900 text-kertas" : "text-tinta-2 hover:bg-kertas-2",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 flex-none"
                    style={{ background: warnaKategori(k) }}
                  />
                  {k}
                  <span className={cn("tabular", on ? "text-kunyit-muda" : "text-tinta-3")}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="label-arsip">
          <span className="tabular text-tinta">{daftar.length}</span> entri ·{" "}
          <span className="tabular text-tinta">{jumlahProduk}</span> produk tercatat
        </p>
        <label className="flex items-center gap-2">
          <span className="sr-only">Cari usaha</span>
          <input
            type="search"
            value={kueri}
            onChange={(e) => setKueri(e.target.value.slice(0, 80))}
            placeholder="Cari nama atau wilayah"
            className="w-52 border border-garis-3 bg-kertas px-2 py-1 text-[0.8125rem] text-tinta placeholder:text-tinta-4 focus:border-hijau-700 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="label-arsip mr-1">Varian pempek</span>
        {varian.map((v) => (
          <span
            key={v}
            className="border border-garis px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-2"
          >
            {v}
          </span>
        ))}
      </div>

      {hasil.length === 0 ? (
        <div className="mt-4">
          <KeadaanKosong
            judul="Belum ada usaha yang cocok"
            pesan="Direktori ini hanya memuat usaha yang punya rujukan publik. Coba hapus kata kunci atau pilih kategori lain."
            aksi={
              <Tombol
                href="/umkm"
                varian="garis"
                panah
                onClick={(e) => {
                  e.preventDefault();
                  setKueri("");
                  pilih("");
                }}
              >
                Tampilkan semua
              </Tombol>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-0 border border-garis md:grid-cols-2">
          {hasil.map((u, i) => {
            const terverifikasi = u.statusData === "rujukan-umum";
            return (
              <li
                key={u.id}
                className="border-b border-garis md:border-r md:[&:nth-child(2n)]:border-r-0"
              >
                <Link href={`/umkm/${u.id}`} className="group flex h-full flex-col sm:flex-row">
                  <div className="relative aspect-4/3 flex-none overflow-hidden bg-kertas-3 sm:aspect-auto sm:w-40">
                    <Image
                      src={u.gambar[0].src}
                      alt={u.gambar[0].caption}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="label-arsip text-[0.5625rem]">
                        <span className="tabular mr-1.5 text-kunyit-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {u.kategori}
                      </p>
                      <span className={cn("status flex-none", terverifikasi ? "text-ok" : "text-warn")}>
                        {terverifikasi ? "Rujukan umum" : "Demonstrasi"}
                      </span>
                    </div>
                    <p className="mt-1.5 font-display text-xl leading-tight text-tinta group-hover:text-hijau-700">
                      {u.nama}
                    </p>
                    <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                      {u.wilayah}
                    </p>
                    <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-tinta-2">
                      {u.ringkas}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-garis-2 pt-2">
                      <span className="tabular font-mono text-[0.5625rem] text-tinta-3">
                        {u.produk.length} produk
                      </span>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-hijau-700">
                        Lihat profil →
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
