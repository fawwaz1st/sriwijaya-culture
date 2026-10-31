"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Foto } from "@/components/foto";
import type { Destinasi } from "@/lib/types";

/**
 * Pita foto destinasi.
 *
 * Deretan horizontal yang bisa digeser, dengan tombol panah yang muncul
 * hanya ketika masih ada yang bisa digeser. Ini menggantikan grid kartu
 * berteks: pengunjung membaca gambar dulu, baru memilih.
 *
 * Kursor dan papan tomuk tetap jalan: tombol panah punya aria-label,
 * dan pita bisa digulir dengan Tab karena wadahnya focusable.
 */
export function PitaFoto({
  daftar,
  judul = "Sorotan destinasi",
}: {
  daftar: readonly Destinasi[];
  judul?: string;
}) {
  const wadah = useRef<HTMLDivElement>(null);
  const [bisaKiri, setBisaKiri] = useState(false);
  const [bisaKanan, setBisaKanan] = useState(false);

  const ukur = useCallback(() => {
    const el = wadah.current;
    if (!el) return;
    setBisaKiri(el.scrollLeft > 4);
    setBisaKanan(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    ukur();
    const el = wadah.current;
    if (!el) return;
    el.addEventListener("scroll", ukur, { passive: true });
    window.addEventListener("resize", ukur);
    return () => {
      el.removeEventListener("scroll", ukur);
      window.removeEventListener("resize", ukur);
    };
  }, [ukur, daftar]);

  function geser(arah: -1 | 1) {
    const el = wadah.current;
    if (!el) return;
    el.scrollBy({ left: arah * Math.max(240, el.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section aria-label={judul} className="border-y border-garis-malam bg-malam-2 py-4">
      <div className="mx-auto flex max-w-[1760px] items-center gap-3 px-5 sm:px-8 lg:px-12">
        <p className="meta hidden shrink-0 sm:block">{judul}</p>

        <button
          type="button"
          onClick={() => geser(-1)}
          disabled={!bisaKiri}
          aria-label="Gulir ke kiri"
          className="sentuh grid h-9 w-9 flex-none place-items-center border border-garis-malam text-terang-2 transition-colors hover:border-emas hover:text-emas disabled:opacity-25"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div
          ref={wadah}
          tabIndex={0}
          role="group"
          aria-label={judul + ", bisa digulir"}
          className="gulir-tipis flex min-w-0 flex-1 gap-3 overflow-x-auto scroll-smooth pb-1"
        >
          {daftar.map((d) => (
            <Link
              key={d.id}
              href={`/destinasi/${d.id}`}
              className="group relative h-32 w-44 flex-none overflow-hidden sm:h-36 sm:w-52"
            >
              <Foto
                src={d.gambar[0].src}
                alt={d.gambar[0].caption}
                rasioPaksa="bebas"
                sizes="208px"
                className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-malam/95 to-transparent px-2.5 pb-2 pt-6">
                <span className="block truncate font-display text-[0.9375rem] leading-tight text-terang">
                  {d.nama}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-3">
                  {d.wilayah}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => geser(1)}
          disabled={!bisaKanan}
          aria-label="Gulir ke kanan"
          className="sentuh grid h-9 w-9 flex-none place-items-center border border-garis-malam text-terang-2 transition-colors hover:border-emas hover:text-emas disabled:opacity-25"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}