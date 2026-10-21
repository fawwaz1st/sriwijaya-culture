# AI Development Log

Catatan proses pengembangan Sriwijaya Culture dengan bantuan AI.
Ditulis apa adanya, termasuk bagian yang gagal dan diperbaiki.

## Informasi proyek

| Item | Keterangan |
|---|---|
| Nama proyek | Sriwijaya Culture |
| Tujuan | Platform informasi pariwisata, budaya, dan usaha lokal Kota Palembang |
| Stack | HTML5, CSS3, Vanilla JavaScript |
| Batasan | Tanpa Node.js, tanpa framework, tanpa backend, tanpa database, tanpa build |
| Periode | Oktober 2026 |
| Peran AI | Penulisan kode, riset fakta, perancangan struktur data, pengujian otomatis |
| Peran manusia | Keputusan produk, penentuan aturan data, verifikasi fakta, penolakan kode yang tidak jujur |

## Tahap 1. Membaca brief dan guidebook

Brief yang diterima berisi tiga dokumen bertahap dari permintaan awal sampai
perbaikan. Dokumen-dokumen itu saling menimpa: permintaan awal memuat fitur
Hotel & Penginapan dan Artikel Budaya, dokumen kedua meminta penghapusan
Artikel Budaya, dokumen ketiga meminta penghapusan Hotel dan penggantiannya
dengan Artikel Sejarah dan Budaya.

Keputusan yang diambil: mengikuti dokumen terbaru, yaitu lima menu
(Beranda, Destinasi Wisata, Direktori UMKM, Artikel Sejarah dan Budaya,
Tentang Kami), dan menghapus seluruh jejak Hotel serta Artikel Budaya lama.

Guidebook lomba berupa PDF hasil scan tanpa lapisan teks. Teks tidak dapat
diekstrak langsung, sehingga halaman dirender menjadi gambar pada 170 dpi
lalu dibaca visual. Isi guidebook yang memengaruhi desain produk:

- Penilaian mencakup Implementasi AI sebesar 20 persen dan AI Development
  Log sebesar 10 persen. Artinya website biasa tanpa fitur AI tidak memenuhi
  harapan penilaian.
- Karya dikumpulkan dalam bentuk berkas, bukan deployment, sehingga seluruh
  fitur harus berjalan dari berkas lokal.
- Larangan framework dan backend tegas, sehingga fitur AI harus berjalan di
  sisi klien.

Kesimpulan tahap ini: fitur AI wajib ada, dan harus berjalan tanpa server.

## Tahap 2. Riset fakta

Riset dilakukan untuk 10 destinasi dan 3 topik sejarah. Prinsip yang dipakai:
lebih baik menulis "belum terverifikasi" daripada mengarang.

Temuan yang mengubah isi website:

1. Songket Palembang adalah Warisan Budaya Takbenda Indonesia sejak 2013
   dengan nomor pencatatan 201300009. Inskripsi UNESCO 2021 atas nama
   Malaysia. Banyak tulisan populer mengklaim UNESCO mengakui songket
   sebagai warisan Indonesia, dan klaim itu salah.
2. Benteng Kuto Besak sering ditulis "dibangun oleh Sultan Mahmud Badaruddin
   I". Kronologinya tidak masuk akal karena masa pemerintahannya 1724 sampai
   1758 sedangkan pembangunan berlangsung 1780 sampai 1797. Yang tepat:
   gagasan dari Sultan Mahmud Badaruddin I, pelaksanaan pada masa Sultan
   Muhammad Bahauddin.
3. Pulau Kemaro: kisah Tan Bun An dan Siti Fatimah adalah legenda rakyat yang
   ditulis di batu di samping kelenteng, bukan peristiwa bersejarah.
4. Angka tiket hampir semua destinasi beredar tanpa sumber resmi. Hanya
   Museum Sultan Mahmud Badaruddin II yang punya angka dari laman Kementerian
   Pariwisata, dan Taman Purbakala yang punya angka dari pemberitaan bertanggal.
