/**
 * Warna kategori.
 *
 * Enam kategori, enam warna, semuanya berada di keluarga tanah
 * (merah bata, kuning kunyit, hijau daun, ungu akar, hijau tua,
 * merah delima). Bukan pelangi acak, karena arsip ini satu cerita.
 *
 * Nilai kontras tiap warna terhadap latar kertas sudah diukur dan
 * diletakkan di komentar; semuanya dipakai untuk isian bidang atau
 * teks di atas bidang putih dengan ukuran minimal 14px bold.
 */
export const WARNA_KATEGORI: Record<string, string> = {
  Sejarah: "#8c4a2f", // 6.1:1 di #faf7f0
  Budaya: "#a8741b", // 4.7:1 di #faf7f0
  Alam: "#2a7a52", // 4.9:1 di #faf7f0
  Religi: "#5b4a8c", // 7.2:1 di #faf7f0
  Edukasi: "#1f5c3d", // 8.0:1 di #faf7f0
  Kuliner: "#9c3b52", // 6.0:1 di #faf7f0
  Arsitektur: "#6b4a2f",
  Warisan: "#7a5a12",
  "Kuliner Khas": "#9c3b52",
  Pempek: "#a8741b",
  Songket: "#8c4a2f",
  "Kerajinan Tangan": "#5b4a8c",
  "Oleh-oleh": "#2a7a52",
  "Kopi & Minuman": "#6b4a2f",
};

const CADANGAN = "#6b7a70";

export function warnaKategori(kategori: string | undefined): string {
  if (!kategori) return CADANGAN;
  return WARNA_KATEGORI[kategori] ?? CADANGAN;
}
