# Sriwijaya Culture

Arsip digital destinasi, usaha lokal, dan sejarah budaya Kota Palembang.
Dibuat oleh tim **Koding Seadanya** untuk ITFEST 2026, tema
*Empowering Culture Through AI-Driven Innovation*.

**Live:** https://sriwijaya-culture.vercel.app

---

## Apa yang situs ini lakukan

Sebelas destinasi, tiga usaha publik yang sudah dicek, sepuluh
catatan sejarah, dan sembilan belas tonggak waktu. Setiap klaim menunjuk
sumber, dan klaim yang belum pasti ditandai, bukan ditulis sebagai
fakta.

Lima hal yang membedakannya dari direktori wisata biasa:

1. **Peta yang benar-benar bisa dipakai.** Embed Google Maps asli
   dengan dua lapisan (satelit dan jalan), sehingga pengunjung bisa
   zoom dan melihat bangunan sekitar. Destinasi tanpa koordinat
   terverifikasi tidak digambar, bukan ditebak posisinya.
2. **Tingkat verifikasi per sumber.** Tiga tingkat, badge yang sama di
   seluruh situs. Angka yang tidak bisa ditelusuri tidak ditampilkan,
   dan entri yang belum diverifikasi tidak dipromosikan ke direktori.
3. **Asisten yang mengaku kalau tidak tahu.** Sari hanya menjawab dari
   arsip, menyebut nomor rujukan yang bisa diklik, dan menolak
   pertanyaan di luar topik. Penolakan itu ditegakkan oleh kode, bukan
   hanya oleh instruksi ke model.
4. **Data kota yang hidup.** Cuaca dan gempa terkini ditarik dari
   Open-Meteo dan BMKG lewat rute API. Kalau sumber gagal, situs
   mengatakan belum tersedia, bukan menampilkan angka perkiraan.
5. **Favorit dan jarak nyata.** Pengunjung bisa menyimpan destinasi di
   peramban ini dan menghitung jarak dari posisinya bila memberi izin.
   Tidak ada akun, tidak ada data pribadi yang dikirim.

---

## Menjalankan di mesin lokal

```bash
npm install
cp .env.example .env.local   # lalu isi kunci penyedia model
npm run dev                  # http://localhost:3000
```

### Variabel lingkungan

| Nama | Wajib | Keterangan |
|---|---|---|
| `GROQ_API_KEY` | disarankan | Kunci Groq. Tanpa kunci, asisten tetap menjawab dalam mode arsip langsung. |
| `GROQ_MODEL` | tidak | Model utama. Default `openai/gpt-oss-120b`. |
| `GROQ_MODEL_CADANGAN` | tidak | Model kedua bila yang pertama gagal. |
| `GROQ_MODEL_CEPAT` | tidak | Model ketiga, paling ringan. |
| `OPENROUTER_API_KEY` | tidak | Alternatif Groq. |
| `TOGETHER_API_KEY` | tidak | Alternatif lain. |
| `NEXT_PUBLIC_SITE_URL` | tidak | Dipakai sitemap dan metadata. |

**Catatan penting untuk penilai.** Proyek ini membutuhkan kunci
penyedia model agar Asisten Sari menjawab dengan model bahasa. Kunci
tidak pernah masuk repositori: berkas `.env.local` di-ignore, dan di
produksi nilainya diisi lewat Environment Variables Vercel. Tanpa
kunci, asisten tetap berfungsi dalam mode arsip langsung dan tidak
pernah menampilkan jawaban kosong.

---

## Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16.4 (App Router) | Server component untuk katalog, rute dinamis untuk rekaman arsip, prerender 48 halaman |
| Bahasa | TypeScript 5.9 | Skema data ditegakkan di satu tempat, kesalahan tertangkap saat build |
| Styling | Tailwind CSS 4.3 | Token di CSS, kontras dihitung bukan dikira-kira |
| AI | Vercel AI SDK 7 | Streaming jawaban, rantai model berlapis lewat env |
| Pencarian | TF-IDF di server | 25 dokumen tidak butuh embedding 90 MB |
| Peta | Google Maps embed | Bisa di-zoom, tanpa kunci API berbayar |
| Deploy | Vercel | Edge cache, image optimization bawaan |

---

## Struktur

