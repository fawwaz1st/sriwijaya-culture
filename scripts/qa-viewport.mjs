/**
 * Tangkap halaman yang tidak punya <section> (asisten) dan beberapa
 * halaman kunci lain pada viewport, bukan fullPage.
 *
 * Alasan: `fullPage` di Chromium tidak selalu mengecat iframe lintas
 * origin dan gambar lazy-load di luar viewport awal, sehingga hasilnya
 * terbaca sebagai kotak kosong padahal ada. Viewport shot menghindari
 * artefak itu.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "_shot/viewport";
mkdirSync(OUT, { recursive: true });

const RUTE = [
  ["/asisten", "asisten", [0, 420]],
  ["/artikel", "artikel", [0, 900, 1800]],
  ["/umkm", "umkm", [0, 700]],
  ["/destinasi/jembatan-ampera", "detail-destinasi", [0, 900]],
  ["/metodologi", "metodologi", [0, 800]],
];

const browser = await chromium.launch();
let n = 0;

for (const [nama, w, h] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();

  for (const [rute, slug, posisi] of RUTE) {
    await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);

    for (const y of posisi) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(900);
      const file = join(OUT, `${slug}-${nama}-y${y}.png`);
      writeFileSync(file, await page.screenshot({ fullPage: false }));
      n += 1;
    }
    console.log(`${nama.padEnd(8)} ${slug.padEnd(18)} ${posisi.length} potongan`);
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${n} gambar di ${OUT}`);