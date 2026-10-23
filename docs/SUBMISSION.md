# CHECKLIST PENGUMPULAN — ITFEST 2026

Batas akhir: **Jumat, 20.00 WIB** · Penilaian: 24–30 Oktober · Pemenang: Senin 2 November.

## Sebelum mengisi form

- [X] **Situs live** — https://sriwijaya-culture.vercel.app dibuka dan
  semua rute merespons (`node scripts/check-env.mjs`)
- [ ] **Repositori publik** — https://github.com/fawwaz1st/sriwijaya-culture
  (cek: tidak ada kunci API di riwayat commit — `node scripts/scan-secrets.mjs`)
- [ ] **Video demo 2–5 menit** direkam dan diunggah ke Google Drive
  (tautan: "siapa saja yang memiliki tautan dapat melihat")
- [ ] **AI Development Log** diekspor ke **.pdf atau .docx**
  (sumber: `docs/AI-DEVELOPMENT-LOG.md` — buka di Word/Docs lalu
  ekspor; guidebook menuntut salah satu format itu)
- [ ] **Screenshot** disisipkan ke dalam log: beranda, destinasi,
  detail destinasi, asisten (kosong + percakapan + panel kunci),
  terminal `next build`, hasil `audit-final.mjs` 0 masalah

## Isi form (dari guidebook)

1. URL situs yang di-hosting → `https://sriwijaya-culture.vercel.app`
2. URL repositori GitHub → `https://github.com/fawwaz1st/sriwijaya-culture`
3. Tautan video demo (Drive) → _(isi setelah unggah)_
4. Unggah AI Development Log (.pdf/.doc/.docx)

---

## Panduan membuat video demo

**Spesifikasi teknis.** Rekam 1920×1080, 30 fps, format MP4 (H.264).
Durasi 2–5 menit. Unggah ke Google Drive dengan izin "siapa saja yang
memiliki tautan dapat melihat", lalu salin tautannya ke form.

### Struktur adegan

Setiap adegan memperlihatkan hasil di layar, bukan menjelaskan rencana.
Satu gerakan kamera per poin, tanpa potongan kasar.

| Waktu | Adegan | Yang harus terlihat |
|---|---|---|
| 0:00–0:20 | Beranda | Judul, pita statistik, galeri asimetris. Sebut tema: budaya + AI |
| 0:20–0:50 | Destinasi | Katalog → detail. Sorot galeri foto, tabel data tercatat, peta yang bisa di-zoom |
| 0:50–1:20 | UMKM | Direktori, label status data, dan penjelasan mengapa entri belum terverifikasi tidak dipromosikan |
| 1:20–2:40 | Asisten Sari | Tiga pertanyaan berurutan: fakta, harga tiket, lalu pertanyaan di luar topik. Tunjukkan penolakan yang sopan dan kutipan bernomor yang bisa diklik |
| 2:40–3:20 | Panel kunci API | Buka panel, tunjukkan bahwa kunci hanya tersimpan di peramban dan tidak pernah dikirim ke pihak ketiga |
| 3:20–4:00 | Metodologi | Aturan data, status verifikasi, lalu jalankan `node scripts/audit-final.mjs` dan tunjukkan 0 masalah |
| 4:00–4:30 | Penutup | Satu kalimat tentang keputusan paling penting selama pengembangan |

### Cara merekam

1. **Siapkan dua jendela.** Peramban dalam mode layar penuh (F11), dan
   terminal dengan ukuran font 16px agar perintah terbaca di video.
   Tutup notifikasi sistem dan tab lain yang tidak dipakai.
2. **Rekam dalam satu kali jalan** bila memungkinkan. Bila perlu
   mengulang, ulangi satu adegan utuh, bukan satu kalimat, supaya
   irama antar adegan tetap konsisten.
3. **Ketik pertanyaan asisten secara utuh di depan kamera**, jangan
   ditempel. Penonton perlu melihat bahwa jawabannya benar-benar
   dihasilkan saat itu, bukan rekaman lama.
