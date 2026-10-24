/**
 * Ekspor AI-DEVELOPMENT-LOG.md ke PDF.
 *
 * Pendekatan: markdown -> HTML -> Chromium print-to-PDF. Tidak memakai
 * pandoc atau LaTeX karena keduanya menambah ketergantungan sistem yang
 * tidak diperlukan; Chromium sudah tersedia lewat Playwright.
 *
 * Gambar disematkan sebagai data URI supaya PDF tetap utuh saat dikirim
 * ke panitia tanpa folder pendamping.
 *
 * Jalankan: node scripts/export-log.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { chromium } from "playwright";

const SUMBER = "docs/AI-DEVELOPMENT-LOG.md";
const KELUARAN = "docs/AI-DEVELOPMENT-LOG.pdf";
const DASAR = resolve(dirname(SUMBER));

const md = readFileSync(SUMBER, "utf8");

/* --- Siapkan gambar terkompresi ---------------------------------------

 Tangkapan layar asli diambil pada skala 2×, jadi tiap berkas 1-5 MB.
 Menyematkannya apa adanya menghasilkan PDF 23 MB, terlalu besar untuk
 diunggah ke formulir kompetisi. Gambar di sini diperkecil ke lebar
 1100 px dan dikodekan ulang sebagai JPEG mutu 82 sebelum disematkan.
 Hasilnya tetap tajam saat dicetak (1100 px pada lebar A4 ≈ 168 dpi),
 tetapi ukuran berkas turun drastis.
 ---------------------------------------------------------------------- */
const cacheGambar = new Map();
const sharp = (await import("sharp")).default;

async function gambarDataUri(src) {
 if (cacheGambar.has(src)) return cacheGambar.get(src);
 const p = resolve(DASAR, src);
 if (!existsSync(p)) return null;
 const buf = await sharp(p)
 .resize({ width: 1100, withoutEnlargement: true })
 .jpeg({ quality: 82, mozjpeg: true })
 .toBuffer();
 const uri = `data:image/jpeg;base64,${buf.toString("base64")}`;
 cacheGambar.set(src, uri);
 return uri;
}

/* --- Konverter markdown minimal, cukup untuk dokumen ini --------------- */
const potonganGambar = [];

