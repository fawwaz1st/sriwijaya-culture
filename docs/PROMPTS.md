# PROMPTS.md — Kurasi Prompt & Respons

Pasangan prompt → respons terpilih, dari sesi pengembangan nyata dan
dari perilaku produk yang bisa diuji langsung di situs.

## A. Prompt sistem Asisten Sari (produksi, lengkap di `src/lib/asisten-prompt.ts`)

Aturan intinya (10 butir), tiga yang paling menentukan:

1. Jawab **hanya** dari konteks yang diberikan. Tidak ada konteks =
   jawab persis: "Belum ada di arsip kami. …"
2. Setiap angka dan nama tempat wajib merujuk `[n]` dari daftar rujukan.
3. Jangan pernah menyebut "model", "sistem", "konteks", atau nama
   penyedia ke pengguna — bicara sebagai arsip, bukan mesin.

## B. Lima contoh grounding yang berhasil

| Pertanyaan | Sumber yang dikutip | Hasil |
|---|---|---|
| Apa yang membedakan Jembatan Ampera dari jembatan lain? | [1] artikel, [2] destinasi | Panjang 1.117 m, desain angkat, nama lama Bung Karno |
| Apa itu pempek? | [1]–[2] | Kuliner + sejarah ikan digiling, dengan rujukan |
| Apa yang bisa dilihat di Sungai Musi? | [1]–[3] | Panjang 720 km (sumber beda 750 km — keduanya dicatat) |
| Destinasi untuk belajar sejarah Sriwijaya? | [1]–[3] | TPKS, artikel Kerajaan Sriwijaya, artikel Sungai Musi |
| Jam buka Benteng Kuto Besak? | field terstruktur | Jawaban tanpa model, status verifikasi disebut |

## C. Dua contoh penolakan (grounding bekerja)

| Pertanyaan | Jawaban | Waktu |
|---|---|---|
| "Siapa presiden pertama Indonesia?" | "Belum ada di arsip kami. Coba sebut nama tempat, usaha, atau peristiwa…" | 16 ms |
| "Bagaimana cara membuat rendang padang yang enak?" | "Belum ada di arsip kami. …" | 11 ms |

Tanpa penjaga ini, model mengarang. Bukti kegagalan awal: "Jembatan
Ampera ada di Padang, Sumatera Barat".

## D. Prompt pengembangan penting

1. **Analisis guidebook + keputusan stack** (Lembar 3.1 di
   AI-DEVELOPMENT-LOG.md) → migrasi Next.js 16 + TS + Tailwind 4.
2. **Riset desain 2026** → pola museum: label <30 kata, kartu ≤150
   karakter, Google Maps embed nyata.
3. **QA penuh dengan inisiatif** → lahirnya `scripts/qa.mjs`;
   501 temuan → 0.
4. **Kritik habis-habisan + BYOK** → panel kunci milik pengguna,
   keamanan header, CSP ketat.
5. **Debug fallback kunci** → kunci salah tadinya menghasilkan jawaban
   kosong; kini diuji lebih dulu, gagal = turun tingkat dengan
   jawaban arsip yang tetap berguna.

## E. Pola yang sengaja TIDAK dikerjakan AI

- Mengisi alamat/telepon/harga yang tidak ada di data
- Membuat ulasan atau rating
- Kalimat pemasaran ("solusi terbaik untuk kebutuhan Anda")
