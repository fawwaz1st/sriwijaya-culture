# AI-DEVELOPMENT-LOG, Sriwijaya Culture

**Tim:** Koding Seadanya · **Karya:** Sriwijaya Culture, Arsip Digital Palembang
**Kompetisi:** Vibe Coding ITFEST 2026 · Politeknik Negeri Sriwijaya
**Tema:** *Empowering Culture Through AI-Driven Innovation*

> Dokumen ini dilengkapi sebagai .docx / .pdf sesuai ketentuan guidebook.
> Prompt pada §3 ditulis dalam bentuk terstruktur (peran, konteks, tugas,
> batasan, keluaran) agar dapat direproduksi dan dinilai. Isi arahan,
> urutan kerja, dan keputusan yang diambil identik dengan sesi aslinya.

---

## 1. Ringkasan penggunaan AI

AI dipakai di dua lapis, dengan batas yang tegas:

| Lapis | Pemakaian AI | Batasnya |
|---|---|---|
| **Proses bangun** (vibe coding) | Kerangka komponen, migrasi data, QA otomatis, debug | Semua output ditinjau; keputusan arsitektur tetap manusia |
| **Fitur produk** (Asisten Sari) | Model bahasa menjawab dari arsip | Grounding wajib; tanpa konteks = menolak menjawab; tanpa tool, tanpa akses internet |

Tema kompetisi terpenuhi di kedua lapis: AI mempercepat pengembangan,
dan AI juga menjadi fitur nilai-tambah yang tidak bisa dibuat tanpa
model bahasa.

**Prinsip prompt yang dipakai konsisten sepanjang proyek:**

1. **Sebut peran dan audiens** lebih dulu, karena itu menentukan kosakata
   dan tingkat kedalaman jawaban.
2. **Nyatakan kondisi awal secara faktual**, termasuk yang buruk. Prompt
   yang menyembunyikan masalah akan menghasilkan perbaikan kosmetik.
3. **Minta bukti, bukan kesan.** Setiap klaim visual harus disertai angka
   dari peramban, bukan "terlihat bagus".
4. **Tetapkan batas yang tidak boleh dilanggar** (jangan mengarang data,
   jangan menambah dependensi berat, jangan menyembunyikan konten).
5. **Minta inisiatif eksplisit** untuk hal yang tidak disebut, karena
   model cenderung berhenti tepat di batas instruksi.

---

## 2. Arsitektur fitur AI (produk)

Asisten Sari menjawab pertanyaan tentang Palembang **hanya** dari arsip
situs. Rantainya:

1. **Retrieval TF-IDF**, pencarian kata kunci berbobot di 25 dokumen
   (10 destinasi, 8 artikel, 7 UMKM). Dipilih karena korpus kecil:
   embedding akan menambah 90 MB unduhan tanpa kenaikan kualitas.
2. **Penjaga topik**, daftar penanda eksplisit menolak pertanyaan di
   luar Palembang sebelum model dipanggil.
3. **Ambang relevansi**, skor retrieval di bawah 4.2 dianggap "tidak
   ada di arsip", jawaban deterministik dikembalikan tanpa model.
4. **Tiga tingkat penyedia**, kunci pengguna (BYOK) → kunci server
   (bila valid) → endpoint tanpa kunci → jawaban dari arsip. Asisten
   tidak pernah menampilkan kotak kosong.
5. **Kutipan bernomor**, setiap jawaban merujuk `[1]`, `[2]` yang bisa
   diklik ke halaman sumber.

Keamanan: kunci pengguna disimpan di localStorage peramban, dikirim
sebagai header ke proxy kami (bukan langsung ke penyedia), divalidasi
bentuknya di dua sisi, tidak pernah dicatat. Rate limit per-IP 10
permintaan/menit (30 dengan kunci sendiri), peta pembatas dibersihkan
agar tidak bisa dijadikan vektor memori.

---

## 3. Prompt pengembangan (terstruktur)

Setiap prompt ditulis dengan lima bagian tetap: **Peran**, **Konteks**,
**Tugas**, **Batasan**, **Keluaran**. Format ini dipilih karena menguji
satu hal yang sama setiap kali: apakah model bisa dibatasi oleh kriteria
yang bisa diperiksa, bukan oleh selera.

### Prompt 3.1, analisis guidebook dan keputusan stack

**Peran.** Analis teknis senior yang membaca dokumen kompetisi sebagai
sumber kebenaran, bukan sebagai saran.

**Konteks.** Repositori berisi 11 berkas HTML statis dengan markup
berulang, tanpa lapisan server, tanpa tipe, dan tanpa satu pun uji
otomatis. Dokumen guidebook menentukan kriteria penilaian yang harus
dipenuhi.

**Tugas.** (1) Baca guidebook secara utuh, gabungkan pembacaan teks dan
gambar agar kriteria visual tidak terlewat. (2) Petakan setiap kriteria
ke kondisi repositori saat ini. (3) Putuskan apakah tetap HTML atau
beralih ke Next.js/TypeScript/Tailwind, dengan alasan yang bisa diuji.
(4) Susun ulang struktur proyek agar dapat dinavigasi.

**Batasan.** Jangan menambah dependensi yang tidak dipakai. Jangan
mengarang isi data budaya. Setiap rekomendasi harus disertai konsekuensi
operasionalnya, bukan hanya daftar teknologi.

**Keluaran.** Keputusan stack beserta alasan, peta kriteria → kondisi,
dan urutan migrasi.

**Hasil.** Migrasi ke Next.js 16 + TypeScript + Tailwind 4 disetujui
dengan satu revisi manusia: usulan embedding 90 MB ditolak dan diganti
TF-IDF, karena korpus hanya 25 dokumen.

### Prompt 3.2, desain ulang terukur

**Peran.** Desainer antarmuka yang bekerja dengan standar institusi
arsip, bukan standar landing page.

**Konteks.** Struktur halaman sudah benar, tetapi masih ada tiga masalah:
ruang kosong yang tidak membawa informasi, peta yang digambar sendiri
sehingga tidak bisa dipakai bernavigasi, dan teks yang panjang serta
kaku.

