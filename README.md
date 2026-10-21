# Sriwijaya Culture

Platform informasi pariwisata, budaya, dan usaha lokal Kota Palembang, Sumatera Selatan.
Dibuat dengan HTML5, CSS3, dan Vanilla JavaScript. Tanpa Node.js, tanpa framework,
tanpa backend, tanpa database, tanpa proses build.

## Cara menjalankan

Buka `index.html` langsung di peramban. Tidak perlu server.

```
c:\laragon\www\apps\SriwijayaCulture\index.html
```

Bila menggunakan Laragon, arahkan virtual host ke folder ini, atau cukup buka berkasnya.

## Struktur proyek

```
SriwijayaCulture/
├── index.html                 Beranda
├── destinasi.html             Katalog destinasi wisata
├── detail-destinasi.html      Detail satu destinasi (?id=)
├── umkm.html                  Direktori UMKM
├── detail-umkm.html           Detail satu usaha (?id=)
├── artikel.html               Katalog artikel sejarah dan budaya
├── detail-artikel.html        Artikel lengkap (?id=)
├── tentang.html               Tentang kami
├── akun.html                  Akun lokal dan daftar favorit
├── metodologi.html            Metodologi data, batasan, kredit gambar
├── admin.html                 Ringkasan isi data dan cek tautan
│
├── css/
│   ├── style.css              Token warna, tipografi, navbar, footer, tombol, kartu
│   ├── components.css         Galeri, peta, ulasan, produk, auth, asisten, tabel
│   └── responsive.css         Media query 1024 / 820 / 640 / 420, landscape, cetak
│
├── js/
│   ├── main.js                Utilitas, tema, navbar, footer, reveal, boot
│   ├── data-destinasi.js      Dataset 10 destinasi
│   ├── data-umkm.js           Dataset 7 entri UMKM
│   ├── data-artikel.js        Dataset 7 artikel
│   ├── akun.js                Akun lokal, hash kata sandi, favorit
│   ├── render.js              Pembuat HTML kartu, galeri, peta, ulasan, sumber
│   ├── asisten.js             Asisten Sari: pencarian kata kunci + semantik opsional
│   ├── beranda.js             Isi dinamis beranda
│   ├── destinasi.js           Pencarian destinasi
│   ├── detail-destinasi.js    Halaman detail destinasi
│   ├── umkm.js                Pencarian dan filter UMKM
│   ├── detail-umkm.js         Halaman detail UMKM
│   ├── artikel.js             Katalog artikel
│   ├── detail-artikel.js      Halaman artikel lengkap
│   ├── halaman-akun.js        Formulir masuk, daftar, dashboard favorit
│   ├── metodologi.js          Tabel kredit gambar dan ringkasan data
│   └── admin.js               Ringkasan konten dan pemeriksaan tautan
│
└── assets/
    └── images/                23 foto berlisensi bebas dari Wikimedia Commons
```

## Urutan pemuatan skrip

`main.js` harus dimuat lebih dulu karena mendefinisikan `SC.util`, `SC.ikon`,
dan `SC.tema` yang dipakai modul lain. Urutan di setiap halaman:

```
main.js -> data-destinasi.js -> data-umkm.js -> data-artikel.js
        -> akun.js -> render.js -> asisten.js -> <skrip halaman>
```

Bila menambah halaman baru, ikuti urutan yang sama.

## Fitur utama

### 1. Detail destinasi wisata
Setiap destinasi punya halaman sendiri dengan galeri foto, sejarah, daya tarik,
aktivitas, informasi tiket dan jam beserta status verifikasi, peta, ulasan,
sumber data, destinasi terkait, dan artikel terkait.

### 2. Direktori UMKM
Setiap usaha punya halaman sendiri dengan profil, produk unggulan, lokasi,
kontak dan media sosial, ulasan, usaha terkait, dan destinasi di sekitarnya.

### 3. Artikel sejarah dan budaya
Tujuh artikel dengan struktur lengkap: pendahuluan, pembahasan, kesimpulan,
daftar sumber, tombol Jelajahi Destinasi, dan artikel terkait.

### 4. Akun lokal
Daftar dan masuk dengan hash SHA-256 lewat Web Crypto. Favorit destinasi,
UMKM, dan artikel disimpan di `localStorage`. Tidak ada backend.

