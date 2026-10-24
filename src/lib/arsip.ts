/**
 * Satu pintu masuk ke seluruh data arsip.
 *
 * Server component, API AI, dan sitemap membaca dari sini, jadi
 * tipe dan turunan angka hanya didefinisikan sekali.
 */
import { destinasi as destinasiRaw } from "@/lib/data/destinasi";
import { artikel as artikelRaw } from "@/lib/data/artikel";
import { umkm as umkmRaw } from "@/lib/data/umkm";
import { timeline as timelineRaw } from "@/lib/data/timeline";
import { kategoriDestinasi } from "@/lib/data/kategoriDestinasi";
import { kategoriArtikel } from "@/lib/data/kategoriArtikel";
import { kategoriUMKM } from "@/lib/data/kategoriUMKM";
import { umkmTerkait } from "@/lib/data/umkmTerkait";
import { varianPempek } from "@/lib/data/varianPempek";
import type {
  Artikel,
  DataTimeline,
  Destinasi,
  KategoriArtikel,
  KategoriDestinasi,
  KategoriUMKM,
  UMKM as UMKMRecord,
} from "@/lib/types";
import { persen } from "@/lib/format";

export const DESTINASI = destinasiRaw as unknown as readonly Destinasi[];
export const ARTIKEL = artikelRaw as unknown as readonly Artikel[];

/**
 * Seluruh rekaman UMKM, termasuk entri demonstrasi.
 *
 * Dipakai oleh rute detail dan sitemap supaya tautan lama tidak jadi 404,
 * dan supaya entri contoh tetap bisa diperiksa tim.
 */
export const DAFTAR_UMKM = umkmRaw as unknown as readonly UMKMRecord[];

/**
 * UMKM yang layak tampil di direktori publik.
 *
 * Empat dari tujuh rekaman di data masih berstatus `demonstrasi`: nama
 * usaha, alamat, dan harga belum diverifikasi. Menampilkannya di grid
 * publik membuat arsip terlihat seperti mockup, jadi direktori hanya
 * memuat rekaman berstatus `rujukan-umum`. Entri demonstrasi tetap ada
 * di data dan tetap punya halaman detail, hanya tidak dipromosikan.
 */
export const UMKM_PUBLIK = DAFTAR_UMKM.filter((u) => u.statusData !== "demonstrasi");
/** Alias lama supaya pemanggilan di halaman tetap ringkas. */
export const UMKM = UMKM_PUBLIK;
export const TIMELINE = timelineRaw as unknown as DataTimeline;
export const KATEGORI_DESTINASI = kategoriDestinasi as unknown as readonly KategoriDestinasi[];
export const KATEGORI_ARTIKEL = kategoriArtikel as unknown as readonly KategoriArtikel[];
export const KATEGORI_UMKM = kategoriUMKM as unknown as readonly KategoriUMKM[];
export const UMKM_TERKAIT = umkmTerkait as unknown as Record<string, readonly string[]>;
export const VARIAN_PEMPEK = varianPempek as unknown as readonly string[];

export function cariDestinasi(id: string): Destinasi | null {
  return DESTINASI.find((d) => d.id === id) ?? null;
}

export function cariArtikel(id: string): Artikel | null {
  return ARTIKEL.find((a) => a.id === id) ?? null;
}

export function cariUMKM(id: string): UMKMRecord | null {
  return DAFTAR_UMKM.find((u) => u.id === id) ?? null;
}

/** Destinasi yang punya koordinat terverifikasi. */
export const DESTINASI_TERPETAKAN = DESTINASI.filter((d) => Boolean(d.koordinat));

/** Artikel yang menaut ke destinasi tertentu. */
export function artikelUntukDestinasi(id: string): Artikel[] {
  return ARTIKEL.filter(
    (a) => a.destinasiTerkait.includes(id) || a.destinasiTerkait.some((x) => x === id),
  );
}

export function destinasiTerkait(d: Destinasi): Destinasi[] {
  return d.destinasiTerkait
    .map((id) => cariDestinasi(id))
    .filter((x): x is Destinasi => Boolean(x));
}

