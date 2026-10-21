import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  SYSTEM_PROMPT,
  jawabanLangsung,
  susunKonteks,
  teksPesan,
  type KonteksSumber,
} from "@/lib/asisten-prompt";

export const maxDuration = 60;

/**
 * Rantai penyedia model.
 *
 * Tiga tingkat, dicoba berurutan. Tujuannya satu: asisten tidak boleh
 * menampilkan kotak kosong di depan juri.
 *
 *   Tingkat 1  OpenRouter / Groq / Together, kalau kuncinya valid.
 *   Tingkat 2  Endpoint tanpa kunci, dipakai kalau tidak ada kunci valid.
 *   Tingkat 3  Jawaban disusun langsung dari arsip, tanpa model.
 *
 * Tingkat 1 dan 2 sama-sama diberi KONTEKS dan aturan yang sama, jadi
 * kualitas jawabannya tidak bergantung pada penyedia mana yang aktif.
 */

interface Penyedia {
  nama: string;
  model: string;
  baseURL: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

/**
 * Kunci OpenRouter punya bentuk yang bisa diperiksa sebelum dipakai.
 * Kunci yang bentuknya salah lebih baik dilewati daripada menghasilkan
 * galat 401 di depan pengguna.
 */
function kunciOpenRouterValid(k: string | undefined): boolean {
  return Boolean(k && /^sk-or-v1-[a-f0-9]{64}$/.test(k));
}

function penyediaUtama(): Penyedia | null {
  const or = process.env.OPENROUTER_API_KEY;
  if (kunciOpenRouterValid(or)) {
    return {
      nama: "openrouter",
      model: process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free",
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: or,
      headers: {
        "HTTP-Referer": "https://sriwijaya-culture.vercel.app",
        "X-Title": "Sriwijaya Culture",
      },
    };
  }

  const groq = process.env.GROQ_API_KEY;
  if (groq && groq.startsWith("gsk_")) {
    return {
      nama: "groq",
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groq,
    };
  }

  const together = process.env.TOGETHER_API_KEY;
  if (together && together.length > 20) {
    return {
      nama: "together",
      model: process.env.TOGETHER_MODEL || "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      baseURL: "https://api.together.xyz/v1",
      apiKey: together,
    };
  }

  return null;
}

/** Endpoint tanpa kunci. Dipakai hanya kalau tidak ada kunci valid. */
const PENYEDIA_TANPA_KUNCI: Penyedia = {
  nama: "tanpa-kunci",
  model: "openai",
  baseURL: "https://text.pollinations.ai/openai",
};

function susunSystem(konteks: { teks: string; kosong: boolean }): string {
  return (
    SYSTEM_PROMPT +
    (konteks.kosong
      ? "\n\nKONTEKS: (kosong). Tidak ada dokumen yang cocok. Jawab bahwa belum ada di arsip, lalu sebutkan topik yang tersedia."
      : `\n\nKONTEKS:\n${konteks.teks}`)
  );
}

/** Tingkat 3: jawaban dari arsip, tanpa model. Selalu berhasil. */
function jawabanDariArsip(kueri: string): { teks: string; sumber: KonteksSumber[] } {
  const { sumber, kosong } = susunKonteks(kueri);

  if (kosong) {
    return {
      teks:
        'Belum ada di arsip kami. Coba sebut nama tempat, usaha, atau peristiwa yang lebih spesifik, misalnya "Jembatan Ampera", "songket", atau "Sriwijaya".',
      sumber: [],
    };
  }

  const baris = sumber.map((s) => `[${s.no}] ${s.judul} (${s.meta})`).join("; ");

  return {
    teks:
      `Asisten sedang berjalan dalam mode arsip langsung, tanpa model bahasa, jadi jawaban ini hanya daftar rujukan paling relevan: ${baris}. ` +
      `Buka salah satu lembar di rujukan untuk membaca isinya.`,
    sumber,
  };
}

function balasanTeks(teks: string, mode: string, jumlahSumber: number): Response {
  return new Response(teks, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Sari-Mode": mode,
      "X-Sari-Sumber": String(jumlahSumber),
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  let messages: UIMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Badan permintaan bukan JSON." }, { status: 400 });
  }

  const terakhir = messages.filter((m) => m.role === "user").at(-1);
  const kueri = terakhir ? teksPesan(terakhir) : "";

  if (!kueri) {
    return Response.json({ error: "Pertanyaan kosong." }, { status: 400 });
  }

  // Batasi panjang masukan. Pencegahan penyalahgunaan, bukan formalitas.
  const kueriAman = kueri.slice(0, 600);

  // Pertanyaan tiket dan jam buka dijawab dari field terstruktur, tanpa model.
  // Dua topik ini paling sering ditanyakan dan paling berbahaya kalau dikarang.
  const langsung = jawabanLangsung(kueriAman);
  if (langsung) {
    const teks =
      langsung.teks +
      (langsung.sumber.length
        ? "\n\n" + langsung.sumber.map((s) => `[${s.no}] ${s.judul} — ${s.href}`).join("\n")
        : "");
    return balasanTeks(teks, "arsip-langsung", langsung.sumber.length);
  }

  const konteks = susunKonteks(kueriAman);

  // --- Tingkat 1: kunci valid ---
  const utama = penyediaUtama();
  if (utama) {
    try {
      const provider = createOpenAICompatible({
        name: utama.nama,
        baseURL: utama.baseURL,
        apiKey: utama.apiKey,
        headers: utama.headers,
      });

      const pesanModel = await convertToModelMessages(messages);
      const hasil = streamText({
        model: provider(utama.model),
        system: susunSystem(konteks),
        messages: pesanModel,
        temperature: 0.2,
        maxOutputTokens: 600,
        onError({ error }) {
          console.error("[asisten] galat penyedia utama:", error);
        },
      });

      return createUIMessageStreamResponse({
        stream: toUIMessageStream({
          stream: hasil.stream,
          onError: () => "Model sedang tidak bisa dijangkau. Coba lagi sebentar.",
        }),
        headers: {
          "X-Sari-Mode": utama.nama,
          "X-Sari-Sumber": String(konteks.sumber.length),
        },
      });
    } catch (e) {
      console.error("[asisten] penyedia utama gagal, turun ke tingkat berikutnya:", e);
    }
  }

  // --- Tingkat 2: tanpa kunci ---
  // Batas waktu keras supaya pengguna tidak menunggu tanpa kepastian.
  try {
    const kendali = new AbortController();
    const batas = setTimeout(() => kendali.abort(), 14000);

    const res = await fetch(PENYEDIA_TANPA_KUNCI.baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: kendali.signal,
      body: JSON.stringify({
        model: PENYEDIA_TANPA_KUNCI.model,
        messages: [
          { role: "system", content: susunSystem(konteks) },
          ...messages.map((m) => ({ role: m.role, content: teksPesan(m) })),
        ],
        max_tokens: 500,
        temperature: 0.2,
        stream: false,
      }),
    });
    clearTimeout(batas);

    if (res.ok) {
      const data = await res.json();
      const jawab = data?.choices?.[0]?.message?.content;
      if (typeof jawab === "string" && jawab.trim().length > 20) {
        return balasanTeks(jawab.trim(), PENYEDIA_TANPA_KUNCI.nama, konteks.sumber.length);
      }
    }
    console.warn("[asisten] penyedia tanpa kunci tidak memberi jawaban, turun ke arsip langsung");
  } catch (e) {
    console.error("[asisten] penyedia tanpa kunci gagal, turun ke arsip langsung:", e);
  }

  // --- Tingkat 3: arsip langsung. Tidak pernah gagal. ---
  const { teks, sumber } = jawabanDariArsip(kueriAman);
  const penuh =
    teks +
    (sumber.length
      ? "\n\n" + sumber.map((s) => `[${s.no}] ${s.judul} — ${s.href}`).join("\n")
      : "");

  return balasanTeks(penuh, "arsip-langsung", sumber.length);
}
