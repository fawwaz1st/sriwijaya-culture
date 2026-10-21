import Link from "next/link";
import { TIMELINE, cariArtikel, cariDestinasi } from "@/lib/arsip";
import { cn } from "@/lib/cn";

/**
 * Garis waktu proporsional.
 *
 * Posisi x dihitung dari tahun sebenarnya terhadap rentang 671 sampai
 * 2023. Jadi pembaca langsung melihat bahwa dua belas dari sembilan belas
 * tonggak menumpuk di dua abad terakhir. Itu informasi, bukan dekorasi.
 *
 * Sumbu digambar sebagai garis tipis dengan tonggak naik-turun, lalu
 * daftar di bawahnya berfungsi sebagai tabel, bukan kartu.
 */
export function TimelineSejarah() {
  const peristiwa = [...TIMELINE.peristiwa].sort((a, b) => a.tahun - b.tahun);
  const tahun = peristiwa.map((p) => p.tahun);
  const awal = Math.min(...tahun);
  const akhir = Math.max(...tahun);
  const span = akhir - awal;
  const posisi = (t: number) => ((t - awal) / span) * 100;

  const abad = new Map<number, number>();
  for (const p of peristiwa) {
    const k = Math.floor(p.tahun / 100) * 100;
    abad.set(k, (abad.get(k) ?? 0) + 1);
  }
  const daftarAbad = [...abad.entries()].sort((a, b) => a[0] - b[0]);
  const maks = Math.max(...daftarAbad.map(([, n]) => n));

  return (
    <div>
      {/* Kepadatan per abad: batang tipis, tanpa kotak. */}
      <div className="flex items-end gap-[3px]" role="img" aria-label="Jumlah tonggak per abad">
        {daftarAbad.map(([k, n]) => (
          <div key={k} className="group relative flex-1" title={`Abad ${k}: ${n} tonggak`}>
            <div
              className={cn("w-full transition-colors", n === maks ? "bg-emas" : "bg-terang-3/40")}
              style={{ height: `${Math.max(4, (n / maks) * 64)}px` }}
            />
            <span className="tabular mt-1.5 block text-center font-mono text-[0.5rem] text-terang-3">
              {String(k).slice(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Sumbu: tonggak naik-turun supaya tahun tidak saling menimpa. */}
      <div className="gulir-tipis mt-6 overflow-x-auto pb-2">
        <div className="relative min-w-[620px]">
          <div className="absolute inset-x-0 top-10 h-px bg-garis-malam" aria-hidden="true" />
          <ol className="relative h-20">
            {peristiwa.map((p, i) => {
              const naik = i % 2 === 0;
              return (
                <li
                  key={`${p.tahun}-${i}`}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${posisi(p.tahun)}%`, top: naik ? 0 : 44 }}
                >
                  <div className="flex flex-col items-center">
                    {naik && (
                      <span className="tabular mb-1 font-mono text-[0.5625rem] text-terang">{p.tahun}</span>
                    )}
                    <span className="h-1.5 w-1.5 rounded-full bg-emas" aria-hidden="true" />
                    {!naik && (
                      <span className="tabular mt-1 font-mono text-[0.5625rem] text-terang-3">{p.tahun}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Tabel tonggak. */}
      <ol className="mt-4 border-t border-garis-malam">
        {peristiwa.map((p, i) => {
          const ref = p.ref.jenis === "destinasi" ? cariDestinasi(p.ref.id) : cariArtikel(p.ref.id);
          const href = p.ref.jenis === "destinasi" ? `/destinasi/${p.ref.id}` : `/artikel/${p.ref.id}`;
          return (
            <li key={`${p.tahun}-${i}`} className="border-b border-garis-malam">
              <Link
                href={href}
                className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 py-2.5 transition-colors hover:bg-malam-3/60"
              >
                <span className="tabular font-mono text-[0.6875rem] text-emas">{p.tahun}</span>
                <span className="min-w-0 text-[0.8125rem] leading-snug text-terang-2 group-hover:text-terang">
                  {p.label}
                </span>
                <span className="tabular shrink-0 font-mono text-[0.5rem] text-terang-3">
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
