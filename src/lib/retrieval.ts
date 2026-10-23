import { ARTIKEL, DESTINASI, UMKM_PUBLIK } from "@/lib/arsip";
import type { Artikel, Destinasi, UMKM } from "@/lib/types";

/**
 * Pengambilan dokumen untuk Asisten Sari.
 *
 * Pendekatan: pencarian kata kunci berbobot (TF-IDF sederhana) di
 * seluruh arsip, lalu hasil teratas dikirim sebagai konteks ke model.
 *
 * Kenapa bukan embedding: arsip ini hanya 25 dokumen dan 147 KB teks.
 * Embedding akan menambah 90 MB unduhan model dan latensi, tanpa
 * kenaikan kualitas berarti pada korpus sekecil ini. Kata kunci
 * berbobot juga bisa dijelaskan ke juri dalam satu kalimat.
 *
 * Yang penting: model TIDAK PERNAH menjawab tanpa konteks. Kalau tidak
 * ada dokumen cocok, jawabannya "belum ada di arsip".
 */

export type JenisDokumen = "destinasi" | "umkm" | "artikel";

export interface Dokumen {
  id: string;
  jenis: JenisDokumen;
  judul: string;
  href: string;
  teks: string;
  sumber: number;
  meta: string;
}

function dokumenDestinasi(d: Destinasi): Dokumen {
  return {
    id: d.id,
    jenis: "destinasi",
    judul: d.nama,
    href: `/destinasi/${d.id}`,
    meta: `${d.wilayah} · ${d.kategori.join(", ")}`,
    sumber: d.sumber.length,
    teks: [
      d.nama,
      d.namaLengkap,
      d.ringkas,
      d.deskripsi,
      d.sejarah,
      d.legenda?.judul ?? "",
      d.legenda?.isi ?? "",
      d.wilayah,
      d.kategori.join(" "),
      d.dayaTarik.join(" "),
      d.aktivitas.join(" "),
      d.tiket.teks,
      d.jam.teks,
      d.akses,
      d.alamat,
      d.fakta.map((f) => `${f.k} ${f.v}`).join(" "),
    ].join("\n"),
  };
}

function dokumenUMKM(u: UMKM): Dokumen {
  return {
    id: u.id,
    jenis: "umkm",
    judul: u.nama,
    href: `/umkm/${u.id}`,
    meta: `${u.kategori} · ${u.wilayah}`,
    sumber: u.sumber.length,
    teks: [
      u.nama,
      u.ringkas,
      u.profil,
      u.sejarah ?? "",
      u.kategori,
      u.wilayah,
      u.produk.map((p) => `${p.nama} ${p.deskripsi}`).join(" "),
    ].join("\n"),
  };
}

function dokumenArtikel(a: Artikel): Dokumen {
  return {
    id: a.id,
    jenis: "artikel",
    judul: a.judul,
    href: `/artikel/${a.id}`,
    meta: `${a.kategori} · ${a.tanggal}`,
    sumber: a.sumber.length,
    teks: [
      a.judul,
      a.ringkas,
      a.pendahuluan,
      a.bagian.map((b) => `${b.subjudul} ${b.paragraf.join(" ")}`).join("\n"),
      a.kesimpulan,
      a.kategori,
    ].join("\n"),
  };
}

/**
 * Korpus pencarian.
 *
 * Usaha memakai `UMKM_PUBLIK`, bukan `DAFTAR_UMKM`.
 *
 * Alasannya ditemukan saat menguji asisten: ketika korpus masih memuat
 * seluruh rekaman, pertanyaan "di mana bisa membeli songket?" dijawab
 * dengan menyebut "Perajin Songket Rumahan 13 Ulu" seolah-olah usaha
 * nyata, padahal entri itu berstatus `demonstrasi` dan alamatnya belum
 * pernah diverifikasi. Asisten yang mengarang alamat adalah kegagalan
 * yang paling merusak kepercayaan, jadi entri yang tidak layak tampil di
 * direktori juga tidak layak masuk konteks model.
 *
 * Rute detail entri demonstrasi tetap hidup agar tautan lama tidak 404,
 * tetapi asisten tidak lagi mengetahuinya.
 */
export const SEMUA_DOKUMEN: Dokumen[] = [
  ...DESTINASI.map(dokumenDestinasi),
  ...UMKM_PUBLIK.map(dokumenUMKM),
  ...ARTIKEL.map(dokumenArtikel),
];

