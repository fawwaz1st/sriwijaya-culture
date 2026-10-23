"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SAPAAN } from "@/lib/asisten-prompt";
import { cariDokumen } from "@/lib/retrieval";
import { cn } from "@/lib/cn";
import { IsiArsip, type RingkasArsip } from "@/components/isi-arsip";

/**
 * Asisten Sari — shell aplikasi layar penuh.
 *
 * Pola 2026 (Claude.ai / ChatGPT / Perplexity): header tipis, area
 * percakapan sebagai satu-satunya yang menggulir, composer menempel di
 * bawah. Empty state terpusat: sapaan besar + chip saran.
 *
 * Kunci milik pengguna (BYOK): disimpan di localStorage peramban ini
 * saja, dikirim ke /api/asisten lewat HTTPS sebagai header, dan dipakai
 * server untuk menelepon penyedia. Kunci tidak pernah diteruskan
 * browser langsung ke pihak ketiga dan tidak pernah ditampilkan utuh
 * setelah disimpan. Tanpa kunci, asisten tetap berjalan dengan tingkat
 * tanpa kunci dan arsip.
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

const KUNCI_PENYIMPANAN = "sari-api-key";

/** Hanya izinkan bentuk kunci yang dikenal, sebelum dikirim ke server. */
function bentukKunciValid(k: string): boolean {
  // Groq: kunci nyata bervariasi panjangnya (56 terlihat), jadi cukup
  // prefiks + rentang wajar, bukan angka pasti.
  return /^(sk-or-v1-[a-f0-9]{64}|gsk_[A-Za-z0-9]{40,80}|sk-[A-Za-z0-9-_]{40,})$/.test(k.trim());
}

