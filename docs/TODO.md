# TODO, Sriwijaya Culture

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
- [x] Peta Google Maps nyata di beranda dan detail destinasi (diukur: iframe 233 KB-1,4 MB, hidup)
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
- [x] **Tidak ada teks di bawah 12px** di seluruh halaman (sebelumnya 116 elemen di beranda berukuran 8-11px)
- [x] Token `--text-2xs` dinaikkan 10px → 12px, `--text-xs` 11px → 13px
- [x] Skala dasar dinaikkan untuk layar ≥1920px dan ≥2560px
- [x] Container diperlebar 1600px → 1760px untuk monitor besar
- [x] Overflow 21px di 320px pada galeri detail destinasi diperbaiki (`min-w-0`)
- [x] Tautan "destinasi lain" menyusut dengan benar di 320px

### Fitur baru sesi ekspansi

- [x] **Tirai pembuka** sekali per sesi, dihormati `prefers-reduced-motion`, tidak pernah menangkap klik
- [x] **Pencarian Ctrl+K** lintas 28 entri, navigasi papan ketik penuh, indeks dikirim dari server
- [x] **Ikon tab dan ikon iOS** dibuat sebagai `ImageResponse`, dirujuk di HTML
- [x] **Halaman `/jelajah`** peta fokus utama dengan penyaring kategori yang menyaring peta dan daftar sekaligus
- [x] **Tombol entri acak** di katalog destinasi
- [x] **Bilah gulir kustom** seluruh situs, versi tinta di bagian berlatar kertas
- [x] **Efek masuk per halaman** berbeda menurut jenis isi (katalog, detail, asisten)
- [x] **Navigasi aktif** memberi latar redup pada menu induk halaman dalam
- [x] **Pemisah katalog** dan nomor bagian ekspresif

### Em dash dan en dash

- [x] 50 em dash dan 24 en dash dihapus dari seluruh `src`, `docs`, dan `scripts`
- [x] Skrip `hapus-dash.mjs` hanya menyentuh karakter dash, tidak menyentuh indentasi
- [x] Verifikasi akhir: em=0, en=0 di seluruh sumber dan dokumentasi

### Perluasan Sari

- [x] Prompt sistem ditambah panduan per jenis pertanyaan dan batas eksplisit (medis, hukum, keuangan, keselamatan)
- [x] Penjaga topik diperluas dari 22 menjadi 44 penanda
- [x] Jawaban langsung tanpa model untuk aktivitas, lokasi, dan kategori (sebelumnya hanya tiket dan jam)
- [x] `deteksiNiat` mengenali tujuh jenis pertanyaan
- [x] Diukur: pertanyaan dalam topik 981-1340 ms, penolakan 8-19 ms, tiket ~280 ms

### Konten baru

- [x] Artikel: Kampung Arab Al Munawar, dan Kenapa Pempek Menjadi Identitas
- [x] Destinasi: Masjid Ki Mas Adirojo (tahun pendirian ditandai belum terverifikasi, koordinat sengaja kosong)
- [x] Angka tetap ("Sepuluh tempat", "Delapan catatan") diganti nilai yang dihitung dari data
- [x] Jumlah akhir: 11 destinasi, 10 artikel, 7 usaha (4 berstatus demonstrasi, tidak dipromosikan)

### Keamanan AI

- [x] **C1** Peran `system` dari klien ditolak; hanya `user` dan `assistant` diterima
- [x] **C2** Penjaga injeksi memeriksa seluruh giliran pengguna dengan daftar penanda eksplisit
- [x] **C3** Validasi sitasi: jawaban tanpa `[n]` sah ditolak dan diganti jawaban arsip
- [x] **H1** Urutan kepercayaan header IP: `x-vercel-forwarded-for` → `x-real-ip` → hop terakhir
- [x] **H1** `LAJU.clear()` dihapus; hanya entri kedaluwarsa dibuang, peta penuh = tolak
- [x] **H2** Jatah BYOK hanya untuk kunci berbentuk sah
- [x] **M1** Batas badan dibaca dari stream (bukan `content-length` yang bisa dipalsukan)
- [x] **M2** Validasi bentuk pesan dan `parts`; badan rusak menghasilkan 400, bukan 500
- [x] **M4** Log galat tidak lagi mencatat objek mentah yang memuat prompt

