"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Destinasi } from "@/lib/types";
import { koordinatTeks } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Peta asli dari Google Maps.
 *
 * Sebelumnya peta digambar sendiri dari geometri OpenStreetMap. Itu jujur
 * tapi tidak berguna: pengunjung tidak bisa zoom, tidak bisa melihat
 * bangunan sekitar, dan tidak bisa memakai peta itu untuk navigasi.
 *
 * Sekarang memakai embed Google Maps tanpa API key (mode `output=embed`).
 * Dua lapisan: satelit untuk melihat bentuk kota dan sungai, jalan untuk
 * membaca nama tempat. Default satelit karena Sungai Musi adalah alasan
 * kota ini ada, dan bentuknya hanya terlihat dari atas.
 *
 * Catatan: embed ini iframe pihak ketiga. Karena itu tidak ada pelacak
 * yang kami pasang sendiri, dan tidak ada cookie yang kami set.
 */
export function Peta({
  daftar,
  tinggi = "520px",
  fokus,
  judul = "Peta Kota Palembang",
}: {
  daftar: readonly Destinasi[];
  tinggi?: string;
  /** Destinasi yang dipilih di awal. */
  fokus?: Destinasi | null;
  judul?: string;
}) {
  const [lapisan, setLapisan] = useState<"k" | "m">("k");
  const [dimuat, setDimuat] = useState(false);
  const [aktif, setAktif] = useState<Destinasi | null>(fokus ?? daftar[0] ?? null);
  const wadah = useRef<HTMLDivElement>(null);

  /**
   * Muat peta saat benar-benar masuk viewport.
   *
   * Sebelumnya peta hanya dimuat setelah tombol diklik. Akibatnya
   * bagian ini tampil sebagai kotak gelap kosong setinggi 560px, dan
   * pengunjung melihat "lubang" di tengah beranda. IntersectionObserver
   * memberi penundaan yang sama hematnya tanpa mengorbankan tampilan:
   * iframe baru diunduh ketika bagian ini akan terlihat, bukan saat
   * halaman pertama dibuka.
   */
  useEffect(() => {
    const el = wadah.current;
    if (!el) return;

    // Peramban tanpa IntersectionObserver tidak punya cara menunda,
    // jadi peta dimuat langsung. Ini bukan setState sinkron di badan
    // effect: nilainya ditetapkan di dalam callback, dan hanya sekali.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setDimuat(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDimuat(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const denganKoordinat = daftar.filter((d) => d.koordinat);
  const tanpa = daftar.filter((d) => !d.koordinat);

  // Query: kalau ada destinasi aktif, pakai koordinatnya supaya pin tepat.
  const q = aktif?.koordinat
    ? `${aktif.koordinat.lat},${aktif.koordinat.lng}`
    : "Palembang, Sumatera Selatan";

  const src =
    `https://maps.google.com/maps?q=${encodeURIComponent(q)}` +
    `&t=${lapisan}&z=${aktif ? 16 : 13}&hl=id&output=embed`;

  return (
    <div className="pulau-gelap border border-garis-malam bg-malam-2" ref={wadah}>
      {/* Bar kontrol */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-garis-malam bg-malam-2 px-3 py-2">
        <div className="flex items-center gap-1">
          {(
            [
              ["k", "Satelit"],
              ["m", "Jalan"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setLapisan(v)}
              aria-pressed={lapisan === v}
              className={cn(
                "flex min-h-8 items-center px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                lapisan === v ? "bg-terang text-malam" : "text-terang-2 hover:text-terang",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="meta hidden sm:block">
          {aktif ? aktif.nama : `${denganKoordinat.length} destinasi berkoordinat`}
        </p>

        {aktif && (
          <Link
            href={`/destinasi/${aktif.id}`}
            className="flex min-h-8 items-center gap-1.5 bg-emas px-2.5 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-malam"
          >
            Buka halaman
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="relative border-b border-garis-malam lg:border-b-0 lg:border-r">
          {dimuat ? (
            <iframe
              key={`${q}-${lapisan}`}
              src={src}
              title={judul}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block w-full"
              style={{ height: tinggi, border: 0 }}
            />
          ) : (
            /**
             * Facade: peta tidak dimuat sebelum diminta.
             *
             * Embed Google Maps mengunduh ~1 MB skrip dan tile saat
             * halaman dibuka. Dengan facade, unduhan itu ditunda sampai
             * pengunjung benar-benar mau melihat peta, satu-satunya
             * optimasi berdampak besar yang tersisa di situs ini.
             */
            <div
              className="relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden bg-malam-3"
              style={{ height: tinggi }}
              aria-hidden="true"
            >
              {/* Kisi jalan samar: memberi tahu bahwa ini peta yang sedang
                  disiapkan, bukan kotak kosong yang rusak. */}
              <svg
                className="absolute inset-0 h-full w-full text-malam-5 opacity-40"
                preserveAspectRatio="none"
                viewBox="0 0 400 300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M0 210 Q120 170 200 195 T400 150" />
                <path d="M0 120 Q90 140 170 105 T400 80" />
                <path d="M60 0 L90 300" />
                <path d="M250 0 L230 300" />
                <path d="M330 0 L350 300" />
                <path d="M0 40 H400" />
              </svg>
              <span className="relative h-9 w-9 animate-pulse rounded-full border border-emas/40 bg-emas/10" />
              <span className="relative font-mono text-[0.75rem] uppercase tracking-[0.14em] text-terang-3">
                Memuat peta
              </span>
            </div>
          )}
        </div>

        {/* Indeks: satu baris per destinasi. Sebelumnya baris membengkak
            karena kolom terlalu sempit untuk dua baris teks. */}
        <div className="flex min-h-0 flex-col bg-malam-2">
          <p className="meta border-b border-garis-malam px-3 py-2">
            {String(denganKoordinat.length).padStart(2, "0")} titik
          </p>
          <ul className="gulir-tipis min-h-0 flex-1 overflow-y-auto" style={{ maxHeight: tinggi }}>
            {denganKoordinat.map((d, i) => {
              const on = aktif?.id === d.id;
              return (
                <li key={d.id} className="border-b border-garis-malam last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setAktif(d)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
                      on ? "bg-emas/12" : "hover:bg-malam-3",
                    )}
                  >
                    <span
                      className={cn(
                        "tabular w-4 shrink-0 font-mono text-[0.75rem]",
                        on ? "text-emas" : "text-terang-3",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 truncate text-[0.8125rem] leading-tight",
                        on ? "text-emas" : "text-terang-2",
                      )}
                    >
                      {d.nama}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {tanpa.length > 0 && (
            /* text-pretty: kolom samping hanya 240px, sehingga satu nama
               panjang menyisakan satu glyph sendirian di baris kedua.
               text-wrap: pretty menahan widow itu tanpa memotong teks. */
            <p className="border-t border-garis-malam px-3 py-2 text-[0.75rem] leading-snug text-pretty text-terang-3">
              Tanpa koordinat: {tanpa.map((d) => d.nama).join(", ")}.
            </p>
          )}
        </div>
      </div>

      <p className="border-t border-garis-malam px-3 py-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
        Peta: Google Maps · citra satelit dan data jalan © Google
      </p>
    </div>
  );
}

/** Peta kecil untuk halaman detail: satu destinasi, bisa dibuka penuh. */
export function PetaDestinasi({ destinasi }: { destinasi: Destinasi }) {
  const [lapisan, setLapisan] = useState<"k" | "m">("k");

  if (!destinasi.koordinat) {
    return (
      <div className="border border-garis-kertas bg-kertas-2 p-4">
        <p className="meta">Peta</p>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gelap-2">
          Koordinat tempat ini belum diverifikasi, jadi tidak digambar. Kami
          tidak menebak posisi.
        </p>
      </div>
    );
  }

  const { lat, lng } = destinasi.koordinat;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&t=${lapisan}&z=16&hl=id&output=embed`;

  return (
    <div className="border border-garis-kertas">
      <div className="flex items-center justify-between border-b border-garis-kertas bg-kertas-2 px-2 py-1.5">
        <div className="flex items-center gap-1">
          {(
            [
              ["k", "Satelit"],
              ["m", "Jalan"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setLapisan(v)}
              aria-pressed={lapisan === v}
              className={cn(
                "flex min-h-7 items-center px-2 py-0.5 font-mono text-[0.75rem] uppercase tracking-[0.1em] transition-colors",
                lapisan === v ? "bg-gelap text-kertas" : "text-gelap-2 hover:text-gelap",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="tabular font-mono text-[0.75rem] text-gelap-3">
          {koordinatTeks(lat, lng)}
        </span>
      </div>
      <iframe
        key={lapisan}
        src={src}
        title={`Peta ${destinasi.nama}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block w-full"
        style={{ height: "240px", border: 0 }}
      />
      <div className="flex border-t border-garis-kertas">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-2 py-2 text-center font-mono text-[0.75rem] uppercase tracking-[0.1em] text-gelap hover:bg-kertas-2"
        >
          Rute →
        </a>
      </div>
    </div>
  );
}
