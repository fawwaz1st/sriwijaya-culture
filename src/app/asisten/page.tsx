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
              Sari menjawab dengan mengambil dokumen dari arsip ini lebih dulu,
              lalu merangkai jawaban hanya dari dokumen tersebut. Setiap jawaban
              membawa nomor rujukan yang bisa kamu buka.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 border-t border-garis-malam pt-4">
              {[
                ["Sumber", "Selalu disebut"],
                ["Karangan", "Tidak diizinkan"],
                ["Legenda", "Diberi label"],
                ["Di luar arsip", "Ditolak"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline justify-between gap-2">
                  <span className="meta">{k}</span>
                  <span className="text-[0.6875rem] font-medium text-terang">{v}</span>
                </li>
              ))}
            </ul>
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
            i: "Pertanyaan diubah jadi kata kunci, lalu dicocokkan dengan 25 rekaman arsip memakai bobot TF-IDF. Judul diberi bobot tiga kali lebih besar.",
          },
          {
            n: "02",
            j: "Penyusunan jawaban",
            i: "Lima dokumen teratas dikirim sebagai konteks. Model diminta menjawab hanya dari konteks itu, dan menuliskan nomor rujukan.",
          },
          {
            n: "03",
            j: "Batas yang jelas",
            i: "Kalau konteks kosong, jawabannya adalah belum ada di arsip. Harga, jam buka, dan kontak tidak pernah dikarang.",
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
