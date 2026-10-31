import type { Metadata } from "next";
import { AsistenChat } from "@/components/asisten-chat";
import { PanelArsip } from "@/components/panel-arsip";
import { ARTIKEL, DESTINASI, TIMELINE, UMKM_PUBLIK, statistikArsip } from "@/lib/arsip";

export const metadata: Metadata = {
  title: "Asisten Sari",
  description:
    "Tanya tentang destinasi, usaha lokal, dan sejarah Palembang. Asisten ini hanya menjawab dari arsip dan menyebut sumbernya.",
};

/**
 * Halaman asisten.
 *
 * Asisten adalah pusat halaman ini: satu kotak percakapan yang mengisi
 * tinggi layar, tanpa header panjang di atasnya. Di layar lebar, kolom
 * samping menunjukkan cakupan arsip yang bisa ditanyakan, jadi pengunjung
 * tahu batasannya sebelum mengetik.
 *
 * Penjelasan cara kerja hanya muncul di bawah kotak pada layar kecil;
 * di layar lebar ia pindah ke kolom samping.
 */
export default function HalamanAsisten() {
  const s = statistikArsip();

  const ringkas = {
    destinasi: s.destinasi,
    umkm: s.umkm,
    artikel: s.artikel,
    peristiwa: s.peristiwa,
    contohDestinasi: DESTINASI.slice(0, 2).map((d) => ({ id: d.id, nama: d.nama, kategori: d.kategori[0] })),
    contohArtikel: ARTIKEL.slice(0, 2).map((a) => ({ id: a.id, judul: a.judul, kategori: a.kategori })),
    contohUMKM: UMKM_PUBLIK.slice(0, 2).map((u) => ({ id: u.id, nama: u.nama, kategori: u.kategori })),
    rentangTahun: `${TIMELINE.peristiwa[0]?.tahun ?? ""}-${TIMELINE.peristiwa[TIMELINE.peristiwa.length - 1]?.tahun ?? ""}`,
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1400px] gap-6 px-5 pb-4 pt-20 sm:px-8 lg:px-12">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col border border-garis-malam bg-malam-2/40 px-4 sm:px-6">
          <AsistenChat ringkasArsip={ringkas} />
        </div>

        <p className="mt-3 shrink-0 text-[0.75rem] leading-relaxed text-terang-3 xl:hidden">
          Sari mencari dokumen di arsip lebih dulu, lalu merangkai jawaban hanya
          dari dokumen itu. Tanpa dokumen yang cocok, jawabannya &ldquo;belum ada
          di arsip&rdquo;. Harga, jam buka, dan kontak tidak pernah dikarang.
        </p>
      </div>

      <PanelArsip r={ringkas} />
    </div>
  );
}