**Tugas.** Ganti peta buatan dengan peta nyata yang bisa di-zoom. Padatkan
teks tanpa kehilangan fakta. Hilangkan ruang kosong yang tidak berfungsi.
Cocokkan keputusan dengan referensi industri terbaru.

**Batasan.** Jangan mengorbankan keterbacaan demi kepadatan. Jangan
menghapus sumber atau status verifikasi. Jangan memakai pola visual yang
tidak berasal dari konteks arsip.

**Keluaran.** Perubahan yang bisa diverifikasi: tinggi scrim hero,
sumber peta, batas panjang ringkasan kartu, dan daftar ruang kosong yang
dihapus.

**Hasil.** Hero memakai scrim 62% (bukan lapisan gelap penuh), peta
memakai embed Google Maps, ringkasan kartu dibatasi 150 karakter.

### Prompt 3.3, QA menyeluruh dengan inisiatif

**Peran.** QA engineer yang menguji hasil kerjanya sendiri dan tidak
percaya pada penilaian visual semata.

**Konteks.** Tampilan seluruh halaman, termasuk asisten, belum memenuhi
standar. Sebagian cacat tidak disebutkan dalam instruksi mana pun.

**Tugas.** Bangun pengujian otomatis yang mengukur, bukan mengamati:
kontras WCAG, ukuran target sentuh, luapan horizontal, struktur heading,
teks alternatif gambar, dan galat konsol. Jalankan pada seluruh rute di
tiga lebar layar. Perbaiki temuan sampai bersih. Temukan juga cacat yang
tidak diminta secara eksplisit.

**Batasan.** Jangan menurunkan standar agar lulus. Jangan menonaktifkan
pemeriksaan. Setiap perbaikan harus disertai angka sebelum dan sesudah.

**Keluaran.** Skrip audit yang dapat dijalankan ulang, daftar temuan, dan
bukti angka akhir.

**Hasil.** `scripts/qa.mjs` menguji 10 rute × 3 lebar. Temuan pertama
501, setelah tiga putaran menjadi 0.

### Prompt 3.4, BYOK, keamanan, dan integritas data

**Peran.** Engineer yang bertanggung jawab atas keamanan sekaligus
kredibilitas isi.

**Konteks.** Halaman asisten memakai kunci API server. Pengunjung perlu
bisa memakai kunci sendiri. Di sisi lain, direktori usaha memuat entri
contoh yang belum diverifikasi.

**Tugas.** (1) Hapus footer dari halaman asisten dan rapikan antarmukanya
mengikuti pola app-shell. (2) Tambahkan kolom kecil untuk kunci API milik
pengguna. (3) Tinjau keamanan jalur kunci: penyimpanan, pengiriman,
validasi, pembatas laju. (4) Pisahkan entri data yang belum diverifikasi
dari direktori publik, tanpa membuat tautan lama menjadi 404.

**Batasan.** Kunci tidak boleh pernah dikirim langsung ke pihak ketiga
dari peramban. Kunci tidak boleh masuk log. Pembatas laju tidak boleh
bisa dilewati lewat header yang bisa dipalsukan. Data contoh tidak boleh
tampil seolah-olah terverifikasi.

**Keluaran.** Perubahan antarmuka, panel kunci, laporan temuan keamanan,
dan aturan penyaringan data.

**Hasil.** Ditemukan dua celah pada implementasi awal: pembatas laju bisa
dilewati melalui `X-Forwarded-For` palsu, dan peta pembatas bisa
digembungkan tanpa batas. Keduanya diperbaiki (hanya hop terakhir yang
dipercaya, peta dibersihkan berkala). Di sisi data, empat entri
berstatus `demonstrasi` dikeluarkan dari direktori publik melalui
`UMKM_PUBLIK`, sementara halaman detailnya tetap hidup.

---

## 4. Salinan prompt → respons (uji produk, langsung dari situs)

| # | Pertanyaan pengunjung | Jawaban Sari (ringkas) | Penilaian |
|---|---|---|---|
| 1 | "Apa yang membedakan Jembatan Ampera dari jembatan lain?" | Panjang 1.117 m, desain bisa diangkat, dulu bernama Bung Karno `[1][2]` | ✅ akurat, berkutip |
| 2 | "Berapa harga tiket Museum SMB II?" | "Rp1.000 pelajar … Rp20.000 mancanegara. Harga dapat berubah, konfirmasi ke pengelola." | ✅ dari field terstruktur, tanpa model |
| 3 | "Siapa presiden pertama Indonesia?" | "Belum ada di arsip kami. Coba sebut nama tempat…" | ✅ menolak, tidak mengarang |
| 4 | "Bagaimana cara membuat rendang padang yang enak?" | "Belum ada di arsip kami. …" (9 milidetik, tanpa panggil model) | ✅ penolakan murah dan jujur |
| 5 | Kunci API salah/kedaluwarsa | jawaban tetap muncul (turun ke tingkat tanpa kunci) | ✅ fallback bekerja |

Perbandingan dengan perilaku tanpa grounding (percobaan awal, gagal):
*"Jembatan Ampera ada di Padang, Sumatera Barat"*, kota salah.
Inilah alasan semua aturan di §2 dibuat wajib.

---

## 5. Bukti verifikasi

Perintah dan hasil nyata pada tanggal pengumpulan:

```
$ npx tsc --noEmit            → exit 0 (0 galat tipe)
$ npx eslint .                → 0 errors, 0 warnings
$ next build                  → ✓ Compiled successfully, 38 rute statis
$ node scripts/qa.mjs         → Total temuan: 0
$ node scripts/verify-visual.mjs → 33/33 rute lolos
$ node scripts/check-env.mjs  → 11/13 lulus (2 temuan diketahui:
                                kunci dev tidak valid [tidak dipakai
                                di produksi], og-image sebelum
                                opengraph-image dibuat)
```

