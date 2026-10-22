import Link from "next/link";
import { statistikArsip } from "@/lib/arsip";

/**
 * Footer sebagai kolofon galeri: satu baris identitas, lalu tiga kolom
 * informasi. Tidak ada empat kolom tautan sosial yang tidak pernah diklik.
 */
export function SiteFooter() {
  const s = statistikArsip();

  return (
    <footer className="border-t border-garis-malam bg-malam">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12">
        <p className="display max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)] text-terang">
          Kota ini dibentuk oleh sungai.
        </p>

        <div className="mt-12 grid gap-10 border-t border-garis-malam pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="meta">Isi arsip</p>
            <ul className="mt-3 space-y-0.5 text-[0.8125rem] text-terang-2">
              {[
                { href: "/destinasi", label: "Destinasi wisata" },
                { href: "/umkm", label: "Usaha lokal" },
                { href: "/artikel", label: "Sejarah dan budaya" },
                { href: "/asisten", label: "Asisten Sari" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="tautan inline-flex min-h-8 items-center hover:text-terang"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta">Tentang data</p>
            <ul className="mt-3 space-y-0.5 text-[0.8125rem] text-terang-2">
              <li>
                <Link href="/metodologi" className="tautan inline-flex min-h-8 items-center hover:text-terang">
                  Metodologi dan sumber
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="tautan inline-flex min-h-8 items-center hover:text-terang">
                  Tentang tim
                </Link>
              </li>
            </ul>
            <dl className="mt-5 flex gap-5">
              <div>
                <dt className="meta">Rekaman</dt>
                <dd className="tabular mt-1 font-mono text-sm text-terang">
                  {s.destinasi + s.umkm + s.artikel}
                </dd>
              </div>
              <div>
                <dt className="meta">Sumber</dt>
                <dd className="tabular mt-1 font-mono text-sm text-terang">{s.sumber}</dd>
              </div>
              <div>
                <dt className="meta">Terverifikasi</dt>
                <dd className="tabular mt-1 font-mono text-sm text-emas">{s.persenTerverifikasi}%</dd>
              </div>
            </dl>
          </div>

          <div className="sm:col-span-2">
            <p className="meta">Keterangan</p>
            <p className="mt-3 max-w-[44ch] text-[0.8125rem] leading-relaxed text-terang-2">
              Foto dari Wikimedia Commons dengan lisensi Creative Commons. Kredit per
              berkas ada di halaman masing-masing. Geometri peta dari OpenStreetMap
              contributors (ODbL). Situs ini tidak mengarang alamat, harga, atau ulasan.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-garis-malam pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="meta">© 2026 Koding Seadanya · ITFEST 2026</p>
          <p className="meta">Next.js · TypeScript · Vercel</p>
        </div>
      </div>
    </footer>
  );
}
