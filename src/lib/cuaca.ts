/**
 * Pemetaan kode cuaca WMO (Open-Meteo) ke bahasa Indonesia.
 *
 * Sumber: dokumentasi Open-Meteo "Weather variable documentation"
 * (kode standar WMO 4677). Disimpan di satu tempat agar klien dan
 * server memakai nama yang konsisten.
 */
export interface RingkasanCuaca {
  kode: number;
  teks: string;
  ikon: string; // emoji sederhana untuk visual, bukan hiasan
}

const TABEL: Record<number, { teks: string; ikon: string }> = {
  0: { teks: "Cerah", ikon: "☀" },
  1: { teks: "Umumnya cerah", ikon: "🌤" },
  2: { teks: "Berawan sebagian", ikon: "⛅" },
  3: { teks: "Mendung", ikon: "☁" },
  45: { teks: "Berkabut", ikon: "🌫" },
  48: { teks: "Berkabut, embun beku", ikon: "🌫" },
  51: { teks: "Gerimis ringan", ikon: "🌦" },
  53: { teks: "Gerimis sedang", ikon: "🌦" },
  55: { teks: "Gerimis lebat", ikon: "🌧" },
  56: { teks: "Gerimis beku ringan", ikon: "🌧" },
  57: { teks: "Gerimis beku lebat", ikon: "🌧" },
  61: { teks: "Hujan ringan", ikon: "🌧" },
  63: { teks: "Hujan sedang", ikon: "🌧" },
  65: { teks: "Hujan lebat", ikon: "⛈" },
  66: { teks: "Hujan beku ringan", ikon: "🌧" },
  67: { teks: "Hujan beku lebat", ikon: "🌧" },
  71: { teks: "Salju ringan", ikon: "🌨" },
  73: { teks: "Salju sedang", ikon: "🌨" },
  75: { teks: "Salju lebat", ikon: "🌨" },
  77: { teks: "Butiran salju", ikon: "🌨" },
  80: { teks: "Hujan lokal ringan", ikon: "🌧" },
  81: { teks: "Hujan lokal sedang", ikon: "🌧" },
  82: { teks: "Hujan lokal lebat", ikon: "⛈" },
  85: { teks: "Salju lokal ringan", ikon: "🌨" },
  86: { teks: "Salju lokal lebat", ikon: "🌨" },
  95: { teks: "Badai petir", ikon: "⛈" },
  96: { teks: "Badai petir, hujan es ringan", ikon: "⛈" },
  99: { teks: "Badai petir, hujan es lebat", ikon: "⛈" },
};

export function ringkasanKode(kode: number): RingkasanCuaca {
  const e = TABEL[kode];
  if (e) return { kode, teks: e.teks, ikon: e.ikon };
  return { kode, teks: "Cuaca tidak terbaca", ikon: "?" };
}