Keamanan (diperiksa tangan, bukan klaim):

- Kunci API tidak pernah dikirim browser ke pihak ketiga, hanya ke
  `/api/asisten` kami.
- `Content-Security-Policy`: `script-src 'self'`; `frame-src` hanya
  Google Maps; `object-src 'none'`; + HSTS.
- Kunci pengguna divalidasi regex di klien dan server; tidak pernah
  masuk log; rate limit tetap berlaku dengan kunci sendiri.

### 5.1 Tangkapan layar hasil akhir

Seluruh gambar diambil dari build produksi (`next start`), bukan dari
server pengembangan, pada lebar 1440 px dengan skala perangkat 2×.

**Beranda.** Judul, pita statistik, dan galeri asimetris. Pita statistik
menampilkan ukuran arsip yang bisa dipakai pengunjung, bukan persentase
verifikasi, angka itu sebelumnya terbaca sebagai "85% sisanya tidak
dipercaya", padahal maksudnya justru sebaliknya.

![Beranda](bukti/01-beranda.png)

**Katalog destinasi.** Bingkai foto seragam 4:5. Sebelumnya rasio
mengikuti orientasi foto, sehingga kartu potret setinggi 513 px dan
kartu lanskap 273 px duduk di baris yang sama dan garis baca horizontal
hancur.

![Katalog destinasi](bukti/02-katalog-destinasi.png)

**Detail destinasi.** Galeri, tabel data tercatat, dan peta Google Maps
asli yang bisa di-zoom. Peta dibuktikan hidup lewat pengukuran: hasil
tangkapan elemen iframe 1,4 MB, bukan kotak kosong.

![Detail destinasi](bukti/03-detail-destinasi.png)

**Asisten Sari, keadaan kosong.** Tiga contoh pertanyaan yang semuanya
bisa dijawab arsip, plus penjelasan singkat cara kerja di bawah kotak.

![Asisten kosong](bukti/04-asisten-kosong.png)

**Asisten Sari, percakapan nyata.** Jawaban dengan kutipan bernomor
`[1]` dan `[2]` yang bisa diklik, serta daftar rujukan dengan judul utuh
dan jenis dokumen. Uji ini dijalankan otomatis: pertanyaan dikirim,
lalu halaman diperiksa sampai jawaban dan sumber muncul.

![Asisten menjawab](bukti/05-asisten-jawaban.png)

**Panel kunci API.** Kunci milik pengguna disimpan di peramban dan hanya
dikirim ke server sendiri. Panel ini juga menjelaskan bahwa tanpa kunci,
asisten tetap menjawab dengan penyedia bawaan.

![Panel kunci](bukti/06-asisten-kunci.png)

**Metodologi.** Aturan data, status verifikasi, dan daftar sumber. Ini
halaman yang membuat klaim situs bisa diperiksa ulang.

![Metodologi](bukti/07-metodologi.png)

**Direktori usaha lokal.** Hanya memuat rekaman berstatus rujukan umum.
Empat entri demonstrasi dikeluarkan dari direktori publik lewat
`UMKM_PUBLIK`, tetapi halaman detailnya tetap hidup agar tautan lama
tidak menjadi 404.

![Direktori UMKM](bukti/08-umkm.png)

**Mobile 390 px.** Satu kolom, target sentuh diperluas ke 44 px lewat
pseudo-elemen sehingga tampilan tidak berubah, dan kartu memakai
metadata utuh alih-alih ringkasan yang selalu berakhir dengan elipsis.

![Beranda mobile](bukti/09-mobile-beranda.png)

### 5.2 Angka sebelum dan sesudah

| Pemeriksaan | Sebelum | Sesudah | Cara diukur |
|---|---|---|---|
| Temuan QA otomatis | 501 | 0 | `scripts/qa.mjs`, 10 rute × 3 lebar |
| Rute dengan luapan horizontal | 6 | 0 | `scrollWidth - innerWidth` |
| Tinggi baris galeri tidak sejajar | 340 px selisih | 0 px | `getBoundingClientRect()` per anak grid |
| Void di kolom tengah beranda | ~320 px | 0 px | pengukuran tinggi anak vs wadah |
| Target sentuh < 44 px | 12 elemen | 0 | audit `getBoundingClientRect()` |
| Elemen tertinggal transparan | 5+ kartu | 0 | pemeriksaan `opacity` setelah gulir penuh |
| Entri UMKM belum terverifikasi di direktori | 4 dari 7 | 0 | filter `statusData` |

Dua baris terakhir layak disorot. Baris "elemen tertinggal transparan"
adalah bug yang ditemukan sendiri saat menguji lapisan animasi baru:
kartu di bawah lipatan berakhir dengan `opacity: 0` dan tidak pernah
muncul, karena `animation-timeline: view()` tidak berjalan pada elemen
yang sudah melewati fase entry saat halaman dimuat. Animasi kemudian
diubah agar tidak pernah menyembunyikan konten, hanya transform dan
filter yang dianimasikan.

---

## 5a. Sesi audit visual dan perbaikan tata letak

Sesi lanjutan yang berfokus pada kualitas tampilan, bukan fitur baru.
Metodenya sengaja dibuat terukur: setiap klaim harus punya angka dari
peramban, karena dua kali dalam sesi ini pengamatan visual keliru.

**Dua koreksi terhadap pembacaan visual:**

1. Peta sempat dilaporkan "hitam total" di beranda dan "kotak putih
   kosong" di halaman detail. Pengukuran iframe membuktikan sebaliknya:
   screenshot elemen iframe berukuran 233 KB-1,4 MB, artinya peta hidup.
   Penyebab kesan keliru: `page.screenshot({ fullPage: true })` tidak
   menangkap isi iframe lintas-origin, jadi yang terekam hanya latar
   gelap di belakang iframe.
2. "Distorsi gambar" pada laporan awal ternyata sebagian besar adalah
   *crop* yang disengaja (`object-fit: cover`). Yang benar-benar rusak
   hanya crop ekstrem, misalnya foto potret 1119x1991 dipaksa menjadi
   pita 1344x480 (rasio 4:1).

