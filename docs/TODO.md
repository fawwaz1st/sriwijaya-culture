# TODO — Sriwijaya Culture

Status per 23 Oktober 2026. Dokumen ini mencatat apa yang sudah selesai,
apa yang sengaja tidak dikerjakan, dan apa yang tersisa. Diperbarui
setiap kali ada perubahan yang mengubah keadaan proyek.

Legenda: `[x]` selesai dan terverifikasi · `[ ]` belum · `[~]` sengaja
ditunda dengan alasan.

---

## Selesai dan terverifikasi

### Fungsional

- [x] Migrasi penuh dari HTML statis ke Next.js 16 + TypeScript + Tailwind 4
- [x] 38 rute statis, semuanya `200`, tanpa overflow horizontal di 3 viewport
- [x] Asisten Sari: streaming, sitasi bernomor, fallback 3 tingkat, penjaga topik
- [x] Peta Google Maps nyata di beranda dan detail destinasi (diukur: iframe 233 KB–1,4 MB, hidup)
- [x] Atlas SVG dari geometri OpenStreetMap
- [x] Rate limit per-IP, BYOK di localStorage, CSP dengan `frame-src` terbatas

### Data

- [x] Koordinat Pulau Kemaro diverifikasi dari OpenStreetMap + Wikidata (-2.97982, 104.82065)
- [x] Empat entri UMKM berstatus `demonstrasi` disembunyikan dari direktori publik
- [x] `/umkm` menjelaskan berapa entri yang ditahan dan alasannya
- [x] Rute detail entri demonstrasi tetap hidup agar tautan lama tidak 404

### Tata letak

- [x] Void ~340px di bawah kartu Benteng Kuto Besak (baris grid tidak sejajar)
- [x] Void ~320px di kolom tengah "paling dikenal" (diisi tabel fakta)
- [x] Void ~400px di bawah percakapan asisten (komposer tidak di dasar)
- [x] Header asisten pecah 3 baris di 390px
- [x] Foto unggulan artikel terpotong 4:1 (potret dipaksa jadi pita)
- [x] Kartu UMKM tidak sejajar kakinya
- [x] Hero detail destinasi memotong foto potret (dibatasi `max-w-[46rem]`)

### Gerak

- [x] Sistem animasi `animation-timeline` tanpa JavaScript
- [x] Animasi tidak pernah menyembunyikan konten (bug `opacity: 0` dihapus)
- [x] `prefers-reduced-motion` dan `@supports not` mengembalikan keadaan akhir

### Aksesibilitas

- [x] Area sentuh 44px lewat utilitas `.sentuh` untuk chip filter dan tombol kecil
- [x] Satu `h1` per halaman, heading berurutan
- [x] `aria-live` pada log percakapan
- [x] Alt deskriptif pada seluruh gambar

### Kualitas kode

- [x] `tsc --noEmit` bersih
- [x] `eslint --max-warnings=0` bersih
- [x] `npm run build` sukses
- [x] `verify-visual.mjs` 33/33 lolos

---

## Belum dikerjakan

### Konten (butuh manusia, bukan kode)

- [ ] Verifikasi alamat, telepon, dan jam buka tiga UMKM yang sudah publik,
      supaya entri `demonstrasi` bisa diangkat jadi `rujukan-umum`
- [ ] Foto produk asli untuk Pempek Beringin dan Fikri Koleksi; saat ini
      galeri memakai foto umum dari Wikimedia
- [ ] Kredit fotografer per gambar di halaman galeri (sekarang hanya lisensi)
- [ ] Artikel untuk kategori yang masih kosong

### Teknis

- [ ] Lightbox galeri di halaman detail destinasi
- [ ] Uji kontras otomatis di CI (sekarang diukur manual)
- [ ] Uji regresi visual berbasis snapshot (sekarang hanya cek overflow)
- [ ] Halaman 404 kustom yang memakai bahasa arsip, bukan bawaan Next.js

### Sengaja ditunda

- [~] Embedding vektor untuk pencarian. Korpus 25 dokumen; TF-IDF sudah
      cukup dan embedding menambah ~90 MB unduhan tanpa kenaikan kualitas
      yang terukur.
- [~] Rating dan ulasan pengunjung. Tidak ada mekanisme verifikasi, dan
      arsip ini menolak angka yang tidak bisa ditelusuri.
- [~] Peta statis sebagai fallback. Google Maps embed sudah terbukti hidup;
      fallback statis akan menambah dependensi build tanpa manfaat nyata.

---

## Catatan metode

Dua kali dalam sesi audit, pembacaan visual keliru dan harus dikoreksi
dengan pengukuran:

1. Peta dilaporkan "hitam total". Ternyata `page.screenshot({ fullPage:
   true })` tidak menangkap isi iframe lintas-origin. Pengukuran
   screenshot elemen membuktikan peta hidup.
2. "Distorsi gambar" sebagian besar adalah crop yang disengaja. Hanya
   crop ekstrem yang benar-benar rusak.

Karena itu, klaim visual di proyek ini harus disertai angka dari
peramban, bukan hanya kesan dari screenshot.
