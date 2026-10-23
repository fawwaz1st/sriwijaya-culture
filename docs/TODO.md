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
- [x] 38 rute statis, semuanya `200`
- [x] Asisten Sari: sitasi bernomor, rantai model berlapis, penjaga topik
- [x] Peta Google Maps nyata di beranda dan detail destinasi (diukur: iframe 233 KB–1,4 MB, hidup)
- [x] Atlas SVG dari geometri OpenStreetMap
- [x] Rate limit per-IP dengan urutan kepercayaan header yang benar
- [x] BYOK di localStorage, CSP dengan `frame-src` terbatas

### Data

- [x] Koordinat Pulau Kemaro diverifikasi dari OpenStreetMap + Wikidata (-2.97982, 104.82065)
- [x] Empat entri UMKM berstatus `demonstrasi` disembunyikan dari direktori publik **dan dari beranda**
- [x] `/umkm` menjelaskan berapa entri yang ditahan dan alasannya
- [x] Rute detail entri demonstrasi tetap hidup agar tautan lama tidak 404
- [x] Angka "Sembilan titik" diganti nilai yang dihitung dari data (sekarang 10)

### Tata letak

- [x] Void ~340px di bawah kartu Benteng Kuto Besak (baris grid tidak sejajar)
- [x] Void ~320px di kolom tengah "paling dikenal" (diisi tabel fakta)
- [x] Void ~400px di bawah percakapan asisten (komposer tidak di dasar)
- [x] Header asisten pecah 3 baris di 390px
- [x] Foto unggulan artikel terpotong 4:1 (potret dipaksa jadi pita)
- [x] Kartu UMKM tidak sejajar kakinya
- [x] Hero detail destinasi memotong foto potret (dibatasi `max-w-[46rem]`)
- [x] Tabel tonggak garis waktu memakai dua kolom di layar lebar

### Responsif dan tipografi

- [x] Diaudit pada **11 lebar**: 320, 360, 390, 430, 768, 820, 1024, 1280, 1440, 1920, 2560 px
- [x] **0 overflow horizontal** di seluruh 50 kombinasi halaman × lebar
- [x] **Tidak ada teks di bawah 12px** di seluruh halaman (sebelumnya 116 elemen di beranda berukuran 8–11px)
- [x] Token `--text-2xs` dinaikkan 10px → 12px, `--text-xs` 11px → 13px
- [x] Skala dasar dinaikkan untuk layar ≥1920px dan ≥2560px
- [x] Container diperlebar 1600px → 1760px untuk monitor besar
- [x] Overflow 21px di 320px pada galeri detail destinasi diperbaiki (`min-w-0`)
- [x] Tautan "destinasi lain" menyusut dengan benar di 320px

### Keamanan AI

- [x] **C1** Peran `system` dari klien ditolak; hanya `user` dan `assistant` diterima
- [x] **C2** Penjaga topik memeriksa **seluruh** giliran pengguna, bukan hanya yang terakhir
- [x] **C3** Validasi sitasi: jawaban tanpa `[n]` sah ditolak dan diganti jawaban arsip
- [x] **H1** Urutan kepercayaan header IP: `x-vercel-forwarded-for` → `x-real-ip` → hop terakhir
- [x] **H1** `LAJU.clear()` dihapus; hanya entri kedaluwarsa dibuang, peta penuh = tolak
- [x] **H2** Jatah BYOK hanya untuk kunci berbentuk sah
- [x] **M1** Batas badan dibaca dari stream (bukan `content-length` yang bisa dipalsukan)
- [x] **M2** Validasi bentuk pesan dan `parts`; badan rusak menghasilkan 400, bukan 500
- [x] **M4** Log galat tidak lagi mencatat objek mentah yang memuat prompt

### Gerak

- [x] Sistem animasi `animation-timeline` tanpa JavaScript
- [x] Animasi tidak pernah menyembunyikan konten (bug `opacity: 0` dihapus)
- [x] `prefers-reduced-motion` mengembalikan keadaan akhir
- [x] `animation-delay` dihapus dari semua scroll-timeline (menggeser start timeline, bukan waktu)
- [x] `foto-nyala` dihapus: animasi mati yang juga memblokir hover brightness
- [x] `filter: blur()` dihapus dari `angka-naik`; angka terakhir kini terbaca 396ms lebih cepat
- [x] Lima aturan animasi mati dihapus (`muncul`, `buka-tirai`, `garis-tumbuh`, `garis-gulir`, `foto-apung`)

### Keunikan ekspresif

- [x] Bilah progres baca 2px di puncak layar, digerakkan `scroll-timeline`
- [x] Nomor bagian besar dan redup di sudut seksi (penanda katalog museum)
- [x] Tekstur kertas halus dari gradien (tanpa berkas gambar tambahan)
- [x] Garis bawah yang tumbuh pada tautan teks
- [x] Cincin fokus emas untuk navigasi keyboard

### Aksesibilitas

- [x] Area sentuh 44px lewat utilitas `.sentuh` dan aturan `pointer: coarse`
- [x] Satu `h1` per halaman, heading berurutan
- [x] `aria-live` pada log percakapan
- [x] Alt deskriptif pada seluruh gambar

### Kualitas kode

- [x] `tsc --noEmit` bersih
- [x] `eslint --max-warnings=0` bersih
- [x] `npm run build` sukses
- [x] `audit-final.mjs` → **0 masalah dari 50 pemeriksaan**
- [x] `uji-keamanan.mjs` → 8/8 skenario berperilaku benar
- [x] `uji-asisten.mjs` → jawaban model 1,3 detik dengan sitasi sah

---

## Sengaja tidak dikerjakan

- [~] **Harga dan jam buka di kartu direktori.** Field-nya ada, tetapi
  untuk sebagian besar usaha belum diverifikasi. Menampilkannya berarti
  mengarang. Halaman detail tetap menampilkan status verifikasinya.
- [~] **Ulasan dan rating pengunjung.** Tidak ada sumber. Membuatnya
  berarti mengarang pendapat orang.
- [~] **Embedding vektor untuk retrieval.** Korpus 25 dokumen; 90 MB
  unduhan tidak sepadan dengan kenaikan kualitas.
- [~] **Peta statis sebagai cadangan saat Google gagal.** Butuh kunci
  API berbayar. Yang dipakai sekarang: daftar titik di samping peta
  tetap berfungsi walau iframe gagal.
- [~] **CSP nonce untuk `script-src`.** Masih `unsafe-inline`; ini
  memerlukan middleware dan pengujian menyeluruh. Risiko XSS saat ini
  rendah karena tidak ada input pengguna yang dirender sebagai HTML.

---

## Tersisa (kalau ada waktu)

- [ ] Nonce-based CSP lewat middleware, hapus `unsafe-inline` dari `script-src`
- [ ] Rate limit berbasis KV/Redis agar bertahan lintas instans di Vercel
- [ ] Lightbox galeri foto dengan navigasi keyboard
- [ ] Mode bahasa Inggris
- [ ] Halaman 404 yang menyarankan entri terdekat dari arsip