### Bug percakapan yang ditemukan lewat pengujian end-to-end

- [x] **Pertanyaan kedua hilang** saat dikirim sebelum jawaban pertama selesai (dibuang tanpa pesan). Sekarang diantrekan.
- [x] **Duplikasi pesan** pada antrean: pertanyaan yang sama muncul dua kali. Riwayat kini dikirim tanpa duplikat.
- [x] **Riwayat basi**: `kirim` memakai `pesan` dari closure, bukan keadaan terbaru. Diganti `pesanRef` lewat effect.
- [x] **Server memilih pertanyaan salah**: pesan antrean bisa mendahului, sehingga `at(-1)` menunjuk pesan yang salah. Kini pertanyaan yang diproses selalu ditaruh di akhir payload.
- [x] **Sumber palsu pada penolakan**: pesan "belum ada di arsip" tetap menampilkan 4 chip. Sumber kini berasal dari jawaban server, bukan dari kata kunci pertanyaan.
- [x] **Penolakan meracuni percakapan**: satu pertanyaan di luar topik mematikan semua pertanyaan berikutnya. Pemeriksaan diganti dari "retrieval kosong" menjadi "ada instruksi menyimpang".

### Kunci model untuk produksi

- [x] Lima variabel lingkungan terpasang di Vercel (`GROQ_API_KEY`, tiga model, site URL)
- [x] Terverifikasi di produksi: `mode=groq`, jawaban 1,3-2,2 detik dengan sitasi
- [x] Injeksi `system` di produksi diabaikan; pertanyaan luar topik ditolak 12-26 ms
- [x] `scan-secrets.mjs` bersih: tidak ada kunci di berkas kerja maupun riwayat commit


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

### Bug percakapan (ditemukan lewat pengujian, bukan pembacaan kode)

- [x] Pertanyaan kedua hilang tanpa jejak saat dikirim sebelum jawaban pertama selesai
- [x] Pertanyaan antrean muncul dua kali (duplikasi pesan)
- [x] Riwayat basi karena closure pesan (diganti pesanRef lewat effect)
- [x] Server memilih pertanyaan yang salah saat ada pesan antrean
- [x] Jawaban penolakan tetap menampilkan chip rujukan (kontradiksi)
- [x] Panel rujukan dihitung ulang dari pertanyaan, bukan dari jawaban

### Produksi

- [x] Lima variabel lingkungan terpasang di Vercel (terenkripsi)
- [x] Asisten produksi berjalan dengan model Groq (mode=groq)
- [x] Injeksi peran system diabaikan di produksi
- [x] Peta produksi hidup (iframe 1,45 MB, frame Google aktif)
- [x] Dua pertanyaan berdekatan dijawab keduanya di produksi

### Kualitas kode

- [x] `tsc --noEmit` bersih
- [x] `eslint --max-warnings=0` bersih
- [x] `npm run build` sukses
- [x] `audit-final.mjs` → **0 masalah dari 50 pemeriksaan**
- [x] `uji-keamanan.mjs` → 8/8 skenario berperilaku benar
- [x] `uji-asisten.mjs` → jawaban model 1,3 detik dengan sitasi sah

### QA visual per bagian

- [x] `qa-section.mjs` → 129 bagian di 39 halaman, 0 temuan
- [x] `qa-viewport.mjs` → 22 tangkapan untuk rute yang tidak punya `<section>`
- [x] `audit-tipografi.mjs` → 22 bersih di 11 lebar layar, termasuk deteksi widow
- [x] 86 tangkapan bagian di `_shot/section`, 22 di `_shot/viewport`
- [x] Gradien `fixed` di dalam wadah bergulir `/asisten` diperbaiki
- [x] Widow dihapus lewat `text-wrap: pretty` pada seluruh paragraf
- [x] Thumbnail daftar terkait diseragamkan (selisih tinggi 0 px)
- [x] Daftar terkait diubah ke satu kolom agar tidak menyisakan sel kosong
- [x] Kontras judul "Bacaan lain" dipulihkan dari 1,05:1
- [x] Ukuran baris `.baca` dipatok `38rem`, tidak lagi bergantung `ch`
- [x] Foto Benteng Kuto Besak diganti ke foto gerbang agar papan nama tidak terpotong

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