export function artikelTerkait(a: Artikel): Artikel[] {
  return a.artikelTerkait
    .map((id) => cariArtikel(id))
    .filter((x): x is Artikel => Boolean(x));
}

export function umkmTerkaitDari(id: string): UMKMRecord[] {
  const daftar = UMKM_TERKAIT[id] ?? [];
  return daftar.map((x) => cariUMKM(x)).filter((x): x is UMKMRecord => Boolean(x));
}

/** Distribusi kategori destinasi, untuk grafik batang dan donat. */
export function distribusiKategori(): Array<{ label: string; n: number }> {
  return KATEGORI_DESTINASI.map((k) => ({
    label: k,
    n: DESTINASI.filter((d) => d.kategori.includes(k)).length,
  })).filter((x) => x.n > 0);
}

/** Hitungan status verifikasi seluruh sumber di arsip. */
export function statusVerifikasi() {
  const semua = [
    ...DESTINASI.flatMap((d) => d.sumber),
    ...ARTIKEL.flatMap((a) => a.sumber),
    ...UMKM.flatMap((u) => u.sumber),
  ];
  const tinggi = semua.filter((s) => s.verifikasi === "tinggi").length;
  const sedang = semua.filter((s) => s.verifikasi === "sedang").length;
  const perlu = semua.filter((s) => s.verifikasi === "perlu-konfirmasi").length;
  return { total: semua.length, tinggi, sedang, perlu };
}

/**
 * Indeks pencarian cepat.
 *
 * Dibentuk di server lalu dikirim ke komponen klien sebagai prop.
 * Ukurannya kecil (25 baris) sehingga tidak perlu endpoint sendiri,
 * dan pencarian berjalan seketika tanpa permintaan jaringan.
 *
 * `keterangan` sengaja memuat wilayah dan kategori, bukan ringkasan
 * panjang: kolom ini ditampilkan satu baris di panel pencarian, dan
 * yang dicari pengguna biasanya nama tempat atau jenis usaha.
 */
export function indeksCari() {
  return [
    ...DESTINASI.map((d) => ({
      id: d.id,
      jenis: "destinasi" as const,
      judul: d.nama,
      keterangan: `${d.wilayah} · ${d.kategori.join(", ")}`,
      href: `/destinasi/${d.id}`,
    })),
    ...ARTIKEL.map((a) => ({
      id: a.id,
      jenis: "artikel" as const,
      judul: a.judul,
      keterangan: `${a.kategori} · ${a.sumber.length} sumber`,
      href: `/artikel/${a.id}`,
    })),
    ...UMKM_PUBLIK.map((u) => ({
      id: u.id,
      jenis: "usaha" as const,
      judul: u.nama,
      keterangan: `${u.kategori} · ${u.wilayah}`,
      href: `/umkm/${u.id}`,
    })),
  ];
}

export function statistikArsip() {
  const v = statusVerifikasi();
  return {
    destinasi: DESTINASI.length,
    destinasiTerpetakan: DESTINASI_TERPETAKAN.length,
    umkm: UMKM.length,
    artikel: ARTIKEL.length,
    peristiwa: TIMELINE.peristiwa.length,
    sumber: v.total,
    sumberTinggi: v.tinggi,
    persenTerverifikasi: persen(v.tinggi, v.total),
  };
}

/** Rentang tahun dari peristiwa paling awal ke paling akhir. */
export function rentangTahun(): { awal: number; akhir: number; span: number } {
  const tahun = TIMELINE.peristiwa.map((p) => p.tahun);
  const awal = Math.min(...tahun);
  const akhir = Math.max(...tahun);
  return { awal, akhir, span: akhir - awal };
}

/** Pencarian teks sederhana untuk katalog (dipakai di server). */
export function cariTeks<T>(
  daftar: readonly T[],
  kueri: string,
  ambilTeks: (item: T) => string[],
): T[] {
  const q = kueri.trim().toLowerCase();
  if (!q) return [...daftar];
  const kata = q.split(/\s+/);
  return daftar.filter((item) => {
    const teks = ambilTeks(item).join(" ").toLowerCase();
    return kata.every((k) => teks.includes(k));
  });
}
