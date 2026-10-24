import Link from "next/link";
import { TIMELINE, cariArtikel, cariDestinasi } from "@/lib/arsip";
import { cn } from "@/lib/cn";

/**
 * Garis waktu sebagai pita era.
 *
 * Sumbu tahun proporsional sudah dicoba dan gagal secara keterbacaan:
 * 12 dari 19 tonggak jatuh di dua abad terakhir, sehingga dua belas
 * label bertumpuk di 8% lebar terakhir. Pita era menyampaikan informasi
 * yang sama (di mana sejarahnya menumpuk) tanpa label yang saling
 * menimpa, lalu daftar kronologis di bawahnya menjadi tabelnya.
 */
export function TimelineSejarah() {
  const peristiwa = [...TIMELINE.peristiwa].sort((a, b) => a.tahun - b.tahun);

  /**
   * Pita era, bukan sumbu tahun proporsional.
   *
   * Percobaan pertama memetakan tahun ke posisi x. Hasilnya jujur secara
   * matematis tapi tidak terbaca: 12 dari 19 tonggak jatuh di dua abad
   * terakhir, jadi dua belas label bertumpuk di 8% lebar terakhir.
   * Informasi yang sama disampaikan sebagai pita per era dengan jumlah
   * tonggak, lalu daftar kronologis di bawahnya.
   */
  const era = [
    { label: "Sriwijaya", dari: 600, sampai: 1399 },
    { label: "Kesultanan", dari: 1400, sampai: 1819 },
    { label: "Kolonial", dari: 1820, sampai: 1944 },
    { label: "Republik", dari: 1945, sampai: 2100 },
  ].map((e) => ({
    ...e,
    jumlah: peristiwa.filter((p) => p.tahun >= e.dari && p.tahun <= e.sampai).length,
  }));
  const maks = Math.max(...era.map((e) => e.jumlah), 1);

  return (
    <div>
      {/* Pita era: satu blok per zaman, tinggi sebanding jumlah tonggak. */}
      <ol className="grid grid-cols-2 gap-px border border-garis-malam bg-garis-malam sm:grid-cols-4">
        {era.map((e) => (
          <li
            key={e.label}
            className="label-masuk bg-malam-2 p-3 sm:p-4"
          >
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
              {e.dari}-{e.sampai === 2100 ? "kini" : e.sampai}
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span
                className={cn(
                  "tabular font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none",
                  e.jumlah === maks ? "text-emas" : "text-terang",
                )}
              >
                {e.jumlah}
              </span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-terang-3">
                tonggak
              </span>
            </p>
            <p className="mt-2 font-display text-[0.9375rem] leading-tight text-terang-2">{e.label}</p>
          </li>
        ))}
      </ol>

      {/* Tabel tonggak.

          Di layar lebar, tabel satu kolom selebar 1344px menyisakan
          ruang kosong panjang di antara label dan jumlah sumber: baris
          terbaca sebagai dua ujung yang berjauhan. Sekarang tonggak
          dibagi dua kolom di layar >= lg, jadi kepadatan naik dan mata
          tidak perlu melompat jauh. Urutan tetap kronologis karena
          dibaca kolom demi kolom. */}
      <ol className="mt-4 grid gap-x-10 border-t border-garis-malam lg:grid-cols-2">
        {peristiwa.map((p, i) => {
          const ref = p.ref.jenis === "destinasi" ? cariDestinasi(p.ref.id) : cariArtikel(p.ref.id);
          const href = p.ref.jenis === "destinasi" ? `/destinasi/${p.ref.id}` : `/artikel/${p.ref.id}`;
          return (
            <li
              key={`${p.tahun}-${i}`}
              className="kartu-masuk border-b border-garis-malam"
            >
              <Link
                href={href}
                className="group flex items-baseline gap-3 py-2.5 transition-colors hover:bg-malam-3/60"
              >
                <span className="tabular w-14 shrink-0 font-mono text-[0.75rem] text-emas">{p.tahun}</span>
                <span className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-terang-2 group-hover:text-terang">
                  {p.label}
                </span>
                <span className="tabular shrink-0 font-mono text-[0.75rem] text-terang-3">
                  {ref?.sumber.length ?? 0} sumber
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
