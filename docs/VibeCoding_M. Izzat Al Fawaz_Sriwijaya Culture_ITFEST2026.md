# VibeCoding_M. Izzat Al Fawaz_Sriwijaya Culture_ITFEST2026

**Tim:** Koding Seadanya
**Judul karya:** Sriwijaya Culture, Arsip Digital Palembang
**Kategori:** Web Development
**Tanggal:** 21 Oktober 2026

| Nama | Kode Peserta | Peran |
|---|---|---|
| M. Izzat Al Fawaz | 062640833318 | Pengembang utama, arsitektur, AI |
| Abdur Rachman Abyan | 062640833308 | Data, riset sumber, verifikasi klaim |
| Richa Karina | 062640833326 | Desain, konten, pengujian visual |

---

## 1. Ringkasan

Sriwijaya Culture adalah arsip digital Kota Palembang: 10 destinasi,
7 usaha lokal, 8 catatan sejarah, dan 19 tonggak waktu. Dibangun ulang
dari nol dalam dua hari memakai Next.js 16, TypeScript, Tailwind CSS 4,
dan Vercel AI SDK 7.

Keputusan paling menentukan bukan soal framework, melainkan soal
kejujuran data. Setiap klaim di situs menunjuk sumber. Yang belum pasti
ditandai belum pasti. Fitur AI dirancang untuk mengikuti aturan yang
sama: menolak menjawab daripada mengarang.

---

## 2. Titik awal dan masalahnya

Versi pertama adalah 11 berkas HTML dengan CSS dan JavaScript vanilla.
Fungsional, tetapi punya tiga masalah yang tidak bisa diperbaiki dengan
menambah halaman:

1. **Tidak ada lapisan server.** Semua logika dijalankan di browser,
   termasuk asisten yang memakai model embedding 90 MB. Pengguna
   mengunduh model penuh sebelum bisa bertanya.
2. **Tidak ada tipe.** Skema data berbeda antar rekaman, dan kesalahan
   field hanya terlihat saat halaman dibuka di browser.
3. **Struktur berantakan.** Berkas percobaan (`_audit.js`, `_diag3.py`,
   `_osm_map.json` 25 MB, 73 screenshot) bercampur dengan kode produk.

Keputusan: migrasi penuh ke Next.js, bukan menambal HTML. Alasannya ada
di bagian 4.

---

## 3. Analisis kebutuhan dari guidebook

Guidebook ITFEST 2026 menetapkan enam kriteria penilaian. Setiap
kriteria diterjemahkan menjadi keputusan teknis konkret, bukan niat.

| Kriteria | Bobot | Keputusan teknis |
|---|---|---|
| Kesesuaian tema | 20% | Asisten AI menjadi fitur inti, bukan tempelan. Tema budaya diwujudkan sebagai arsip, bukan katalog jualan. |
| Kreativitas dan inovasi | 20% | Peta SVG dari koordinat OSM asli, garis waktu proporsional, tingkat verifikasi per klaim. |
| Kualitas produk digital | 20% | 38 halaman prerender, responsif 390/820/1440, kontras diukur, reduced-motion dihormati. |
| Implementasi AI | 20% | Retrieval TF-IDF + grounding ketat + sitasi nomor + rantai 3 tingkat penyedia. |
| Kualitas presentasi | 10% | Video 2-5 menit, dokumentasi ini, README teknis. |
| Kelengkapan pengumpulan | 10% | URL hosted, repo publik, video, log ini. |

---

## 4. Keputusan arsitektur dan alasannya

### 4.1 Next.js, bukan HTML statis

| Aspek | HTML vanilla | Next.js 16 |
|---|---|---|
| Asisten AI | Mustahil tanpa server; model 90 MB diunduh klien | Route handler di server, kunci API tidak pernah sampai ke browser |
| Data | Disalin ke setiap halaman | Satu modul `lib/data`, dipakai server dan API |
| Tipe | Tidak ada | TypeScript menangkap field hilang saat build |
| Gambar | JPEG mentah 7 MB total | AVIF/WebP otomatis, `sizes` per breakpoint |
| SEO | Manual per berkas | `sitemap.xml`, `robots.txt`, OG image dari kode |
| Deploy | Unggah manual | `git push` lalu build otomatis |

