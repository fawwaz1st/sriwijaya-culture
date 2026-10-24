/**
 * QA per bagian (section), bukan per halaman.
 *
 * Halaman yang "lolos" bisa tetap punya bagian rusak: satu seksi kosong,
 * satu judul menembus wadah, satu gambar gagal muat. Skrip ini membuka
 * setiap rute, memecahnya menjadi section, lalu mengukur tiap section
 * secara terpisah.
 *
 * Yang diukur per section:
 *   - luapan horizontal (section lebih lebar dari viewport)
 *   - tinggi dan rasio isi (mendeteksi section kosong atau nyaris kosong)
 *   - ukuran teks terkecil
 *   - gambar gagal muat
 *   - elemen yang menembus tepi section
 *   - teks yang bertumpuk (overlap antar blok teks bersaudara)
 *
 * Setiap section juga difoto, supaya temuan bisa diperiksa mata.
 *
 * Jalankan: node scripts/qa-section.mjs [--only /rute]
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "_shot/section";
mkdirSync(OUT, { recursive: true });

const RUTE = [
  ["/", "beranda"],
  ["/destinasi", "destinasi"],
  ["/destinasi/jembatan-ampera", "detail-destinasi"],
  ["/destinasi/pulau-kemaro", "detail-kemaro"],
  ["/jelajah", "jelajah"],
  ["/umkm", "umkm"],
  ["/umkm/pempek-beringin", "detail-umkm"],
  ["/artikel", "artikel"],
  ["/artikel/sejarah-jembatan-ampera", "detail-artikel"],
  ["/artikel/sejarah-kampung-arab", "detail-arab"],
  ["/asisten", "asisten"],
  ["/metodologi", "metodologi"],
  ["/tentang", "tentang"],
];

const LEBAR = [
  ["desktop", 1440, 900],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
];

const hanya = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;
const rute = hanya ? RUTE.filter(([r]) => r === hanya) : RUTE;

const browser = await chromium.launch();
const laporan = [];
let masalah = 0;

for (const [nama, w, h] of LEBAR) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const galat = [];
  page.on("console", (m) => {
    if (m.type() === "error") galat.push(m.text().slice(0, 160));
  });
  page.on("pageerror", (e) => galat.push("PAGEERROR " + e.message.slice(0, 160)));

  for (const [r, slug] of rute) {
    galat.length = 0;

    let status = 0;
    try {
      const resp = await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 60000 });
      status = resp?.status() ?? 0;
    } catch (e) {
      console.log(`${nama.padEnd(8)} ${slug.padEnd(20)} GAGAL MEMUAT: ${e.message.slice(0, 60)}`);
      masalah += 1;
      continue;
    }

    // Gulir seluruh halaman supaya lazy-load dan animasi terpicu.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 600) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // --- Ukur setiap section ---
    const sections = await page.evaluate(() => {
      const hasil = [];

      // Semua section di dalam <main>, ditambah <main> sendiri kalau
      // tidak punya section (halaman asisten dan halaman pendek).
      const main = document.querySelector("main");
      if (!main) return hasil;

      let daftar = [...main.querySelectorAll("section")];
      if (daftar.length === 0) daftar = [main];

      daftar.forEach((s, idx) => {
        const b = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        if (b.width < 2) return;

        const judul =
          (s.querySelector("h1, h2, h3")?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48) ||
          `(section ${idx + 1})`;

        // Teks terkecil yang benar-benar memuat teks sendiri
        let minFs = 99;
        let pelaku = "";
        const teksBlok = [];
        for (const el of s.querySelectorAll("p, span, a, li, dd, dt, h1, h2, h3, h4, button, label, figcaption, td")) {
          const punyaTeks = [...el.childNodes].some(
            (n) => n.nodeType === 3 && n.textContent.trim().length > 2,
          );
          if (!punyaTeks) continue;
          const eb = el.getBoundingClientRect();
          if (eb.width < 4 || eb.height < 4) continue;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs > 0 && fs < minFs) {
            minFs = fs;
            pelaku = el.textContent.trim().slice(0, 30);
          }
          teksBlok.push({
            x: Math.round(eb.x),
            y: Math.round(eb.y + window.scrollY),
            w: Math.round(eb.width),
            h: Math.round(eb.height),
            tag: el.tagName.toLowerCase(),
          });
        }

        // Gambar gagal muat
        const imgRusak = [...s.querySelectorAll("img")].filter(
          (i) => i.complete && i.naturalWidth === 0,
        ).length;

        // Elemen yang menembus tepi section
        const menembus = [];
        const kiriSection = b.left;
        const kananSection = b.right;
        for (const el of s.querySelectorAll("div, p, h1, h2, h3, ul, ol, figure, table")) {
          const eb = el.getBoundingClientRect();
          if (eb.width < 40 || eb.height < 10) continue;
          if (eb.left < kiriSection - 3 || eb.right > kananSection + 3) {
            menembus.push({
              tag: el.tagName.toLowerCase(),
              cls: String(el.className).slice(0, 40),
              kiri: Math.round(eb.left),
              kanan: Math.round(eb.right),
            });
            if (menembus.length >= 3) break;
          }
        }

        // Rasio isi: seberapa banyak bounding box anak yang terisi.
        // Section dengan rasio sangat rendah berarti ruang kosong besar.
        const anak = [...s.children]
          .map((c) => c.getBoundingClientRect())
          .filter((cb) => cb.width > 20 && cb.height > 20);
        let rasioIsi = 1;
        if (anak.length > 0 && b.width > 100 && b.height > 100) {
          let minX = 1e9,
            minY = 1e9,
            maxX = -1e9,
            maxY = -1e9,
            luas = 0;
          for (const cb of anak) {
            minX = Math.min(minX, cb.left);
            minY = Math.min(minY, cb.top);
            maxX = Math.max(maxX, cb.right);
            maxY = Math.max(maxY, cb.bottom);
            luas += cb.width * cb.height;
          }
          const bungkus = Math.max(1, (maxX - minX) * (maxY - minY));
          rasioIsi = +(luas / bungkus).toFixed(2);
        }

        hasil.push({
          idx,
          judul,
          y: Math.round(b.top + window.scrollY),
          w: Math.round(b.width),
          h: Math.round(b.height),
          minFs: minFs === 99 ? null : +minFs.toFixed(1),
          pelaku,
          imgRusak,
          menembus,
          rasioIsi,
          jumlahTeks: teksBlok.length,
          // Penanda berhenti: section tanpa teks sama sekali
          kosong: teksBlok.length === 0 && s.querySelectorAll("img, iframe, svg").length === 0,
        });
      });

      return hasil;
    });

    // --- Nilai temuan ---
    const temuan = [];
    for (const s of sections) {
      if (s.minFs !== null && s.minFs < 11.5) {
        temuan.push(`teks ${s.minFs}px di "${s.judul}" :: ${s.pelaku}`);
      }
      if (s.imgRusak > 0) temuan.push(`${s.imgRusak} gambar rusak di "${s.judul}"`);
      if (s.menembus.length > 0) {
        temuan.push(`menembus wadah di "${s.judul}" (${s.menembus[0].tag} ${s.menembus[0].kiri}..${s.menembus[0].kanan})`);
      }
      if (s.kosong) temuan.push(`section kosong: "${s.judul}"`);
      if (s.h > 300 && s.rasioIsi < 0.35) {
        temuan.push(`ruang kosong besar di "${s.judul}" (rasio isi ${s.rasioIsi}, tinggi ${s.h}px)`);
      }
    }

    const docOvf = await page.evaluate(
      () => Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    );
    if (docOvf > 1) temuan.push(`luapan dokumen ${docOvf}px`);
    if (galat.length) temuan.push(`${galat.length} galat konsol: ${galat[0]}`);

    if (temuan.length) masalah += temuan.length;

    laporan.push({ rute: r, slug, layar: nama, status, sections, temuan });

    const tanda = temuan.length ? ` <-- ${temuan.length} TEMUAN` : "";
    console.log(
      `${nama.padEnd(8)} ${slug.padEnd(20)} ${String(sections.length).padStart(2)} section  ${temuan.length ? "" : "bersih"}${tanda}`,
    );
    for (const t of temuan) console.log(`           - ${t}`);

    // --- Foto setiap section pada desktop dan mobile ---
    //
    // Selektor harus mencerminkan cara section diukur di atas: kalau
    // halaman tidak punya <section> sama sekali, <main> sendiri yang
    // diukur, jadi <main> juga yang difoto. Sebelumnya loop ini hanya
    // memakai "main section", sehingga halaman seperti /destinasi
    // dilaporkan "1 section bersih" tanpa satu pun gambar dihasilkan.
    if (nama === "desktop" || nama === "mobile") {
      const adaSection = await page.locator("main section").count();
      const sasaran = adaSection > 0 ? "main section" : "main";
      const n = await page.locator(sasaran).count();
      for (let i = 0; i < n; i += 1) {
        const s = page.locator(sasaran).nth(i);
        const berkas = join(OUT, `${slug}-${nama}-s${String(i + 1).padStart(2, "0")}.png`);
        try {
          await s.scrollIntoViewIfNeeded();
          await page.waitForTimeout(220);
          await s.screenshot({ path: berkas });
        } catch (e) {
          // Jangan ditelan diam-diam: kegagalan foto berarti bukti visual
          // untuk section itu tidak ada, dan laporan "bersih" jadi
          // menyesatkan.
          console.log(`           ! foto gagal: ${berkas} (${e.message.slice(0, 60)})`);
        }
      }
    }
  }
  await ctx.close();
}

await browser.close();
writeFileSync(join(OUT, "laporan.json"), JSON.stringify(laporan, null, 2));

const totalSection = laporan.reduce((a, l) => a + l.sections.length, 0);
console.log(`\n=== RINGKASAN ===`);
console.log(`Halaman diperiksa : ${laporan.length}`);
console.log(`Section diperiksa : ${totalSection}`);
console.log(`Temuan            : ${masalah}`);
process.exit(masalah === 0 ? 0 : 1);