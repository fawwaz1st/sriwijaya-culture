import type { Metadata } from "next";
import Link from "next/link";
import { Angka, BadgeVerifikasi } from "@/components/ui";
import { BatangVerifikasi } from "@/components/batang-verifikasi";
import { ARTIKEL, DAFTAR_UMKM, DESTINASI, statistikArsip, statusVerifikasi } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Metodologi dan Sumber",
  description:
    "Cara data arsip Sriwijaya Culture dikumpulkan, diperiksa, dan diberi tingkat verifikasi. Termasuk kredit foto dan batasan yang kami akui.",
};

/**
 * Metodologi.
 *
 * Halaman ini yang membuat klaim di seluruh situs bisa diperiksa. Karena
 * itu isinya prosedur, bukan kata pengantar: apa yang dihitung, dari mana,
 * dan apa yang sengaja tidak dilakukan.
 */
export default function HalamanMetodologi() {
  const s = statistikArsip();
  const v = statusVerifikasi();

  const semuaSumber = [
    ...DESTINASI.flatMap((d) => d.sumber.map((x) => ({ ...x, induk: d.nama }))),
    ...ARTIKEL.flatMap((a) => a.sumber.map((x) => ({ ...x, induk: a.judul }))),
    ...DAFTAR_UMKM.flatMap((u) => u.sumber.map((x) => ({ ...x, induk: u.nama }))),
  ];

  const unik = new Map<string, (typeof semuaSumber)[number]>();
  for (const x of semuaSumber) if (!unik.has(x.url)) unik.set(x.url, x);
  const daftarUnik = [...unik.values()].sort((a, b) => a.judul.localeCompare(b.judul, "id"));

  return (
    <div className="masuk-katalog mx-auto max-w-[1760px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Metodologi</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Bagaimana kami tahu, dan bagaimana kami salah.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            Setiap angka bisa dilacak ke sumbernya. Kalau tidak, angkanya
            tidak tampil.
          </p>
        </div>
      </header>

      <section className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-garis-malam py-6 sm:grid-cols-3 lg:grid-cols-6">
        <Angka nilai={s.sumber} label="Rujukan" />
        <Angka nilai={daftarUnik.length} label="Unik" />
        <Angka nilai={v.tinggi} label="Tingkat tinggi" />
        <Angka nilai={v.sedang} label="Satu sumber" />
        <Angka nilai={v.perlu} label="Perlu konfirmasi" />
        <Angka nilai={s.persenTerverifikasi} satuan="%" label="Rasio" />
      </section>

      <section className="mt-14">
        <p className="meta-emas">Aturan data</p>
        <h2 className="display mt-2 max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)] text-terang">
          Enam aturan yang tidak kami langgar.
        </h2>
        <ol className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {[
            { j: "Setiap klaim menunjuk sumber", i: "Tautan yang bisa dibuka." },
            { j: "Perbedaan ditulis sebagai perbedaan", i: "Dua angka, keduanya dicatat." },
            { j: "Legenda diberi label legenda", i: "Dipisah dari catatan sejarah." },
            { j: "Tidak mengisi yang belum ada", i: "Kosong lebih baik daripada salah." },
            { j: "Contoh diberi label", i: "Tidak dikira toko nyata." },
            { j: "Tidak ada tombol kosong", i: "Tidak ada formulir palsu." },
          ].map((r, i) => (
            <li key={r.j} className="border-t border-garis-malam pt-4">
              <p className="tabular font-mono text-[0.75rem] text-emas">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display text-lg leading-tight text-terang">{r.j}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">{r.i}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <p className="meta-emas">Tingkat verifikasi</p>
        <h2 className="display mt-2 max-w-[20ch] text-[clamp(1.9rem,4vw,3rem)] text-terang">
          Tiga tingkat, tiga arti.
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <BatangVerifikasi tinggi={v.tinggi} sedang={v.sedang} perlu={v.perlu} />
          <dl className="grid grid-cols-1 gap-4 self-end sm:grid-cols-3">
            {[
              { t: "tinggi", j: "Terverifikasi", n: v.tinggi },
              { t: "sedang", j: "Satu sumber", n: v.sedang },
              { t: "perlu-konfirmasi", j: "Perlu konfirmasi", n: v.perlu },
            ].map((x) => (
              <div key={x.t} className="border-t border-garis-malam pt-3">
                <dt className="tabular font-display text-3xl leading-none text-terang">{x.n}</dt>
                <dd className="mt-1.5 flex flex-col gap-1.5">
                  <span className="font-display text-[0.9375rem] leading-tight text-terang">{x.j}</span>
                  <BadgeVerifikasi tingkat={x.t} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-14">
        <p className="meta-emas">Batas</p>
        <h2 className="display mt-2 max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)] text-terang">
          Yang sengaja tidak kami lakukan.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[
              {
                j: "Harga tiket dan jam buka",
                i: "Sumbernya bukan pengelola resmi, jadi angkanya tidak kami tampilkan.",
              },
              {
                j: "Ulasan pengunjung",
                i: "Ulasan yang tak bisa diperiksa lebih berbahaya daripada tidak ada.",
              },
              {
                j: "Alamat dan kontak usaha",
                i: "Kami tak bisa memeriksa lapangan. Nama boleh tampil, kontak tidak.",
              },
            ].map((x) => (
              <div key={x.j} className="border border-warn/35 bg-warn/8 p-4">
                <p className="status text-warn">{x.j}</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-terang-2">{x.i}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-garis-malam pt-4">
            <p className="meta-emas">Kredit foto</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-terang-2">
              Semua foto dari Wikimedia Commons (lisensi Creative Commons),
              dikompres untuk web. Kredit per foto ada di halaman detailnya.
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-terang-2">
              Peta: data © OpenStreetMap contributors (ODbL).
            </p>
            <p className="mt-4 border-t border-garis-malam pt-3 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-terang-3">
              Data diperiksa terakhir 28 Oktober 2026
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <p className="meta-emas">Daftar rujukan</p>
        <h2 className="display mt-2 text-[clamp(1.9rem,4vw,3rem)] text-terang">
          {daftarUnik.length} sumber unik.
        </h2>
        <ol className="mt-6 grid gap-x-10 border-t border-garis-malam md:grid-cols-2">
          {daftarUnik.map((x, i) => (
            <li
              key={x.url}
              className="grid grid-cols-[2rem_1fr] items-start gap-2 border-b border-garis-malam py-2.5"
            >
              <span className="tabular pt-0.5 font-mono text-[0.75rem] text-terang-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <a
                  href={x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tautan inline-flex min-h-6 items-center text-[0.8125rem] font-medium leading-snug text-terang"
                >
                  {x.judul}
                </a>
                <p className="mt-0.5 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-terang-3">
                  {x.penulis} · {x.induk}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <p className="meta-emas">Data nyata, diperbarui otomatis</p>
        <h2 className="display mt-2 max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)] text-terang">
          Angka hidup, bukan gambar mati.
        </h2>
        <p className="mt-3 max-w-[60ch] text-[0.875rem] leading-relaxed text-terang-2">
          Halaman jelajah dan beranda sekarang menampilkan cuaca dan gempa
          terkini dari sumber resmi (Open-Meteo dan BMKG). Keduanya ditarik
          langsung lewat API publik, tanpa kunci berbayar, dan diperbarui
          otomatis setiap beberapa menit.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          <li>
            <p className="meta-emas">Cuaca</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">
              Sumber: Open-Meteo, tanpa kunci. Diperbarui setiap 10 menit.
            </p>
          </li>
          <li>
            <p className="meta-emas">Gempa</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">
              Sumber: BMKG autogempa, dimuat ulang setiap 5 menit.
            </p>
          </li>
        </ul>
      </section>

      <p className="mt-10 border-t border-garis-malam pt-5 text-[0.8125rem] leading-relaxed text-terang-2">
        Menemukan kesalahan? Arsip ini terbuka untuk koreksi. Buka{" "}
        <Link href="/tentang" className="tautan inline-flex min-h-6 items-center font-medium text-terang">
          halaman tentang
        </Link>{" "}
        untuk melihat siapa yang menyusunnya.
      </p>
    </div>
  );
}