```
src/
├── app/
│   ├── layout.tsx              Font, metadata, header, footer
│   ├── page.tsx                Beranda
│   ├── api/cuaca/route.ts    Cuaca Palembang dari Open-Meteo
│   ├── api/gempa/route.ts    Gempa terkini dari BMKG
│   ├── globals.css             Token warna, tipe, utilitas arsip
│   ├── destinasi/              Katalog + detail (?kategori=)
│   ├── umkm/                   Direktori + profil usaha
│   ├── artikel/                Katalog + artikel panjang
│   ├── asisten/                Halaman Asisten Sari
│   ├── favorit/                Daftar simpanan lokal pengunjung
│   ├── metodologi/             Aturan data, tingkat verifikasi, daftar sumber
│   ├── tentang/                Tim dan teknologi
│   ├── api/asisten/route.ts    Rantai 3 tingkat penyedia model
│   ├── sitemap.ts robots.ts    SEO
│   └── opengraph-image.tsx     OG image dari HTML
├── components/
│   ├── atlas-map.tsx           Peta SVG interaktif dari OSM
│   ├── timeline.tsx            Garis waktu proporsional
│   ├── asisten-chat.tsx        Antarmuka percakapan + panel rujukan
│   ├── site-header.tsx         Navigasi
│   ├── site-footer.tsx         Kolofon
│   └── ui.tsx                  Tombol, badge, judul bagian, keadaan kosong
└── lib/
    ├── types.ts                Skema seluruh rekaman
    ├── arsip.ts                Satu pintu masuk data + turunan angka
    ├── geo.ts                  Proyeksi koordinat ke SVG
    ├── retrieval.ts            Indeks TF-IDF + ambang relevansi
    ├── asisten-prompt.ts       Aturan prompt, penjaga topik, jawaban langsung
    ├── warna.ts                Warna kategori
    ├── format.ts               Tanggal, angka, label verifikasi
    └── data/                   Data arsip (dihasilkan dari sumber, lihat scripts/)
```

