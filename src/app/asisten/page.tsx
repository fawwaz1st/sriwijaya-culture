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
 * Halaman ini menjelaskan cara kerja asisten di atas, bukan di bawah.
 * Pengguna berhak tahu bahwa jawabannya dibatasi arsip sebelum ia
 * mulai mengetik.
 */
export default function HalamanAsisten() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="border-t border-tinta pt-4">
        <p className="label-arsip">
          <span className="mr-2 text-kunyit-ink">05</span>Asisten arsip
        </p>
        <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
          <h1 className="judul-arsip max-w-[20ch] text-[clamp(2.25rem,5vw,3.75rem)]">
            Asisten yang mengaku kalau tidak tahu.
          </h1>
          <div className="self-end">
            <p className="max-w-[48ch] text-sm leading-relaxed text-tinta-2">
              Sari menjawab dengan mengambil dokumen dari arsip ini lebih dulu,
              lalu merangkai jawaban hanya dari dokumen tersebut. Setiap jawaban
              membawa nomor rujukan yang bisa kamu buka.
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-garis-2 pt-3">
              {[
                ["Sumber", "Selalu disebut"],
                ["Karangan", "Tidak diizinkan"],
                ["Legenda", "Diberi label"],
                ["Di luar arsip", "Ditolak"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                    {k}
                  </span>
                  <span className="text-[0.6875rem] font-medium text-tinta">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div className="mt-8">
        <AsistenChat />
      </div>

      <section className="mt-10 grid gap-0 border border-garis sm:grid-cols-3">
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
          <div key={b.n} className="border-b border-garis p-4 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <p className="tabular font-mono text-[0.625rem] text-kunyit-ink">{b.n}</p>
            <p className="mt-1 font-display text-base leading-tight text-tinta">{b.j}</p>
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-tinta-2">{b.i}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
