/**
 * Audit tipografi & responsif: cari teks yang terlalu kecil untuk dibaca
 * dan elemen yang pecah di resolusi ekstrem.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const RUTE = ["/", "/destinasi", "/umkm", "/artikel", "/asisten", "/metodologi", "/tentang"];

// Dari terbesar ke terkecil, termasuk yang ekstrem.
const LEBAR = [
  ["4k", 2560, 1440],
  ["desktop-besar", 1920, 1080],
  ["desktop", 1440, 900],
  ["laptop", 1280, 800],
  ["tablet-l", 1024, 768],
  ["tablet", 820, 1180],
  ["tablet-p", 768, 1024],
  ["mobile-l", 430, 932],
  ["mobile", 390, 844],
  ["mobile-s", 360, 740],
  ["mobile-xs", 320, 568],
];

const browser = await chromium.launch();

console.log("=== TEKS TERLALU KECIL (< 12px) ===");
for (const [nama, w, h] of LEBAR) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const masalah = [];

  for (const rute of RUTE) {
    await page.goto(BASE + rute, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(400);

    const r = await page.evaluate(() => {
      const kecil = [];
      const overflow = Math.max(0, document.documentElement.scrollWidth - innerWidth);
      for (const el of document.querySelectorAll("p, span, a, li, td, dd, dt, h1, h2, h3, h4, button, label, figcaption")) {
        // Hanya elemen yang benar-benar memuat teks sendiri
        const teks = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
        if (!teks) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 4 || b.height < 4) continue;
        if (b.bottom < 0 || b.top > 20000) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < 12) {
          kecil.push({ fs: +fs.toFixed(1), tag: el.tagName.toLowerCase(), teks: el.textContent.trim().slice(0, 26) });
        }
      }
      // Hitung distribusi
      const map = new Map();
      for (const k of kecil) map.set(k.fs, (map.get(k.fs) || 0) + 1);
      return {
        total: kecil.length,
        distribusi: [...map.entries()].sort((a, b) => a[0] - b[0]),
        contoh: kecil.slice(0, 3),
        overflow,
      };
    });

    if (r.total > 0 || r.overflow > 0) {
      masalah.push(`${rute}: ${r.total} teks kecil ${JSON.stringify(r.distribusi)}${r.overflow ? ` OVF=${r.overflow}` : ""}`);
    }
  }

  console.log(`\n--- ${nama} (${w}px) ---`);
  if (!masalah.length) console.log("  bersih");
  else for (const m of masalah) console.log("  " + m);
  await ctx.close();
}

/**
 * Widow / orphan: baris terakhir paragraf yang hanya memuat satu kata
 * pendek. Ditemukan lewat pengukuran per baris (Range.getClientRects
 * dikelompokkan menurut koordinat atas), bukan menebak dari jumlah kata.
 *
 * Pengecualian yang disengaja:
 * - `line-clamp-*`: rects mengukur teks penuh walau yang tampil hanya
 *   beberapa baris, sehingga hasilnya selalu positif palsu.
 * - Elemen di dalam wadah bergulir horizontal (pita foto) tidak
 *   diperiksa karena lebarnya tidak ditentukan oleh layar.
 */
console.log("\n\n=== WIDOW (baris terakhir satu kata) ===");
for (const [nama, w, h] of LEBAR) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const temuan = [];

  for (const rute of RUTE) {
    await page.goto(BASE + rute, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(300);

    const r = await page.evaluate(() => {
      const hasil = [];
      for (const el of document.querySelectorAll("p, li, dd, dt, figcaption, blockquote")) {
        if (el.children.length) continue;
        const teks = el.textContent.trim();
        if (teks.length < 30) continue;
        const cs = getComputedStyle(el);
        if (cs.webkitLineClamp && cs.webkitLineClamp !== "none") continue;
        if (cs.display === "none" || el.getBoundingClientRect().width < 80) continue;

        const rng = document.createRange();
        rng.selectNodeContents(el);
        const rects = [...rng.getClientRects()].filter((x) => x.width > 0.5);
        if (!rects.length) continue;

        const baris = new Map();
        for (const x of rects) {
          const k = Math.round(x.top);
          const lama = baris.get(k);
          if (!lama) baris.set(k, { kiri: x.left, kanan: x.right });
          else {
            lama.kiri = Math.min(lama.kiri, x.left);
            lama.kanan = Math.max(lama.kanan, x.right);
          }
        }
        const lebar = [...baris.values()].map((x) => x.kanan - x.kiri);
        if (lebar.length < 2) continue;
        const maks = Math.max(...lebar);
        const akhir = lebar[lebar.length - 1];
        if (akhir < 40 && akhir / maks < 0.2) {
          hasil.push({ teks: teks.slice(0, 44), akhir: Math.round(akhir), maks: Math.round(maks) });
        }
      }
      return hasil;
    });

    if (r.length) temuan.push(`${rute}: ${JSON.stringify(r)}`);
  }

  console.log(`\n--- ${nama} (${w}px) ---`);
  if (!temuan.length) console.log("  bersih");
  else for (const t of temuan) console.log("  " + t);
  await ctx.close();
}

await browser.close();
