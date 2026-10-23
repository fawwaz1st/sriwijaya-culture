/**
 * Tangkap semua halaman pada 3 viewport, full page, dengan lazy-load
 * dipicu. Dipakai sebagai bahan audit visual.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "_shot/audit";
mkdirSync(OUT, { recursive: true });

const RUTE = [
  ["/", "beranda"],
  ["/destinasi", "destinasi"],
  ["/destinasi/jembatan-ampera", "destinasi-ampera"],
  ["/destinasi/pulau-kemaro", "destinasi-kemaro"],
  ["/umkm", "umkm"],
  ["/umkm/pempek-beringin", "umkm-pempek"],
  ["/artikel", "artikel"],
  ["/artikel/sejarah-jembatan-ampera", "artikel-ampera"],
  ["/asisten", "asisten"],
  ["/metodologi", "metodologi"],
  ["/tentang", "tentang"],
];

const VP = [
  ["mobile", 390, 844],
  ["tablet", 820, 1180],
  ["desktop", 1440, 1000],
];

const browser = await chromium.launch();
const laporan = [];

for (const [nama, w, hh] of VP) {
  const ctx = await browser.newContext({ viewport: { width: w, height: hh }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [rute, slug] of RUTE) {
    try {
      await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += 500) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(90);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(700);

      const m = await page.evaluate(() => ({
        h: document.documentElement.scrollHeight,
        overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        h1: document.querySelectorAll("h1").length,
        imgRusak: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        teks: document.body.innerText.length,
      }));

      const file = `${OUT}/${slug}-${nama}.png`;
      writeFileSync(file, await page.screenshot({ fullPage: true }));
      laporan.push({ slug, nama, ...m });
      console.log(`${nama.padEnd(8)} ${rute.padEnd(32)} h=${String(m.h).padStart(5)} ovf=${m.overflow} img=${m.imgRusak.length}`);
    } catch (e) {
      console.log(`${nama} ${rute} GAGAL ${e.message.slice(0, 80)}`);
    }
  }
  await ctx.close();
}

writeFileSync(`${OUT}/laporan.json`, JSON.stringify(laporan, null, 2));
await browser.close();