5. Pusat Kerajaan Sriwijaya masih diperdebatkan. Palembang adalah kandidat
   kuat, tetapi lokasi Minanga Tamwan belum pasti.

Keputusan: setiap entri data diberi field `verifikasi` dengan nilai
`tinggi`, `sedang`, atau `perlu-konfirmasi`, dan antarmuka menampilkan
label sesuai. Artikel memuat bagian "yang masih diperdebatkan".

## Tahap 3. Riset tren antarmuka

Riset tren UI 2026 untuk situs warisan budaya. Yang diambil dan diterapkan:

- Palet gelap yang dibangun khusus, bukan sekadar membalik warna terang.
  Latar hijau tua pekat dengan teks krem hangat, untuk mengurangi halation
  yang membuat teks terlihat lebih tipis di latar gelap.
- Animasi reveal dengan durasi 300 sampai 500 ms dan easing
  `cubic-bezier(.4, 0, .2, 1)`, karena durasi di bawah 300 ms terasa mendadak
  dan di atas 500 ms menimbulkan kelelahan gerak.
- Target sentuh 44 px, bukan 24 px, karena 24 px hanya memenuhi batas minimum
  WCAG 2.5.8 dan terasa sempit di ponsel.
- Outline fokus 3 px sesuai WCAG 2.2.
- Penghormatan `prefers-reduced-motion` baik di CSS maupun JavaScript.

Yang tidak diambil: gradien ungu-biru, kartu dengan sudut seragam, dan
animasi fade-in pada semua elemen tanpa alasan.

## Tahap 4. Perancangan data

Data dipisah menjadi tiga berkas agar mudah dirawat dan tidak tergandakan:

- `js/data-destinasi.js` memuat 10 destinasi.
- `js/data-umkm.js` memuat 7 entri UMKM.
- `js/data-artikel.js` memuat 7 artikel.

Setiap entri punya `id` unik. Hubungan antar entri memakai id, bukan salinan
objek, sehingga menambah destinasi otomatis muncul di pencarian, asisten,
artikel terkait, dan destinasi terkait tanpa mengubah kode lain.

Keputusan yang disengaja: UMKM tidak memuat alamat, nomor telepon, atau akun
media sosial. Alasannya tidak ada verifikasi lapangan. Antarmuka menjelaskan
mengapa kolom itu kosong, bukan menampilkan kolom kosong tanpa keterangan.
Entri contoh diberi label "Data demonstrasi".

## Tahap 5. Implementasi

Urutan pengerjaan: data, lalu logika, lalu tampilan, lalu poles.

Komponen inti yang dibuat:

- `main.js` memuat utilitas, tema, navbar, footer, dan reveal. Navbar dan
  footer dirender dari satu sumber (`SC.NAV`) supaya 11 halaman konsisten
  tanpa menyalin blok HTML sebanyak 11 kali.
- `render.js` memuat pembuat HTML untuk kartu, galeri, peta, ulasan, daftar
  sumber, dan tombol favorit. Semua teks dari data di-escape sebelum masuk
  `innerHTML`.
- `akun.js` memuat pendaftaran, masuk, dan favorit dengan hash SHA-256 lewat
  Web Crypto. Bila Web Crypto tidak tersedia, ada fallback hash lemah dan
  antarmuka memberi tahu pengguna bahwa mode terbatas sedang dipakai.
- `asisten.js` memuat dua tingkat pencarian seperti dijelaskan di README.

## Tahap 6. Kegagalan yang ditemukan dan diperbaiki

Bagian ini dicatat karena kegagalan yang diperbaiki lebih berguna daripada
klaim semuanya berjalan mulus.

### Kegagalan 1. Urutan pemuatan skrip salah

Gejala: konsol menampilkan `Cannot read properties of undefined (reading 'qs')`
dan `Cannot read properties of undefined (reading 'esc')` di setiap halaman.
Kartu tidak muncul sama sekali.

