/**
 * Dimensi asli setiap foto, dibaca dari berkas JPEG saat build.
 * Dipakai untuk mempertahankan rasio asli foto: foto potret tetap
 * potret, foto lebar tetap lebar. Memaksa semua foto ke satu rasio
 * membuat koleksi ini terlihat seperti template.
 *
 * DIHASILKAN oleh scripts/image-manifest.mjs
 */
export const FOTO = {
  "/images/ampera-1.jpg": {
    "w": 1280,
    "h": 2276,
    "r": 0.5624,
    "o": "p"
  },
  "/images/ampera-2.jpg": {
    "w": 1280,
    "h": 853,
    "r": 1.5006,
    "o": "l"
  },
  "/images/ampera-3.jpg": {
    "w": 1280,
    "h": 853,
    "r": 1.5006,
    "o": "l"
  },
  "/images/bkb-1.jpg": {
    "w": 1280,
    "h": 853,
    "r": 1.5006,
    "o": "l"
  },
  "/images/bkb-2.jpg": {
    "w": 1280,
    "h": 828,
    "r": 1.5459,
    "o": "l"
  },
  "/images/kapitan-1.jpg": {
    "w": 1280,
    "h": 720,
    "r": 1.7778,
    "o": "l"
  },
  "/images/kedukan-1.jpg": {
    "w": 1280,
    "h": 960,
    "r": 1.3333,
    "o": "l"
  },
  "/images/kemaro-2.jpg": {
    "w": 1280,
    "h": 2276,
    "r": 0.5624,
    "o": "p"
  },
  "/images/masjid-1.jpg": {
    "w": 1280,
    "h": 960,
    "r": 1.3333,
    "o": "l"
  },
  "/images/masjid-2.jpg": {
    "w": 1280,
    "h": 958,
    "r": 1.3361,
    "o": "l"
  },
  "/images/monpera-1.jpg": {
    "w": 1280,
    "h": 1707,
    "r": 0.7499,
    "o": "p"
  },
  "/images/museum-1.jpg": {
    "w": 1280,
    "h": 853,
    "r": 1.5006,
    "o": "l"
  },
  "/images/museum-2.jpg": {
    "w": 1280,
    "h": 1707,
    "r": 0.7499,
    "o": "p"
  },
  "/images/musi-1.jpg": {
    "w": 1280,
    "h": 853,
    "r": 1.5006,
    "o": "l"
  },
  "/images/musi-2.jpg": {
    "w": 1280,
    "h": 770,
    "r": 1.6623,
    "o": "l"
  },
  "/images/pempek-1.jpg": {
    "w": 800,
    "h": 507,
    "r": 1.5779,
    "o": "l"
  },
  "/images/pempek-2.jpg": {
    "w": 1280,
    "h": 960,
    "r": 1.3333,
    "o": "l"
  },
  "/images/pempek-3.jpg": {
    "w": 1280,
    "h": 720,
    "r": 1.7778,
    "o": "l"
  },
  "/images/songket-1.jpg": {
    "w": 1280,
    "h": 853,
    "r": 1.5006,
    "o": "l"
  },
  "/images/songket-2.jpg": {
    "w": 1280,
    "h": 1280,
    "r": 1,
    "o": "l"
  },
  "/images/tpks-1.jpg": {
    "w": 1280,
    "h": 720,
    "r": 1.7778,
    "o": "l"
  },
  "/images/tpks-2.jpg": {
    "w": 1280,
    "h": 823,
    "r": 1.5553,
    "o": "l"
  },
  "/images/tpks-3.jpg": {
    "w": 1280,
    "h": 743,
    "r": 1.7227,
    "o": "l"
  }
} as const;

export type SrcFoto = keyof typeof FOTO;

export function rasio(src: string): number {
  const f = (FOTO as Record<string, { r: number }>)[src];
  return f ? f.r : 1.5;
}

export function potret(src: string): boolean {
  const f = (FOTO as Record<string, { o: string }>)[src];
  return f ? f.o === "p" : false;
}
