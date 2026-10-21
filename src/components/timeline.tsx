import Link from "next/link";
import { TIMELINE, cariArtikel, cariDestinasi } from "@/lib/arsip";
import { cn } from "@/lib/cn";

/**
 * Garis waktu proporsional.
 *
 * Sumbu tidak membagi rata tiap peristiwa. Posisi x dihitung dari
 * tahun sebenarnya terhadap rentang 671 sampai 2023, jadi pembaca
 * langsung melihat bahwa 12 dari 19 tonggak menumpuk di 200 tahun
 * terakhir. Itu informasi, bukan dekorasi.
 *
 * Semua angka diambil dari field yang sudah tertulis di record asal,
 * dan setiap tonggak menaut ke record tersebut.
 */
export function TimelineSejarah() {
  const peristiwa = [...TIMELINE.peristiwa].sort((a, b) => a.tahun - b.tahun);
  const tahun = peristiwa.map((p) => p.tahun);
  const awal = Math.min(...tahun);
  const akhir = Math.max(...tahun);
  const span = akhir - awal;

  const posisi = (t: number) => ((t - awal) / span) * 100;

  // Hitung kepadatan per abad untuk grafik batang kecil di atas sumbu.
  const abad = new Map<number, number>();
  for (const p of peristiwa) {
    const k = Math.floor(p.tahun / 100) * 100;
    abad.set(k, (abad.get(k) ?? 0) + 1);
  }
  const daftarAbad = [...abad.entries()].sort((a, b) => a[0] - b[0]);
  const maksAbad = Math.max(...daftarAbad.map(([, n]) => n));

  return (
    <div className="border border-garis bg-kertas-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-garis px-4 py-2">
        <p className="label-arsip">Sumbu waktu · {awal}–{akhir} M</p>
        <p className="tabular font-mono text-[0.625rem] text-tinta-3">
          {span} tahun · {peristiwa.length} tonggak
        </p>
      </div>

      {/* --- Pita era --- */}
      {TIMELINE.era.map((e) => (
        <div key={e.label} className="border-b border-garis px-4 py-2">
          <div className="relative h-7 bg-kertas-3/60">
            <div
              className="absolute inset-y-0 flex items-center overflow-hidden border-x border-hijau-700 bg-hijau-700/15 px-1.5"
              style={{ left: `${posisi(e.dari)}%`, width: `${posisi(e.sampai) - posisi(e.dari)}%` }}
            >
              <span className="truncate font-mono text-[0.5625rem] uppercase tracking-wider text-hijau-800">
                {e.label}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* --- Grafik kepadatan per abad --- */}
      <div className="border-b border-garis px-4 py-3">
        <p className="label-arsip mb-2">Kepadatan tonggak per abad</p>
        <div className="flex items-end gap-[2px]" role="img" aria-label="Diagram batang jumlah tonggak per abad">
          {daftarAbad.map(([k, n]) => (
            <div key={k} className="group relative flex-1" title={`Abad ${k}: ${n} tonggak`}>
              <div
                className={cn(
                  "w-full transition-colors",
                  n === maksAbad ? "bg-kunyit" : "bg-hijau-600/70",
                )}
                style={{ height: `${Math.max(3, (n / maksAbad) * 52)}px` }}
              />
              <span className="tabular mt-1 block text-center font-mono text-[0.5rem] text-tinta-4">
                {String(k).slice(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Sumbu dengan tonggak --- */}
      <div className="overflow-x-auto px-4 py-4">
        <div className="relative min-w-[560px]">
          <div className="absolute left-0 right-0 top-8 h-px bg-garis-3" aria-hidden="true" />
          <ol className="relative flex h-16">
            {peristiwa.map((p, i) => {
              const kiri = posisi(p.tahun);
              const naik = i % 2 === 0;
              return (
                <li
                  key={`${p.tahun}-${i}`}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${kiri}%`, top: naik ? 0 : 34 }}
                >
                  <div className="flex flex-col items-center">
                    {naik && (
                      <span className="tabular mb-0.5 font-mono text-[0.5625rem] font-semibold text-tinta">
                        {p.tahun}
                      </span>
                    )}
                    <span
                      className="h-2 w-2 rounded-full border border-kertas bg-hijau-700"
                      aria-hidden="true"
                    />
                    {!naik && (
                      <span className="tabular mt-0.5 font-mono text-[0.5625rem] text-tinta-3">
                        {p.tahun}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* --- Daftar tonggak: tabel, bukan kartu --- */}
      <ol className="border-t border-garis">
        {peristiwa.map((p, i) => {
          const ref =
            p.ref.jenis === "destinasi" ? cariDestinasi(p.ref.id) : cariArtikel(p.ref.id);
          const href =
            p.ref.jenis === "destinasi" ? `/destinasi/${p.ref.id}` : `/artikel/${p.ref.id}`;
          const jumlahSumber = ref?.sumber.length ?? 0;
          return (
            <li key={`${p.tahun}-${i}`} className="border-b border-garis-2 last:border-b-0">
              <Link
                href={href}
                className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 px-4 py-2 transition-colors hover:bg-kertas"
              >
                <span className="tabular font-mono text-[0.6875rem] font-semibold text-hijau-700">
                  {p.tahun}
                </span>
                <span className="min-w-0 text-[0.8125rem] leading-snug text-tinta group-hover:text-hijau-700">
                  {p.label}
                </span>
                <span className="tabular flex-none font-mono text-[0.5625rem] text-tinta-4">
                  {jumlahSumber} sumber
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