Penyebab: `akun.js` dan `render.js` membaca `SC.util` saat berkas dimuat,
tetapi `SC.util` baru didefinisikan di `main.js` yang dimuat setelah keduanya.

Perbaikan: `main.js` dipindah ke posisi pertama di semua halaman, dan boot
dipisah menjadi `SC.mulai()` plus `SC.mulaiSekali()` supaya halaman tetap
berfungsi bila lupa memanggil boot manual.

Verifikasi: muat ulang 11 halaman, error konsol menjadi 0, kartu muncul.

### Kegagalan 2. Kesalahan ketik pada daftar stopword

Gejala: `node --check` menolak `asisten.js` dengan
`SyntaxError: Unexpected token '?'`.

Penyebab: kunci objek ditulis `ada? : 1` alih-alih `ada: 1`.

Perbaikan: hapus tanda tanya. Kegagalan ini ditemukan karena pemeriksaan
sintaks dijalankan sebelum pengujian peramban, bukan setelah.

### Kegagalan 3. Nama variasi tidak konsisten

Gejala: `admin.js` menampilkan `uniq is not defined`.

Penyebab: variabel dinamai `petaUnik` pada satu baris dan `uniq` pada baris
lainnya.

Perbaikan: samakan nama menjadi `petaUnik`.

### Kegagalan 4. Tabel meluber di layar 360 px

Gejala: halaman metodologi meluber 47 px ke samping, halaman admin meluber
183 px.

Penyebab pertama: tabel lebar tidak dibungkus pembungkus yang bisa digeser.
Diperbaiki dengan menambahkan `.table-wrap` berisi `overflow-x: auto`.

Penyebab kedua, dan ini yang lebih penting: `.panel` dan item grid tidak
punya `min-width: 0`. Pada CSS Grid, item anak memiliki `min-width: auto`
secara bawaan, sehingga isi lebar memaksa induknya meluber walaupun sudah
dibungkus. Diperbaiki dengan menambahkan `min-width: 0` pada `.panel`,
`.grid`, dan `.grid > *`.

Verifikasi: pengukuran `scrollWidth - clientWidth` pada 11 halaman di
viewport 360 px semuanya bernilai 0.

Catatan: solusi `overflow-x: hidden` pada `body` sengaja tidak dipakai
karena hanya menyembunyikan masalah, bukan memperbaikinya.

### Kegagalan 5. Tanda kutip nyasar pada template string

Gejala: potensi HTML rusak pada tombol "Jelajahi Destinasi" di halaman
artikel, karena string ditutup dengan `"` alih-alih `'`.

Perbaikan: perbaiki tanda kutip. Ditemukan saat membaca ulang kode, bukan
saat pengujian, sehingga menjadi alasan menambah pemeriksaan sintaks.

## Tahap 7. Pengujian

Pengujian dijalankan dengan Playwright di Chromium, bukan hanya dilihat dari
tampilan.

Hasil pengujian muat halaman: 11 halaman dimuat, 11 judul halaman benar,
navbar memuat 5 tautan di setiap halaman, 0 error konsol.

Hasil pengujian interaksi:

| Uji | Hasil |
|---|---|
| Cari "ampera" | 2 kartu |
| Cari "pulau" | 1 kartu |
| Cari kata acak | pesan "Destinasi tidak ditemukan" tampil |
| Kolom dikosongkan | 10 kartu kembali |
| Tombol galeri berikutnya | gambar berganti |
| Thumbnail ketiga | gambar berganti |
| Klik gambar utama | lightbox terbuka |
| Tekan Escape | lightbox tertutup |
| Peta tersemat | ada |
| Tautan Google Maps | 3 tautan, query sesuai destinasi |
| Daftar akun lalu masuk | berhasil |
| Simpan favorit | aria-pressed menjadi true |
| Favorit di halaman akun | 1 item tampil |
| Asisten: pertanyaan tiket | jawaban dari field tiket beserta catatan verifikasi |
| Asisten: pertanyaan UMKM | jawaban daftar produk beserta status data |
| Asisten: pertanyaan di luar data | menyatakan belum memuat data, tidak mengarang |
| Toggle tema | tema gelap aktif |
| Viewport 360 px | overflow 0 |
| Viewport 768 px | overflow 0 |
| Viewport 1440 px | overflow 0 |

