/**
 * Verifikasi visual.
 *
 * Mengambil tangkapan layar tiap rute pada tiga lebar layar, lalu
 * melaporkan: overflow horizontal, elemen yang menembus viewport,
 * dan tinggi halaman. Bukan sekadar "kelihatan bagus", tapi diukur.
 *
 * Pakai: node scripts/verify-visual.mjs [--only /path]
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = join(process.cwd(), "_shot");
mkdirSync(OUT, { recursive: true });

const RUTES = [
  "/",
  "/destinasi",
  "/destinasi/jembatan-ampera",
  "/destinasi/pulau-kemaro",
  "/umkm",
  "/umkm/pempek-beringin",
  "/artikel",
  "/artikel/sejarah-jembatan-ampera",
  "/asisten",
  "/metodologi",
  "/tentang",
];

const LEBAR = [
  { nama: "mobile", w: 390, h: 844 },
  { nama: "tablet", w: 820, h: 1180 },
  { nama: "desktop", w: 1440, h: 1000 },
];

const hanya = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;

const rute = hanya ? [hanya] : RUTES;
const browser = await chromium.launch();
const laporan = [];

for (const ukuran of LEBAR) {
  const ctx = await browser.newContext({
    viewport: { width: ukuran.w, height: ukuran.h },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();

  for (const r of rute) {
    const galat = [];
    page.on("console", (m) => {
      if (m.type() === "error") galat.push(m.text().slice(0, 200));
    });
    page.on("pageerror", (e) => galat.push("pageerror: " + e.message.slice(0, 200)));

    const resp = await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(500);

    const metrik = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      // Cari elemen yang lebih lebar dari viewport (penyebab scroll horizontal).
      const menembus = [];
      if (overflow > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.width > 0 && (b.right > doc.clientWidth + 2 || b.left < -2)) {
            menembus.push({
              tag: el.tagName.toLowerCase(),
              cls: String(el.className || "").slice(0, 70),
              lebar: Math.round(b.width),
              kiri: Math.round(b.left),
              kanan: Math.round(b.right),
            });
            if (menembus.length >= 6) break;
          }
        }
      }
      return {
        judul: document.title,
        tinggi: doc.scrollHeight,
        overflow,
        menembus,
        h1: document.querySelectorAll("h1").length,
        imgTanpaAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt"))
          .length,
        linkKosong: [...document.querySelectorAll("a")].filter(
          (a) => !a.textContent.trim() && !a.getAttribute("aria-label") && !a.querySelector("img,svg"),
        ).length,
      };
    });

    const namaBerkas = `${ukuran.nama}${r.replace(/\//g, "_") || "_beranda"}.png`;
    await page.screenshot({ path: join(OUT, namaBerkas), fullPage: ukuran.nama !== "desktop" });

    laporan.push({
      rute: r,
      layar: ukuran.nama,
      status: resp?.status(),
      ...metrik,
      galat: galat.slice(0, 4),
    });
    console.log(
      `${ukuran.nama.padEnd(8)} ${r.padEnd(34)} ${String(resp?.status()).padEnd(4)} overflow=${metrik.overflow} h=${metrik.tinggi} h1=${metrik.h1} err=${galat.length}`,
    );
  }
  await ctx.close();
}

await browser.close();
writeFileSync(join(OUT, "laporan.json"), JSON.stringify(laporan, null, 2));

const gagal = laporan.filter((l) => l.overflow > 1 || l.status !== 200 || l.h1 !== 1 || l.galat.length);
console.log("\n=== RINGKASAN ===");
console.log(`Total pemeriksaan: ${laporan.length}`);
console.log(`Bermasalah: ${gagal.length}`);
if (gagal.length) {
  for (const g of gagal) {
    console.log(
      `- [${g.layar}] ${g.rute}: overflow=${g.overflow} status=${g.status} h1=${g.h1} galat=${g.galat.join(" | ")}`,
    );
    if (g.menembus?.length) console.log("  menembus:", JSON.stringify(g.menembus.slice(0, 3)));
  }
  process.exitCode = 1;
}
