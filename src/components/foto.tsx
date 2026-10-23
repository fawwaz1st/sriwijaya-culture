import Image from "next/image";
import { cn } from "@/lib/cn";
import { FOTO, rasio } from "@/lib/foto";

/**
 * Foto arsip.
 *
 * Dua mode:
 * 1. Rasio asli (default). Foto potret tetap potret, foto lebar tetap
 *    lebar. Ini yang dipakai di hero dan halaman detail, karena memotong
 *    koleksi di sana berarti menghilangkan informasi.
 * 2. Bingkai seragam lewat `rasioPaksa`. Dipakai hanya di grid katalog,
 *    di mana ritme baris lebih penting daripada rasio masing-masing foto.
 *    Pemotongan ini disengaja dan tidak mengurangi isi halaman detail.
 *
 * `prioritas` hanya untuk satu foto per halaman, yaitu kandidat LCP.
 *
 * `rasioPaksa="bebas"` melepas rasio inline sepenuhnya. Dipakai saat
 * bingkai ditentukan oleh wadah ber-tinggi tetap (mis. pita sinematik),
 * karena inline aspect-ratio akan mengalahkan tinggi wadah.
 */
export function Foto({
  src,
  alt,
  className,
  prioritas = false,
  sizes = "100vw",
  rasioPaksa,
  posisi = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  prioritas?: boolean;
  sizes?: string;
  /** Bingkai editorial seragam, mis. "4 / 5". */
  rasioPaksa?: string;
  posisi?: "center" | "top" | "bottom";
}) {
  const f = (FOTO as Record<string, { w: number; h: number; r: number }>)[src];
  const w = f?.w ?? 1280;
  const h = f?.h ?? 853;
  const bebas = rasioPaksa === "bebas";
  const r = bebas ? undefined : (rasioPaksa ?? String(rasio(src)));

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      priority={prioritas}
      sizes={sizes}
      className={cn(
        "foto",
        posisi === "top" && "object-top",
        posisi === "bottom" && "object-bottom",
        className,
      )}
      style={r ? { aspectRatio: r } : undefined}
    />
  );
}
