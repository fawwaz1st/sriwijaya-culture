/**
 * Hapus em dash (U+2014) dan en dash (U+2013) dari kode dan dokumentasi.
 *
 * PELAJARAN DARI PERCOBAAN PERTAMA.
 *
 * Versi pertama memakai `replace(/[ \t]{2,}/g, " ")` untuk merapikan
 * spasi setelah penggantian. Aturan itu ikut meratakan indentasi di
 * awal baris, sehingga seluruh berkas menempel ke kiri. Kode masih
 * dikompilasi, tetapi 3.600 baris berubah dan tidak terbaca. Semua
 * dikembalikan dari git.
 *
 * Aturan sekarang: penggantian HANYA menyentuh karakter dash dan spasi
 * yang mengapitnya. Baris yang tidak memuat dash tidak pernah disentuh.
 *
 * Pemetaan:
 *   "kata — kata"   ->  "kata, kata"     (klausa lanjutan)
 *   "2020 – 2024"   ->  "2020-2024"      (rentang)
 *   "kata—kata"     ->  "kata-kata"      (tanpa spasi)
 *   "kata – kata"   ->  "kata, kata"
 *
 * Jalankan: node scripts/hapus-dash.mjs [--kering]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const KERING = process.argv.includes("--kering");
const EM = "\u2014";
const EN = "\u2013";
const EKSTENSI = new Set([".ts", ".tsx", ".css", ".md", ".mjs", ".json"]);

function kumpulkan(dir, hasil = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", ".vercel"].includes(e.name)) continue;
    if (e.name === "hapus-dash.mjs") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) kumpulkan(p, hasil);
    else if (EKSTENSI.has(extname(e.name))) hasil.push(p);
  }
  return hasil;
}

/**
 * Ganti dash pada satu baris, tanpa menyentuh indentasi.
 * Indentasi diambil utuh, isi baris diproses, lalu disatukan kembali.
 */
function prosesBaris(baris) {
  if (!baris.includes(EM) && !baris.includes(EN)) return baris;

  const indentasi = baris.match(/^[ \t]*/)[0];
  let isi = baris.slice(indentasi.length);

  // Rentang angka: "2020 – 2024" atau "2020–2024" -> "2020-2024"
  isi = isi.replace(/(\d)\s*\u2013\s*(\d)/g, "$1-$2");
  isi = isi.replace(/(\d)\s*\u2014\s*(\d)/g, "$1-$2");

  // Dash dengan spasi di kedua sisi: pemisah klausa -> koma.
  isi = isi.replace(/[ \t]+\u2014[ \t]+/g, ", ");
  isi = isi.replace(/[ \t]+\u2013[ \t]+/g, ", ");

  // Dash tanpa spasi: tanda hubung.
  isi = isi.split(EM).join("-");
  isi = isi.split(EN).join("-");

  return indentasi + isi;
}

const daftar = [...kumpulkan("src"), ...kumpulkan("docs"), ...kumpulkan("scripts")];

let totalEm = 0;
let totalEn = 0;
let berubah = 0;

for (const f of daftar) {
  const asli = readFileSync(f, "utf8");
  if (!asli.includes(EM) && !asli.includes(EN)) continue;

  const em = (asli.match(new RegExp(EM, "g")) || []).length;
  const en = (asli.match(new RegExp(EN, "g")) || []).length;

  const baru = asli.split("\n").map(prosesBaris).join("\n");

  if (baru !== asli) {
    const sisaEm = (baru.match(new RegExp(EM, "g")) || []).length;
    const sisaEn = (baru.match(new RegExp(EN, "g")) || []).length;
    if (sisaEm || sisaEn) console.log(`SISA ${f}: em=${sisaEm} en=${sisaEn}`);
    totalEm += em;
    totalEn += en;
    berubah += 1;
    console.log(`${KERING ? "[kering] " : ""}${f}  em=${em} en=${en}`);
    if (!KERING) writeFileSync(f, baru, "utf8");
  }
}

console.log(`\nBerkas: ${berubah} | em: ${totalEm} | en: ${totalEn}`);
