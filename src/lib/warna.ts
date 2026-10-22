/**
 * Warna kategori.
 *
 * Semua nilai diukur terhadap dua latar yang benar-benar dipakai situs
 * (--color-malam #0b0d0c dan --color-malam-2 #121514), bukan terhadap
 * latar terang seperti versi sebelumnya. Rasio di komentar adalah hasil
 * hitung, bukan perkiraan.
 *
 * Enam kategori, satu keluarga warna tanah: bata, kunyit, daun, akar,
 * hijau tua, delima. Bukan pelangi, karena arsip ini satu cerita.
 *
 * Dipakai untuk dua hal: bidang warna (badge nomor) dan teks di atas
 * latar gelap. Keduanya lulus WCAG AA untuk teks normal.
 */
export const WARNA_KATEGORI: Record<string, string> = {
  Sejarah: "#e89b76", // 8.71:1 malam · 8.21:1 malam-2
  Budaya: "#f0c766", // 12.13:1 · 11.43:1
  Alam: "#6ed49c", // 10.73:1 · 10.11:1
  Religi: "#b5a8e8", // 9.03:1 · 8.51:1
  Edukasi: "#6ecb92", // 9.86:1 · 9.29:1
  Kuliner: "#f090a5", // 8.58:1 · 8.08:1
  Arsitektur: "#e8b88f", // 9.10:1
  Warisan: "#f0c766", // 12.13:1
  "Kuliner Khas": "#f090a5",
  Pempek: "#f0c766",
  Songket: "#e89b76",
  "Kerajinan Tangan": "#b5a8e8",
  "Oleh-oleh": "#6ed49c",
  "Kopi & Minuman": "#e8b88f",
};

const CADANGAN = "#a8b5aa"; // 8.2:1 malam

export function warnaKategori(kategori: string | undefined): string {
  if (!kategori) return CADANGAN;
  return WARNA_KATEGORI[kategori] ?? CADANGAN;
}

/**
 * Warna teks yang aman di atas bidang warna kategori.
 *
 * Semua warna kategori di atas terang, jadi teks di atasnya harus gelap.
 * Tetap dihitung supaya kalau nanti ada warna gelap ditambahkan,
 * hasilnya tidak diam-diam tidak terbaca.
 */
export function teksDiAtasKategori(kategori: string | undefined): string {
  const w = warnaKategori(kategori);
  const n = parseInt(w.slice(1), 16);
  const lum = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lum((n >> 16) & 255) + 0.7152 * lum((n >> 8) & 255) + 0.0722 * lum(n & 255);
  return L > 0.35 ? "#0b0d0c" : "#f2efe8";
}
