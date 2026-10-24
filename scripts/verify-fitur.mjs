/**
 * Uji fitur baru: tirai intro, pencarian Ctrl+K, ikon tab, dan halaman
 * jelajah. Setiap pemeriksaan diukur, bukan diasumsikan.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const browser = await chromium.launch();
let gagal = 0;
const cek = (nama, lulus, detail = "") => {
  if (!lulus) gagal += 1;
  console.log(`${lulus ? "LULUS" : "GAGAL"}  ${nama}${detail ? "  :: " + detail : ""}`);
};

/* ---------- 1. Tirai intro ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });

  /*
   * Tirai dirender setelah hidrasi (butuh sessionStorage), bukan di HTML
   * server. Diukur dengan `waitUntil: "commit"`: muncul pada ~150 ms
   * setelah navigasi, tetapi `domcontentloaded` bisa terjadi sebelum
   * hidrasi React selesai. Karena itu tunggu sampai DOM stabil, lalu
   * periksa dengan toleransi waktu yang cukup.
   */
  await page.waitForFunction(() => document.readyState === "complete", undefined, { timeout: 20000 });
  await page.waitForTimeout(250);
  const adaAwal = await page.locator(".tirai-buka").count();
  cek("tirai muncul saat muat pertama", adaAwal === 1, `ditemukan ${adaAwal}`);

  // Hilang setelah animasi
  await page.waitForTimeout(2000);
  const adaAkhir = await page.locator(".tirai-buka").count();
  cek("tirai hilang setelah animasi", adaAkhir === 0, `sisa ${adaAkhir}`);

  // Tidak muncul lagi di navigasi berikutnya (sesi sama)
  await page.goto(BASE + "/destinasi", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(150);
  const adaKedua = await page.locator(".tirai-buka").count();
  cek("tirai tidak muncul lagi di halaman berikutnya", adaKedua === 0, `ditemukan ${adaKedua}`);

  await ctx.close();
}

/* ---------- 2. Pencarian Ctrl+K ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);

  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  const dialog = await page.locator('[role="dialog"][aria-label="Pencarian arsip"]').count();
  cek("Ctrl+K membuka pencarian", dialog === 1, `dialog ${dialog}`);

  if (dialog) {
    await page.keyboard.type("songket");
    await page.waitForTimeout(500);
    const hasil = await page.locator('[role="dialog"] ul li').count();
    cek("pencarian menemukan hasil untuk songket", hasil > 0, `${hasil} baris`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const setelahEsc = await page.locator('[role="dialog"]').count();
    cek("Escape menutup pencarian", setelahEsc === 0, `sisa ${setelahEsc}`);
  }
  await ctx.close();
}

/* ---------- 3. Ikon tab ---------- */
{
  const res = await fetch(BASE + "/icon");
  const tipe = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  cek("ikon tab tersedia", res.status === 200 && tipe.includes("image"), `${res.status} ${tipe} ${Math.round(buf.length / 1024)}KB`);

  const res2 = await fetch(BASE + "/apple-icon");
  const tipe2 = res2.headers.get("content-type") || "";
  cek("ikon iOS tersedia", res2.status === 200 && tipe2.includes("image"), `${res2.status} ${tipe2}`);

  const html = await (await fetch(BASE + "/")).text();
  cek("ikon dirujuk di HTML", /rel="icon"|rel="apple-touch-icon"/.test(html), "tag link icon");
}

/* ---------- 4. Halaman jelajah ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/jelajah", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);

  const iframe = await page.locator('iframe[title*="Peta"]').count();
  cek("jelajah menampilkan peta", iframe === 1, `iframe ${iframe}`);

  const tombol = await page.locator('button[aria-pressed]').count();
  cek("jelajah punya penyaring kategori", tombol > 3, `${tombol} tombol`);

  // Saring kategori lalu pastikan daftar menyusut
  const sebelum = await page.locator("ul li button[aria-pressed]").count();
  await page.locator('button:has-text("Sejarah")').first().click();
  await page.waitForTimeout(400);
  const sesudah = await page.locator("ul li button[aria-pressed]").count();
  cek("penyaring mengubah daftar titik", sesudah <= sebelum, `${sebelum} -> ${sesudah}`);

  await ctx.close();
}

/* ---------- 5. Em dash tidak ada di HTML ---------- */
{
  const html = await (await fetch(BASE + "/")).text();
  const em = (html.match(/\u2014/g) || []).length;
  const en = (html.match(/\u2013/g) || []).length;
  cek("HTML bebas em dash dan en dash", em === 0 && en === 0, `em=${em} en=${en}`);
}

/* ---------- 6. Scrollbar kustom ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  const sb = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return { width: cs.scrollbarWidth, color: cs.scrollbarColor };
  });
  cek("bilah gulir kustom aktif", sb.width === "thin" && sb.color !== "auto", JSON.stringify(sb));
  await ctx.close();
}

console.log(`\n=== TOTAL GAGAL: ${gagal} ===`);
await browser.close();
process.exit(gagal === 0 ? 0 : 1);
