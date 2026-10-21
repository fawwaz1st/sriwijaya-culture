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
    <div className="grid border border-garis-malam lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="flex min-h-[540px] min-w-0 flex-col border-b border-garis-malam lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-garis-malam bg-malam-2 px-4 py-2.5">
          <p className="meta flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-1.5 rounded-full", sibuk ? "denyut bg-emas" : "bg-ok")}
            />
            Asisten Sari
          </p>
          <p className="meta text-terang-3">
            {mode === "arsip-langsung" ? "Mode arsip langsung" : mode ? `Model: ${mode}` : "Siap"}
          </p>
        </div>

        <div className="gulir-tipis min-h-0 flex-1 overflow-y-auto px-4 py-5" aria-live="polite">
          {pesan.length === 0 && (
            <div className="mx-auto max-w-[44ch] py-8">
              <p className="font-display text-2xl leading-tight text-terang">
                Tanya apa saja tentang arsip ini.
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-terang-2">
                Sari hanya menjawab dari isi arsip, dan selalu menyebut nomor
                sumber. Kalau jawabannya belum ada, ia akan mengatakannya.
              </p>
            </div>
          )}

          <ol className="space-y-5">
            {pesan.map((m) =>
              m.peran === "pengguna" ? (
                <li key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] bg-terang px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-malam">
                    {m.teks}
                  </p>
                </li>
              ) : (
                <li key={m.id} className="flex gap-2.5">
                  <span className="meta-emas mt-1 flex-none">Sari</span>
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-wrap text-[0.875rem] leading-relaxed text-terang">
                      {m.teks}
                    </p>
                    {m.sumber.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-garis-malam pt-2">
                        {m.sumber.map((s) => (
                          <li key={s.no}>
                            <Link
                              href={s.href}
                              className="group flex items-baseline gap-2 text-[0.75rem] leading-snug text-terang-2 hover:text-emas"
                            >
                              <span className="tabular font-mono text-[0.5625rem] text-emas">[{s.no}]</span>
                              <span className="min-w-0 truncate">{s.judul}</span>
                              <span className="ml-auto flex-none font-mono text-[0.5rem] uppercase tracking-[0.1em] text-terang-3">
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
              <li className="flex gap-2.5">
                <span className="meta-emas mt-1 flex-none">Sari</span>
                <span className="flex gap-1 pt-2" aria-label="Sedang menyusun jawaban">
                  <span className="h-1.5 w-1.5 rounded-full bg-terang-3 denyut" />
                  <span className="h-1.5 w-1.5 rounded-full bg-terang-3 denyut [animation-delay:200ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-terang-3 denyut [animation-delay:400ms]" />
                </span>
              </li>
            )}
          </ol>

          {galat && (
            <div className="mt-4 border border-bahaya/40 bg-bahaya/8 p-3">
              <p className="status text-bahaya">Koneksi gagal</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">{galat}</p>
            </div>
          )}
          <div ref={ujung} />
        </div>

        {pesan.length === 0 && (
          <div className="border-t border-garis-malam px-4 py-3">
            <p className="meta mb-2">Coba mulai dari</p>
            <ul className="flex flex-wrap gap-1.5">
              {SAPAAN.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => kirim(s)}
                    className="border border-garis-malam px-2 py-1 text-left text-[0.75rem] leading-snug text-terang-2 transition-colors hover:border-emas hover:text-terang"
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
          className="border-t border-garis-malam bg-malam-2 p-3"
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
              className="gulir-tipis min-h-[54px] flex-1 resize-none border border-malam-5 bg-transparent px-3 py-2.5 text-[0.875rem] leading-relaxed text-terang placeholder:text-terang-3 focus:border-emas focus:outline-none"
            />
            {sibuk ? (
              <button
                type="button"
                onClick={hentikan}
                className="h-[54px] flex-none border border-malam-5 px-3.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-2 hover:border-terang"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-[54px] flex-none items-center gap-2 bg-emas px-3.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-malam transition-colors hover:bg-emas-muda disabled:cursor-not-allowed disabled:bg-malam-4 disabled:text-terang-3"
              >
                Kirim
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-terang-3">
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
                className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-terang-3 hover:text-terang"
              >
                Bersihkan
              </button>
            )}
          </div>
        </form>
      </div>

      <aside className="min-w-0 self-start bg-malam-2 lg:sticky lg:top-[4.5rem]">
        <div className="flex items-center justify-between border-b border-garis-malam px-3.5 py-2.5">
          <p className="meta">Rujukan arsip</p>
          <p className="tabular font-mono text-[0.5625rem] text-terang-3">
            {String(rujukan.length).padStart(2, "0")}
          </p>
        </div>

        {rujukan.length === 0 ? (
          <div className="px-3.5 py-4">
            <p className="text-[0.75rem] leading-relaxed text-terang-3">
              Rujukan muncul setelah kamu bertanya. Sari hanya memakai dokumen
              yang ada di daftar ini.
            </p>
            <div className="mt-5 border-t border-garis-malam pt-4">
              <p className="meta">Isi arsip</p>
              <ul className="mt-2 space-y-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-3">
                <li>10 destinasi</li>
                <li>7 usaha lokal</li>
                <li>8 catatan sejarah</li>
                <li>19 tonggak waktu</li>
              </ul>
            </div>
          </div>
        ) : (
          <ul className="gulir-tipis max-h-[440px] overflow-y-auto">
            {rujukan.map((r) => (
              <li key={r.no} className="border-b border-garis-malam last:border-b-0">
                <Link href={r.href} className="group block px-3.5 py-3 hover:bg-malam-3">
                  <p className="flex items-baseline gap-1.5">
                    <span className="tabular font-mono text-[0.5625rem] text-emas">[{r.no}]</span>
                    <span className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-terang-3">
                      {r.jenis}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.8125rem] font-medium leading-tight text-terang group-hover:text-emas">
                    {r.judul}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-terang-3">
                    {r.meta}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-garis-malam px-3.5 py-2.5">
          <p className="font-mono text-[0.5rem] uppercase leading-relaxed tracking-[0.1em] text-terang-3">
            Pencarian kata kunci berbobot atas 25 rekaman. Tidak ada data yang
            dikirim keluar selain pertanyaan dan potongan arsip yang relevan.
          </p>
        </div>
      </aside>
    </div>
  );
}

function rujukanUntuk(kueri: string): Rujukan[] {
  return cariDokumen(kueri, 4).map((h, i) => ({
    no: i + 1,
    judul: h.dokumen.judul,
    jenis: h.dokumen.jenis,
    href: h.dokumen.href,
    meta: h.dokumen.meta,
  }));
}

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
        // Potongan bukan JSON diabaikan, bukan membuat jawaban gagal.
      }
    }
  }

  return teks;
}