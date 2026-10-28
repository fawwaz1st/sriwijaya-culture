/**
 * Favorit lokal.
 *
 * Disimpan di peramban pengguna, tanpa server dan tanpa akun. Ini
 * bukan data arsip: ia hanya mengingat apa yang pengunjung tandai.
 * Karena itu ia tidak pernah dikirim ke mana pun dan tidak pernah
 * dianggap fakta. Kunci disimpan per jenis entri supaya id yang sama
 * pada destinasi dan usaha tidak bentrok.
 */
export interface EntitasFavorit {
  id: string;
  jenis: "destinasi" | "artikel" | "usaha";
  nama: string;
  href: string;
}

const KUNCI = "sriwijaya-favorit-v1";
const PERUBAHAN = "sriwijaya-favorit-berubah";

let mentahCache: string | null | undefined;
let daftarCache: EntitasFavorit[] = [];

function parse(mentah: string | null): EntitasFavorit[] {
  if (!mentah) return [];
  try {
    const parsed = JSON.parse(mentah);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is EntitasFavorit =>
        Boolean(x) &&
        typeof x === "object" &&
        typeof x.id === "string" &&
        typeof x.jenis === "string" &&
        typeof x.nama === "string" &&
        typeof x.href === "string",
    );
  } catch {
    return [];
  }
}

/**
 * Daftar dengan cache stabil.
 *
 * useSyncExternalStore menuntut getSnapshot mengembalikan nilai yang
 * sama selama sumbernya tidak berubah. Tanpa cache, setiap render akan
 * membuat array baru dan React mengeluh.
 */
export function daftarFavorit(): EntitasFavorit[] {
  if (typeof window === "undefined") return [];
  const mentah = window.localStorage.getItem(KUNCI);
  const kunci = mentah ?? "";
  if (kunci !== mentahCache) {
    mentahCache = kunci;
    daftarCache = parse(mentah);
  }
  return daftarCache;
}

export function bacaFavorit(): EntitasFavorit[] {
  return daftarFavorit().map((x) => ({ ...x }));
}

export function simpanFavorit(daftar: EntitasFavorit[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(daftar));
  } catch {
    // Penyimpanan bisa penuh atau diblokir; simpanan tetap di cache sesi ini.
  }
  mentahCache = JSON.stringify(daftar);
  daftarCache = daftar.map((x) => ({ ...x }));
  window.dispatchEvent(new CustomEvent(PERUBAHAN));
}

export function kunciEntitas(id: string, jenis: EntitasFavorit["jenis"]): string {
  return jenis + ":" + id;
}

export function adalahFavorit(id: string, jenis: EntitasFavorit["jenis"]): boolean {
  return daftarFavorit().some((x) => x.id === id && x.jenis === jenis);
}

export function toggleFavorit(entitas: EntitasFavorit): boolean {
  const daftar = daftarFavorit();
  const ada = daftar.some((x) => x.id === entitas.id && x.jenis === entitas.jenis);
  const baru = ada
    ? daftar.filter((x) => !(x.id === entitas.id && x.jenis === entitas.jenis))
    : [entitas, ...daftar];
  simpanFavorit(baru);
  return !ada;
}

export function hapusFavorit(id: string, jenis: EntitasFavorit["jenis"]): void {
  simpanFavorit(daftarFavorit().filter((x) => !(x.id === id && x.jenis === jenis)));
}

export const PERUBAHAN_FAVORIT = PERUBAHAN;

/** Langganan perubahan favorit untuk useSyncExternalStore. */
export function langgananFavorit(ubah: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => ubah();
  window.addEventListener(PERUBAHAN, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PERUBAHAN, onChange);
    window.removeEventListener("storage", onChange);
  };
}