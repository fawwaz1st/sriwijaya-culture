/**
 * Uji fungsional asisten: kirim pertanyaan nyata, lihat apakah jawaban
 * dan sumber muncul. Ini menguji API route, bukan hanya tampilan.
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 140)); });
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message.slice(0, 140)));

await page.goto(BASE + "/asisten", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(800);

// Cari composer
const ta = page.locator("textarea").first();
console.log("textarea ada:", await ta.count());

await ta.fill("Apa itu Jembatan Ampera?");
await ta.press("Enter");

// Tunggu jawaban masuk (maks 45 detik)
const mulai = Date.now();
let adaJawaban = false;
while (Date.now() - mulai < 45000) {
  await page.waitForTimeout(1200);
  const n = await page.locator('[data-peran="sari"], .balon-sari, article').count();
  const teks = await page.evaluate(() => document.body.innerText);
  if (teks.includes("Ampera") && teks.length > 1500) { adaJawaban = true; break; }
  if (n > 0) { adaJawaban = true; break; }
}

const isi = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    panjang: t.length,
    adaAmpera: t.includes("Ampera"),
    adaSumber: /sumber|Sumber/.test(t),
    potongan: t.slice(-700),
  };
});

console.log("\nada jawaban:", adaJawaban);
console.log("panjang teks halaman:", isi.panjang);
console.log("menyebut Ampera:", isi.adaAmpera);
console.log("menyebut sumber:", isi.adaSumber);
console.log("--- potongan akhir ---");
console.log(isi.potongan);
console.log("\nconsole errors:", errors.length ? errors.slice(0, 3) : "tidak ada");

await browser.close();