async function inline(s) {
 let hasil = s;
 const cocok = [...hasil.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
 for (const m of cocok) {
 const [utuh, alt, src] = m;
 const uri = await gambarDataUri(src);
 const ganti = uri
 ? `<figure><img src="${uri}" alt="${alt}"/><figcaption>${alt}</figcaption></figure>`
 : `<em>[gambar hilang: ${src}]</em>`;
 hasil = hasil.replace(utuh, ganti);
 }
 return hasil
 .replace(/`([^`]+)`/g, "<code>$1</code>")
 .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
 .replace(/\*([^*]+)\*/g, "<em>$1</em>")
 .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const baris = md.split(/\r?\n/);
const html = [];
let i = 0;
let dalamKode = false;
let bufferKode = [];
let dalamTabel = false;

while (i < baris.length) {
 const b = baris[i];

 if (b.trim().startsWith("```")) {
 if (dalamKode) {
 html.push(`<pre><code>${bufferKode.join("\n")}</code></pre>`);
 bufferKode = [];
 dalamKode = false;
 } else {
 dalamKode = true;
 }
 i++;
 continue;
 }
 if (dalamKode) { bufferKode.push(b); i++; continue; }

 // Tabel
 if (/^\|/.test(b.trim())) {
 const rows = [];
 while (i < baris.length && /^\|/.test(baris[i].trim())) { rows.push(baris[i]); i++; }
 const sel = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
 const kepala = sel(rows[0]);
 const isi = rows.slice(2).map(sel);
 const kepalaHtml = await Promise.all(kepala.map((c) => inline(c)));
 html.push("<table><thead><tr>" + kepalaHtml.map((c) => `<th>${c}</th>`).join("") + "</tr></thead><tbody>");
 for (const r of isi) {
 const selHtml = await Promise.all(r.map((c) => inline(c)));
 html.push("<tr>" + selHtml.map((c) => `<td>${c}</td>`).join("") + "</tr>");
 }
 html.push("</tbody></table>");
 continue;
 }

 if (/^#{1,6}\s/.test(b)) {
 const n = b.match(/^#+/)[0].length;
 html.push(`<h${n}>${await inline(b.replace(/^#+\s*/, ""))}</h${n}>`);
 i++; continue;
 }
 if (/^>\s?/.test(b)) {
 const isi = [];
 while (i < baris.length && /^>\s?/.test(baris[i])) { isi.push(baris[i].replace(/^>\s?/, "")); i++; }
 html.push(`<blockquote>${await inline(isi.join(" "))}</blockquote>`);
 continue;
 }
 if (/^\d+\.\s/.test(b)) {
 /*
 * Daftar bernomor.
 *
 * Bug yang diperbaiki di sini: paragraf yang dibungkus baris baru
 * tetapi masih bagian dari butir yang sama sebelumnya dipotong,
 * sehingga kelanjutannya menjadi paragraf lepas. Hasilnya nomor
 * tampil ganda ("1. 1. 1.") karena setiap potongan memulai daftar
 * baru. Sekarang baris lanjutan (yang tidak diawali penanda) ikut
 * diserap ke butir sebelumnya.
 */
 const isi = [];
 while (i < baris.length) {
 const k = baris[i];
 if (/^\d+\.\s/.test(k)) {
 isi.push(k.replace(/^\d+\.\s/, ""));
 i++;
 } else if (k.trim() !== "" && !/^(#{1,6}\s|[-*]\s|>|\||```|---)/.test(k.trim())) {
 // baris lanjutan dari butir terakhir
 isi[isi.length - 1] += " " + k.trim();
 i++;
 } else {
 break;
 }
 }
 const butir = await Promise.all(isi.map((x) => inline(x)));
 html.push("<ol>" + butir.map((x) => `<li>${x}</li>`).join("") + "</ol>");
 continue;
 }
 if (/^[-*]\s/.test(b)) {
 const isi = [];
 while (i < baris.length) {
 const k = baris[i];
 if (/^[-*]\s/.test(k)) {
 isi.push(k.replace(/^[-*]\s/, ""));
 i++;
 } else if (k.trim() !== "" && !/^(#{1,6}\s|\d+\.\s|>|\||```|---)/.test(k.trim())) {
 isi[isi.length - 1] += " " + k.trim();
 i++;
 } else {
 break;
 }
 }
 const butir = await Promise.all(isi.map((x) => inline(x)));
 html.push("<ul>" + butir.map((x) => `<li>${x}</li>`).join("") + "</ul>");
 continue;
 }
 if (b.trim() === "---") { html.push("<hr/>"); i++; continue; }
 if (b.trim() === "") { i++; continue; }

 const para = [];
 while (i < baris.length && baris[i].trim() !== "" && !/^(#{1,6}\s|[-*]\s|\d+\.\s|>|\||```|---)/.test(baris[i].trim())) {
 para.push(baris[i]); i++;
 }
 if (para.length) html.push(`<p>${await inline(para.join(" "))}</p>`);
 else i++;
}

const dokumen = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<title>AI Development Log, Sriwijaya Culture</title>
<style>
 @page { size: A4; margin: 18mm 16mm 20mm; }
 * { box-sizing: border-box; }
 body {
 font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
 font-size: 10.5pt; line-height: 1.62; color: #1a1a1a; margin: 0;
 }
 h1 { font-size: 20pt; margin: 0 0 6pt; letter-spacing: -0.01em; border-bottom: 2pt solid #b8860b; padding-bottom: 6pt; }
 h2 { font-size: 14pt; margin: 18pt 0 7pt; padding-bottom: 3pt; border-bottom: 0.5pt solid #ddd; page-break-after: avoid; }
 h3 { font-size: 11.5pt; margin: 13pt 0 5pt; page-break-after: avoid; }
 p { margin: 0 0 7pt; }
 ul, ol { margin: 0 0 8pt; padding-left: 16pt; }
 li { margin-bottom: 2.5pt; }
 code { font-family: Consolas, monospace; font-size: 9pt; background: #f2f2f2; padding: 1pt 3pt; border-radius: 2pt; }
 pre { background: #f6f6f4; border-left: 2.5pt solid #b8860b; padding: 7pt 9pt; overflow: visible; page-break-inside: avoid; }
 pre code { background: none; padding: 0; font-size: 8.6pt; line-height: 1.45; }
 table { width: 100%; border-collapse: collapse; margin: 0 0 10pt; font-size: 9pt; page-break-inside: avoid; }
 th { background: #f3efe4; text-align: left; font-weight: 600; }
 th, td { border: 0.5pt solid #cfcfcf; padding: 3.5pt 5pt; vertical-align: top; }
 blockquote { margin: 0 0 9pt; padding: 6pt 10pt; background: #faf7ee; border-left: 2.5pt solid #b8860b; font-size: 9.5pt; color: #444; }
 figure { margin: 9pt 0 12pt; page-break-inside: avoid; }
 figure img { width: 100%; border: 0.5pt solid #ccc; }
 figcaption { font-size: 8.5pt; color: #666; margin-top: 3pt; font-style: italic; }
 hr { border: none; border-top: 0.5pt solid #ddd; margin: 14pt 0; }
 a { color: #8a6508; text-decoration: none; }
</style></head><body>${html.join("\n")}</body></html>`;

/*
 * HTML perantara TIDAK ditulis ke repositori.
 *
 * Versi sebelumnya menulis `docs/_log-temp.html` lalu membiarkannya.
 * Akibatnya setiap ekspor meninggalkan berkas sampah di folder
 * dokumentasi yang ikut terlihat di `git status`. Isinya hanya
 * perantara untuk Chromium, jadi cukup dikirim lewat `setContent`.
 */
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(dokumen, { waitUntil: "load" });
await page.pdf({
 path: KELUARAN,
 format: "A4",
 printBackground: true,
 margin: { top: "18mm", bottom: "20mm", left: "16mm", right: "16mm" },
 displayHeaderFooter: true,
 headerTemplate: `<div style="font-size:7pt;color:#999;width:100%;padding:0 16mm;">Sriwijaya Culture · AI Development Log</div>`,
 footerTemplate: `<div style="font-size:7pt;color:#999;width:100%;padding:0 16mm;display:flex;justify-content:space-between;"><span>Koding Seadanya · ITFEST 2026</span><span class="pageNumber"></span></div>`,
});
await browser.close();

const { statSync } = await import("node:fs");
const s = statSync(KELUARAN);
console.log(`PDF dibuat: ${KELUARAN} (${Math.round(s.size / 1024)} KB)`);