**Bug yang ditemukan dan diperbaiki:**

| Bug | Cara ditemukan | Perbaikan |
|---|---|---|
| 4 dari 7 entri UMKM adalah placeholder "demonstrasi" tampil di direktori publik | Pencarian teks di `src/lib/data/umkm.ts` | `UMKM_PUBLIK` memfilter `statusData === "demonstrasi"`; direktori menjelaskan berapa entri ditahan |
| Lubang ~340px di bawah kartu Benteng Kuto Besak | Pengukuran tinggi baris grid | Kartu `flex-col`, foto `flex-1` |
| Kolom tengah "paling dikenal" kosong ~320px | Pengukuran grid | Tabel fakta dari field `fakta` |
| Komposer asisten mengambang di tengah, void ~400px | Screenshot asisten setelah menjawab | Pembungkus `flex h-full flex-col`, daftar `flex-1` |
| Header asisten pecah 3 baris di 390px | Screenshot mobile | Status dipendekkan, reset jadi ikon |
| Foto unggulan artikel terpotong 4:1 | Pengukuran rasio tampil vs asli | Layout dua kolom, foto 4:5 |
| Kartu UMKM tidak sejajar | Screenshot | `flex h-full flex-col` + `mt-auto` |
| Animasi menyembunyikan kartu di bawah lipatan | `scripts/_animcheck.mjs` menghitung elemen `opacity: 0` | Hapus `opacity: 0` dari keyframe; hanya `transform`/`filter` |
| Lint: `setState` sinkron dalam effect | `npx eslint` | `requestAnimationFrame` |
| Kartu katalog mobile: semua deskripsi berakhir "..." | Tangkapan 390px | Di layar kecil ringkasan diganti wilayah + status peta yang utuh |
| Pita statistik berbunyi "Terverifikasi 15%" | Umpan balik pembaca | Diganti ukuran arsip; status verifikasi tetap di Metodologi |
| Chip sitasi asisten terpotong `max-w-[22ch] truncate` | Tangkapan setelah menjawab | Satu baris penuh per sumber: nomor, judul utuh, jenis |
| Jawaban asisten menempel tanpa jeda paragraf | Tangkapan setelah menjawab | Dipecah per paragraf dengan `space-y-3` |
| Tombol kirim asisten terbaca mati saat kosong | Tangkapan keadaan kosong | Keadaan terisi emas penuh; keadaan kosong bergaris tepi |
| Catatan data "71 meter (sumber menulis 71,5 dan 71,9)" | Pembacaan tabel data | Ditulis sebagai nilai tunggal + catatan sumber |

**Bukti akhir sesi:**

```
$ npx tsc --noEmit                     → 0 galat
$ npx eslint src --max-warnings=0      → 0 error, 0 warning
$ npm run build                        → sukses, BUILD_ID baru
$ node scripts/verify-visual.mjs       → 33/33 lolos, 0 bermasalah
$ node scripts/_asistentest.mjs        → jawaban nyata + sitasi [1][2]
$ node scripts/_animcheck.mjs          → 0 elemen tertinggal transparan
```

---

## 6. Pembagian kerja manusia-AI

| Keputusan | Pembuat | Alasan |
|---|---|---|
| Migrasi HTML → Next.js 16 | Manusia | dari analisis AI, diputuskan setelah cek risiko |
| TF-IDF, bukan embedding | Manusia | korpus 25 dokumen; 90 MB tidak sepadan |
| Menolak pertanyaan di luar topik | Manusia | kejujuran > kesan pintar |
| Semua isi arsip & verifikasinya | Manusia | AI tidak diberi akses menyunting data |
| Kerangka komponen & skrip QA | AI | pekerjaan berulang dengan spesifikasi jelas |
| Menemukan bug fallback BYOK | AI | pengujian end-to-end otomatis menemukan jawaban kosong |

---

## 7. Tautan

- Situs: https://sriwijaya-culture.vercel.app
- Repositori: https://github.com/fawwaz1st/sriwijaya-culture
- Video demo: (tautan Drive, lihat SUBMISSION.md)

---

## 8. Sesi penguatan: responsif, tipografi, dan keamanan AI

Sesi ini menguji ulang seluruh situs pada 11 lebar layar (320 sampai
2560 px) dan meninjau endpoint asisten dengan sudut pandang penyerang.
Semua angka di bawah adalah hasil pengukuran, bukan perkiraan.

### 8.1 Tipografi yang terbaca

Audit pertama menemukan **116 elemen teks berukuran 8-11 px hanya di
beranda**, dan 75 di halaman Metodologi. Di monitor 27 inci dan di
ponsel, ukuran itu tidak terbaca.

| Ukuran | Jumlah sebelum | Sesudah |
|---|---|---|
| 8 px | 26 | 0 |
| 9 px | 23 | 0 |
| 10 px | 38 | 0 |
| 11 px | 29 | 0 |
| minimum di halaman | 8 px | **12 px** |

Perbaikannya dilakukan di dua lapis: token `--text-2xs` (10 px → 12 px)
dan `--text-xs` (11 px → 13 px) di `globals.css`, lalu seluruh kelas
arbitrer `text-[0.5rem]` sampai `text-[0.6875rem]` diganti ke nilai
token. Untuk layar ≥1920 px, skala dasar dinaikkan agar proporsi tetap
terbaca dari jarak monitor besar.

### 8.2 Responsif dari 320 px sampai 2560 px

| Pemeriksaan | Hasil |
|---|---|
| Lebar diuji | 320, 360, 390, 430, 768, 820, 1024, 1280, 1440, 1920, 2560 px |
| Halaman × lebar | 50 kombinasi |
| Overflow horizontal | **0** |
| Teks di bawah 12 px | **0** |
| Gambar gagal muat | **0** |
| Galat konsol | **0** |