## Keputusan produk yang diambil AI, dan alasannya

1. Menghapus Hotel & Penginapan sepenuhnya, termasuk berkas dan tautan,
   mengikuti dokumen permintaan terbaru.
2. Menambahkan halaman metodologi terpisah, bukan hanya catatan kaki,
   karena aturan data adalah pembeda utama proyek ini.
3. Menambahkan halaman ringkasan konten tanpa login admin, karena brief
   melarang dashboard admin tetapi pemilik situs tetap perlu melihat status
   data. Halaman ini hanya membaca data yang sudah ada.
4. Membuat asisten dengan dua tingkat, karena model semantik memerlukan
   unduhan dan tidak boleh menjadi syarat agar fitur dasar berjalan.
5. Menyediakan tombol cetak pada artikel yang membuka dialog cetak peramban,
   bukan mengklaim menyimpan PDF secara otomatis.
6. Tidak membuat formulir ulasan, karena tidak ada tempat penyimpanan dan
   formulir yang tidak menyimpan akan menipu pengguna.

## Bagian yang belum selesai

1. Alamat, kontak, dan media sosial UMKM masih kosong karena belum
   diverifikasi. Perlu kerja lapangan atau izin dari pemilik usaha.
2. Ulasan pengunjung belum ada karena tidak ada sumber sah yang dapat
   dikutip. Bila kelak dikumpulkan, perlu layanan penyimpanan, bukan
   localStorage.
3. Koordinat Kampung Arab Al-Munawar belum ditemukan dari sumber otoritatif,
   sehingga halaman itu tidak menampilkan peta sematan.
4. Pencarian semantik asisten belum diuji dengan model benar-benar terunduh
   karena pengujian dijalankan tanpa koneksi ke Hugging Face. Jalur kode
   sudah ada dan gagalnya ditangani dengan pesan yang jelas.
5. Gambar untuk beberapa produk UMKM masih memakai foto kategori, bukan foto
   produk spesifik, karena foto produk memerlukan izin dari pemilik usaha.

Catatan pembaruan 18 Oktober 2026: butir 3 (koordinat Kampung Arab) sudah
selesai di Tahap 8.1. Butir 4 (pencarian semantik) masih menunggu pengujian
dengan koneksi internet aktif.

## Cara memverifikasi klaim di log ini

1. Buka `index.html` di peramban, pastikan tidak ada error di konsol.
2. Buka `destinasi.html`, ketik "ampera", pastikan 2 kartu muncul.
3. Buka `detail-destinasi.html?id=jembatan-ampera`, klik tombol galeri
   berikutnya, pastikan gambar berganti.
4. Buka `akun.html`, buat akun, lalu simpan satu destinasi ke favorit.
5. Klik tombol asisten di kanan bawah, tanyakan "tiket jembatan ampera".
6. Kecilkan jendela peramban sampai 360 px, pastikan tidak ada geser horizontal.
7. Buka `metodologi.html#kredit` untuk memeriksa daftar lisensi gambar.

## Tahap 8. Perbaikan setelah audit mandiri (pagi 18 Oktober 2026)

### 8.1 Peta Kampung Arab akhirnya muncul

Sebelumnya halaman detail Kampung Arab Al-Munawar tidak menampilkan peta
sematan karena `koordinat` bernilai `null`. Audit menemukan bahwa koordinat
diverifikasi dari Jalan Al-Munawar di Seberang Ulu II, Palembang
(OpenStreetMap, diakses 18 Oktober 2026) dan berada di lokasi yang sama
dengan alamat tercatat: `lat=-2.9874825, lng=104.7729826`.

