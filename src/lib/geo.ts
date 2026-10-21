import { atlas } from "@/lib/data/atlas";
import type { DataAtlas, Destinasi, Koordinat } from "@/lib/types";

const A = atlas as unknown as DataAtlas;

/**
 * Proyeksi linier dari koordinat geografis ke ruang SVG.
 *
 * Sengaja linier, bukan Mercator: kotak wilayah hanya 0,064 derajat
 * bujur x 0,049 derajat lintang, jadi distorsi Mercator di skala ini
 * tidak terlihat. Yang penting posisi relatifnya benar.
 */
export function proyeksi(lon: number, lat: number): { x: number; y: number } {
  const { roi, pad, spanLon, spanLat, width, height } = A;
  return {
    x: pad + ((lon - roi.minLon) / spanLon) * (width - pad * 2),
    y: pad + ((roi.maxLat - lat) / spanLat) * (height - pad * 2),
  };
}

export interface TitikPeta {
  no: number;
  destinasi: Destinasi;
  x: number;
  y: number;
  kategoriUtama: string;
}

/**
 * Nomor urut hanya diberikan pada destinasi yang koordinatnya sudah
 * diverifikasi. Destinasi tanpa koordinat tidak digambar dan tidak
 * mendapat nomor, supaya indeks tidak punya nomor yang melompat.
 */
export function titikPeta(daftar: readonly Destinasi[]): TitikPeta[] {
  const hasil: TitikPeta[] = [];
  for (const d of daftar) {
    const k: Koordinat | null | undefined = d.koordinat;
    if (!k) continue;
    const { x, y } = proyeksi(k.lng, k.lat);
    hasil.push({
      no: hasil.length + 1,
      destinasi: d,
      x,
      y,
      kategoriUtama: d.kategori[0] ?? "Sejarah",
    });
  }
  return hasil;
}

export function tanpaKoordinat(daftar: readonly Destinasi[]): Destinasi[] {
  return daftar.filter((d) => !d.koordinat);
}

export const ATLAS = A;
