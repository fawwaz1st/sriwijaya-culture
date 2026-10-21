import type { Metadata } from "next";
import Link from "next/link";
import { AngkaBesar, BadgeVerifikasi, CatatanBelumPasti, JudulBagian } from "@/components/ui";
import { ARTIKEL, DAFTAR_UMKM, DESTINASI, statistikArsip, statusVerifikasi } from "@/lib/arsip";
import { persen } from "@/lib/format";

export const metadata: Metadata = {
  title: "Metodologi dan Sumber",
  description:
    "Cara data arsip Sriwijaya Culture dikumpulkan, diperiksa, dan diberi tingkat verifikasi. Termasuk kredit foto dan batasan yang kami akui.",
};

/**
 * Halaman metodologi.
 *
 * Ini halaman yang membuat klaim di seluruh situs bisa diperiksa.
 * Karena itu isinya bukan kata pengantar, melainkan prosedur:
 * apa yang dihitung, dari mana, dan apa yang sengaja tidak dilakukan.
 */
export default function HalamanMetodologi() {
  const s = statistikArsip();
  const v = statusVerifikasi();

  const semuaSumber = [
    ...DESTINASI.flatMap((d) => d.sumber.map((x) => ({ ...x, induk: d.nama }))),
    ...ARTIKEL.flatMap((a) => a.sumber.map((x) => ({ ...x, induk: a.judul }))),
    ...DAFTAR_UMKM.flatMap((u) => u.sumber.map((x) => ({ ...x, induk: u.nama }))),
  ];

  // Sumber unik berdasarkan URL, supaya angka tidak menggelembung.
  const unik = new Map<string, (typeof semuaSumber)[number]>();
  for (const x of semuaSumber) if (!unik.has(x.url)) unik.set(x.url, x);
  const daftarUnik = [...unik.values()];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="border-t border-tinta pt-4">
        <p className="label-arsip">
          <span className="mr-2 text-kunyit-ink">06</span>Metodologi
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h1 className="judul-arsip max-w-[22ch] text-[clamp(2.25rem,5vw,3.75rem)]">
            Bagaimana kami tahu, dan bagaimana kami salah.
          </h1>
          <p className="max-w-[46ch] pb-1 text-sm leading-relaxed text-tinta-2">
            Setiap angka di situs ini bisa ditelusuri ke satu baris di halaman
            ini. Kalau tidak bisa, angkanya tidak kami tampilkan.
          </p>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-y-5 border border-garis bg-kertas-2 px-4 py-5 sm:grid-cols-3 lg:grid-cols-6">
        <AngkaBesar nilai={s.sumber} label="Rujukan" catatan="Seluruh entri" />
        <AngkaBesar nilai={daftarUnik.length} label="Unik" catatan="Setelah deduplikasi" />
        <AngkaBesar nilai={v.tinggi} label="Tingkat tinggi" catatan="Saling menguatkan" />
        <AngkaBesar nilai={v.sedang} label="Satu sumber" catatan="Belum ada pembanding" />
        <AngkaBesar nilai={v.perlu} label="Perlu konfirmasi" catatan="Ditandai di UI" />
        <AngkaBesar nilai={s.persenTerverifikasi} satuan="%" label="Rasio" catatan="Tinggi / total" />
      </section>

      <section className="mt-12">
        <JudulBagian
          nomor="01"
          judul="Enam aturan yang tidak kami langgar"
          keterangan="Aturan ini yang membuat arsip bisa dipercaya. Kalau sebuah entri melanggar salah satunya, entri itu tidak masuk."
        />
        <ol className="mt-6 grid gap-0 border border-garis md:grid-cols-2">
          {[
            {
              j: "Setiap klaim menunjuk sumber",
              i: "Angka, tanggal, dan peristiwa punya field sumber berisi URL yang bisa dibuka. Tidak ada klaim tanpa rujukan.",
            },
            {
              j: "Perbedaan ditulis sebagai perbedaan",
              i: "Kalau dua sumber berbeda, keduanya dicatat. Kami tidak memilih satu angka hanya karena lebih enak dibaca.",
            },
            {
              j: "Legenda diberi label legenda",
              i: "Cerita rakyat seperti Tan Bun An dan Siti Fatimah ditulis di kotak terpisah dan tidak disebut peristiwa sejarah.",
            },
            {
              j: "Tidak mengisi data yang belum ada",
              i: "Alamat, nomor telepon, akun sosial, harga tiket, dan ulasan tidak diisi perkiraan. Lebih baik kosong daripada salah.",
            },
            {
              j: "Entri contoh diberi label",
              i: "Entri UMKM berstatus demonstrasi ditandai di kartu dan halaman detailnya, supaya tidak dikira usaha nyata.",
            },
            {
              j: "Tidak ada formulir palsu",
              i: "Tidak ada pendaftaran yang berpura-pura menyimpan data permanen. Tidak ada tombol yang tidak melakukan apa pun.",
            },
          ].map((r, i) => (
            <li
              key={r.j}
              className="border-b border-garis p-4 md:border-r md:[&:nth-child(2n)]:border-r-0"
            >
              <p className="tabular font-mono text-[0.625rem] text-kunyit-ink">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-display text-base leading-tight text-tinta">{r.j}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta-2">{r.i}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <JudulBagian
          nomor="02"
          judul="Tiga tingkat, tiga arti"
          keterangan="Badge yang sama dipakai di seluruh situs, jadi kamu bisa membaca keyakinan kami sebelum membuka detail."
        />
        <div className="mt-5 grid gap-0 border border-garis sm:grid-cols-3">
          {[
            {
              t: "tinggi",
              j: "Terverifikasi",
              i: "Didukung lebih dari satu sumber yang saling menguatkan, atau satu sumber resmi yang bisa diperiksa.",
              n: v.tinggi,
            },
            {
              t: "sedang",
              j: "Satu sumber",
              i: "Didukung satu sumber terpercaya, tetapi belum ada pembanding independen.",
              n: v.sedang,
            },
            {
              t: "perlu-konfirmasi",
              j: "Perlu konfirmasi",
              i: "Angka beredar di internet tanpa sumber resmi. Ditampilkan dengan peringatan, atau tidak ditampilkan sama sekali.",
              n: v.perlu,
            },
          ].map((x, i) => (
            <div
              key={x.t}
              className={`border-b border-garis p-4 sm:border-b-0 ${i < 2 ? "sm:border-r" : ""}`}
            >
              <BadgeVerifikasi tingkat={x.t} />
              <p className="mt-2 font-display text-lg leading-tight text-tinta">{x.j}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta-2">{x.i}</p>
              <p className="tabular mt-3 border-t border-garis-2 pt-2 font-mono text-[0.625rem] text-tinta-3">
                {x.n} rujukan · {persen(x.n, v.total)}%
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <JudulBagian
          nomor="03"
          judul="Yang sengaja tidak kami lakukan"
          keterangan="Mengakui batas lebih berguna daripada berpura-pura lengkap."
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <CatatanBelumPasti judul="Harga tiket dan jam buka">
              Beberapa destinasi hanya menampilkan teks tanpa angka pasti, karena
              sumbernya bukan pengelola resmi. Kami tidak mengubah ketidakpastian
              menjadi angka bulat.
            </CatatanBelumPasti>
            <CatatanBelumPasti judul="Ulasan pengunjung">
              Tidak ada ulasan di situs ini. Ulasan yang tidak bisa diverifikasi
              lebih berbahaya daripada tidak ada ulasan.
            </CatatanBelumPasti>
            <CatatanBelumPasti judul="Alamat dan kontak UMKM">
              Verifikasi lapangan tidak bisa dilakukan lewat kode. Nama usaha
              boleh tampil karena terdokumentasi publik, kontak tidak.
            </CatatanBelumPasti>
          </div>
          <div className="border border-garis p-4">
            <p className="label-arsip">Kredit foto</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-tinta-2">
              Seluruh foto berasal dari Wikimedia Commons dengan lisensi Creative
              Commons. Berkas asli diunduh, dikonversi ke JPEG, dan dikompres.
              Kredit per berkas tercantum di halaman detail masing-masing.
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-tinta-2">
              Geometri peta berasal dari OpenStreetMap contributors (ODbL) dan
              disederhanakan dengan Douglas-Peucker agar muat tanpa server peta.
            </p>
            <p className="mt-3 border-t border-garis-2 pt-2 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
              Sumber data diperiksa terakhir: 20 Oktober 2026
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <JudulBagian
          nomor="04"
          judul={`${daftarUnik.length} sumber unik`}
          keterangan="Diurutkan berdasarkan judul. Setiap baris bisa dibuka."
        />
        <ol className="mt-5 border-t border-garis-2">
          {daftarUnik
            .slice()
            .sort((a, b) => a.judul.localeCompare(b.judul, "id"))
            .map((x, i) => (
              <li
                key={x.url}
                className="grid grid-cols-[2rem_1fr] gap-2 border-b border-garis-2 py-2.5 sm:grid-cols-[2.5rem_1fr_auto]"
              >
                <span className="tabular pt-0.5 font-mono text-[0.5625rem] text-tinta-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <a
                    href={x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tautan-arsip text-[0.8125rem] font-medium leading-snug text-tinta"
                  >
                    {x.judul}
                  </a>
                  <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                    {x.penulis} · dipakai di {x.induk}
                  </p>
                </div>
                {x.verifikasi && (
                  <span className="hidden sm:block">
                    <BadgeVerifikasi tingkat={x.verifikasi} />
                  </span>
                )}
              </li>
            ))}
        </ol>
      </section>

      <section className="mt-12 border-t border-garis pt-4">
        <p className="text-[0.8125rem] leading-relaxed text-tinta-2">
          Menemukan kesalahan? Arsip ini terbuka untuk koreksi. Buka{" "}
          <Link href="/tentang" className="tautan-arsip font-medium text-tinta">
            halaman tentang
          </Link>{" "}
          untuk melihat siapa yang menyusunnya dan bagaimana menghubungi tim.
        </p>
      </section>
    </div>
  );
}
