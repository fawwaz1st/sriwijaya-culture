/* ============================================================
   data-timeline.js - tonggak waktu yang tercatat di arsip
   ------------------------------------------------------------
   ATURAN DATA:
   - Setiap entri menunjuk ke record asal (destinasi atau artikel)
     lewat `ref`. Daftar rujukan TIDAK disalin di sini, tapi diambil
     dari field `sumber` record tersebut, supaya hanya ada satu
     sumber kebenaran dan tautan sumber tidak pernah basi.
   - Tahun di sini diambil dari angka yang sudah tertulis di data
     asal (field `fakta` dan isi artikel), bukan angka baru.
   - Peristiwa tanpa rujukan yang jelas tidak dimasukkan. Satu
     daftar pendek yang bisa dipertanggungjawabkan lebih berguna
     daripada daftar panjang yang memakai angka tak bersumber.
   ============================================================ */
window.SC = window.SC || {};

SC.TIMELINE = {
  /* Rentang masa yang dicatat sumber, digambar sebagai pita. */
  era: [
    {
      dari: 1659,
      sampai: 1823,
      label: "Kesultanan Palembang Darussalam",
      ref: { jenis: "artikel", id: "sejarah-songket-palembang" }
    }
  ],

  peristiwa: [
    {
      tahun: 671,
      label: "Pendeta Tiongkok mengunjung Sriwijaya",
      ref: { jenis: "artikel", id: "kerajaan-sriwijaya" }
    },
    {
      tahun: 682,
      label: "Prasasti Kedukan Bukit",
      ref: { jenis: "artikel", id: "kerajaan-sriwijaya" }
    },
    {
      tahun: 684,
      label: "Prasasti Talang Tuwo",
      ref: { jenis: "artikel", id: "kerajaan-sriwijaya" }
    },
    {
      tahun: 1738,
      label: "Masjid Agung mulai dibangun",
      ref: { jenis: "destinasi", id: "masjid-agung" }
    },
    {
      tahun: 1748,
      label: "Masjid Agung rampung",
      ref: { jenis: "destinasi", id: "masjid-agung" }
    },
    {
      tahun: 1780,
      label: "Benteng Kuto Besak mulai dibangun",
      ref: { jenis: "destinasi", id: "benteng-kuto-besak" }
    },
    {
      tahun: 1797,
      label: "Kuto Besak ditempati resmi",
      ref: { jenis: "destinasi", id: "benteng-kuto-besak" }
    },
    {
      tahun: 1823,
      label: "Museum SMB II dibangun",
      ref: { jenis: "destinasi", id: "museum-smb2" }
    },
    {
      tahun: 1830,
      label: "Kampung Kapitan, Tjoa Kie Tjuan jadi mayor",
      ref: { jenis: "destinasi", id: "kampung-kapitan" }
    },
    {
      tahun: 1848,
      label: "Perluasan kolonial Masjid Agung",
      ref: { jenis: "destinasi", id: "masjid-agung" }
    },
    {
      tahun: 1947,
      label: "Perang Lima Hari Lima Malam",
      ref: { jenis: "destinasi", id: "monpera" }
    },
    {
      tahun: 1962,
      label: "Pembangunan Jembatan Ampera",
      ref: { jenis: "destinasi", id: "jembatan-ampera" }
    },
    {
      tahun: 1965,
      label: "Jembatan Ampera digunakan",
      ref: { jenis: "destinasi", id: "jembatan-ampera" }
    },
    {
      tahun: 1975,
      label: "Batu pertama Monpera",
      ref: { jenis: "destinasi", id: "monpera" }
    },
    {
      tahun: 1984,
      label: "Museum SMB II jadi museum",
      ref: { jenis: "destinasi", id: "museum-smb2" }
    },
    {
      tahun: 1988,
      label: "Monpera diresmikan",
      ref: { jenis: "destinasi", id: "monpera" }
    },
    {
      tahun: 1994,
      label: "Taman Purbakala jadi objek wisata",
      ref: { jenis: "destinasi", id: "taman-purbakala-sriwijaya" }
    },
    {
      tahun: 2018,
      label: "Kampung Arab ditata untuk Asian Games",
      ref: { jenis: "destinasi", id: "kampung-arab-al-munawar" }
    },
    {
      tahun: 2023,
      label: "Museum SMB II dipugar",
      ref: { jenis: "destinasi", id: "museum-smb2" }
    }
  ]
};
