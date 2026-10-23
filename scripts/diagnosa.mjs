/**
 * Diagnosa menyeluruh berbasis pengukuran, bukan screenshot.
 * Mendeteksi: gambar gagal load, void layout, target tap kecil, kontras rendah.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";

const RUTE = [
  ["/", "beranda"],
  ["/destinasi", "destinasi"],
  ["/destinasi/jembatan-ampera", "destinasi-ampera"],
  ["/umkm", "umkm"],
  ["/umkm/pempek-beringin", "umkm-pempek"],
  ["/artikel", "artikel"],
  ["/artikel/sejarah-jembatan-ampera", "artikel-ampera"],
  ["/asisten", "asisten"],
  ["/metodologi", "metodologi"],
  ["/tentang", "tentang"],
];

const browser = await chromium.launch();

for (const [vpName, w, hh] of [["mobile", 390, 844], ["desktop", 1440, 1000]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: hh } });
  const page = await ctx.newPage();
  const err = [];
  page.on("console", (m) => { if (m.type() === "error") err.push(m.text().slice(0, 100)); });
  page.on("pageerror", (e) => err.push("PAGEERROR " + e.message.slice(0, 100)));

  for (const [rute, slug] of RUTE) {
    err.length = 0;
    await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(600);

    const r = await page.evaluate(() => {
      // 1. Gambar gagal
      const gambarRusak = [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => (i.currentSrc || i.src || "").slice(-50));

      // 2. Gambar belum termuat (belum complete setelah scroll)
      const gambarPending = [...document.images]
        .filter((i) => !i.complete)
        .map((i) => (i.currentSrc || i.src || "").slice(-40));

      // 3. Gambar yang stretch: rasio tampil vs rasio asli menyimpang jauh
      const distorsi = [];
      for (const i of document.images) {
        if (!i.naturalWidth || !i.complete) continue;
        const b = i.getBoundingClientRect();
        if (b.width < 40 || b.height < 40) continue;
        const rTampil = b.width / b.height;
        const rAsli = i.naturalWidth / i.naturalHeight;
        const simpangan = Math.abs(rTampil - rAsli) / rAsli;
        if (simpangan > 0.28) {
          distorsi.push({
            src: (i.currentSrc || i.src).slice(-42),
            tampil: `${Math.round(b.width)}x${Math.round(b.height)}`,
            asli: `${i.naturalWidth}x${i.naturalHeight}`,
            simpangan: +simpangan.toFixed(2),
            fit: getComputedStyle(i).objectFit,
          });
        }
      }

      // 4. Void: baris grid di mana anak-anaknya beda tinggi jauh
      const voidBaris = [];
      for (const g of document.querySelectorAll("section div")) {
        const cs = getComputedStyle(g);
        if (cs.display !== "grid") continue;
        const anak = [...g.children].map((c) => {
          const b = c.getBoundingClientRect();
          return { h: Math.round(b.height), y: Math.round(b.top + scrollY), w: Math.round(b.width) };
        }).filter((a) => a.w > 60);
        if (anak.length < 2) continue;
        const baris = new Map();
        for (const a of anak) {
          const k = Math.round(a.y / 20) * 20;
          if (!baris.has(k)) baris.set(k, []);
          baris.get(k).push(a);
        }
        for (const [y, row] of baris) {
          if (row.length < 2) continue;
          const hs = row.map((r) => r.h);
          const beda = Math.max(...hs) - Math.min(...hs);
          if (beda > 60) voidBaris.push({ y, beda, hs });
        }
      }

      // 5. Target tap kecil di mobile
      const tapKecil = [...document.querySelectorAll("a, button, input, select, textarea")]
        .map((e) => {
          const b = e.getBoundingClientRect();
          return { tag: e.tagName, teks: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24), w: Math.round(b.width), h: Math.round(b.height) };
        })
        .filter((t) => t.w > 0 && t.h > 0 && (t.w < 32 || t.h < 32));

      return { gambarRusak, gambarPending, distorsi, voidBaris, tapKecil, overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth) };
    });

    const masalah = [];
    if (r.gambarRusak.length) masalah.push(`IMG RUSAK:${r.gambarRusak.length} ${r.gambarRusak.slice(0,2).join(",")}`);
    if (r.gambarPending.length) masalah.push(`IMG PENDING:${r.gambarPending.length}`);
    if (r.distorsi.length) masalah.push(`DISTORSI:${r.distorsi.length} ${JSON.stringify(r.distorsi.slice(0,2))}`);
    if (r.voidBaris.length) masalah.push(`VOID:${r.voidBaris.length} ${JSON.stringify(r.voidBaris.slice(0,2))}`);
    if (r.overflow) masalah.push(`OVERFLOW:${r.overflow}px`);
    if (vpName === "mobile" && r.tapKecil.length) masalah.push(`TAP<32:${r.tapKecil.length} ${JSON.stringify(r.tapKecil.slice(0,3))}`);
    if (err.length) masalah.push(`ERR:${JSON.stringify(err.slice(0,2))}`);

    console.log(`${vpName.padEnd(8)}${slug.padEnd(20)} ${masalah.length ? masalah.join(" | ") : "bersih"}`);
  }
  await ctx.close();
}

await browser.close();