---

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
```

Perintah lain:

```bash
npm run build        # build produksi
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
node scripts/check-env.mjs        # cek kesiapan deploy
node scripts/verify-visual.mjs    # screenshot 11 rute x 3 viewport + cek overflow
node scripts/verify-fitur.mjs      # uji tirai, pencarian, favorit, API data nyata, jarak
```

---

## Asisten Sari: cara kerja dan batasnya

Tiga tingkat, dicoba berurutan. Tujuannya satu: asisten tidak pernah
menampilkan jawaban kosong.

1. **Penyedia utama** (OpenRouter / Groq / Together), kalau kuncinya ada
   dan bentuknya valid. Streaming token.
2. **Endpoint tanpa kunci**, dipakai kalau tidak ada kunci valid. Batas
   waktu keras 14 detik.
3. **Arsip langsung**, jawaban disusun dari field data tanpa model.
   Selalu berhasil.

Sebelum model dipanggil, pertanyaan disaring lebih dulu:

- **Penjaga topik** menolak pertanyaan di luar domain (politik, kripto,
  resep, cuaca). Jawabannya "belum ada di arsip", tanpa rujukan palsu.
- **Ambang relevansi** pada TF-IDF mencegah dokumen muncul hanya karena
  satu kata kebetulan cocok.
- **Jawaban langsung** untuk tiket dan jam buka, karena dua topik ini
  paling sering ditanyakan dan paling berbahaya kalau dikarang.

### Mengisi kunci

```bash
cp .env.example .env.local
# lalu isi salah satu:
# OPENROUTER_API_KEY=sk-or-v1-...
# GROQ_API_KEY=gsk_...
```

Tanpa kunci, situs tetap berfungsi penuh. Panel asisten akan menampilkan
label **Mode arsip langsung**, jadi pengguna tahu apa yang sedang terjadi.

---

## Aturan data

Enam aturan yang dipegang seluruh isi arsip:

1. Setiap klaim menunjuk sumber berupa URL yang bisa dibuka.
2. Perbedaan antar sumber ditulis sebagai perbedaan, bukan dipilih diam-diam.
3. Legenda rakyat diberi label legenda, dipisahkan dari catatan sejarah.
4. Alamat, telepon, akun sosial, harga, dan ulasan tidak diisi perkiraan.
5. Entri contoh diberi label "demonstrasi" di kartu dan halaman detail.
6. Tidak ada formulir yang berpura-pura menyimpan data permanen.

Konsekuensi yang terlihat di produk:

- Pulau Kemaro baru masuk peta setelah koordinatnya diverifikasi dari
  OpenStreetMap dan Wikidata; titiknya menandai pusat pulau, bukan dermaga.
- Kontak UMKM sebagian kosong, dengan penjelasan kenapa.
- Empat dari tujuh entri UMKM berstatus `demonstrasi` dan **tidak**
  ditampilkan di direktori publik. Halaman `/umkm` hanya memuat rekaman
  berstatus `rujukan-umum`, dan menjelaskan berapa entri yang ditahan.
  Rute detailnya tetap hidup supaya tautan lama tidak menjadi 404.
- Tidak ada bintang rating di mana pun.

---

## Aksesibilitas

- Kontras teks diukur, bukan dikira-kira. Tinta utama 14.6:1, tinta
  sekunder 6.6:1, tipe terkecil 4.6:1 terhadap latar.
- Seluruh kontrol bisa dicapai papan tombol. Peta bisa dioperasikan
  dengan Tab dan Enter.
- Area sentuh kontrol kecil diperluas ke 44px lewat utilitas `.sentuh`,
  tanpa mengubah tinggi visualnya.
- `prefers-reduced-motion` mematikan seluruh animasi.
- Setiap halaman punya satu `h1`, struktur heading berurutan.
- Gambar punya `alt` deskriptif, bukan nama berkas.

---

## Gerak

Animasi memakai `animation-timeline` bawaan CSS, tanpa JavaScript dan
tanpa IntersectionObserver. Tiga aturan yang dipegang:

1. **Tidak ada konten yang disembunyikan demi animasi.** Versi awal
   memakai `opacity: 0` sebagai titik awal dengan `animation-timeline:
   view()`. Hasil pengukuran: kartu di bawah lipatan berakhir
   `opacity: 0` dan tidak pernah muncul, karena elemen itu sudah
   melewati fase `entry` sebelum animasi terpasang. Sekarang yang
   dianimasikan hanya `transform`, `filter`, dan `clip-path`. Kalau
   animasi gagal, konten tetap terbaca.
2. **Setiap gerakan mewakili sesuatu.** Foto menyala seperti lampu
   galeri, angka statistik naik seperti penghitung, label meta tumbuh
   seperti garis indeks katalog cetak.
3. **Selalu ada jalan keluar.** `prefers-reduced-motion` dan peramban
   tanpa `animation-timeline` mendapat keadaan akhir secara langsung
   lewat `@supports not`.

Kelas yang tersedia: `.muncul`, `.kartu-masuk`, `.foto-nyala`,
`.label-masuk`, `.angka-naik`, `.buka-tirai`, `.garis-tumbuh`,
`.garis-gulir`, `.denyut`.

---

## Catatan perbaikan tata letak

Beberapa bug yang ditemukan lewat pengukuran, bukan perkiraan:

| Gejala | Sebab | Perbaikan |
|---|---|---|
| Lubang ~340px di bawah kartu Benteng Kuto Besak | Foto 4:3 di kolom yang tingginya ditentukan potret 4:5 di sebelahnya | Kartu jadi `flex-col`, foto `flex-1`, teks menempel dasar |
| Kolom tengah "paling dikenal" kosong ~320px | Tidak ada isi setelah daftar 3 destinasi | Tabel fakta dari field `fakta` Ampera |
| Komposer asisten mengambang di tengah | `sticky bottom-0` menempel dasar isi, bukan dasar kotak | Pembungkus `flex h-full flex-col`, daftar `flex-1`, komposer di dasar |
| Header asisten pecah 3 baris di 390px | Tiga kontrol berdesakan | Status dipendekkan, tombol reset jadi ikon di bawah `sm` |
| Foto unggulan artikel terpotong 4:1 | Foto potret dipaksa jadi pita 1344x480 | Layout dua kolom, foto 4:5, teks di kolom kanan |
| Kartu UMKM tidak sejajar kakinya | `block` tanpa `flex-col` | `flex h-full flex-col` + `mt-auto` pada baris meta |

---

## Kredit

Foto dari Wikimedia Commons dengan lisensi Creative Commons. Kredit per
berkas tercantum di halaman detail masing-masing dan di `/metodologi`.
Geometri peta dari OpenStreetMap contributors (ODbL).

Data diperiksa terakhir 28 Oktober 2026.

---

## Tim

| Nama | Kode | Peran |
|---|---|---|
| M. Izzat Al Fawaz | 062640833318 | Pengembang utama |
| Abdur Rachman Abyan | 062640833308 | Data dan riset |
| Richa Karina | 062640833326 | Desain dan konten |

Lisensi kode: MIT. Lisensi data dan foto mengikuti sumbernya masing-masing.