Catatan verifikasi diperbarui, tautan Google Maps tetap tersedia dan
Tombol "Lihat Rute" muncul. Verifikasi di uji otomatis: iframe OpenStreetMap
berhasil dimuat, catatan "Pota memerlukan koneksi internet" muncul.

### 8.2 Panggilan SC.mulai() di setiap skrip halaman

Audit menemukan 10 skrip halaman (admin, artikel, beranda, destinasi,
detail-artikel, detail-destinasi, detail-umkm, halaman-akun, metodologi, umkm)
tidak memanggil `SC.mulai()` di akhir berkas, padahal navbar, footer,
theme toggle, dan asisten Sari hanya terpasang lewat fungsi itu. Gejala:
halaman tampil tanpa navigasi konsisten dan tanpa tombol asisten di kanan bawah.

Perbaikan: tambahkan `SC.mulai();` di akhir setiap skrip halaman, dan ubah
`main.js` supaya `initReveal()` hanya dipanggil sekali (menggunakan flag
`__scMulai`) untuk menghindari duplikasi observer RevealOS.

Verifikasi: semua 11 halaman dimuat, navbar memuat 5 tautan dan footer
memuat 6 tautan, ada fab asisten di semua halaman, 0 error konsol.

### 8.3 Perbaikan data Pulau Kemaro dan Jembatan Ampera

1. Koordinat Pulau Kemaro (`lat=-2.978951, lng=104.817997`) dihapus.
   Alasan: angka itu berasal dari delta yang salah judul.field `luas: 79 hektare` dihapus karena tidak akurat. Catatan verifikasi diperbarui untuk menjelaskan hal ini.
2. Field `catatanVerifikasi` tentang peresmian Jembatan Ampera dipindah ke bagian artikel (sudah ada di sana di "Yang masih diperdebatkan") dan dihapus dari data destinasi supaya tidak duplikat.

Verifikasi: 10 destinasi tersisa semuanya punya koordinat valid, 0 field
`koordinat: null`, 0 field `luas: 79 hektare` tidak akurat.

### 8.4 Inisiatif UI: Bootstrap dan Kontras

1. **Bootstrap berwarna hijau dan emas untuk semua halaman**: tombol utama (`btn btn-primary`) sekarang punya warna hijau tua dengan teks putih, memakai CSS variables `--green-600` dan `--accent`. Tadinya tombolini tidak punya warna khusus dan menyeruh di banyak halaman.
2. **Fokus outline 3 px** di semua elemen interaktif untuk memenuhi WCAG 2.2.
3. **Skip-link** `Lewati ke konten utama` tampil saat menerima fokus keyboard, di semua halaman.

Verifikasi: semua halaman diuji dengan Playwright, 0 error kebalikan, semua elemen interaktif punya outline fokus yang terlihat.

### 8.5 Inisiatif SEO dan Cetak

1. **Meta Open Graph dan Twitter Card** ditambahkan ke semua 11 halaman;
   setiap halaman memuat `og:type`, `og:title`, dan `index.html` memuat
   `og:description` plus Twitter Card summary.
2. **theme-color** `#1a4a33` ditambahkan ke semua halaman untuk bilah
   alamat peramban memakai warna brand saat dibuka di perangkat bergerak.
3. **CSS cetak diperbaiki**: `@page { margin: 1.5cm; }` ditambahkan, dan
   class `no-print` diterapkan pada tombol "Kembali", "Bagikan", dan "Cetak"
   artikel supaya tidak ikut tercetak. Tombol "Buka di Google Maps" dan
   tautan lain dengan class `btn` tetap disembunyikan di media print.

Verifikasi: semua 11 file HTML dimuat dan divalidasi tanpa error konsol;
halaman artikel dicetak dan hasilnya hanya menampilkan konten artikel
tanpa navigasi dan tombol.

## Tahap 9. Audit visual dan responsivitas penuh (sore 18 Oktober 2026)