export function AsistenChat({ ringkasArsip }: { ringkasArsip?: RingkasArsip }) {
  const [input, setInput] = useState("");
  const [pesan, setPesan] = useState<PesanLokal[]>([]);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [panel, setPanel] = useState(false);
  const [panelKunci, setPanelKunci] = useState(false);
  const [kunci, setKunci] = useState("");
  const [statusKunci, setStatusKunci] = useState<string | null>(null);
  const ujung = useRef<HTMLDivElement>(null);
  const kotak = useRef<HTMLTextAreaElement>(null);
  const kendali = useRef<AbortController | null>(null);
  const sibukRef = useRef(false);

  const kosong = pesan.length === 0;

  /**
   * Kunci tersimpan dibaca sekali saat render pertama lewat lazy
   * initializer: berjalan di luar efek, tanpa render berantai. SSR
   * aman karena typeof window diperiksa dulu. Kunci disimpan sebagai
   * state (bukan ref) agar tidak diakses saat render.
   */
  const [kunciAktif, setKunciAktif] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const t = localStorage.getItem(KUNCI_PENYIMPANAN);
      return t && bentukKunciValid(t) ? t : "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (!kosong) ujung.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [pesan, sibuk, kosong]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) kotak.current?.focus();
  }, []);

  useEffect(() => {
    const el = kotak.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 108) + "px";
  }, [input]);

  function simpanKunci() {
    const k = kunci.trim();
    if (!k) {
      // Kosong berarti hapus.
      setKunciAktif("");
      try {
        localStorage.removeItem(KUNCI_PENYIMPANAN);
      } catch {}
      setStatusKunci("Kunci dihapus. Asisten kembali ke mode bawaan.");
      setKunci("");
      return;
    }
    if (!bentukKunciValid(k)) {
      setStatusKunci("Bentuk kunci tidak dikenali. Periksa lagi kunci Anda.");
      return;
    }
    setKunciAktif(k);
    try {
      localStorage.setItem(KUNCI_PENYIMPANAN, k);
    } catch {}
    setStatusKunci("Kunci tersimpan di peramban ini saja.");
    setKunci("");
  }

  function hapusKunci() {
    setKunciAktif("");
    setKunci("");
    try {
      localStorage.removeItem(KUNCI_PENYIMPANAN);
    } catch {}
    setStatusKunci("Kunci dihapus.");
  }

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
    setStatusKunci(null);

    const kendaliBaru = new AbortController();
    kendali.current = kendaliBaru;

    try {
      const res = await fetch("/api/asisten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Kunci dikirim hanya ke server kami, bukan ke penyedia langsung.
          ...(kunciAktif ? { "X-Sari-Api-Key": kunciAktif } : {}),
        },
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
                ? { ...x, teks: "Jawabannya tidak sampai. Coba lagi, atau buka rujukan di bawah." }
                : x,
            );
          }
          if (ada) return p.map((x) => (x.id === idSari ? { ...x, teks: teksAkhir } : x));
          return [...p, { id: idSari, peran: "sari", teks: teksAkhir, sumber }];
        });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setGalat("Sari sedang tidak bisa dihubungi. Arsip tetap bisa dibaca lewat katalog.");
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
  const jawabanTerakhir = [...pesan].reverse().find((p) => p.peran === "sari");
  const rujukanTerakhir = jawabanTerakhir?.sumber ?? [];

  const statusTerakhir = !jawabanTerakhir
    ? "Siap menjawab"
    : rujukanTerakhir.length === 0
      ? "Tidak ada di arsip"
      : "Dijawab dari arsip";

  return (
    <div className="flex h-full flex-col bg-malam">
      {/* --- Bar atas: status + aksi ---

          Di layar 390px tiga kontrol ini tidak muat dan status pecah
          jadi tiga baris. Status dipendekkan dan tombol "Mulai ulang"
          menjadi ikon di bawah `sm`. */}
      <div className="flex items-center justify-between gap-2 border-b border-garis-malam px-3 py-2.5 sm:gap-3 sm:px-6">
        <p className="meta flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("h-1.5 w-1.5 flex-none rounded-full", sibuk ? "denyut bg-emas" : "bg-ok")}
          />
          <span className="truncate">{sibuk ? "Menyusun jawaban" : statusTerakhir}</span>
        </p>

        <div className="flex flex-none items-center gap-1.5 sm:gap-3">
          {rujukanTerakhir.length > 0 && (
            <button
              type="button"
              onClick={() => setPanel((v) => !v)}
              aria-expanded={panel}
              className="sentuh meta flex items-center gap-1.5 rounded-md px-2 py-1.5 text-emas transition-colors hover:bg-emas/10 hover:text-emas-muda sm:px-2.5"
            >
              <span className="tabular">{rujukanTerakhir.length}</span>
              <span className="hidden sm:inline">rujukan</span>
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
                setGalat(null);
                setPanel(false);
                kotak.current?.focus();
              }}
              aria-label="Mulai ulang percakapan"
              title="Mulai ulang"
              className="sentuh meta grid h-8 w-8 place-items-center rounded-md text-terang-3 transition-colors hover:bg-terang/8 hover:text-terang sm:h-auto sm:w-auto sm:px-2.5 sm:py-1.5"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2.5 8a5.5 5.5 0 1 1 1.8 4.1" strokeLinecap="round" />
                <path d="M2 4.5V8h3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Mulai ulang</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPanelKunci((v) => !v)}
            aria-expanded={panelKunci}
            aria-label="Pengaturan kunci API"
            className={cn(
              "grid h-7 w-7 place-items-center border transition-colors",
              kunciAktif
                ? "border-emas/50 text-emas hover:text-emas-muda"
                : "border-garis-malam text-terang-3 hover:border-terang hover:text-terang",
            )}
            title={kunciAktif ? "Kunci API tersimpan" : "Pakai kunci API milikmu"}
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="5.5" cy="10.5" r="2.6" />
              <path d="M7.6 8.4 13 3m-2 0h2v2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- Panel kunci API (BYOK) --- */}
      {panelKunci && (
        <div
          role="group"
          aria-label="Pengaturan kunci API"
          className="border-b border-garis-malam bg-malam-2/60 px-4 py-3.5 sm:px-6"
        >
          <div className="mx-auto w-full max-w-[46rem]">
            <p className="meta-emas">Kunci API milikmu</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">
              Punya kunci OpenRouter atau Groq? Tempel di sini untuk jawaban
              yang lebih cepat. Kunci disimpan di peramban ini saja dan tidak
              pernah keluar selain ke server kami. Tanpa kunci pun Sari
              tetap menjawab — hanya lebih lambat.
            </p>
            <div className="mt-2.5 flex gap-2">
              <input
                type="password"
                value={kunci}
                onChange={(e) => setKunci(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && simpanKunci()}
                placeholder={kunciAktif ? "•••••••• (tersimpan)" : "sk-or-v1-…"}
                autoComplete="off"
                spellCheck={false}
                className="min-h-9 flex-1 border border-garis-malam bg-malam px-2.5 py-1.5 font-mono text-[0.8125rem] text-terang placeholder:text-terang-3 focus:border-emas/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={simpanKunci}
                className="min-h-9 bg-emas px-3.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-malam transition-colors hover:bg-emas-muda"
              >
                Simpan
              </button>
              {kunciAktif && (
                <button
                  type="button"
                  onClick={hapusKunci}
                  className="min-h-9 border border-garis-malam px-3.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-terang-2 transition-colors hover:border-bahaya hover:text-bahaya"
                >
                  Hapus
                </button>
              )}
            </div>
            {statusKunci && <p className="meta mt-2 normal-case tracking-normal">{statusKunci}</p>}
          </div>
        </div>
      )}

      {/* --- Percakapan: satu-satunya yang menggulir ---
          role=log + aria-live polite: pembaca layar diumumkan saat
          jawaban baru masuk, tanpa menyela pengguna yang sedang mengetik. */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Percakapan dengan Sari"
        className="gulir-tipis min-h-0 flex-1 overflow-y-auto"
      >
        {kosong ? (
          /*
           * Empty state rata atas, bukan justify-center. Di layar tinggi
           * (desktop 1000px) justify-center mendorong sapaan ke tengah
           * kotak dan menyisakan ~450px kosong di atas serta di bawah.
           * Rata atas membuat mata langsung bertemu judul dan kolom
           * input, sisa ruang di bawah dipakai chip saran.
           */
          <div className="mx-auto w-full max-w-[46rem] px-1 pb-10 pt-8">
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(217,168,50,0.07),transparent_60%)]"
            />
            <p className="meta-emas relative">Asisten arsip · Palembang</p>
            <h1 className="display relative mt-3 text-[clamp(2rem,5.2vw,3.5rem)] text-terang">
              Mau tahu apa tentang Palembang?
            </h1>
            <p className="relative mt-3 max-w-[44ch] text-[0.875rem] leading-relaxed text-terang-2">
              Sari menjawab dari arsip situs ini dan menyertakan sumbernya.
            </p>

            <div className="relative mt-7">
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

            {ringkasArsip && <IsiArsip r={ringkasArsip} />}
          </div>
        ) : (
          /*
           * Percakapan aktif.
           *
           * Sebelumnya blok ini hanya `<>...</>`: daftar pesan setinggi
           * isinya, lalu composer `sticky bottom-0` menempel di dasar
           * daftar, bukan di dasar kotak. Akibatnya pada percakapan
           * pendek (satu tanya satu jawab) composer mengambang di tengah
           * dan menyisakan ~400px kosong di bawahnya.
           *
           * Sekarang dibungkus flex-col setinggi kotak: daftar pesan
           * mengambil sisa ruang (flex-1) dan composer duduk di dasar.
           */
          <div className="flex h-full flex-col">
            {/* Area pesan bisa digulir sendiri. Sebelumnya seluruh kotak
                ikut memanjang, jadi jawaban panjang mendorong composer
                keluar layar dan di ponsel teks tertutup composer. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-[46rem] px-3 pb-4 pt-6 sm:px-1">
                <ol className="space-y-7">
                  {pesan.map((m) =>
                    m.peran === "pengguna" ? (
                      <li key={m.id} className="flex justify-end">
                        <p className="max-w-[85%] rounded-lg bg-terang px-3.5 py-2.5 text-[0.875rem] leading-relaxed text-malam shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                          {m.teks}
                        </p>
                      </li>
                    ) : (
                      <li key={m.id}>
                        <div className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid h-6 w-6 flex-none place-items-center bg-emas/15 font-display text-[0.625rem] font-medium text-emas"
                          >
                            S
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="whitespace-pre-wrap text-[0.9375rem] leading-[1.7] text-terang">
                              {m.teks}
                            </p>
                            {m.sumber.length > 0 && (
                              <ul className="mt-3 flex flex-wrap gap-1.5">
                                {m.sumber.map((s) => (
                                  <li key={s.no}>
                                    <Link
                                      href={s.href}
                                      className="group flex items-center gap-1.5 rounded-full border border-garis-malam bg-malam-2/60 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-terang-2 transition-colors hover:border-emas/60 hover:bg-emas/8 hover:text-emas"
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
                          </div>
                        </div>
                      </li>
                    ),
                  )}

                  {sibuk && (
                    <li>
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
                    <p className="status text-bahaya">Sari sedang tidak bisa dihubungi</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-terang-2">{galat}</p>
                  </div>
                )}
                <div ref={ujung} />
              </div>
            </div>

            {/* Composer di dasar kotak, bukan menempel isi percakapan. */}
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
          </div>
        )}
      </div>

      {/* --- Panel rujukan --- */}
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
            Dokumen yang dipakai untuk pertanyaan terakhir.
          </p>
          <ul className="mt-4 space-y-2">
            {rujukan.map((r) => (
              <li key={r.no}>
                <Link href={r.href} className="group block border border-garis-malam p-2.5 hover:border-emas">
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
        "flex items-end gap-2 border border-garis-malam bg-malam-2 p-2 shadow-[inset_0_1px_0_rgba(242,239,232,0.05)] transition-all focus-within:border-emas/60 focus-within:shadow-[0_0_0_1px_rgba(217,168,50,0.25),inset_0_1px_0_rgba(242,239,232,0.05)]",
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
              className="rounded-full border border-garis-malam px-3 py-1.5 text-left text-[0.75rem] leading-snug text-terang-2 transition-colors hover:border-emas hover:text-terang"
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