4. **Gunakan kursor sebagai penunjuk.** Setiap kali menyebut elemen,
   arahkan kursor ke elemen itu dan beri jeda setengah detik sebelum
   melanjutkan.
5. **Beri jeda 1 detik** sebelum dan sesudah setiap perpindahan
   halaman. Jeda ini yang membuat hasil akhir terasa tenang, bukan
   terburu-buru.
6. **Akhiri di halaman Metodologi**, karena di situlah semua klaim
   situs bisa diperiksa ulang oleh penilai.
7. **Bicaralah dengan tempo normal** dan jelaskan alasan di balik
   keputusan, bukan hanya membacakan apa yang terlihat. Contoh: "Peta
   ini memakai Google Maps asli, bukan gambar, supaya pengunjung bisa
   zoom dan melihat bangunan sekitar."
8. **Sisipkan satu kalimat jujur tentang batasan.** Misalnya:
   "Empat entri UMKM belum kami tampilkan karena alamatnya belum
   terverifikasi." Sikap ini yang membedakan arsip dari brosur.

### Yang sebaiknya dihindari

- Membaca daftar fitur seperti presentasi. Tunjukkan, jangan bacakan.
- Mempercepat rekaman agar muat durasi. Kalau terlalu panjang, potong
  satu adegan, jangan naikkan kecepatan.
- Menampilkan data yang tidak ada di situs. Semua yang disebut harus
  bisa dilihat penonton di layar pada saat yang sama.

---

## Jawaban pertanyaan form

### Latar belakang, tujuan, dan solusi (maksimal 300 kata)

Palembang menyimpan lapisan sejarah panjang, dari Sriwijaya abad ke-7
hingga kota sungai modern. Namun informasinya tersebar: sebagian di
ensiklopedia umum, sebagian di artikel media, sebagian hanya di papan
nama depan lokasi. Pengunjung sulit membedakan fakta terverifikasi dari
cerita yang beredar. Usaha lokal seperti pempek dan songket pun jarang
terdokumentasi dengan sumber yang bisa diperiksa.

Sriwijaya Culture menjawabnya dengan satu arsip digital yang
menggabungkan tiga hal: sepuluh destinasi bersejarah, delapan catatan
budaya, dan direktori usaha lokal. Tujuannya bukan mempromosikan, tetapi
mendokumentasikan secara bertanggung jawab. Setiap klaim mencantumkan
sumber, setiap data membawa status verifikasi, dan yang belum pasti
ditandai belum pasti. Sepuluh destinasi sudah berkoordinat, 71 sumber
tercatat, dan garis waktu merangkum 1.300 tahun dalam sembilan belas
tonggak.

Solusinya dibangun sebagai aplikasi Next.js dengan tiga lapis. Pertama,
arsip terstruktur: setiap entri memuat sumber, koordinat, dan catatan
verifikasi. Kedua, visualisasi yang bisa dipakai: peta Google Maps asli
yang dapat di-zoom, garis waktu, dan galeri foto berkredit. Ketiga,
Asisten Sari, asisten berbasis model bahasa yang menjawab hanya dari isi
arsip, menyertakan kutipan bernomor yang bisa diklik, dan menolak
menjawab bila jawabannya tidak ada. Penolakan itu disengaja, dan
ditegakkan oleh kode, bukan hanya oleh instruksi ke model: jawaban tanpa
rujukan sah otomatis diganti ringkasan arsip.

Dampaknya, pengunjung dapat merencanakan kunjungan dengan informasi yang
bisa diperiksa, sementara peneliti dan pelaku usaha memperoleh titik awal
yang transparan. Seluruh kode, data, dan proses pengembangan terbuka
untuk diperiksa ulang.

---

## Setelah submit

- [ ] Tangkapan layar bukti pengiriman form disimpan
- [ ] Ikuti IG @itfestival.polsri & @hmjmi_polsri (syarat verifikasi)
