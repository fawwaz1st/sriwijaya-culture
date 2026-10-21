import Link from "next/link";
import { statistikArsip } from "@/lib/arsip";

/**
 * Footer diperlakukan sebagai kolofon buku: siapa yang menyusun,
 * dari mana datanya, dan apa batasannya. Bukan tempat menaruh empat
 * kolom tautan sosial yang tidak pernah diklik.
 */
export function SiteFooter() {
  const s = statistikArsip();
  const tahun = 2026;

  return (
    <footer className="mt-20 border-t border-garis bg-hijau-950 text-kertas/70">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="label-arsip text-kunyit-muda/80">Kolofon</p>
            <p className="mt-3 max-w-[38ch] font-display text-2xl leading-tight text-kertas">
              Arsip terbuka tentang kota yang dibentuk oleh sungai.
            </p>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-kertas/60">
              Sriwijaya Culture mengumpulkan {s.destinasi} destinasi, {s.umkm} usaha
              lokal, dan {s.artikel} catatan sejarah. Setiap klaim menunjuk sumber.
              Yang belum pasti ditandai belum pasti, bukan ditulis sebagai fakta.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <div>
                <dt className="label-arsip text-kertas/40">Rekaman</dt>
                <dd className="tabular mt-1 font-mono text-sm text-kertas">
                  {s.destinasi + s.umkm + s.artikel}
                </dd>
              </div>
              <div>
                <dt className="label-arsip text-kertas/40">Sumber</dt>
                <dd className="tabular mt-1 font-mono text-sm text-kertas">{s.sumber}</dd>
              </div>
              <div>
                <dt className="label-arsip text-kertas/40">Terverifikasi</dt>
                <dd className="tabular mt-1 font-mono text-sm text-kertas">
                  {s.persenTerverifikasi}%
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Tautan arsip">
            <p className="label-arsip text-kertas/40">Isi Arsip</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/destinasi", label: "Destinasi wisata" },
                { href: "/umkm", label: "Direktori usaha lokal" },
                { href: "/artikel", label: "Sejarah dan budaya" },
                { href: "/asisten", label: "Asisten Sari" },
                { href: "/metodologi", label: "Metodologi dan sumber" },
                { href: "/tentang", label: "Tentang tim" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="tautan-arsip text-kertas/65 hover:text-kertas">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-arsip text-kertas/40">Keterangan</p>
            <ul className="mt-3 space-y-3 text-sm text-kertas/60">
              <li>
                Foto dari Wikimedia Commons dengan lisensi Creative Commons.
                Kredit per berkas ada di halaman metodologi.
              </li>
              <li>
                Geometri peta dari OpenStreetMap contributors (ODbL), disederhanakan
                untuk ditampilkan.
              </li>
              <li>
                Situs ini tidak mengarang alamat, nomor telepon, harga, atau ulasan.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-kertas/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-kertas/40">
            © {tahun} Koding Seadanya · ITFEST 2026
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-kertas/40">
            Dibangun dengan Next.js, TypeScript, dan data yang bisa ditelusuri
          </p>
        </div>
      </div>
    </footer>
  );
}
