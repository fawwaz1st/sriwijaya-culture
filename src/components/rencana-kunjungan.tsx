"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { DESTINASI } from "@/lib/arsip";
import {
  bacaRencana,
  hapusDariRencana,
  langgananRencana,
  tambahKeRencana,
  urutkanRencana,
  type ItemRencana,
} from "@/lib/rencana";

/**
 * Rencana kunjungan.
 *
 * Daftar berurutan yang disimpan di peramban pengunjung. Isinya hanya
 * id destinasi yang benar-benar ada di arsip, jadi tidak mungkin
 * menampilkan tempat yang tidak pernah kami verifikasi.
 *
 * Urutan bisa diatur naik atau turun. Pengurutan dilakukan di sini,
 * bukan di server, karena datanya memang hidup di perangkat pengunjung.
 */
const KOSONG: readonly ItemRencana[] = [];

export function RencanaKunjungan() {
  const rencana = useSyncExternalStore(langgananRencana, bacaRencana, () => KOSONG);
  const [pilih, setPilih] = useState("");

  const tersedia = useMemo(
    () => DESTINASI.filter((d) => !rencana.some((r) => r.id === d.id)),
    [rencana],
  );

  const detail = rencana
    .map((r) => DESTINASI.find((d) => d.id === r.id))
    .filter((d): d is (typeof DESTINASI)[number] => Boolean(d));

  const totalTitikPeta = detail.filter((d) => d.koordinat).length;

  return (
    <section className="border border-garis-malam bg-malam-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-garis-malam px-4 py-3">
        <div>
          <p className="meta-emas">Rencana kunjungan</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-terang-2">
            Susun urutan tempat. Tersimpan di peramban ini, tanpa akun.
          </p>
        </div>
        <p className="tabular font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
          {rencana.length} tempat · {totalTitikPeta} berkoordinat
        </p>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="border-b border-garis-malam p-4 md:border-b-0 md:border-r">
          {detail.length === 0 ? (
            <p className="text-[0.8125rem] leading-relaxed text-terang-3">
              Belum ada tempat di rencana. Pilih dari daftar di samping,
              lalu atur urutannya sesuai rute perjalanan Anda.
            </p>
          ) : (
            <ol className="space-y-2">
              {detail.map((d, i) => (
                <li key={d.id} className="flex items-center gap-3 border border-garis-malam bg-malam px-3 py-2.5">
                  <span className="tabular w-6 flex-none font-mono text-[0.75rem] text-emas">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link href={`/destinasi/${d.id}`} className="block truncate text-[0.875rem] text-terang hover:text-emas">
                      {d.nama}
                    </Link>
                    <span className="mt-0.5 block truncate font-mono text-[0.625rem] uppercase tracking-[0.08em] text-terang-3">
                      {d.wilayah}
                      {d.koordinat ? " · berkoordinat" : " · tanpa koordinat"}
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-1">
                    <button
                      type="button"
                      onClick={() => urutkanRencana(d.id, -1)}
                      disabled={i === 0}
                      aria-label={"Naikkan " + d.nama}
                      className="sentuh grid h-8 w-8 place-items-center border border-garis-malam text-terang-2 transition-colors hover:border-emas hover:text-emas disabled:opacity-30"
                    >
                      <span aria-hidden="true">↑</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => urutkanRencana(d.id, 1)}
                      disabled={i === detail.length - 1}
                      aria-label={"Turunkan " + d.nama}
                      className="sentuh grid h-8 w-8 place-items-center border border-garis-malam text-terang-2 transition-colors hover:border-emas hover:text-emas disabled:opacity-30"
                    >
                      <span aria-hidden="true">↓</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => hapusDariRencana(d.id)}
                      aria-label={"Hapus " + d.nama + " dari rencana"}
                      className="sentuh grid h-8 w-8 place-items-center border border-garis-malam text-terang-3 transition-colors hover:border-bahaya hover:text-bahaya"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          )}

          {detail.length > 1 && (
            <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-terang-3">
              Urutan ini hanya catatan Anda, bukan rute jalan yang dihitung.
            </p>
          )}
        </div>

        <div className="p-4">
          <label className="block">
            <span className="meta">Tambah tempat</span>
            <select
              value={pilih}
              onChange={(e) => {
                if (!e.target.value) return;
                tambahKeRencana(e.target.value);
                setPilih("");
              }}
              className="mt-2 w-full border border-garis-malam bg-malam px-2.5 py-2 text-[0.8125rem] text-terang focus:border-emas focus:outline-none"
            >
              <option value="">Pilih destinasi…</option>
              {tersedia.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </label>

          {rencana.length > 0 && (
            <button
              type="button"
              onClick={() => rencana.forEach((r) => hapusDariRencana(r.id))}
              className={cn(
                "sentuh mt-3 w-full border border-garis-malam px-3 py-2 font-mono text-[0.75rem]",
                "uppercase tracking-[0.1em] text-terang-2 transition-colors hover:border-bahaya hover:text-bahaya",
              )}
            >
              Kosongkan rencana
            </button>
          )}

          <p className="mt-3 text-[0.75rem] leading-relaxed text-terang-3">
            Daftar ini tidak dikirim ke mana pun. Menghapus data situs akan
            mengosongkannya.
          </p>
        </div>
      </div>
    </section>
  );
}