const STOPWORD = new Set([
  "yang", "dan", "di", "ke", "dari", "untuk", "dengan", "pada", "adalah", "itu",
  "ini", "ada", "atau", "juga", "akan", "bisa", "dapat", "tidak", "saya", "aku",
  "apa", "apakah", "bagaimana", "gimana", "kenapa", "mengapa", "dimana", "mana",
  "kapan", "siapa", "berapa", "sebuah", "para", "oleh", "dalam", "tentang", "kalau",
  "jika", "mau", "ingin", "tolong", "coba", "jelaskan", "sebutkan", "beri",
  "carikan", "rekomendasi", "dong", "ya", "kah", "lah", "nya", "the", "and", "of",
]);

function token(teks: string): string[] {
  return teks
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORD.has(t));
}

/** Indeks IDF dibangun sekali saat modul dimuat. */
const DF = new Map<string, number>();
const TOKEN_DOKUMEN: string[][] = SEMUA_DOKUMEN.map((d) => token(d.teks));

for (const tokens of TOKEN_DOKUMEN) {
  for (const t of new Set(tokens)) DF.set(t, (DF.get(t) ?? 0) + 1);
}

const N = SEMUA_DOKUMEN.length;

function idf(t: string): number {
  const df = DF.get(t) ?? 0;
  if (df === 0) return 0;
  return Math.log((N + 1) / (df + 0.5));
}

export interface HasilCari {
  dokumen: Dokumen;
  skor: number;
}

/**
 * Cari dokumen paling relevan.
 *
 * Skor = jumlah (frekuensi kata dalam dokumen x IDF kata).
 * Judul diberi bobot 3x karena pertanyaan pengguna biasanya menyebut
 * nama tempat, bukan isi paragraf.
 */
export function cariDokumen(kueri: string, batas = 5): HasilCari[] {
  const kata = token(kueri);
  if (kata.length === 0) return [];

  const hasil: HasilCari[] = [];

  SEMUA_DOKUMEN.forEach((d, i) => {
    const tokens = TOKEN_DOKUMEN[i];
    const freq = new Map<string, number>();
    for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);

    let skor = 0;
    for (const k of new Set(kata)) {
      const f = freq.get(k) ?? 0;
      if (!f) continue;
      skor += (1 + Math.log(f)) * idf(k);
    }

    // Bonus judul: pencocokan langsung nama entitas.
    const judulLower = d.judul.toLowerCase();
    for (const k of new Set(kata)) {
      if (judulLower.includes(k)) skor += 3.5 * idf(k);
    }

    if (skor > 0) hasil.push({ dokumen: d, skor });
  });

  hasil.sort((a, b) => b.skor - a.skor);

  /**
   * Ambang relevansi.
   *
   * Tanpa ambang, pertanyaan di luar topik tetap mendapat dokumen hanya
   * karena satu kata kebetulan muncul (misalnya "pertama" pada judul
   * artikel). Itu membuat asisten terlihat menjawab, padahal sedang
   * mengarang kaitan. Jadi: kalau skor teratas terlalu rendah, atau
   * selisih dengan peringkat kedua terlalu tipis, anggap tidak ada.
   */
  const teratas = hasil[0];
  if (!teratas) return [];

  const AMBANG_MINIMUM = 4.2;
  if (teratas.skor < AMBANG_MINIMUM) return [];

  const kedua = hasil[1];
  if (kedua && teratas.skor < kedua.skor * 1.12 && teratas.skor < AMBANG_MINIMUM * 1.6) {
    return [];
  }

  // Hanya dokumen yang skornya cukup dekat dengan yang teratas.
  const potong = teratas.skor * 0.45;
  return hasil.filter((h) => h.skor >= potong).slice(0, batas);
}

/** Ambil potongan teks paling relevan, bukan seluruh dokumen. */
export function potonganRelevan(d: Dokumen, kueri: string, maks = 1400): string {
  const kata = new Set(token(kueri));
  const paragraf = d.teks.split("\n").filter((p) => p.trim().length > 0);

  const berbobot = paragraf.map((p) => {
    const t = token(p);
    let n = 0;
    for (const k of t) if (kata.has(k)) n++;
    return { p, n };
  });

  berbobot.sort((a, b) => b.n - a.n);
  const terpilih: string[] = [];
  let total = 0;
  for (const { p } of berbobot) {
    if (total + p.length > maks) continue;
    terpilih.push(p);
    total += p.length;
    if (total > maks * 0.8) break;
  }

  return terpilih.join("\n") || d.teks.slice(0, maks);
}
