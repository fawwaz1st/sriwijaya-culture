/**
 * Ukur performa nyata: ukuran transfer, jumlah request, LCP, CLS, dan
 * gambar terbesar. Dijalankan pada build produksi.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const RUTE = ["/", "/destinasi", "/destinasi/jembatan-ampera", "/artikel", "/umkm", "/asisten"];

const browser = await chromium.launch();

for (const rute of RUTE) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const transfer = { total: 0, js: 0, css: 0, img: 0, font: 0, dok: 0 };
  const besar = [];

  page.on("response", async (res) => {
    try {
      const h = res.headers();
      const len = +(h["content-length"] || 0);
      const t = h["content-type"] || "";
      transfer.total += len;
      if (t.includes("javascript")) transfer.js += len;
      else if (t.includes("css")) transfer.css += len;
      else if (t.startsWith("image/")) transfer.img += len;
      else if (t.includes("font")) transfer.font += len;
      else if (t.includes("html")) transfer.dok += len;
      if (len > 200000) besar.push({ url: res.url().split("/").pop()?.slice(0, 40), kb: Math.round(len / 1024), t: t.split(";")[0] });
    } catch {}
  });

  await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);

  const metrik = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const lcp = performance.getEntriesByType("largest-contentful-paint").pop();
    const paint = performance.getEntriesByType("paint");
    return {
      ttfb: Math.round(nav?.responseStart || 0),
      domContentLoaded: Math.round(nav?.domContentLoadedEventEnd || 0),
      load: Math.round(nav?.loadEventEnd || 0),
      fcp: Math.round(paint.find((p) => p.name === "first-contentful-paint")?.startTime || 0),
      lcp: lcp ? Math.round(lcp.startTime) : null,
      gambar: document.images.length,
    };
  });

  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  console.log(`\n=== ${rute} ===`);
  console.log(`  transfer total ${mb(transfer.total)} MB | js ${Math.round(transfer.js/1024)}KB css ${Math.round(transfer.css/1024)}KB img ${Math.round(transfer.img/1024)}KB font ${Math.round(transfer.font/1024)}KB`);
  console.log(`  TTFB ${metrik.ttfb}ms | FCP ${metrik.fcp}ms | LCP ${metrik.lcp ?? "-"}ms | load ${metrik.load}ms | ${metrik.gambar} gambar`);
  if (besar.length) console.log("  berkas besar:", besar.slice(0, 4).map((b) => `${b.url} ${b.kb}KB`).join(", "));

  await ctx.close();
}

await browser.close();
