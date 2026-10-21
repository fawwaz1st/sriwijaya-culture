"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SAPAAN } from "@/lib/asisten-prompt";
import { cariDokumen } from "@/lib/retrieval";
import { cn } from "@/lib/cn";

/**
 * Antarmuka Asisten Sari.
 *
 * Dibangun seperti meja referensi perpustakaan: percakapan di satu
 * kolom, daftar rujukan selalu terlihat di kolom lain. Sumber tidak
 * disembunyikan di balik tombol, karena kemampuan memeriksa jawaban
 * adalah inti produk ini.
 *
 * Catatan teknis: server bisa menjawab dalam dua bentuk, yaitu stream
 * UIMessage dari AI SDK (saat ada model) atau teks biasa (mode arsip
 * langsung). Satu jalur fetch menangani keduanya supaya pengguna tidak
 * pernah melihat jawaban kosong.
 */

interface Rujukan {
  no: number;
  judul: string;
  jenis: string;
  href: string;
  meta: string;
}

interface PesanLokal {
  id: string;
  peran: "pengguna" | "sari";
  teks: string;
  sumber: Rujukan[];
}

export function AsistenChat() {
  const [input, setInput] = useState("");
  const [pesan, setPesan] = useState<PesanLokal[]>([]);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const ujung = useRef<HTMLDivElement>(null);
  const kotak = useRef<HTMLTextAreaElement>(null);
  const kendali = useRef<AbortController | null>(null);
  const sibukRef = useRef(false);

  useEffect(() => {
    ujung.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [pesan, sibuk]);

  // Fokus otomatis hanya di layar lebar, supaya papan tombol seluler
  // tidak langsung terbuka saat halaman dimuat.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) kotak.current?.focus();
  }, []);

  async function kirim(teks: string) {
    const bersih = teks.trim().slice(0, 600);
    if (!bersih || sibukRef.current) return;

    const idPengguna = `u-${crypto.randomUUID()}`;
    const idSari = `s-${crypto.randomUUID()}`;
    const riwayat = pesan;

    setPesan((p) => [...p, { id: idPengguna, peran: "pengguna", teks: bersih, sumber: [] }]);
    setInput("");
    setSibuk(true);
    sibukRef.current = true;
    setGalat(null);

    const kendaliBaru = new AbortController();
    kendali.current = kendaliBaru;

    try {
      const res = await fetch("/api/asisten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: kendaliBaru.signal,
        body: JSON.stringify({
          messages: [
            ...riwayat.map((p) => ({
              id: p.id,
              role: p.peran === "pengguna" ? "user" : "assistant",
              parts: [{ type: "text", text: p.teks }],
            })),
            { id: idPengguna, role: "user", parts: [{ type: "text", text: bersih }] },
          ],
        }),
      });

      setMode(res.headers.get("X-Sari-Mode"));

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const tipe = res.headers.get("Content-Type") || "";
      const sumber = rujukanUntuk(bersih);

      // --- Bentuk 1: teks biasa (mode arsip langsung) ---
      if (tipe.includes("text/plain")) {
        const jawab = await res.text();
        setPesan((p) => [...p, { id: idSari, peran: "sari", teks: jawab, sumber }]);
      } else {
        // --- Bentuk 2: stream UIMessage. Tampilkan sambil tumbuh. ---
        const akhir = await bacaStreamUI(res, (sebagian) => {
          setPesan((p) => {
            const ada = p.find((x) => x.id === idSari);
            if (ada) return p.map((x) => (x.id === idSari ? { ...x, teks: sebagian } : x));
            return [...p, { id: idSari, peran: "sari", teks: sebagian, sumber }];
          });
        });

        setPesan((p) => {
          const ada = p.find((x) => x.id === idSari);
          const teksAkhir = akhir.trim();
          if (!teksAkhir) {
            return p.map((x) =>
              x.id === idSari
                ? {
                    ...x,
                    teks:
                      "Model tidak mengirim jawaban. Coba lagi, atau buka rujukan di samping untuk membaca arsipnya langsung.",
                  }
                : x,
            );
          }
          if (ada) return p.map((x) => (x.id === idSari ? { ...x, teks: teksAkhir } : x));
          return [...p, { id: idSari, peran: "sari", teks: teksAkhir, sumber }];
        });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setGalat("Asisten tidak bisa menjangkau server. Arsip tetap bisa dibaca lewat katalog.");
      }
    } finally {
      setSibuk(false);
      sibukRef.current = false;
      kendali.current = null;
    }
  }

  function hentikan() {
    kendali.current?.abort();
    setSibuk(false);
    sibukRef.current = false;
  }

  const kueriTerakhir = [...pesan].reverse().find((p) => p.peran === "pengguna")?.teks ?? "";
  const rujukan = kueriTerakhir ? rujukanUntuk(kueriTerakhir) : [];

  return (
    <div className="grid border border-garis lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      {/* --- Kolom percakapan --- */}
      <div className="flex min-h-[520px] min-w-0 flex-col border-b border-garis lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-garis bg-kertas-2 px-4 py-2">
          <p className="label-arsip flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-1.5 rounded-full", sibuk ? "denyut bg-kunyit" : "bg-ok")}
            />
            Asisten Sari
          </p>
          <p className="font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
            {mode === "arsip-langsung"
              ? "Mode arsip langsung"
              : mode
                ? `Model: ${mode}`
                : "Siap"}
          </p>
        </div>

        <div className="gulir-tipis min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
          {pesan.length === 0 && (
            <div className="mx-auto max-w-[46ch] py-8 text-center">
              <p className="font-display text-2xl leading-tight text-tinta">
                Tanya apa saja tentang arsip ini.
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-tinta-2">
                Sari hanya menjawab dari isi arsip, dan selalu menyebut nomor
                sumber. Kalau jawabannya belum ada, ia akan mengatakannya.
              </p>
            </div>
          )}

          <ol className="space-y-4">
            {pesan.map((m) =>
              m.peran === "pengguna" ? (
                <li key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] border border-hijau-800 bg-hijau-900 px-3 py-2 text-[0.875rem] leading-relaxed text-kertas">
                    {m.teks}
                  </p>
                </li>
              ) : (
                <li key={m.id} className="flex gap-2">
                  <span className="label-arsip flex-none pt-1 text-kunyit-ink">Sari</span>
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-wrap text-[0.875rem] leading-relaxed text-tinta">
                      {m.teks}
                    </p>
                    {m.sumber.length > 0 && (
                      <ul className="mt-2 space-y-1 border-t border-garis-2 pt-2">
                        {m.sumber.map((s) => (
                          <li key={s.no}>
                            <Link
                              href={s.href}
                              className="group flex items-baseline gap-1.5 text-[0.75rem] leading-snug text-tinta-2 hover:text-tinta"
                            >
                              <span className="tabular font-mono text-[0.5625rem] text-kunyit-ink">
                                [{s.no}]
                              </span>
                              <span className="min-w-0 truncate">{s.judul}</span>
                              <span className="ml-auto flex-none font-mono text-[0.5rem] uppercase tracking-wider text-tinta-4">
                                {s.jenis}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ),
            )}

            {sibuk && (
              <li className="flex gap-2">
                <span className="label-arsip flex-none pt-1">Sari</span>
                <span className="flex gap-1 pt-2" aria-label="Sedang menyusun jawaban">
                  <span className="h-1.5 w-1.5 rounded-full bg-tinta-4 denyut" />
                  <span className="h-1.5 w-1.5 rounded-full bg-tinta-4 denyut [animation-delay:200ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-tinta-4 denyut [animation-delay:400ms]" />
                </span>
              </li>
            )}
          </ol>

          {galat && (
            <div className="mt-4 border border-bahaya/40 bg-[#fbeeec] p-3">
              <p className="font-mono text-[0.625rem] uppercase tracking-wider text-bahaya">
                Koneksi gagal
              </p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-tinta-2">{galat}</p>
            </div>
          )}
          <div ref={ujung} />
        </div>

        {pesan.length === 0 && (
          <div className="border-t border-garis-2 px-4 py-3">
            <p className="label-arsip mb-2">Coba mulai dari</p>
            <ul className="flex flex-wrap gap-1.5">
              {SAPAAN.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => kirim(s)}
                    className="border border-garis px-2 py-1 text-left text-[0.75rem] leading-snug text-tinta-2 transition-colors hover:border-hijau-800 hover:bg-kertas-2 hover:text-tinta"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            kirim(input);
          }}
          className="border-t border-garis bg-kertas-2 p-3"
        >
          <div className="flex items-end gap-2">
            <label htmlFor="sari-input" className="sr-only">
              Pertanyaan untuk Asisten Sari
            </label>
            <textarea
              id="sari-input"
              ref={kotak}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 600))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  kirim(input);
                }
              }}
              rows={2}
              placeholder="Contoh: destinasi mana yang cocok untuk belajar sejarah Sriwijaya?"
              className="gulir-tipis min-h-[52px] flex-1 resize-none border border-garis-3 bg-kertas px-2.5 py-2 text-[0.875rem] leading-relaxed text-tinta placeholder:text-tinta-4 focus:border-hijau-700 focus:outline-none"
            />
            {sibuk ? (
              <button
                type="button"
                onClick={hentikan}
                className="h-[52px] flex-none border border-garis-3 px-3 font-mono text-[0.625rem] uppercase tracking-wider text-tinta-2 hover:bg-kertas"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-[52px] flex-none items-center gap-2 border border-hijau-900 bg-hijau-900 px-3 font-mono text-[0.625rem] uppercase tracking-wider text-kertas transition-colors hover:bg-hijau-700 disabled:cursor-not-allowed disabled:border-garis-3 disabled:bg-kertas-3 disabled:text-tinta-4"
              >
                Kirim
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-4">
              {input.length}/600 · Enter untuk kirim
            </p>
            {pesan.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPesan([]);
                  setMode(null);
                  setGalat(null);
                }}
                className="font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3 hover:text-tinta"
              >
                Bersihkan
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- Kolom rujukan --- */}
      <aside className="min-w-0 self-start bg-kertas-2 lg:sticky lg:top-[4.5rem]">
        <div className="flex items-center justify-between border-b border-garis px-3 py-2">
          <p className="label-arsip">Rujukan arsip</p>
          <p className="tabular font-mono text-[0.5625rem] text-tinta-3">
            {String(rujukan.length).padStart(2, "0")}
          </p>
        </div>

        {rujukan.length === 0 ? (
          <div className="px-3 py-4">
            <p className="text-[0.75rem] leading-relaxed text-tinta-3">
              Rujukan muncul setelah kamu bertanya. Sari hanya memakai dokumen
              yang ada di daftar ini.
            </p>
            <div className="mt-4 border-t border-garis-2 pt-3">
              <p className="label-arsip">Isi arsip</p>
              <ul className="mt-1.5 space-y-1 font-mono text-[0.625rem] uppercase tracking-wider text-tinta-3">
                <li>10 destinasi</li>
                <li>7 usaha lokal</li>
                <li>8 catatan sejarah</li>
                <li>19 tonggak waktu</li>
              </ul>
            </div>
          </div>
        ) : (
          <ul className="gulir-tipis max-h-[460px] overflow-y-auto">
            {rujukan.map((r) => (
              <li key={r.no} className="border-b border-garis-2">
                <Link href={r.href} className="group block px-3 py-2.5 hover:bg-kertas">
                  <p className="flex items-baseline gap-1.5">
                    <span className="tabular font-mono text-[0.5625rem] text-kunyit-ink">
                      [{r.no}]
                    </span>
                    <span className="font-mono text-[0.5rem] uppercase tracking-wider text-tinta-4">
                      {r.jenis}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] font-medium leading-tight text-tinta group-hover:text-hijau-700">
                    {r.judul}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-tinta-3">
                    {r.meta}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-garis px-3 py-2">
          <p className="font-mono text-[0.5rem] uppercase leading-relaxed tracking-wider text-tinta-4">
            Pencarian kata kunci berbobot atas 25 rekaman. Tidak ada data yang
            dikirim keluar selain pertanyaan dan potongan arsip yang relevan.
          </p>
        </div>
      </aside>
    </div>
  );
}

/** Ambil dokumen arsip yang relevan untuk ditampilkan sebagai rujukan. */
function rujukanUntuk(kueri: string): Rujukan[] {
  return cariDokumen(kueri, 4).map((h, i) => ({
    no: i + 1,
    judul: h.dokumen.judul,
    jenis: h.dokumen.jenis,
    href: h.dokumen.href,
    meta: h.dokumen.meta,
  }));
}

/**
 * Baca stream UIMessage dari AI SDK dan kembalikan teks lengkapnya.
 *
 * Formatnya baris "data: {json}". Yang diambil hanya bagian text-delta,
 * karena itu satu-satunya bagian yang ditampilkan di antarmuka ini.
 */
async function bacaStreamUI(
  res: Response,
  saatPotongan: (teks: string) => void,
): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let buffer = "";
  let teks = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const baris = buffer.split("\n");
    buffer = baris.pop() ?? "";

    for (const b of baris) {
      const t = b.trim();
      if (!t.startsWith("data:")) continue;
      const isi = t.slice(5).trim();
      if (!isi || isi === "[DONE]") continue;
      try {
        const ev = JSON.parse(isi);
        if (ev.type === "text-delta" && typeof ev.delta === "string") {
          teks += ev.delta;
          saatPotongan(teks);
        }
      } catch {
        // Potongan bukan JSON diabaikan, bukan membuat seluruh jawaban gagal.
      }
    }
  }

  return teks;
}
