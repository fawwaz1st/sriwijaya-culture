import type { Metadata } from "next";
import { AsistenChat } from "@/components/asisten-chat";

export const metadata: Metadata = {
  title: "Asisten Sari",
  description:
    "Tanya tentang destinasi, usaha lokal, dan sejarah Palembang. Asisten ini hanya menjawab dari arsip dan menyebut sumbernya.",
};

export default function HalamanAsisten() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Asisten arsip</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Asisten yang mengaku kalau tidak tahu.
          </h1>
          <div className="max-w-[42ch] pb-2">
            <p className="text-[0.875rem] leading-relaxed text-terang-2">
              Sari membaca arsip ini dulu sebelum menjawab, lalu merangkai jawaban
              hanya dari yang ia baca. Tiap jawaban bawa nomor rujukan yang bisa
              kamu buka sendiri.
            </p>
            {/* Empat jaminan, disusun sebagai dua baris label-nilai yang
                rata. Versi sebelumnya memakai flex-baseline di dalam grid
                2 kolom sehingga nilai kanan menggantung tidak sejajar. */}
            <dl className="mt-4 grid grid-cols-2 gap-x-6 border-t border-garis-malam pt-4">
              {[
                ["Sumber", "Selalu disebut"],
                ["Karangan", "Tidak diizinkan"],
                ["Legenda", "Diberi label"],
                ["Di luar arsip", "Ditolak"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 py-1">
                  <dt className="meta shrink-0">{k}</dt>
                  <dd className="text-right text-[0.6875rem] font-medium text-terang">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="mt-10">
        <AsistenChat />
      </div>

      <section className="mt-12 grid gap-8 border-t border-garis-malam pt-8 sm:grid-cols-3">
        {[
          {
            n: "01",
            j: "Pengambilan dokumen",
            i: "Pertanyaanmu jadi kata kunci, lalu dicocokkan ke 25 rekaman arsip. Nama tempat diberi bobot lebih besar dari isi paragraf.",
          },
          {
            n: "02",
            j: "Penyusunan jawaban",
            i: "Lima dokumen teratas dikirim ke model sebagai satu-satunya bahan. Model diminta menulis nomor rujukannya.",
          },
          {
            n: "03",
            j: "Batas yang jelas",
            i: "Kalau tidak ada dokumen yang cocok, jawabannya \"belum ada di arsip\". Harga, jam buka, dan kontak tidak pernah dikarang.",
          },
        ].map((b) => (
          <div key={b.n}>
            <p className="tabular font-mono text-[0.625rem] text-emas">{b.n}</p>
            <p className="mt-2 font-display text-lg leading-tight text-terang">{b.j}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-terang-2">{b.i}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
