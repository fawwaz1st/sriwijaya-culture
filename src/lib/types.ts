/**
 * Skema data arsip.
 *
 * Semua rekaman ditulis manual oleh tim, jadi bentuknya bisa ditegakkan
 * di satu tempat dan dipakai bersama oleh server component, API AI,
 * dan pembuat sitemap. Field yang opsional memang opsional di data.
 */

export type Verifikasi = "tinggi" | "sedang" | "perlu-konfirmasi";

export type KategoriDestinasi =
  | "Sejarah"
  | "Budaya"
  | "Alam"
  | "Religi"
  | "Edukasi"
  | "Kuliner";

export type KategoriArtikel =
  | "Sejarah"
  | "Budaya"
  | "Arsitektur"
  | "Kuliner"
  | "Warisan";

export type KategoriUMKM =
  | "Kuliner Khas"
  | "Pempek"
  | "Songket"
  | "Kerajinan Tangan"
  | "Oleh-oleh"
  | "Kopi & Minuman";

export interface Gambar {
  src: string;
  caption: string;
  kredit: string;
}

export interface Koordinat {
  lat: number;
  lng: number;
}

export interface Fakta {
  k: string;
  v: string;
}

export interface Sumber {
  judul: string;
  penulis: string;
  url: string;
  verifikasi?: Verifikasi;
  tahun?: number | null;
  catatan?: string;
}

export interface KlaimTerverifikasi {
  verifikasi: Verifikasi;
  teks: string;
}

export interface Ulasan {
  status: string;
  pesan: string;
}

export interface Legenda {
  judul: string;
  isi: string;
}

export interface Destinasi {
  id: string;
  nama: string;
  namaLengkap: string;
  kategori: KategoriDestinasi[];
  wilayah: string;
  ringkas: string;
  gambar: Gambar[];
  deskripsi: string;
  sejarah: string;
  legenda?: Legenda | null;
  dayaTarik: string[];
  aktivitas: string[];
  alamat: string;
  koordinat?: Koordinat | null;
  mapsQuery: string;
  tiket: KlaimTerverifikasi;
  jam: KlaimTerverifikasi;
  akses: string;
  fakta: Fakta[];
  ulasan: Ulasan;
  sumber: Sumber[];
  tanggalDiperbarui?: string;
  artikelTerkait: string[];
  destinasiTerkait: string[];
  catatanVerifikasi?: string;
}

export interface BagianArtikel {
  subjudul: string;
  paragraf: string[];
}

export interface Artikel {
  id: string;
  judul: string;
  kategori: KategoriArtikel;
  ringkas: string;
  tanggal: string;
  diperbarui: string | null;
  penulis: string;
  gambar: string;
  gambarCaption: string;
  status: string;
  pendahuluan: string;
  bagian: BagianArtikel[];
  kesimpulan: string;
  sumber: Sumber[];
  destinasiTulis?: string[];
  destinasiTerkait: string[];
  artikelTerkait: string[];
}

export interface Produk {
  nama: string;
  deskripsi: string;
}

export interface Kontak {
  telepon: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
}

export interface Sosial {
  platform: string;
  url: string;
}

export interface UMKM {
  id: string;
  nama: string;
  kategori: KategoriUMKM;
  wilayah: string;
  statusData: string;
  ringkas: string;
  gambar: Gambar[];
  profil: string;
  sejarah: string | null;
  alamat: string | null;
  koordinat?: Koordinat | null;
  mapsQuery: string;
  kontak: Kontak;
  sosial: Sosial[];
  jam: KlaimTerverifikasi | null;
  produk: Produk[];
  ulasan: Ulasan;
  sumber: Sumber[];
  catatanVerifikasi?: string;
  instagram?: string | null;
  catatan?: string | null;
}

export interface RujukanTimeline {
  jenis: "destinasi" | "artikel";
  id: string;
}

export interface EraTimeline {
  dari: number;
  sampai: number;
  label: string;
  ref: RujukanTimeline;
}

export interface PeristiwaTimeline {
  tahun: number;
  label: string;
  ref: RujukanTimeline;
}

export interface DataTimeline {
  era: EraTimeline[];
  peristiwa: PeristiwaTimeline[];
}

export type KelasJalan = "trunk" | "primary" | "secondary";

export interface SegmenJalan {
  cls: KelasJalan;
  d: string;
}

export interface Sungai {
  nama: string;
  d: string;
}

export interface DataAtlas {
  viewBox: string;
  width: number;
  height: number;
  roi: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  pad: number;
  spanLon: number;
  spanLat: number;
  jalan: SegmenJalan[];
  sungai: Sungai[];
}
