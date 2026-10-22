const SITE = "https://sriwijaya-culture.vercel.app";

/**
 * Struktur data JSON-LD untuk mesin pencari.
 *
 * TouristDestination di beranda dan Article di halaman artikel memberi
 * Google konteks eksplisit: ini tempat wisata, ini artikel sejarah.
 * Ditaruh sebagai komponen server murni — tidak ada JS yang jalan.
 */
export function JsonLdDestinasi({
  nama,
  deskripsi,
  gambar,
  koordinat,
  href,
}: {
  nama: string;
  deskripsi: string;
  gambar?: string;
  koordinat?: { lat: number; lng: number };
  href: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: nama,
    description: deskripsi,
    url: `${SITE}${href}`,
    ...(gambar && { image: `${SITE}${gambar}` }),
    ...(koordinat && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: koordinat.lat,
        longitude: koordinat.lng,
      },
    }),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palembang",
      addressRegion: "Sumatera Selatan",
      addressCountry: "ID",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Data berasal dari arsip internal, bukan masukan pengguna.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function JsonLdSitus() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sriwijaya Culture",
    alternateName: "Arsip Digital Palembang",
    url: SITE,
    description:
      "Arsip digital destinasi, usaha lokal, dan sejarah budaya Kota Palembang.",
    inLanguage: "id-ID",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