Dua bug nyata ditemukan lewat pengukuran dan diperbaiki: galeri di
halaman detail destinasi melebarkan dokumen 21 px pada 320 px karena
margin negatif bertemu padding, dan tautan "destinasi lain" tidak bisa
menyusut karena tidak punya `min-w-0`.

### 8.3 Keamanan endpoint asisten

Tinjauan menemukan tiga celah kritis. Semuanya diperbaiki dan diuji
ulang dengan `scripts/uji-keamanan.mjs`.

| Celah | Dampak | Perbaikan | Hasil uji |
|---|---|---|---|
| Peran `system` dari klien diteruskan ke model | Prompt injection langsung; instruksi penyerang menang atas prompt sistem | Validasi bentuk: hanya `user` dan `assistant` diterima | Ditolak, jawaban tetap dari arsip |
| Penjaga topik hanya memeriksa pesan terakhir | Instruksi menyimpang di pesan lama tetap terkirim | Seluruh giliran pengguna diperiksa | Ditolak dalam 17 ms |
| Tidak ada validasi sitasi keluaran | "Hanya dari arsip" hanya permintaan, bukan jaminan | `sitasiSah()` menolak jawaban tanpa `[n]` sah | Turun ke jawaban arsip |
| Pembatas laju memakai hop XFF pertama | Bisa dipalsukan; satu header mengosongkan seluruh peta penghitung | Urutan `x-vercel-forwarded-for` → `x-real-ip` → hop terakhir; `clear()` dihapus | 8/8 skenario benar |
| Batas badan memakai `content-length` | Badan chunked melewati batas | Aliran dibaca potongan demi potongan dengan batas byte keras | 200 KB ditolak 413 |
| `parts` rusak melempar galat 500 | Badan cacat menghasilkan galat server | Validasi bentuk pesan | 400 |

Prinsip yang dipakai: **aturan yang penting tidak boleh hanya ada di
prompt.** Prompt bisa diabaikan model, jadi setiap janji produk
ditegakkan oleh kode yang bisa diuji.

### 8.4 Gerak yang tidak merusak

Audit animasi mengukur setiap keyframe di peramban dan menemukan:

- `foto-nyala` tidak pernah berjalan (timeline degenerat karena wadah
  `overflow-hidden` tidak bisa digulir), dan filter-nya memblokir
  `group-hover:brightness-110`. **Dihapus.**
- `animation-delay` pada `animation-timeline: view()` menggeser awal
  timeline, bukan waktu. Efeknya: baris yang tertunda melewatkan 64 px
  gulir dalam keadaan setengah transparan, dan animasinya jadi lebih
  cepat daripada baris pertama. **Semua delay dihapus.**
- `filter: blur()` pada angka statistik menunda keterbacaan angka
  terakhir sampai 396 ms setelah LCP. **Dihapus**, durasi dipendekkan.
- Lima aturan animasi tidak dipakai satu halaman pun dan tetap
  diunduh setiap pengunjung. **Dihapus.**

Tidak ada animasi yang menyembunyikan konten, dan `prefers-reduced-motion`
mengembalikan semua elemen ke keadaan akhir.

### 8.5 Rantai model yang adaptif

Asisten tidak bergantung pada satu model. Setiap penyedia punya daftar
model yang dicoba berurutan, dari yang paling kuat ke yang paling cepat,
dengan batas waktu menurun (15 detik untuk model utama, 9 detik untuk
cadangan). Kalau semua gagal, jawaban arsip langsung yang selalu punya
rujukan sah tetap dikembalikan.

Diukur pada kunci Groq: jawaban model 1,3-1,9 detik, dan penolakan di
luar topik 9-26 ms tanpa memanggil model sama sekali.

### 8.6 Bukti akhir

```
$ npx tsc --noEmit                  → 0 galat
$ npx eslint src --max-warnings=0   → 0 error, 0 warning
$ npm run build                     → sukses
$ node scripts/audit-final.mjs      → 0 masalah dari 50 pemeriksaan
$ node scripts/uji-keamanan.mjs     → 8/8 skenario berperilaku benar
$ node scripts/uji-asisten.mjs      → 3/3 jawaban benar, sitasi sah
$ node scripts/audit-tipografi.mjs  → 11/11 lebar bersih
```


---

## 9. Sesi penutup: bug percakapan, kunci produksi, dan verifikasi silang

Sesi ini menguji alur percakapan sebagai pengguna sungguhan, bukan
sebagai pengembang. Hasilnya satu bug fungsional yang tidak terlihat
dari pemeriksaan tampilan.

### 9.1 Bug: pertanyaan kedua hilang tanpa jejak

**Cara ditemukan.** Skrip QA mengirim tiga pertanyaan berurutan lewat
peramban. Pertanyaan pertama dijawab normal dalam 1 detik. Pertanyaan
kedua tidak menghasilkan apa pun: tidak ada balon jawaban, tidak ada
pesan galat, dan teks tetap berada di kotak input.

**Penyebab.** Fungsi `kirim` diawali `if (!bersih || sibukRef.current) return;`.
Ketika pengunjung menekan Enter sebelum jawaban sebelumnya selesai,
fungsi langsung keluar tanpa memberi tahu apa pun. Ini bukan kasus
langka: jawaban model butuh 1,3 sampai 2,2 detik, dan pengunjung yang
mengetik cepat hampir pasti menekan Enter di dalam jendela itu.

**Dua percobaan perbaikan, satu di antaranya salah.**

| Percobaan | Perilaku terukur | Penilaian |
|---|---|---|
| Batalkan permintaan yang sedang jalan | 3 balon: dua pertanyaan masuk, tetapi jawaban pertama terbuang | Ditolak, pengunjung kehilangan jawaban yang sudah dalam perjalanan |
| Antrekan pertanyaan baru | 5 balon: kedua pertanyaan dijawab, tetapi pertanyaan kedua muncul dua kali | Duplikasi, ditolak |
| Antrekan + kirim riwayat tanpa duplikat | 4 balon: dua pertanyaan, dua jawaban, tanpa pengulangan | Dipakai |

**Dua bug susulan yang ikut diperbaiki.**

