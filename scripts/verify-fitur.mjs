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
  /*
   * Tirai dipasang lewat requestAnimationFrame setelah hidrasi, jadi
   * jeda tetap 250 ms pernah membuat pemeriksaan ini gagal secara acak
   * saat hidrasi lambat. Yang benar: tunggu elemennya muncul dengan
   * batas waktu, bukan menebak lama hidrasi.
   */
  const adaAwal = await page
    .waitForSelector(".tirai-buka", { timeout: 5000 })
    .then(() => 1)
    .catch(() => 0);
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

/* ---------- 2b. Hamburger tetap jalan di tablet ---------- */
{
  for (const width of [768, 820, 1023]) {
    const ctx = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    const tombolMenu = await page.locator('button[aria-label=\"Buka menu\"]').count();
    cek("tombol menu tampil di lebar " + width, tombolMenu === 1, "tombol " + tombolMenu);
    if (tombolMenu) {
      await page.locator('button[aria-label=\"Buka menu\"]').click();
      await page.waitForTimeout(300);
      const menu = await page.locator('#menu-mobile').count();
      cek("menu tablet terbuka di " + width, menu === 1, "menu " + menu);
      /*
       * Ada di DOM belum berarti terlihat. Bug nyata yang pernah lolos:
       * <header> memakai backdrop-filter, sehingga menjadi containing
       * block untuk keturunan position: fixed. Panel menu yang memakai
       * fixed top-16 bottom-0 lalu dihitung terhadap header 64px dan
       * tingginya menjadi 0 px: elemennya ada, tapi tidak terlihat.
       * Karena itu tinggi dan posisinya diukur, bukan sekadar dihitung.
       */
      const kotak = await page.evaluate(() => {
        const el = document.querySelector("#menu-mobile");
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return { tinggi: Math.round(b.height), atas: Math.round(b.top), display: cs.display, posisi: cs.position };
      });
      cek(
        "panel menu benar-benar terlihat di " + width,
        Boolean(kotak) && kotak.tinggi > 300 && kotak.atas <= 80 && kotak.display !== "none" && kotak.posisi === "fixed",
        JSON.stringify(kotak),
      );
      const tautan = await page.locator('#menu-mobile a[href=\"/destinasi\"]').count();
      cek("menu tablet punya tautan di " + width, tautan === 1, "tautan " + tautan);
    }
    await ctx.close();
  }
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

/* ---------- 7. Favorit lokal di peramban ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/destinasi", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  const tombolSimpan = page.locator("button[aria-label=\"Simpan ke favorit\"]").first();
  const adaTombol = await tombolSimpan.count();
  cek("katalog punya tombol simpan", adaTombol === 1, "tombol " + adaTombol);
  if (adaTombol) {
    await tombolSimpan.click();
    const tersimpan = await page.evaluate(() => {
      try { return window.localStorage.getItem("sriwijaya-favorit-v1"); } catch { return null; }
    });
    cek("favorit tersimpan di peramban", Boolean(tersimpan) && String(tersimpan).includes("destinasi"), String(tersimpan).slice(0, 80));
    await page.goto(BASE + "/favorit", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    const tautanFavorit = await page.locator('a[href^="/destinasi/"]').count();
    cek("halaman favorit menampilkan entri tersimpan", tautanFavorit > 0, "tautan " + tautanFavorit);
  }
  await ctx.close();
}

/* ---------- 8. Bagikan tautan tanpa layanan pihak ketiga ---------- */
{
  const ctx = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"], viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/destinasi/jembatan-ampera", { waitUntil: "networkidle", timeout: 60000 });
  const shareAda = await page.evaluate(() => typeof navigator.share === "function");
  if (shareAda) {
    cek("bagikan tersedia", true, "Web Share API tersedia di peramban");
  } else {
    await page.locator("button[aria-label=\"Bagikan tautan halaman ini\"]").first().click();
    await page.waitForTimeout(400);
    const disalin = await page.getByText("Tautan disalin").count();
    cek("bagikan menyalin tautan saat share API tidak ada", disalin > 0, "status " + disalin);
  }
  await ctx.close();
}

/* ---------- 9. Data kota nyata ---------- */
{
  const res = await fetch(BASE + "/api/cuaca");
  const data = await res.json();
  cek("API cuaca aktif", res.status === 200 && typeof data.temperatur === "number", "suhu " + data.temperatur);

  const resGempa = await fetch(BASE + "/api/gempa");
  const dataGempa = await resGempa.json();
  cek("API gempa aktif", resGempa.status === 200 && Boolean(dataGempa.magnitudo), "M " + dataGempa.magnitudo);

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  const cuacaSiap = await page
    .waitForFunction(() => {
      const teks = document.body.innerText;
      return /cuaca palembang saat ini/i.test(teks) && (/Sumber: Open-Meteo/.test(teks) || /cuaca belum tersedia/i.test(teks));
    }, { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  cek("widget cuaca menampilkan sumber atau pesan gagal", cuacaSiap);

  await page.goto(BASE + "/jelajah", { waitUntil: "networkidle", timeout: 60000 });
  const gempaSiap = await page
    .waitForFunction(() => {
      const teks = document.body.innerText;
      return /gempa terkini \(bmkg\)/i.test(teks) && (/Sumber: BMKG/.test(teks) || /data gempa belum tersedia/i.test(teks));
    }, { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  cek("widget gempa menampilkan sumber atau pesan gagal", gempaSiap);
  await ctx.close();
}

/* ---------- 10. Jarak dari posisi pengguna ---------- */
{
  const ctx = await browser.newContext({
    permissions: ["geolocation"],
    geolocation: { latitude: -2.99, longitude: 104.76 },
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/destinasi/jembatan-ampera", { waitUntil: "networkidle", timeout: 60000 });
  await page.locator("button:has-text(\"Hitung jarak\")").first().click();
  const jarakSiap = await page
    .waitForFunction(() => /jalan kaki/i.test(document.body.innerText), undefined, { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  cek("jarak tampil setelah izin lokasi diberikan", jarakSiap);
  await ctx.close();
}
console.log(`\n=== TOTAL GAGAL: ${gagal} ===`);
await browser.close();
process.exit(gagal === 0 ? 0 : 1);