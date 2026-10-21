/* eslint-disable */
/**
 * DIHASILKAN OTOMATIS oleh scripts/export-data.mjs.
 * Jangan diedit manual. Sumber: js/data-*.js (commit baseline).
 */
export const umkmTerkait = {
  "pempek-beringin": [
    "pempek-candy",
    "oleh-oleh-khas-palembang",
    "kuliner-palembang-rumahan"
  ],
  "pempek-candy": [
    "pempek-beringin",
    "kuliner-palembang-rumahan",
    "oleh-oleh-khas-palembang"
  ],
  "fikri-koleksi-songket": [
    "kerajinan-songket-rumahan",
    "oleh-oleh-khas-palembang",
    "kopi-lokal-palembang"
  ],
  "kerajinan-songket-rumahan": [
    "fikri-koleksi-songket",
    "oleh-oleh-khas-palembang"
  ],
  "oleh-oleh-khas-palembang": [
    "pempek-beringin",
    "pempek-candy",
    "kerajinan-songket-rumahan"
  ],
  "kuliner-palembang-rumahan": [
    "pempek-beringin",
    "pempek-candy",
    "kopi-lokal-palembang"
  ],
  "kopi-lokal-palembang": [
    "kuliner-palembang-rumahan",
    "oleh-oleh-khas-palembang"
  ]
} as const;
