"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Foto } from "@/components/foto";
import { KeadaanKosong, Tombol } from "@/components/ui";
import { warnaKategori } from "@/lib/warna";
import { cn } from "@/lib/cn";
import type { KategoriUMKM, UMKM } from "@/lib/types";

/**
 * Direktori usaha.
 *
 * Nama usaha boleh tampil karena terdokumentasi publik. Alamat, telepon,
 * dan akun sosial tidak ditampilkan sampai diverifikasi. Status data
 * selalu terlihat, bukan disembunyikan di halaman detail.
 */
export function KatalogUMKM({
  daftar,
  kategori,
}: {
  daftar: readonly UMKM[];
  kategori: readonly KategoriUMKM[];
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
        const t = [u.nama, u.ringkas, u.wilayah, u.kategori].join(" ").toLowerCase();
        return kata.every((k) => t.includes(k));
      });
    }
    return h;
  }, [daftar, aktif, kueri]);

  function pilih(k: string) {
    const next = new URLSearchParams(params.toString());
    if (!k || k === aktif) next.delete("kategori");
    else next.set("kategori", k);
    router.replace(next.toString() ? `/umkm?${next}` : "/umkm", { scroll: false });
  }

  const jumlahProduk = daftar
    .filter((u) => u.statusData === "rujukan-umum")
    .reduce((n, u) => n + u.produk.length, 0);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-2 border-y border-garis-malam py-2.5">
        <button
          type="button"
          onClick={() => pilih("")}
          aria-pressed={!aktif}
          className={cn(
            "px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
            !aktif ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
          )}
        >
          Semua <span className="tabular opacity-60">{daftar.length}</span>
        </button>
        {kategori.map((k) => {
          const n = daftar.filter((u) => u.kategori === k).length;
          if (!n) return null;
          const on = aktif === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => pilih(k)}
              aria-pressed={on}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                on ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
              )}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: warnaKategori(k) }} />
              {k} <span className="tabular opacity-60">{n}</span>
            </button>
          );
        })}

        <label className="ml-auto flex items-center gap-2">
          <span className="sr-only">Cari usaha</span>
          <input
            type="search"
            value={kueri}
            onChange={(e) => setKueri(e.target.value.slice(0, 80))}
            placeholder="Cari nama atau wilayah"
            className="w-44 border border-malam-5 bg-transparent px-2.5 py-1.5 text-[0.8125rem] text-terang placeholder:text-terang-3 focus:border-emas focus:outline-none sm:w-56"
          />
        </label>
      </div>

      <p className="meta mt-4">
        <span className="tabular text-terang">{hasil.length}</span> usaha ·{" "}
        <span className="tabular text-terang">{jumlahProduk}</span> produk
        pada hasil ini
      </p>

      {hasil.length === 0 ? (
        <div className="mt-8">
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
        <ul className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((u) => {
            const terverifikasi = u.statusData === "rujukan-umum";
            return (
              <li key={u.id} className="h-full">
                {/* flex-col + mt-auto: kartu mengisi tinggi baris dan
                    baris meta (wilayah · produk) menempel di dasar, jadi
                    tiga kartu dalam satu baris punya kaki yang sejajar
                    walau panjang ringkasannya berbeda. */}
                <Link href={`/umkm/${u.id}`} className="group kartu flex h-full flex-col p-2.5">
                  <div className="overflow-hidden">
                    <Foto
                      src={u.gambar[0].src}
                      alt={u.gambar[0].caption}
                      rasioPaksa="4 / 3"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="meta">{u.kategori}</p>
                      <span className={cn("status shrink-0", terverifikasi ? "text-ok" : "text-warn")}>
                        {terverifikasi ? "Asli" : "Contoh"}
                      </span>
                    </div>
                    <h2 className="mt-1 font-display text-lg leading-tight text-terang transition-colors group-hover:text-emas">
                      {u.nama}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-terang-2">
                      {u.ringkas}
                    </p>
                    <p className="mt-auto pt-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
                      {u.wilayah} · {u.produk.length} produk
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}

          {/*
           * Sisa sel di baris terakhir. Tujuh kartu di tiga kolom
           * menyisakan ruang kosong. Daripada meregangkan kartu ketujuh
           * (fotonya jadi raksasa), sisa sel diisi panel yang berguna:
           * jalan masuk ke asisten, yang memang bisa menjawab pertanyaan
           * soal kuliner dan oleh-oleh.
           *
           * Lebar panel dihitung dari sisa, bukan ditumpuk sebagai
           * beberapa kelas span. Sebelumnya `lg:col-span-2` dan
           * `lg:col-span-1` sama-sama terpasang dan yang terakhir menang,
           * jadi panel cuma selebar satu kolom dan menyisakan lubang.
           */}
          {hasil.length > 0 && (
            <li
              className={cn(
                "h-full",
                hasil.length % 3 === 1
                  ? "sm:col-span-2 lg:col-span-2"
                  : hasil.length % 3 === 2
                    ? "sm:col-span-2 lg:col-span-1"
                    : "sm:col-span-2 lg:col-span-3",
              )}
            >
              <div className="kartu flex h-full flex-col justify-center gap-6 p-6 lg:p-8">
                <div>
                  <p className="meta-emas">Bingung memilih</p>
                  <p className="mt-2 max-w-[34ch] font-display text-xl leading-snug text-terang sm:text-2xl">
                    Tanya Sari soal pempek, songket, atau oleh-oleh yang tahan
                    dibawa pulang.
                  </p>
                  <p className="mt-2 max-w-[46ch] text-[0.8125rem] leading-relaxed text-terang-2">
                    Jawabannya diambil dari catatan yang sama dengan halaman
                    ini. Kalau datanya tidak ada, ia bilang tidak tahu.
                  </p>
                </div>
                <Link
                  href="/asisten"
                  className="inline-flex min-h-9 w-fit items-center gap-2 border border-emas/40 px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-emas transition-colors hover:border-emas hover:bg-emas/10"
                >
                  Buka asisten →
                </Link>
              </div>
            </li>
          )}
        </ul>
      )}
    </>
  );
}
