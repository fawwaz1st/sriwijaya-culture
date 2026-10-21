import Image from "next/image";
import Link from "next/link";
import { AtlasMap } from "@/components/atlas-map";
import { TimelineSejarah } from "@/components/timeline";
import { AngkaBesar, JudulBagian, Tombol } from "@/components/ui";
import { DESTINASI, ARTIKEL, UMKM, statistikArsip, TIMELINE } from "@/lib/arsip";
import { warnaKategori } from "@/lib/warna";

export default function Beranda() {
  const s = statistikArsip();
  const unggulan = DESTINASI[0];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-10">
        <div className="grid gap-0 border border-garis lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
            <div>
              <p className="label-arsip">
                <span className="mr-2 text-kunyit-ink">Lembar 01</span>
                Arsip terbuka · Palembang
              </p>
              <h1 className="judul-arsip mt-4 text-[clamp(2.5rem,6.4vw,5rem)]">
                Sepuluh tempat
                <br />
                yang membentuk
                <br />
                <span className="text-hijau-700">sebuah kota.</span>
              </h1>
              <p className="prosa mt-6 max-w-[46ch] text-lg">
                Destinasi, usaha lokal, dan catatan sejarah budaya Palembang.
                Setiap angka menunjuk sumber, dan yang belum pasti ditandai
                belum pasti.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tombol href="/destinasi" panah>
                Jelajahi destinasi
              </Tombol>
              <Tombol href="/asisten" varian="garis">
                Tanya Asisten Sari
              </Tombol>
            </div>
          </div>

          <div className="grup-foto relative min-h-[320px] overflow-hidden border-t border-garis lg:min-h-[520px] lg:border-l lg:border-t-0">
            <Image
              src={unggulan.gambar[1]?.src ?? unggulan.gambar[0].src}
              alt={unggulan.gambar[1]?.caption ?? unggulan.gambar[0].caption}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="foto-arsip object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-hijau-950/80 via-hijau-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
              <p className="label-arsip text-kunyit-muda/90">Sampul · 01</p>
              <p className="mt-1 font-display text-xl leading-tight text-kertas sm:text-2xl">
                {unggulan.nama}
              </p>
              <p className="mt-1 max-w-[42ch] text-xs leading-relaxed text-kertas/70">
                {unggulan.ringkas}
              </p>
            </div>
          </div>
        </div>

        {/* Pita angka: dihitung dari data, bukan ditulis manual. */}
        <div className="grid grid-cols-2 gap-y-5 border border-t-0 border-garis bg-kertas-2 px-4 py-5 sm:grid-cols-3 lg:grid-cols-6 lg:px-6">
          <AngkaBesar nilai={s.destinasi} label="Destinasi" catatan={`${s.destinasiTerpetakan} berkoordinat`} />
          <AngkaBesar nilai={s.umkm} label="Usaha lokal" catatan="Direktori UMKM" />
          <AngkaBesar nilai={s.artikel} label="Catatan" catatan="Artikel sejarah" />
          <AngkaBesar nilai={s.peristiwa} label="Tonggak" catatan="Garis waktu" />
          <AngkaBesar nilai={s.sumber} label="Sumber" catatan="Dirujuk per klaim" />
          <AngkaBesar nilai={s.persenTerverifikasi} satuan="%" label="Terverifikasi" catatan="Sumber tingkat tinggi" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <JudulBagian
          nomor="02"
          judul="Posisi yang sebenarnya, bukan ilustrasi"
          keterangan="Jalan dan sungai digambar dari koordinat OpenStreetMap. Pin bernomor karena empat destinasi berdekatan di kawasan Bukit Kecil."
          aksi={<Tombol href="/destinasi" varian="garis" panah>Semua destinasi</Tombol>}
        />
        <div className="mt-6">
          <AtlasMap daftar={DESTINASI} />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <JudulBagian
          nomor="03"
          judul="Seribu tiga ratus tahun, diringkas"
          keterangan={`${TIMELINE.peristiwa.length} tonggak yang angkanya sudah tertulis di arsip. Sumbu digambar proporsional terhadap jarak tahun.`}
          aksi={<Tombol href="/artikel" varian="garis" panah>Baca sejarah</Tombol>}
        />
        <div className="mt-6">
          <TimelineSejarah />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <JudulBagian
          nomor="04"
          judul="Mulai dari yang paling dikenal"
          aksi={<Tombol href="/destinasi" varian="garis" panah>Katalog lengkap</Tombol>}
        />
        <div className="mt-6 grid gap-0 border border-garis sm:grid-cols-2 lg:grid-cols-3">
          {DESTINASI.slice(0, 6).map((d, i) => (
            <Link
              key={d.id}
              href={`/destinasi/${d.id}`}
              className="grup-foto group relative flex flex-col border-b border-garis sm:border-r [&:nth-child(2n)]:sm:border-r-0 lg:[&:nth-child(2n)]:sm:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-kertas-3">
                <Image
                  src={d.gambar[0].src}
                  alt={d.gambar[0].caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="foto-arsip object-cover"
                />
                <span
                  className="absolute left-0 top-0 px-1.5 py-1 font-mono text-[0.5625rem] font-semibold text-kertas"
                  style={{ background: warnaKategori(d.kategori[0]) }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="label-arsip text-[0.5625rem]">{d.kategori.join(" · ")}</p>
                <p className="mt-1 font-display text-xl leading-tight text-tinta group-hover:text-hijau-700">
                  {d.nama}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-tinta-2">
                  {d.ringkas}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <JudulBagian
          nomor="05"
          judul="Pahami tempatnya sebelum datang"
          aksi={<Tombol href="/artikel" varian="garis" panah>Katalog artikel</Tombol>}
        />
        <div className="mt-6 grid gap-0 border border-garis md:grid-cols-2 lg:grid-cols-3">
          {ARTIKEL.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href={`/artikel/${a.id}`}
              className="group flex flex-col border-b border-garis md:border-r md:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(3)]:border-b-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={a.gambar}
                  alt={a.gambarCaption}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="label-arsip text-[0.5625rem]">{a.kategori}</p>
                <p className="mt-1 font-display text-lg leading-snug text-tinta group-hover:text-hijau-700">
                  {a.judul}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <JudulBagian
          nomor="06"
          judul="Dukung usaha lokal Palembang"
          keterangan="Alamat dan kontak hanya ditampilkan bila sudah diverifikasi. Entri contoh diberi label jelas."
          aksi={<Tombol href="/umkm" varian="garis" panah>Buka direktori</Tombol>}
        />
        <div className="mt-6 grid gap-0 border border-garis sm:grid-cols-2 lg:grid-cols-4">
          {UMKM.slice(0, 4).map((u) => (
            <Link
              key={u.id}
              href={`/umkm/${u.id}`}
              className="group border-b border-garis sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={u.gambar[0].src}
                  alt={u.gambar[0].caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="label-arsip text-[0.5625rem]">{u.kategori}</p>
                <p className="mt-1 font-display text-base leading-tight text-tinta">{u.nama}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