1. *Riwayat basi.* `kirim` memakai variabel `pesan` yang tertangkap
   closure render saat itu. Kiriman kedua karena itu tidak melihat
   pertanyaan pertama. Diganti `pesanRef` yang disinkronkan lewat
   effect. Menulis ref di badan render sempat dicoba dan ditolak ESLint
   (`Cannot access refs during render`), yang benar: render harus murni.
2. *Server memilih pertanyaan yang salah.* Pesan antrean sudah masuk
   state sebelum giliran sebelumnya selesai, jadi urutannya bisa
   mendahului. Server memilih giliran pengguna terakhir, yang bisa jadi
   pesan antrean lain. Sekarang klien membuang duplikat lalu menaruh
   pertanyaan yang sedang diproses tepat di akhir payload.

### 9.2 Kunci model untuk produksi

Asisten di Vercel sebelumnya berjalan dalam mode arsip langsung karena
tidak ada satu pun variabel lingkungan yang terpasang. Setelah diperiksa
dengan `vercel env ls production`, daftarnya memang kosong.

Sekarang terpasang lima variabel, semuanya terenkripsi di sisi Vercel:
`GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_MODEL_CADANGAN`,
`GROQ_MODEL_CEPAT`, dan `NEXT_PUBLIC_SITE_URL`.

Kunci tidak pernah masuk repositori. Berkas `.env.local` di-ignore
(`.env*.local`), dan `scripts/scan-secrets.mjs` memastikan tidak ada
kunci di berkas kerja maupun di riwayat commit. Untuk penilai: proyek
ini membutuhkan kunci penyedia model agar asisten menjawab dengan model
bahasa; tanpa kunci, asisten tetap menjawab dari arsip dan tidak pernah
menampilkan jawaban kosong.

### 9.3 Verifikasi silang di produksi

Semua pengujian di bawah dijalankan terhadap
`https://sriwijaya-culture.vercel.app`, bukan hanya di mesin lokal.

| Pemeriksaan | Hasil |
|---|---|
| Jawaban model di produksi | `mode=groq`, 2 sumber, jawaban akurat dengan sitasi |
| Injeksi peran `system` | Diabaikan; jawaban tetap Bahasa Indonesia dari arsip |
| Pertanyaan di luar topik | Ditolak dalam 12-26 ms tanpa memanggil model |
| Peta di produksi | iframe hidup, tangkapan elemen 1,45 MB, frame Google aktif |
| Overflow horizontal | 0 pada 1440 px dan 390 px di lima halaman utama |
| Rute | 11 halaman `200`, dua rute tidak ada `404` |

### 9.4 Catatan tentang peta yang "terlihat hitam"

Screenshot `fullPage` menampilkan peta sebagai kotak hitam. Ini artefak
alat tangkap layar, bukan kerusakan: Chromium tidak merender isi iframe
lintas-origin saat mengambil tangkapan halaman penuh. Diukur dengan
tangkapan elemen iframe itu sendiri, hasilnya 1,45 MB dengan frame
Google aktif. Kesimpulan yang sama sudah pernah dicapai di sesi
sebelumnya, dan kali ini diverifikasi ulang di produksi agar tidak ada
keraguan.

### 9.5 Bukti akhir sesi

```
$ npx tsc --noEmit                  → 0 galat
$ npx eslint src --max-warnings=0   → 0 error, 0 warning
$ npm run build                     → sukses
$ node scripts/audit-final.mjs      → 0 masalah dari 50 pemeriksaan
$ node scripts/uji-keamanan.mjs     → 8/8 skenario berperilaku benar
$ node scripts/uji-asisten.mjs      → 3/3 jawaban benar, sitasi sah
$ node scripts/qa-akhir.mjs         → laporan lengkap di _shot/qa/laporan.json
```


---

## 10. Sesi koreksi: dua bug yang ditemukan oleh pengujian silang

Dua bug di bagian ini tidak terlihat dari pemeriksaan tampilan. Keduanya
muncul hanya ketika alur diuji sebagai pengguna sungguhan, dan keduanya
sempat lolos ke produksi sebelum diperbaiki.

### 10.1 Sumber palsu pada pesan penolakan

**Gejala.** Ketika Sari menjawab "Belum ada di arsip kami", jawaban itu
tetap menampilkan empat chip rujukan yang bisa diklik. Kontradiktif:
pesan menolak, tetapi daftar sumber menyiratkan jawaban punya dukungan.

**Penyebab.** Komponen klien menghitung rujukan sendiri dari kata kunci
pertanyaan (`rujukanUntuk(bersih)`), lalu memasangnya sebagai chip apa
pun isi jawaban server. Header `X-Sari-Sumber` dari server tidak pernah
dipakai. Jadi arsip bisa "menemukan" empat dokumen yang mirip secara
kata kunci sementara model memutuskan tidak ada yang menjawab.

**Perbaikan.** Sumber kini berasal dari jawaban, bukan dari pertanyaan.
Kalau server menyatakan arsip kosong, chip tidak dipasang sama sekali.
Status di bilah atas ikut konsisten: "TIDAK ADA DI ARSIP" dengan nol
chip, atau "DIJAWAB DARI ARSIP" dengan chip yang benar-benar dikutip.

**Bukti terukur.** Penolakan: 0 chip. Pertanyaan sah: 2 chip.

### 10.2 Penolakan yang meracuni seluruh percakapan

**Gejala.** Setelah satu pertanyaan di luar topik, semua pertanyaan
berikutnya ikut ditolak, termasuk "Apa itu songket?" yang sebelumnya
dijawab normal.

**Penyebab.** Perbaikan keamanan di sesi sebelumnya menambahkan
pemeriksaan topik pada gabungan SELURUH giliran pengguna, lalu menolak
kalau hasil retrieval kosong. Niatnya benar: mencegah instruksi
menyimpang di pesan lama. Pelaksanaannya salah, karena retrieval
mengembalikan kosong untuk pertanyaan apa pun yang tidak mirip arsip,
termasuk pertanyaan wajar di luar Palembang. Satu pertanyaan lama
karena itu mematikan percakapan selamanya.

