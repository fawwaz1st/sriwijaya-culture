import Link from "next/link";

/**
 * Footer satu baris.
 *
 * Versi lama empat kolom dan menghabiskan satu layar penuh. Pengunjung
 * datang untuk Palembang, bukan untuk daftar tautan. Sekarang: identitas,
 * tautan utama, dan kredit dalam satu pita.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-terang/10 bg-malam">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-3 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <p className="font-display text-[0.9375rem] text-terang">Sriwijaya Culture</p>

        <nav aria-label="Tautan footer" className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {[
            { href: "/destinasi", label: "Destinasi" },
            { href: "/umkm", label: "Usaha" },
            { href: "/artikel", label: "Sejarah" },
            { href: "/metodologi", label: "Metodologi" },
            { href: "/tentang", label: "Tentang" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="tautan meta inline-flex min-h-8 items-center hover:text-terang">
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="meta">© 2026 Koding Seadanya · ITFEST 2026</p>
      </div>
    </footer>
  );
}
