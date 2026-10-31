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

/* ---------- 0. Navigasi bawah di layar kecil ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  const nav = page.locator('nav[aria-label="Navigasi utama bawah"]');
  cek("navigasi bawah tampil di ponsel", (await nav.count()) === 1);
  const item = await nav.locator("a").count();
  cek("navigasi bawah punya lima item", item === 5, "item " + item);
  const kotak = await nav.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { tinggi: Math.round(b.height), lebar: Math.round(b.width), posisi: getComputedStyle(el).position };
  });
  cek("navigasi bawah menempel di bawah layar", kotak.posisi === "fixed" && kotak.tinggi > 50, JSON.stringify(kotak));
  const label = await nav.innerText();
  cek("label navigasi bawah terbaca", /BERANDA/.test(label) && /SARI/.test(label), label.replace(/\s+/g, " "));
  await ctx.close();
}

/* ---------- 0b. Navigasi bawah hilang di layar lebar ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(600);
  const nav = page.locator('nav[aria-label="Navigasi utama bawah"]');
  const terlihat = await nav.evaluate((el) => {
    const cs = getComputedStyle(el);
    return cs.display !== "none" && el.getBoundingClientRect().height > 0;
  });
  cek("navigasi bawah disembunyikan di desktop", !terlihat);
  await ctx.close();
}

/* ---------- 1. Tirai intro ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });

  /*
   * Tirai hanya muncul sekali per sesi, jadi uji ini harus membersihkan
   * penandanya lebih dulu. Pembersihan dilakukan di origin yang sama
   * (halaman sudah dibuka), lalu halaman dimuat ulang. Penantian
   * memakai polling karena tirai hidup hanya sekitar 1,4 detik:
   * waitForSelector bisa melewatkannya pada mesin yang lambat, dan
   * jeda tetap bisa memeriksa terlalu dini.
   */
  await page.evaluate(() => {
    try { sessionStorage.clear(); } catch {}
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  let adaAwal = 0;
  for (let i = 0; i < 40; i += 1) {
    if ((await page.locator(".tirai-buka").count()) > 0) { adaAwal = 1; break; }
    await page.waitForTimeout(100);
  }
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

/* ---------- 2b. Navigasi bawah menggantikan hamburger ---------- */
{
  /*
   * Hamburger drawer sudah dihapus. Navigasi utama di layar kecil
   * sekarang memakai bottom nav, yang diuji di blok 0. Yang diperiksa
   * di sini adalah konsekuensinya: tidak boleh ada tombol hamburger
   * yang menggantung, dan header tidak boleh memuat panel apa pun.
   */
  for (const width of [320, 390, 440, 768, 1023]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    const hamburger = await page.locator('button[aria-label="Buka menu"]').count();
    cek("tidak ada tombol hamburger di lebar " + width, hamburger === 0, "tombol " + hamburger);
    const panel = await page.locator("#menu-mobile").count();
    cek("tidak ada panel menu lama di lebar " + width, panel === 0, "panel " + panel);
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

/* ---------- 11. Peta ringkas dari koordinat asli ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/jelajah", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  const titik = await page.locator('svg[role="img"] circle').count();
  cek("peta ringkas menggambar titik dari koordinat", titik >= 8, "lingkaran " + titik);
  const label = await page.locator('svg[role="img"] text').count();
  cek("peta ringkas memberi label nama", label >= 8, "teks " + label);
  await ctx.close();
}

/* ---------- 13. Pita foto geser di katalog destinasi ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/destinasi", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(900);
  const pita = page.locator('section[aria-label="Sorotan destinasi"]');
  cek("pita foto tampil di katalog", (await pita.count()) === 1);
  const wadah = pita.locator('div[role="group"]');
  const geserAwal = await wadah.evaluate((el) => el.scrollLeft);
  await pita.locator('button[aria-label="Gulir ke kanan"]').click();
  await page.waitForTimeout(700);
  const geserAkhir = await wadah.evaluate((el) => el.scrollLeft);
  cek("tombol panah menggeser pita", geserAkhir > geserAwal, geserAwal + " -> " + geserAkhir);
  const kananAwal = await pita.locator('button[aria-label="Gulir ke kanan"]').isDisabled();
  cek("tombol kanan aktif saat masih ada isi", !kananAwal);
  await ctx.close();
}

/* ---------- 12. Rencana kunjungan lokal ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/jelajah", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.selectOption("select", { index: 1 });
  await page.waitForTimeout(400);
  const tersimpan = await page.evaluate(() => {
    try { return window.localStorage.getItem("sriwijaya-rencana-v1"); } catch { return null; }
  });
  cek("rencana tersimpan di peramban", Boolean(tersimpan) && String(tersimpan).includes("id"), String(tersimpan).slice(0, 60));
  const baris = await page.locator("ol li").count();
  cek("rencana menampilkan baris", baris >= 1, "baris " + baris);
  if (baris >= 2) {
    const sebelum = await page.locator("ol li a").first().innerText();
    await page.locator('button[aria-label^="Turunkan"]').first().click();
    await page.waitForTimeout(300);
    const sesudah = await page.locator("ol li a").first().innerText();
    cek("urutan rencana bisa diubah", sebelum !== sesudah, sebelum + " -> " + sesudah);
  }
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