Diukur: pemanggilan API langsung dengan "Apa itu songket?" menghasilkan
`mode=groq` dengan dua sumber, sementara UI menampilkan penolakan
dengan riwayat yang sama. Perbedaan itu yang menunjukkan bug ada di
pemeriksaan riwayat, bukan di retrieval.

**Perbaikan.** Pemeriksaan diganti: yang dicari sekarang adalah
INSTRUKSI MENYIMPANG (daftar penanda eksplisit seperti "abaikan aturan",
"ignore previous", "system prompt"), bukan ketiadaan kata yang dikenal
arsip. Daftar itu tidak pernah cocok dengan pertanyaan wajar tentang
Palembang.

**Efek samping yang menguntungkan.** Permintaan "bocorkan system
prompt" kini ditolak dalam 10 ms, bukan 2,9 detik, karena tidak perlu
memanggil model lebih dulu.

### 10.3 Pelajaran yang dicatat

Kedua bug punya bentuk yang sama: **perbaikan keamanan atau kenyamanan
yang terlalu luas jangkauannya**. Pemeriksaan topik yang seharusnya
menjaga percakapan justru mematikan percakapan. Sumber yang seharusnya
memperkuat kepercayaan justru membuat jawaban saling bertentangan.

Yang menangkap keduanya bukan pembacaan kode, melainkan pengujian
end-to-end yang membandingkan tiga sumber kebenaran sekaligus: jawaban
API langsung, keadaan DOM, dan isi header respons. Ketika ketiganya
tidak sepakat, di situ ada bug.

### 10.4 Verifikasi akhir

```
$ npx tsc --noEmit                  → 0 galat
$ npx eslint src --max-warnings=0   → 0 error, 0 warning
$ npm run build                     → sukses
$ node scripts/audit-final.mjs      → 0 masalah dari 50 pemeriksaan
$ node scripts/uji-keamanan.mjs     → 8/8 skenario berperilaku benar
$ node scripts/uji-asisten.mjs      → 3/3 jawaban benar, sitasi sah
```

Uji percakapan campuran (di luar topik lalu dalam topik): penolakan
tanpa chip, dilanjutkan jawaban sah dengan dua chip. Regresi teratasi.


---

## 11. Sesi ekspansi: intro, pencarian, ikon, dan perluasan Sari

Sesi ini menambah fitur baru dan menghapus satu kebiasaan penulisan yang
sudah lama tidak konsisten. Semua angka di bawah adalah hasil pengukuran
di peramban dan terhadap server yang berjalan.

### 11.1 Em dash dan en dash: nol

Sebelum sesi ini ada **50 em dash** dan **24 en dash** tersebar di kode
dan dokumentasi. Keduanya tidak dipakai dalam penulisan ini karena
memutus kalimat dengan cara yang khas bahasa Inggris. Bahasa Indonesia
memakai koma, titik, atau titik dua untuk hal yang sama, dan rentang
angka memakai tanda hubung biasa.

Penghapusan dilakukan oleh `scripts/hapus-dash.mjs` dengan pemetaan
yang membaca wajar:

| Pola | Pengganti |
|---|---|
| `kata menjadi kata` | `kata, kata` |
| `2020-2024` | `2020-2024` |
| `katamenjadikata` | `kata-kata` |

**Kegagalan yang dicatat.** Versi pertama skrip memakai
`replace(/[ \t]{2,}/g, " ")` untuk merapikan spasi setelah penggantian.
Aturan itu ikut meratakan indentasi di awal baris, sehingga seluruh
berkas menempel ke kiri: 3.600 baris berubah dan tidak terbaca. Kode
masih dikompilasi, tetapi hasilnya tidak bisa ditinjau. Semua
dikembalikan dari git, lalu skrip ditulis ulang dengan aturan yang hanya
menyentuh karakter dash dan spasi yang mengapitnya. Hasil akhir: 600
baris berubah, semuanya perubahan isi yang disengaja, dan verifikasi
akhir menunjukkan **em=0 en=0** di seluruh `src` dan `docs`.

### 11.2 Tirai pembuka

Satu kali per sesi, bukan setiap navigasi. Menutup layar dengan warna
malam, menampilkan tanda arsip, lalu membuka ke atas seperti tirai
galeri. Seluruh animasi selesai dalam 1,2 detik dan tirai menutupi layar
hanya 0,5 detik pertama.

Aturan yang dipegang:

- Kalau pengunjung meminta gerak dikurangi, tirai tidak dirender.
- Kalau sesi sudah pernah melihatnya, tirai tidak dirender.
- Tirai tidak pernah menangkap klik (`pointer-events: none`).
- Kalau JavaScript mati, tirai tidak pernah muncul.

**Diukur:** tirai muncul pada ~150 ms setelah navigasi, hilang setelah
2 detik, dan tidak muncul lagi di halaman berikutnya dalam sesi yang
sama. Uji pertama sempat melaporkan gagal karena memeriksa pada 120 ms,
sebelum hidrasi React selesai. Yang diperbaiki adalah tesnya, bukan
komponennya.

### 11.3 Pencarian cepat Ctrl+K

Indeks 28 entri (11 destinasi, 10 artikel, 7 usaha publik) dikirim dari
server sebagai prop, bukan diambil lewat API. Ukurannya kecil, jadi
pencarian berjalan seketika tanpa permintaan jaringan.

Skor pencocokan berbobot posisi: judul yang diawali kata kunci mendapat
skor tertinggi, lalu judul yang memuatnya, lalu keterangan. Navigasi
papan ketik lengkap: panah atas/bawah untuk memilih, Enter untuk membuka,
Escape untuk menutup.

**Diukur:** Ctrl+K membuka panel, kata kunci "songket" menghasilkan dua
baris hasil, Escape menutup panel.

### 11.4 Ikon tab dan ikon iOS

