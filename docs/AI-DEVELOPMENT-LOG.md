# AI-DEVELOPMENT-LOG — Sriwijaya Culture

**Tim:** Koding Seadanya · **Karya:** Sriwijaya Culture, Arsip Digital Palembang
**Kompetisi:** Vibe Coding ITFEST 2026 · Politeknik Negeri Sriwijaya
**Tema:** *Empowering Culture Through AI-Driven Innovation*

> Dokumen ini dilengkapi sebagai .docx / .pdf sesuai ketentuan guidebook.
> Semua prompt dan respons di bawah adalah salinan asli dari sesi
> pengembangan, tidak diubah.

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

---

## 2. Arsitektur fitur AI (produk)

Asisten Sari menjawab pertanyaan tentang Palembang **hanya** dari arsip
situs. Rantainya:

1. **Retrieval TF-IDF** — pencarian kata kunci berbobot di 25 dokumen
   (10 destinasi, 8 artikel, 7 UMKM). Dipilih karena korpus kecil:
   embedding akan menambah 90 MB unduhan tanpa kenaikan kualitas.
2. **Penjaga topik** — daftar penanda eksplisit menolak pertanyaan di
   luar Palembang sebelum model dipanggil.
3. **Ambang relevansi** — skor retrieval di bawah 4.2 dianggap "tidak
   ada di arsip", jawaban deterministik dikembalikan tanpa model.
4. **Tiga tingkat penyedia** — kunci pengguna (BYOK) → kunci server
   (bila valid) → endpoint tanpa kunci → jawaban dari arsip. Asisten
   tidak pernah menampilkan kotak kosong.
5. **Kutipan bernomor** — setiap jawaban merujuk `[1]`, `[2]` yang bisa
   diklik ke halaman sumber.

Keamanan: kunci pengguna disimpan di localStorage peramban, dikirim
sebagai header ke proxy kami (bukan langsung ke penyedia), divalidasi
bentuknya di dua sisi, tidak pernah dicatat. Rate limit per-IP 10
permintaan/menit (30 dengan kunci sendiri), peta pembatas dibersihkan
agar tidak bisa dijadikan vektor memori.

---

## 3. Salinan prompt → respons (pengembangan)

### Prompt 3.1 — analisis guidebook

```
kamu analisa penuh pdf ini DENGAN memakai GAMBAR + TEXT untuk
KEAKURATAN PEMAHAMAN. RESTRUKTURISASI DAN REORGANIZE PROJEK INI
KARENA SANGATLAH BERANTAKAN. PIKIRKAN SANGAT MENDALAM APAKAH TETAP
MEMAKAI HTML ATAU BERALIH PENUH KE NEXT.JS/TYPESCRIPT/TAILWINDCSS.
```

**Respons AI (ringkas):** rekomendasi migrasi penuh ke Next.js 16 +
TypeScript + Tailwind 4 dengan alasan: tidak ada lapisan server, tidak
ada tipe, 11 berkas HTML menggandakan markup. Diikuti manusia, dengan
satu revisi: embedding 90 MB ditolak, diganti TF-IDF.

### Prompt 3.2 — desain ulang terukur

```
Layout/frontend saat ini sangat bagus, namun ada beberapa space, maps
(harusny google maps/maps earth asli), dan banyak teks yang bisa
dipangkas/dipadatkan/humanisasi serta beberapa simplifikasi.
Riset standar industri 2026
```

**Respons AI:** riset referensi (NN/g, pola museum), lalu proposal:
hero foto penuh dengan scrim tinggi 62%, Google Maps embed nyata
(menggantikan SVG buatan), ringkasan kartu ≤150 karakter.

### Prompt 3.3 — QA dengan inisiatif

```
design seluruh halaman masih sangat buruk bahkan di asisten. lakukan
full testing + QA hingga detail terkecil dan bahkan tidak dimention
diprompt (INISIATIF)
```

**Respons AI:** membangun `scripts/qa.mjs` — audit 10 rute × 3 lebar
(390/768/1440) yang mengukur kontras WCAG, target sentuh, overflow,
heading, alt, dan galat konsol. Temuan pertama **501 masalah**;
setelah tiga putaran perbaikan: **0**.

### Prompt 3.4 — BYOK dan keamanan

```
di halaman asisten, jangan ada footer dan perbaiki UI/frontendnya.
tambah kotak kecil input untuk menambahkan API key provider AI.
Tingkatkan optimasi dan keamanan AI!
```

**Respons AI:** pola app-shell 2026 (Claude.ai/ChatGPT), panel kunci
milik pengguna, dan laporan keamanan yang menemukan celah sendiri:
pembatas laju bisa dilewati lewat pemalsuan `X-Forwarded-For` dan map
pembatas bisa digembungkan tanpa batas. Keduanya diperbaiki (hop
terakhir + pembersihan peta).

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
*"Jembatan Ampera ada di Padang, Sumatera Barat"* — kota salah.
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

- Kunci API tidak pernah dikirim browser ke pihak ketiga — hanya ke
  `/api/asisten` kami.
- `Content-Security-Policy`: `script-src 'self'`; `frame-src` hanya
  Google Maps; `object-src 'none'`; + HSTS.
- Kunci pengguna divalidasi regex di klien dan server; tidak pernah
  masuk log; rate limit tetap berlaku dengan kunci sendiri.

---

## 6. Pembagian kerja manusia–AI

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
- Video demo: (tautan Drive — lihat SUBMISSION.md)
