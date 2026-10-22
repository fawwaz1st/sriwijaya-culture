"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SAPAAN } from "@/lib/asisten-prompt";
import { cariDokumen } from "@/lib/retrieval";
import { cn } from "@/lib/cn";

/**
 * Asisten Sari.
 *
 * Bentuknya mengikuti pola antarmuka asisten yang sudah jadi standar:
 * composer di tengah layar saat kosong, bergeser ke bawah setelah ada
 * percakapan, saran berupa chip tepat di bawah composer, dan rujukan
 * dibuka sebagai panel samping, bukan selalu memakan sepertiga layar.
 *
 * Yang membedakan dari chatbot biasa: setiap jawaban membawa nomor
 * rujukan yang bisa dibuka, dan mode penyedia ditampilkan terus terang.
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
  const [panel, setPanel] = useState(false);
  const ujung = useRef<HTMLDivElement>(null);
  const kotak = useRef<HTMLTextAreaElement>(null);
  const kendali = useRef<AbortController | null>(null);
  const sibukRef = useRef(false);

  const kosong = pesan.length === 0;

  useEffect(() => {
    if (!kosong) ujung.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [pesan, sibuk, kosong]);

  // Fokus otomatis hanya di layar lebar supaya papan tombol seluler
  // tidak langsung terbuka saat halaman dimuat.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) kotak.current?.focus();
  }, []);

  // Textarea tumbuh mengikuti isi, maksimal 4 baris.
  useEffect(() => {
    const el = kotak.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 108) + "px";
  }, [input]);

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

      if (tipe.includes("text/plain")) {
        const jawab = await res.text();
        setPesan((p) => [...p, { id: idSari, peran: "sari", teks: jawab, sumber }]);
      } else {
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
                      "Model tidak mengirim jawaban. Coba lagi, atau buka rujukan untuk membaca arsipnya langsung.",
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
  const rujukanTerakhir = [...pesan].reverse().find((p) => p.peran === "sari")?.sumber ?? [];

  return (
    <div
      className={cn(
        "relative flex flex-col",
        // Tinggi minimum penuh hanya saat kosong, supaya composer berada di
        // tengah layar. Setelah ada percakapan, halaman tumbuh mengikuti isi
        // dan composer langsung menempel di bawah jawaban.
        kosong && "min-h-[calc(100svh-10rem)]",
      )}
    >
      {/* --- Bilah status tipis --- */}
      <div className="flex items-center justify-between gap-3 border-b border-garis-malam py-2">
        <p className="meta flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("h-1.5 w-1.5 rounded-full", sibuk ? "denyut bg-emas" : "bg-ok")}
          />
          {mode === "arsip-langsung"
            ? "Mode arsip langsung"
            : mode
              ? `Model: ${mode}`
              : "Siap menjawab dari arsip"}
        </p>

        <div className="flex items-center gap-3">
          {rujukanTerakhir.length > 0 && (
            <button
              type="button"
              onClick={() => setPanel((v) => !v)}
              aria-expanded={panel}
              className="meta flex items-center gap-1.5 text-emas hover:text-emas-muda"
            >
              {rujukanTerakhir.length} rujukan
              <span aria-hidden="true" className={cn("transition-transform", panel && "rotate-180")}>
                ⌄
              </span>
            </button>
          )}
          {!kosong && (
            <button
              type="button"
              onClick={() => {
                setPesan([]);
                setMode(null);
                setGalat(null);
                setPanel(false);
                kotak.current?.focus();
              }}
              className="meta text-terang-3 hover:text-terang"
            >
              Mulai ulang
            </button>
          )}
        </div>
      </div>

      {/* --- Percakapan --- */}
      <div className={cn("flex flex-col", kosong ? "flex-1 justify-center pb-16" : "flex-1")}>
        {kosong ? (
          /* Empty state terpusat: satu pertanyaan besar, composer di tengah. */
          <div className="mx-auto w-full max-w-[46rem] px-1">
            <p className="meta-emas">Asisten arsip · Palembang</p>
            <h1 className="display mt-3 text-[clamp(2rem,5.2vw,3.75rem)] text-terang">
              Mau tahu apa tentang Palembang?
            </h1>
            <p className="mt-3 max-w-[46ch] text-[0.875rem] leading-relaxed text-terang-2">
              Sari menjawab dari 25 rekaman arsip ini dan menyebut sumbernya.
              Kalau datanya belum ada, ia bilang belum ada.
            </p>

            <div className="mt-8">
              <Composer
                input={input}
                setInput={setInput}
                kirim={kirim}
                sibuk={sibuk}
                hentikan={hentikan}
                kotak={kotak}
                besar
              />
              <SaranPertanyaan onPick={kirim} />
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto w-full max-w-[46rem] px-1 py-6">
              <ol className="space-y-7">
                {pesan.map((m) =>
                  m.peran === "pengguna" ? (
                    <li key={m.id} className="flex justify-end">
                      <p className="max-w-[85%] rounded-sm bg-terang px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-malam">
                        {m.teks}
                      </p>
                    </li>
                  ) : (
                    <li key={m.id}>
                      <p className="meta-emas mb-1.5">Sari</p>
                      <p className="whitespace-pre-wrap text-[0.9375rem] leading-[1.7] text-terang">
                        {m.teks}
                      </p>
                      {m.sumber.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {m.sumber.map((s) => (
                            <li key={s.no}>
                              <Link
                                href={s.href}
                                className="group flex items-center gap-1.5 border border-garis-malam px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-terang-2 transition-colors hover:border-emas hover:text-emas"
                              >
                                <span className="tabular text-emas">[{s.no}]</span>
                                <span className="max-w-[22ch] truncate normal-case tracking-normal">
                                  {s.judul}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ),
                )}

                {sibuk && (
                  <li>
                    <p className="meta-emas mb-1.5">Sari</p>
                    <span className="flex gap-1" aria-label="Sedang menyusun jawaban">
                      <span className="h-1.5 w-1.5 rounded-full bg-terang-3 denyut" />
                      <span className="h-1.5 w-1.5 rounded-full bg-terang-3 denyut [animation-delay:200ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-terang-3 denyut [animation-delay:400ms]" />
                    </span>
                  </li>
                )}
              </ol>

              {galat && (
                <div className="mt-5 border border-bahaya/40 bg-bahaya/8 p-3">
                  <p className="status text-bahaya">Koneksi gagal</p>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">{galat}</p>
                </div>
              )}
              <div ref={ujung} />
            </div>

            {/* Composer mengikuti isi percakapan, bukan didorong ke dasar
                layar. Sebelumnya `mt-auto` menyisakan ~300px ruang kosong. */}
            <div className="border-t border-garis-malam bg-malam/95 backdrop-blur">
              <div className="mx-auto w-full max-w-[46rem] px-1 py-3">
                <Composer
                  input={input}
                  setInput={setInput}
                  kirim={kirim}
                  sibuk={sibuk}
                  hentikan={hentikan}
                  kotak={kotak}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- Panel rujukan, dibuka sesuai permintaan --- */}
      {panel && rujukan.length > 0 && (
        <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-[22rem] overflow-y-auto border-l border-garis-malam bg-malam-2 p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="meta">Rujukan arsip</p>
            <button
              type="button"
              onClick={() => setPanel(false)}
              className="grid h-7 w-7 place-items-center border border-garis-malam text-terang-2 hover:border-terang"
              aria-label="Tutup rujukan"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-terang-3">
            Dokumen yang dipakai untuk pertanyaan terakhir. Sari hanya memakai
            yang ada di daftar ini.
          </p>
          <ul className="mt-4 space-y-2">
            {rujukan.map((r) => (
              <li key={r.no}>
                <Link
                  href={r.href}
                  className="group block border border-garis-malam p-2.5 hover:border-emas"
                >
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
        </aside>
      )}
    </div>
  );
}

/** Kotak input. Satu komponen, dua ukuran: hero dan sticky. */
function Composer({
  input,
  setInput,
  kirim,
  sibuk,
  hentikan,
  kotak,
  besar = false,
}: {
  input: string;
  setInput: (v: string) => void;
  kirim: (t: string) => void;
  sibuk: boolean;
  hentikan: () => void;
  kotak: React.RefObject<HTMLTextAreaElement | null>;
  besar?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        kirim(input);
      }}
      className={cn(
        "flex items-end gap-2 border border-garis-malam bg-malam-2 p-2 transition-colors focus-within:border-emas/60",
        besar && "p-2.5",
      )}
    >
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
        rows={1}
        placeholder="Tanya tentang destinasi, sejarah, atau usaha lokal…"
        className={cn(
          "gulir-tipis flex-1 resize-none bg-transparent px-1.5 py-2 text-terang placeholder:text-terang-3 focus:outline-none",
          besar ? "text-[0.9375rem]" : "text-[0.875rem]",
        )}
      />
      {sibuk ? (
        <button
          type="button"
          onClick={hentikan}
          className="grid h-9 w-9 flex-none place-items-center border border-garis-malam text-terang-2 hover:border-terang"
          aria-label="Hentikan jawaban"
        >
          <span className="block h-2.5 w-2.5 bg-terang-2" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          className="grid h-9 w-9 flex-none place-items-center bg-emas text-malam transition-colors hover:bg-emas-muda disabled:cursor-not-allowed disabled:bg-malam-5 disabled:text-terang-3"
          aria-label="Kirim pertanyaan"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 16V4M5 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </form>
  );
}

/** Chip saran. Ditulis tangan, mengikuti isi arsip. */
function SaranPertanyaan({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="mt-3">
      <p className="meta mb-2">Coba</p>
      <ul className="flex flex-wrap gap-1.5">
        {SAPAAN.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="border border-garis-malam px-2.5 py-1.5 text-left text-[0.75rem] leading-snug text-terang-2 transition-colors hover:border-emas hover:text-terang"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
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

async function bacaStreamUI(res: Response, saatPotongan: (teks: string) => void): Promise<string> {
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
