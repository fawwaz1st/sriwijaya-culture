/**
 * Audit visual akhir: tangkap semua halaman di 4 lebar, laporkan
 * overflow, ukuran teks terkecil, dan kontras teks utama.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "_shot/final";
mkdirSync(OUT, { recursive: true });

const RUTE = [
  ["/", "beranda"],
  ["/destinasi", "destinasi"],
  ["/destinasi/jembatan-ampera", "detail-destinasi"],
  ["/umkm", "umkm"],
  ["/umkm/pempek-beringin", "detail-umkm"],
  ["/artikel", "artikel"],
  ["/artikel/sejarah-jembatan-ampera", "detail-artikel"],
  ["/asisten", "asisten"],
  ["/metodologi", "metodologi"],
  ["/tentang", "tentang"],
];

const VP = [
  ["4k", 2560, 1440],
  ["desktop", 1440, 900],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
  ["mobile-xs", 320, 568],
];

const browser = await chromium.launch();
let gagal = 0;

for (const [nama, w, h] of VP) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const [rute, slug] of RUTE) {
    const err = [];
    page.on("console", (m) => { if (m.type() === "error") err.push(m.text().slice(0, 80)); });
    await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(70);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      let minFs = 99;
      let pelaku = "";
      for (const el of document.querySelectorAll("p, span, a, li, dd, dt, button, label, h1, h2, h3")) {
        const punya = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
        if (!punya) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 4 || b.height < 4) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs > 0 && fs < minFs) { minFs = fs; pelaku = el.textContent.trim().slice(0, 30); }
      }
      return {
        overflow: Math.max(0, doc.scrollWidth - doc.clientWidth),
        h: doc.scrollHeight,
        minFs,
        pelaku,
        imgRusak: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
      };
    });

    if (m.overflow > 1 || m.minFs < 11.5 || m.imgRusak > 0 || err.length) gagal += 1;
    const tanda = m.overflow > 1 || m.minFs < 11.5 || m.imgRusak > 0 || err.length ? " <-- MASALAH" : "";
    console.log(`${nama.padEnd(9)}${slug.padEnd(18)} h=${String(m.h).padStart(5)} ovf=${m.overflow} minFs=${m.minFs} img=${m.imgRusak} err=${err.length}${tanda}`);

    if (nama === "desktop" || nama === "mobile") {
      writeFileSync(`${OUT}/${slug}-${nama}.png`, await page.screenshot({ fullPage: true }));
    }
    page.removeAllListeners("console");
  }
  await ctx.close();
}

await browser.close();
console.log(`\n=== TOTAL MASALAH: ${gagal} dari ${VP.length * RUTE.length} pemeriksaan ===`);