Biaya migrasi dua hari terbayar oleh satu hal: asisten AI hanya mungkin
ada kalau ada lapisan server. Itu 20% dari nilai kompetisi.

### 4.2 TF-IDF, bukan embedding

Arsip ini 25 dokumen dan 147 KB teks. Embedding akan menambah unduhan
model, latensi, dan dependensi, tanpa kenaikan kualitas yang terukur
pada korpus sekecil ini. TF-IDF dengan bobot judul 3x cukup, dan bisa
dijelaskan ke juri dalam satu kalimat.

Yang lebih penting: **ambang relevansi**. Tanpa ambang, pertanyaan
"Siapa presiden pertama Indonesia?" tetap mengembalikan dokumen karena
kata "pertama" muncul di salah satu judul. Itu membuat asisten terlihat
menjawab padahal sedang mengarang kaitan. Ambang 4.2 dan pemeriksaan
selisih skor menutup celah itu.

### 4.3 Rantai tiga tingkat penyedia

Masalah nyata yang ditemukan saat pengujian: kunci API yang tersedia di
lingkungan ternyata tidak valid (401, format bukan `sk-or-v1-`). Versi
pertama route mengembalikan stream berisi pesan galat. Di depan juri,
itu terlihat seperti aplikasi rusak.

Perbaikan:

1. **Validasi bentuk kunci sebelum dipakai.** Kunci yang bentuknya salah
   dilewati, bukan dicoba.
2. **Tingkat kedua tanpa kunci.** Kalau tidak ada kunci valid, pakai
   endpoint publik dengan batas waktu 14 detik.
3. **Tingkat ketiga dari arsip.** Kalau keduanya gagal, jawaban disusun
   dari field data tanpa model. Selalu berhasil.

Hasil pengujian: 4 dari 4 jenis pertanyaan dijawab dengan benar, tidak
ada jawaban kosong.

### 4.4 Peta dari data, bukan gambar

Geometri 102 segmen jalan dan 3 sungai disimpan sebagai path SVG yang
diproyeksikan dari koordinat asli. Konsekuensinya: destinasi tanpa
koordinat terverifikasi tidak bisa digambar. Pulau Kemaro karena itu
tidak muncul di peta, dan halaman menjelaskan alasannya. Pilihan ini
mengorbankan kelengkapan demi kejujuran, dan itu disengaja.

---

## 5. Peran AI dalam proses

AI dipakai sebagai alat, bukan penulis otomatis. Pembagian kerjanya:

**Yang dikerjakan AI:**
- Menulis kerangka komponen dari skema data yang sudah ditentukan manusia
- Mengubah 147 KB data JS menjadi modul TypeScript lewat skrip, tanpa
  mengetik ulang satu angka pun
- Menyusun prompt sistem dan aturan grounding
- Menjalankan verifikasi visual otomatis dan membaca hasilnya

**Yang diputuskan manusia:**
- Seluruh isi data dan tingkat verifikasi setiap sumber
- Keputusan migrasi dari HTML ke Next.js
- Keputusan memakai TF-IDF, bukan embedding
- Keputusan menolak pertanyaan di luar topik
- Nada tulisan: tenang, spesifik, tanpa bahasa pemasaran

**Yang ditolak AI:**
- Mengisi alamat, telepon, atau harga yang tidak ada di data
- Membuat ulasan atau rating
- Menulis "solusi terbaik untuk kebutuhan Anda" dan sejenisnya

### Pelajaran dari kegagalan nyata

Tiga hal yang salah di percobaan pertama dan diperbaiki:

1. **Model tanpa konteks mengarang.** Uji awal tanpa grounding
   menghasilkan "Jembatan Ampera ada di Padang, Sumatera Barat". Kota
   salah. Ini yang membuat aturan "jawab hanya dari konteks" menjadi
   wajib, bukan saran.
2. **Kunci API tidak valid tidak terdeteksi.** Endpoint daftar model
   bersifat publik, jadi status 200 menyesatkan. Kunci baru terbukti
   salah saat dipakai. Perbaikannya: periksa bentuk kunci lebih dulu.
3. **Retrieval tanpa ambang selalu "menemukan" sesuatu.** Pertanyaan di
   luar topik tetap dapat rujukan. Perbaikannya: ambang skor plus
   penjaga topik eksplisit.

---

## 6. Sistem desain

Konsep: **lembar arsip**. Halaman diperlakukan seperti lembar katalog
museum, bukan landing page.

