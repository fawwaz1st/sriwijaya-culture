# Sriwijaya Culture

Arsip digital destinasi, usaha lokal, dan sejarah budaya Kota Palembang.
Dibuat oleh tim **Koding Seadanya** untuk ITFEST 2026, tema
*Empowering Culture Through AI-Driven Innovation*.

**Live:** https://sriwijaya-culture.vercel.app

---

## Apa yang situs ini lakukan

Sepuluh destinasi, tujuh usaha lokal, delapan catatan sejarah, dan
sembilan belas tonggak waktu. Setiap klaim menunjuk sumber, dan klaim
yang belum pasti ditandai, bukan ditulis sebagai fakta.

Tiga hal yang membedakannya dari direktori wisata biasa:

1. **Peta dari koordinat asli.** Jalan dan sungai digambar dari
   OpenStreetMap, diproyeksikan linier. Destinasi tanpa koordinat
   terverifikasi tidak digambar, bukan ditebak posisinya.
2. **Tingkat verifikasi per sumber.** Tiga tingkat, badge yang sama di
   seluruh situs. Angka yang tidak bisa ditelusuri tidak ditampilkan.
3. **Asisten yang mengaku kalau tidak tahu.** Sari hanya menjawab dari
   arsip, menyebut nomor rujukan, dan menolak pertanyaan di luar topik.

---

## Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16.4 (App Router) | Server component untuk katalog, rute dinamis untuk 25 rekaman, prerender 38 halaman |
| Bahasa | TypeScript 5.9 | Skema data ditegakkan di satu tempat, kesalahan tertangkap saat build |
| Styling | Tailwind CSS 4.3 | Token di CSS, kontras dihitung bukan dikira-kira |
| AI | Vercel AI SDK 7 | Streaming jawaban, penyedia bisa diganti lewat env |
| Pencarian | TF-IDF di server | 25 dokumen tidak butuh embedding 90 MB |
| Deploy | Vercel | Edge cache, image optimization bawaan |

---

## Struktur

```
src/
├── app/
│   ├── layout.tsx              Font, metadata, header, footer
│   ├── page.tsx                Beranda
│   ├── globals.css             Token warna, tipe, utilitas arsip
│   ├── destinasi/              Katalog + detail (?kategori=)
│   ├── umkm/                   Direktori + profil usaha
│   ├── artikel/                Katalog + artikel panjang
│   ├── asisten/                Halaman Asisten Sari
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

- Pulau Kemaro tidak muncul di peta karena koordinatnya belum diverifikasi.
- Kontak UMKM sebagian kosong, dengan penjelasan kenapa.
- Tidak ada bintang rating di mana pun.

---

## Aksesibilitas

- Kontras teks diukur, bukan dikira-kira. Tinta utama 14.6:1, tinta
  sekunder 6.6:1, tipe terkecil 4.6:1 terhadap latar.
- Seluruh kontrol bisa dicapai papan tombol. Peta bisa dioperasikan
  dengan Tab dan Enter.
- `prefers-reduced-motion` mematikan seluruh animasi.
- Setiap halaman punya satu `h1`, struktur heading berurutan.
- Gambar punya `alt` deskriptif, bukan nama berkas.

---

## Kredit

Foto dari Wikimedia Commons dengan lisensi Creative Commons. Kredit per
berkas tercantum di halaman detail masing-masing dan di `/metodologi`.
Geometri peta dari OpenStreetMap contributors (ODbL).

Data diperiksa terakhir 20 Oktober 2026.

---

## Tim

| Nama | Kode | Peran |
|---|---|---|
| M. Izzat Al Fawaz | 062640833318 | Pengembang utama |
| Abdur Rachman Abyan | 062640833308 | Data dan riset |
| Richa Karina | 062640833326 | Desain dan konten |

Lisensi kode: MIT. Lisensi data dan foto mengikuti sumbernya masing-masing.
