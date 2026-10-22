import type { Metadata } from "next";
import { AsistenChat } from "@/components/asisten-chat";

export const metadata: Metadata = {
  title: "Asisten Sari",
  description:
    "Tanya tentang destinasi, usaha lokal, dan sejarah Palembang. Asisten ini hanya menjawab dari arsip dan menyebut sumbernya.",
};

/**
 * Halaman asisten.
 *
 * Sengaja tanpa header panjang. Versi sebelumnya menumpuk empat lapisan
 * teks sebelum chatbot-nya sendiri (judul, paragraf, tabel jaminan, tiga
 * kartu cara kerja). Pengunjung yang datang untuk bertanya harus
 * menggulir dulu. Sekarang pertanyaan pertama ada di layar pertama.
 *
 * Penjelasan cara kerja dipindah ke bawah sebagai satu baris, karena
 * hanya dibaca kalau orang memang penasaran.
 */
export default function HalamanAsisten() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-20 sm:px-8 lg:px-12">
      <div className="border border-garis-malam bg-malam-2/40 px-4 sm:px-6">
        <AsistenChat />
      </div>

      <p className="mt-6 text-[0.75rem] leading-relaxed text-terang-3">
        Sari mencari dokumen di arsip lebih dulu, lalu merangkai jawaban hanya
        dari dokumen itu. Tanpa dokumen yang cocok, jawabannya &ldquo;belum ada
        di arsip&rdquo;. Harga, jam buka, dan kontak tidak pernah dikarang.
      </p>
    </div>
  );
}
