const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/** "2026-10-18" -> "18 Oktober 2026". */
export function tanggalPanjang(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const bulan = BULAN[Number(m) - 1];
  if (!bulan || !d || !y) return iso;
  return `${Number(d)} ${bulan} ${y}`;
}

/** "2026-10-18" -> "18 Okt 2026" untuk ruang sempit. */
export function tanggalPendek(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const bulan = BULAN[Number(m) - 1];
  if (!bulan || !d || !y) return iso;
  return `${Number(d)} ${bulan.slice(0, 3)} ${y}`;
}

/** Koordinat dengan 4 desimal, format yang dipakai atlas. */
export function koordinatTeks(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/**
 * Angka ribuan gaya Indonesia tanpa Intl, supaya hasil server dan klien
 * selalu sama (Intl bisa berbeda antar runtime dan memicu hydration mismatch).
 */
export function angka(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function persen(bagian: number, total: number): number {
  if (!total) return 0;
  return Math.round((bagian / total) * 100);
}

/** Label singkat untuk status verifikasi, dipakai di badge. */
export const LABEL_VERIFIKASI: Record<string, string> = {
  tinggi: "Terverifikasi",
  sedang: "Satu sumber",
  "perlu-konfirmasi": "Perlu konfirmasi",
};

export function labelVerifikasi(v: string): string {
  return LABEL_VERIFIKASI[v] ?? v;
}