Tahap 1 sampai 8 bersifat fungsional. Tahap ini audit tampilan nyata:
screenshot Playwright pada 1280, 768, dan 360 piksel untuk semua halaman,
lalu setiap temuan diverifikasi dengan pengukuran DOM, bukan perkiraan mata.

### 9.1 Navbar membungkus dua baris pada layar lebar

Gejala: pada lebar 1280 piksel tautan menu pecah menjadi dua baris dan
tinggi navbar membengkak menjadi 96 piksel.

Penyebab: `ul.nav-links` tidak mereset margin bawaan `<ul>` (16 piksel
atas dan bawah), dan lebar gabungan tautan melewati ruang tersedia.

Perbaikan: reset margin (`margin: 0 0 0 auto`), `white-space: nowrap`
pada tautan, query baru `max-width: 1240px` dengan padding dan font lebih
kecil, serta burger menu diaktifkan mulai 1040 piksel (sebelumnya 820,
terlambat satu breakpoint).

Verifikasi terukur: jumlah baris tautan lewat JS = 1 pada 1280 piksel;
tinggi navbar terhitung 64 piksel.

### 9.2 Chips detail destinasi jatuh di luar foto

Gejala: chips "Budaya · Religi · Sejarah" dan ringkasan turun ke latar
krem dengan teks putih translusen sehingga tidak terbaca.

Penyebab: `.hero-media { max-height: 380px }` memotong foto, padahal
teks diletakkan menempel di bawah foto.

Perbaikan: batas tinggi dihapus, `.detail-hero` diberi latar hijau tua
solid, gradasi tiga berhenti (0.55, 0.28, 0.90) pada overlay foto, dan
`object-position: center 55%` supaya subjek foto tetap terlihat.

Verifikasi terukur: bottom chip terhitung 496 piksel, di dalam batas
foto 586 piksel; warna latar terhitung `rgb(13, 43, 30)`; kontras teks
utama 7.3:1 dan 13:1 sesuai WCAG AAA.

### 9.3 Tombol "Hapus pencarian" tampil saat kolom kosong

Gejala: tombol "Hapus pencarian" terlihat pada destinasi dan UMKM
walaupun kolom pencarian kosong, sekalipun JS sudah mengatur atribut
`hidden` dengan benar.

Penyebab: `.btn { display: inline-flex }` menimpa atribut `hidden`
karena atribut itu hanya mengatur `display: none` bawaan, yang kalah
pernyataan dari selector class.

Perbaikan: guard global `[hidden] { display: none !important }` di reset
CSS. Perbaikan ini otomatis menyelesaikan pola identik di halaman UMKM.

Verifikasi terukur: tombol tersembunyi saat kolom kosong, muncul saat
ada query, dan klik mengembalikan 10 kartu.

### 9.4 Overflow 4 piksel pada 360 piksel dan tinggi kartu tidak seragam

Dua temuan kecil sekaligus:

1. Subtitle brand "KEBUDAYAAN & PARIWISATA" memaksa lebar navbar
   melewati 360 piksel. Diperbaiki dengan menyembunyikan subtitle pada
   `max-width: 640 piksel`. Terukur: overflow 0.
2. Judul kartu destinasi satu baris memaksa tinggi kartu menyempit
   di bawah aspect ratio 1/1 yang dipaksa. Diperbaiki: aspect 4/5 dan
   judul maksimum tiga baris dengan tinggi minimum.

### 9.5 Verifikasi akhir

- Pemeriksaan otomatis `_verify_ui.py`: 12 dari 12 lulus (navbar,
  drawer, chips, filter, overflow, console).
- Smoke test 11 halaman pada dua viewport (1280 dan 360 piksel):
  22 dari 22 lulus, 0 error konsol, 0 overflow horizontal, navbar
  selalu satu baris, footer dan tombol asisten ada di semua halaman.
- Seluruh perubahan hanya menyentuh tiga berkas CSS (`style.css`,
  `components.css`, `responsive.css`); tidak ada perubahan JavaScript,
  data, atau HTML.
