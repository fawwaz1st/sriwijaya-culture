/**
 * Verifikasi animasi: pastikan elemen benar-benar berubah dari keadaan
 * awal ke keadaan akhir, bukan hanya punya kelas tanpa efek.
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(300);

// 1. Statistik hero: animasi waktu, harus sudah selesai dalam ~1s
const stat = page.locator(".angka-naik").first();
const a = await stat.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { opacity: cs.opacity, transform: cs.transform, anim: cs.animationName, dur: cs.animationDuration };
});
console.log("statistik saat awal:", JSON.stringify(a));
await page.waitForTimeout(1200);
const b = await stat.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { opacity: cs.opacity, transform: cs.transform };
});
console.log("statistik setelah 1.2s:", JSON.stringify(b), "->", b.opacity === "1" ? "OK terlihat" : "MASIH TERSEMBUNYI");

// 2. Kartu katalog: scroll-driven, harus berubah saat masuk viewport
await page.goto(BASE + "/destinasi", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(200);
const kartu = page.locator(".kartu-masuk").first();
const c = await kartu.evaluate((el) => {
  const cs = getComputedStyle(el);
  const b = el.getBoundingClientRect();
  return { opacity: cs.opacity, anim: cs.animationName, timeline: cs.animationTimeline, top: Math.round(b.top) };
});
console.log("\nkartu sebelum scroll:", JSON.stringify(c));

await kartu.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const d = await kartu.evaluate((el) => {
  const cs = getComputedStyle(el);
  return { opacity: cs.opacity, transform: cs.transform };
});
console.log("kartu setelah masuk viewport:", JSON.stringify(d), "->", +d.opacity > 0.9 ? "OK terlihat" : "MASIH TERSEMBUNYI");

// 3. Pastikan tidak ada elemen yang tertinggal transparan
const tersembunyi = await page.evaluate(() => {
  const hasil = [];
  for (const el of document.querySelectorAll(".kartu-masuk, .muncul, .foto-nyala, .angka-naik, .label-masuk")) {
    const cs = getComputedStyle(el);
    if (+cs.opacity < 0.9) {
      const b = el.getBoundingClientRect();
      hasil.push({ cls: el.className.slice(0, 30), opacity: cs.opacity, top: Math.round(b.top) });
    }
  }
  return hasil;
});
console.log("\nelemen masih transparan setelah scroll penuh:", tersembunyi.length ? JSON.stringify(tersembunyi.slice(0, 5)) : "tidak ada (OK)");

await browser.close();
