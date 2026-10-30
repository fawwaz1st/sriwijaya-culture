/**
 * Rencana kunjungan lokal.
 *
 * Hanya menyimpan id destinasi, berurutan. Tidak ada nama, catatan,
 * atau data pribadi: nama selalu diambil ulang dari arsip, sehingga
 * rencana tidak bisa menampilkan tempat yang tidak ada di arsip.
 *
 * Dibaca lewat useSyncExternalStore, jadi beberapa komponen tetap
 * sinkron tanpa effect yang memicu render berantai.
 */
export interface ItemRencana {
  id: string;
}

const KUNCI = "sriwijaya-rencana-v1";
const PERUBAHAN = "sriwijaya-rencana-berubah";

let mentahCache: string | null | undefined;
let daftarCache: ItemRencana[] = [];

function parse(mentah: string | null): ItemRencana[] {
  if (!mentah) return [];
  try {
    const parsed = JSON.parse(mentah);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is { id: string } => Boolean(x) && typeof x === "object" && typeof (x as { id?: unknown }).id === "string")
      .map((x) => ({ id: x.id }));
  } catch {
    return [];
  }
}

export function bacaRencana(): ItemRencana[] {
  if (typeof window === "undefined") return [];
  const mentah = window.localStorage.getItem(KUNCI);
  const kunci = mentah ?? "";
  if (kunci !== mentahCache) {
    mentahCache = kunci;
    daftarCache = parse(mentah);
  }
  return daftarCache;
}

function simpan(daftar: ItemRencana[]): void {
  if (typeof window === "undefined") return;
  let teks = "[]";
  try {
    teks = JSON.stringify(daftar);
    window.localStorage.setItem(KUNCI, teks);
  } catch {
    // Penyimpanan bisa diblokir; cache sesi ini tetap dipakai.
  }
  mentahCache = teks;
  daftarCache = daftar.map((x) => ({ ...x }));
  window.dispatchEvent(new CustomEvent(PERUBAHAN));
}

export function tambahKeRencana(id: string): void {
  const daftar = bacaRencana();
  if (daftar.some((x) => x.id === id)) return;
  simpan([...daftar, { id }]);
}

export function hapusDariRencana(id: string): void {
  simpan(bacaRencana().filter((x) => x.id !== id));
}

/** Geser satu tempat: arah -1 naik, +1 turun. */
export function urutkanRencana(id: string, arah: -1 | 1): void {
  const daftar = [...bacaRencana()];
  const i = daftar.findIndex((x) => x.id === id);
  if (i < 0) return;
  const j = i + arah;
  if (j < 0 || j >= daftar.length) return;
  const tmp = daftar[i];
  daftar[i] = daftar[j];
  daftar[j] = tmp;
  simpan(daftar);
}

export const PERUBAHAN_RENCANA = PERUBAHAN;

export function langgananRencana(ubah: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => ubah();
  window.addEventListener(PERUBAHAN, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PERUBAHAN, onChange);
    window.removeEventListener("storage", onChange);
  };
}
