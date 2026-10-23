/**
 * Screenshot bukti untuk AI Development Log.
 *
 * Menghasilkan gambar berukuran tetap (bukan fullPage) agar rapi saat
 * disisipkan ke dokumen, plus satu tangkapan percakapan asisten.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "docs/bukti";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

async function simpan(nama, rute, opsi = {}) {
  await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
  if (opsi.scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), opsi.scroll);
  }
  await page.waitForTimeout(opsi.tunggu ?? 1800);
  const buf = await page.screenshot({ fullPage: opsi.penuh ?? false });
  writeFileSync(`${OUT}/${nama}.png`, buf);
  console.log(`${nama}.png  ${Math.round(buf.length / 1024)} KB`);
}

// 1. Beranda (atas)
await simpan("01-beranda", "/", { tunggu: 2200 });

// 2. Katalog destinasi
await simpan("02-katalog-destinasi", "/destinasi");

// 3. Detail destinasi dengan peta
await simpan("03-detail-destinasi", "/destinasi/jembatan-ampera", { scroll: 1500, tunggu: 3200 });

// 4. Asisten: keadaan kosong
await simpan("04-asisten-kosong", "/asisten", { tunggu: 1500 });

// 5. Asisten: percakapan nyata dengan sitasi
await page.goto(BASE + "/asisten", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(900);
const ta = page.locator("textarea").first();
await ta.fill("Apa yang membedakan Jembatan Ampera dari jembatan lain?");
await ta.press("Enter");
await page.waitForTimeout(18000);
writeFileSync(`${OUT}/05-asisten-jawaban.png`, await page.screenshot());
console.log("05-asisten-jawaban.png");

// 6. Asisten: panel kunci API
const tombolKunci = page.locator('button[aria-label="Pengaturan kunci API"]');
if (await tombolKunci.count()) {
  await tombolKunci.first().click();
  await page.waitForTimeout(700);
  writeFileSync(`${OUT}/06-asisten-kunci.png`, await page.screenshot());
  console.log("06-asisten-kunci.png");
}

// 7. Metodologi
await simpan("07-metodologi", "/metodologi");

// 8. UMKM
await simpan("08-umkm", "/umkm");

// 9. Mobile beranda
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mp = await m.newPage();
await mp.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
await mp.waitForTimeout(2200);
writeFileSync(`${OUT}/09-mobile-beranda.png`, await mp.screenshot());
console.log("09-mobile-beranda.png");
await m.close();

await ctx.close();
await browser.close();