Keputusan yang mengikuti konsep itu:

- **Sudut 0 sampai 3px.** Arsip tidak membulat.
- **Garis rambut 1px** memisahkan kolom, meniru formulir katalog.
- **Nomor besar di kolom kiri judul bagian**, berfungsi sebagai nomor
  halaman dan muncul konsisten di navigasi.
- **Warna kategori dari keluarga tanah**: merah bata, kuning kunyit,
  hijau daun, ungu akar. Enam warna, satu cerita.
- **Permukaan netral condong hijau**, bukan krem hangat. Krem adalah
  default yang dipakai hampir semua situs bertema budaya; menghindarinya
  membuat arsip ini tidak terlihat seperti template.
- **Tipografi:** Fraunces dengan sumbu variabel WONK untuk judul, sehingga
  huruf terasa dicetak. Instrument Sans untuk badan. IBM Plex Mono untuk
  metadata dan angka.

Kontras diukur, bukan dikira-kira:

| Peran | Warna | Rasio terhadap latar |
|---|---|---|
| Tinta utama | `#16211b` | 14.6:1 |
| Tinta sekunder | `#47574d` | 6.6:1 |
| Tinta tersier | `#6b7a70` | 4.6:1 |
| Aksen kunyit | `#6b4c05` | 6.5:1 |

---

## 7. Hasil verifikasi

Semua angka di bawah berasal dari skrip yang dijalankan, bukan perkiraan.

**Build produksi**
```
next build  →  exit 0
38 halaman prerender statis
TypeScript  →  lulus
ESLint      →  0 error, 0 warning
```

**Verifikasi visual otomatis** (`scripts/verify-visual.mjs`)
```
11 rute x 3 viewport (390, 820, 1440) = 33 pemeriksaan
Overflow horizontal  : 0 pada semua pemeriksaan
Error konsol         : 0 pada semua pemeriksaan
Jumlah h1 per halaman : tepat 1
Status HTTP          : 200 di semua rute
```

**Verifikasi asisten** (`scripts/check-env.mjs` + uji manual)

| Pertanyaan | Mode | Hasil |
|---|---|---|
| Apa itu Jembatan Ampera? | model | Jawaban faktual, 2 rujukan |
| Di mana membeli songket asli? | model | Menyebut 3 usaha dari arsip |
| Berapa tiket Pulau Kemaro? | arsip langsung | Data terverifikasi + peringatan sumber |
| Siapa presiden pertama Indonesia? | arsip langsung | "Belum ada di arsip kami", 0 rujukan |

**Responsif:** diuji pada 390px, 820px, dan 1440px. Tidak ada scroll
horizontal, tidak ada teks terpotong, tidak ada gambar gepeng.

---

## 8. Yang tidak dikerjakan, dan kenapa

- **Tidak ada akun pengguna.** Fitur akun di versi lama menyimpan kata
  sandi di localStorage tanpa backend. Itu memberi kesan aman yang
  palsu, jadi dihapus.
- **Tidak ada ulasan dan rating.** Tidak bisa diverifikasi, jadi tidak
  ditampilkan.
- **Tidak ada peta interaktif berbasis tile.** Geometri vektor yang
  digambar sendiri lebih ringan, tidak butuh kunci API peta, dan bisa
  dijelaskan sampai tingkat koordinat.
- **Tidak ada mode gelap.** Arsip ini dibaca seperti kertas. Mode gelap
  akan menambah permukaan kedua yang harus dijaga kontrasnya, tanpa
  manfaat yang sebanding untuk waktu yang tersedia.

---

## 9. Kalau ada dua hari lagi

1. Menambah 10 destinasi lagi dengan verifikasi lapangan, terutama yang
   saat ini tidak punya koordinat.
2. Mengganti TF-IDF dengan pencarian hibrida (BM25 + embedding) kalau
   korpus melewati 100 dokumen.
3. Menambah uji regresi visual otomatis di CI, bukan hanya dijalankan
   manual.
4. Menerjemahkan seluruh antarmuka ke bahasa Inggris untuk pembaca luar.

---

## 10. Tautan

- **Live:** https://sriwijaya-culture.vercel.app
- **Repositori:** https://github.com/koding-seadanya/sriwijaya-culture
- **Video demo:** (tautan video 2-5 menit)