### 5. Asisten Sari
Dua tingkat pencarian:
- Tingkat 1, selalu aktif: pencarian kata kunci berbobot (TF-IDF sederhana)
  atas seluruh data destinasi, UMKM, dan artikel. Berjalan tanpa internet.
- Tingkat 2, opsional: pencarian semantik memakai model embedding
  `Xenova/all-MiniLM-L6-v2` yang berjalan di browser dengan WebGPU atau
  WebAssembly. Model diunduh dari Hugging Face saat pengguna menyalakannya.

Asisten tidak mengarang jawaban. Semua kalimat disusun dari field data yang
ada. Bila tidak ada dokumen cocok, asisten mengatakan belum ada datanya.

## Aturan data yang dipegang

1. Setiap angka dan klaim ditelusuri ke sumber yang tercantum di halaman detail.
2. Bila sumber berbeda, perbedaannya ditulis, bukan dipilih sepihak.
3. Cerita rakyat diberi label legenda dan dipisahkan dari catatan sejarah.
4. Alamat, nomor kontak, akun media sosial, harga, dan ulasan tidak diisi perkiraan.
5. Entri contoh diberi label "Data demonstrasi".
6. Tidak ada formulir yang berpura-pura menyimpan data permanen.

Contoh keputusan yang diambil dari aturan ini:
- Songket Palembang adalah Warisan Budaya Takbenda Indonesia 2013. Inskripsi
  UNESCO 2021 atas nama Malaysia, dan website ini menuliskannya demikian.
- Benteng Kuto Besak: gagasan dari Sultan Mahmud Badaruddin I, pelaksanaan
  pada masa Sultan Muhammad Bahauddin. Banyak artikel populer keliru di sini.
- Tiket Pulau Kemaro, Benteng Kuto Besak, Monpera, dan Kampung Al-Munawar
  tidak ditampilkan sebagai angka pasti karena sumbernya bukan pengelola resmi.

## Aksesibilitas dan kenyamanan

- Kontras teks dihitung, bukan dikira-kira. Teks utama 13:1 di latar terang
  dan 13,5:1 di latar gelap.
- Tema gelap memakai latar hijau tua pekat dengan teks krem hangat untuk
  mengurangi halation.
- Target sentuh minimal 44 px pada tombol utama.
- Fokus keyboard terlihat dengan outline 3 px.
- `prefers-reduced-motion` dimatikan untuk animasi reveal dan transisi.
- Navigasi keyboard pada galeri: panah kiri dan kanan, Escape menutup lightbox.
- Tidak ada horizontal scrolling pada viewport 360 px, sudah diuji.

## Yang memerlukan koneksi internet

- Peta sematan OpenStreetMap.
- Tombol Buka di Google Maps dan Lihat Rute.
- Pencarian semantik asisten, karena model embedding diunduh dari Hugging Face.

Sisa fitur berjalan tanpa internet. Website ini tidak mengklaim berjalan penuh
secara offline.

## Pengujian yang sudah dilakukan

- Sintaks seluruh 17 berkas JavaScript diperiksa dengan `node --check`.
- 11 halaman dimuat di Chromium melalui Playwright, 0 error konsol.
- Pencarian destinasi: "ampera" menghasilkan 2 kartu, "pulau" 1 kartu,
  kata acak menampilkan pesan kosong, kolom kosong menampilkan 10 kartu.
- Galeri: tombol berikutnya, thumbnail, dan lightbox berfungsi.
- Akun: pendaftaran, masuk, favorit, dan tampilan favorit di halaman akun.
- Asisten: pertanyaan tiket, UMKM, dan pertanyaan di luar data memberi jawaban jujur.
- Tema gelap aktif.
- Responsif pada 360, 768, dan 1440 px tanpa horizontal scrolling.

## Lisensi gambar

Seluruh foto berasal dari Wikimedia Commons dengan lisensi Creative Commons.
Daftar lengkap berkas, objek, lisensi, dan penulis ada di halaman
`metodologi.html#kredit`.

## Catatan

Proyek ini dibuat untuk keperluan edukasi dan kompetisi. Bukan platform
reservasi, bukan direktori usaha terverifikasi pemerintah, dan bukan layanan
pemesanan penginapan.
