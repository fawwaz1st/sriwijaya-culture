/**
 * Manifest PWA minimal.
 *
 * Cukup supaya peramban Android menawarkan "Tambah ke layar utama"
 * dengan nama dan warna yang benar. Tidak ada service worker: arsip
 * ini hidup dari data segar, dan offline-first menambah kompleksitas
 * tanpa nilai untuk pengunjung sekali-datang.
 */
export default function manifest() {
  return {
    name: "Sriwijaya Culture — Arsip Digital Palembang",
    short_name: "Sriwijaya",
    description:
      "Destinasi, usaha lokal, dan sejarah budaya Kota Palembang. Setiap angka menunjuk sumbernya.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d0c",
    theme_color: "#0b0d0c",
    lang: "id",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