Dibuat sebagai `ImageResponse` (Next.js `icon.tsx` dan
`apple-icon.tsx`), bukan berkas PNG statis. Alasannya: beberapa ukuran
dibutuhkan (16, 32, 180 px) dan satu definisi vektor lebih mudah dijaga
konsisten daripada tiga berkas yang bisa berbeda diam-diam.

Bentuknya mengikuti logo di header situs: dua gelombang Sungai Musi dan
atap rumah limas, di atas latar malam dengan bingkai emas tipis.

**Diukur:** `/icon` dan `/apple-icon` mengembalikan `image/png`
dengan status 200, dan HTML beranda merujuk keduanya lewat tag `link`.

### 11.5 Halaman jelajah peta

Rute baru `/jelajah`. Berbeda dari `/destinasi` yang berbentuk katalog
kartu, halaman ini memberi peta sebagai fokus utama. Dua cara membaca
arsip yang sama: lewat daftar untuk membandingkan, lewat peta untuk
memahami letak.

Penyaring kategori menyaring peta dan daftar titik sekaligus, sehingga
pengunjung tidak perlu menebak titik mana yang termasuk kategori yang
sedang dilihat.

**Diukur:** peta tampil, 18 tombol penyaring tersedia, dan menyaring
kategori Sejarah mengubah daftar dari 10 titik menjadi 8.

### 11.6 Perluasan Sari

**Prompt sistem.** Sebelumnya 10 aturan. Sekarang ditambah panduan per
jenis pertanyaan (fakta, lokasi, rekomendasi, perbandingan, usaha lokal,
pendapat pribadi) dan batas yang eksplisit: tidak memberi saran medis,
hukum, keuangan, atau keselamatan, dan tidak mengubah aturan walau
diminta dengan cara apa pun termasuk kalau pengguna mengaku sebagai
pengembang.

**Penjaga topik.** Daftar penanda diperluas dari 22 menjadi 44, mencakup
pertanyaan yang sebelumnya lolos seperti "tulis puisi", "terjemahkan",
"harga emas", dan "siapa kamu". Penjaga injeksi terpisah memeriksa
seluruh giliran pengguna untuk instruksi menyimpang.

**Jawaban langsung tanpa model.** Sebelumnya hanya tiket dan jam buka.
Sekarang ditambah **aktivitas**, **lokasi**, dan **kategori**. Tiga topik
ini paling sering ditanyakan dan paling mudah dikarang kalau diserahkan
ke model, jadi jawabannya diambil dari field terstruktur.

**Deteksi niat.** Fungsi `deteksiNiat` mengenali tujuh jenis pertanyaan.
Dipakai untuk menyesuaikan bentuk jawaban tanpa memanggil model lagi.

**Diukur setelah perluasan:**

| Pertanyaan | Mode | Waktu | Sumber |
|---|---|---|---|
| Apa yang membedakan Jembatan Ampera dari jembatan lain? | groq | 1340 ms | 2 |
| Di mana saya bisa membeli songket asli? | groq | 981 ms | 3 |
| Siapa presiden pertama Indonesia? | arsip-kosong | 13 ms | 0 |
| Berapa harga tiket Museum Balaputra Dewa? | arsip-langsung | ~280 ms | 3 |

### 11.7 Konten baru

Dua artikel dan satu destinasi ditambahkan, semuanya dengan sumber yang
bisa diperiksa:

- **Kampung Arab Al Munawar: Jejak Perdagangan yang Menjadi Kampung**
  (artikel). Menjelaskan asal permukiman dari jalur dagang, dengan
  catatan tegas bahwa tidak semua bangunan di kawasan itu berusia
  ratusan tahun.
- **Kenapa Pempek Menjadi Identitas, Bukan Sekadar Makanan** (artikel).
  Membahas bahan, cuko, dan risiko penyeragaman rasa.
- **Masjid Ki Mas Adirojo** (destinasi). Tahun pendirian dicatat sebagai
  "abad ke-18 (belum terverifikasi)" dan koordinat sengaja dikosongkan
  karena titik pastinya belum diverifikasi.

Angka yang sebelumnya ditulis tetap ("Sepuluh tempat", "Delapan catatan")
diganti dengan nilai yang dihitung dari data. Angka tetap selalu basi
begitu data berubah, dan hal itu sudah terjadi dua kali di proyek ini.

Jumlah akhir: **11 destinasi, 10 artikel, 7 usaha** (4 di antaranya
berstatus demonstrasi dan tidak dipromosikan).

### 11.8 Komponen kustom

- **Bilah gulir** seluruh situs: rel transparan, batang emas redup yang
  menguat saat disentuh. Di bagian berlatar kertas, bilah memakai tinta
  agar tetap terbaca.
- **Pemisah katalog**: garis tipis dengan tiga titik di tengah, penanda
  bahwa satu entri selesai dan entri berikutnya mulai.
- **Nomor bagian** besar dan redup di sudut seksi, penanda katalog museum.
- **Efek masuk per halaman**: katalog masuk dengan dorongan vertikal,
  detail dengan pembukaan dari tengah, asisten dengan pendar.
- **Tombol entri acak**: menawarkan entri yang tidak akan dipilih sendiri
  oleh pengunjung yang selalu membuka tiga kartu teratas.

### 11.9 Verifikasi akhir sesi

```
$ npx tsc --noEmit                  → 0 galat
$ npx eslint src --max-warnings=0   → 0 error, 0 warning
$ npm run build                     → sukses
$ node scripts/audit-final.mjs      → 0 masalah dari 50 pemeriksaan
$ node scripts/uji-keamanan.mjs     → 8/8 skenario berperilaku benar
$ node scripts/verify-fitur.mjs     → 14/14 fitur lulus
```

Satu regresi ditemukan dan diperbaiki selama sesi ini: empat komponen
baru memakai ukuran teks 11 px, yang melanggar standar 12 px minimum
yang sudah ditetapkan di sesi sebelumnya. Audit menangkapnya sebagai 13
kegagalan `minFs=11`; setelah diperbaiki, kembali 0.
