/**
 * QA akhir, verifikasi klaim submission lewat browser sungguhan.
 * Tidak mengubah src/, docs/, atau config. Hanya membaca.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = "_shot/qa";
mkdirSync(OUT, { recursive: true });

const RUTE = [
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
const RUTE_404 = ["/halaman-yang-tidak-ada-xyz", "/destinasi/bukan-destinasi-xyz"];

const laporan = { rute: [], overflow: [], fokus: [], gerak: [], kotor: [], asisten: {} };

/* ---------- 1. status + h1 ---------- */
{
 const b = await chromium.launch();
 const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
 const p = await ctx.newPage();
 for (const r of [...RUTE, ...RUTE_404]) {
 const res = await p.goto(BASE + r, { waitUntil: "domcontentloaded", timeout: 60000 });
 const info = await p.evaluate(() => {
 const h1 = [...document.querySelectorAll("h1")];
 const vis = h1.filter((e) => {
 const b = e.getBoundingClientRect();
 return b.width > 1 && b.height > 1 && getComputedStyle(e).visibility !== "hidden";
 });
 return {
 h1: h1.length,
 h1Teks: h1.map((e) => e.textContent.trim().slice(0, 60)),
 judul: document.title,
 teks: document.body.innerText.replace(/\s+/g, " ").slice(0, 200),
 };
 });
 laporan.rute.push({ r, status: res.status(), ...info });
 }
 await b.close();
}

/* ---------- 3 + 6. overflow, gambar rusak, teks kotor, console ---------- */
const VP = [
 [320, 568],
 [390, 844],
 [768, 1024],
 [1440, 900],
 [2560, 1440],
];
{
 const b = await chromium.launch();
 for (const [w, h] of VP) {
 const ctx = await b.newContext({ viewport: { width: w, height: h } });
 const p = await ctx.newPage();
 const errs = [];
 p.on("console", (m) => {
 if (m.type() === "error") errs.push(m.text().slice(0, 160));
 });
 p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message.slice(0, 160)));

 for (const r of RUTE) {
 errs.length = 0;
 await p.goto(BASE + r, { waitUntil: "networkidle", timeout: 60000 });
 // gulir penuh agar konten lazy/animasi ikut terukur
 const H = await p.evaluate(() => document.documentElement.scrollHeight);
 for (let y = 0; y < H; y += 800) {
 await p.evaluate((v) => window.scrollTo(0, v), y);
 await p.waitForTimeout(40);
 }
 await p.evaluate(() => window.scrollTo(0, 0));
 await p.waitForTimeout(200);

 const m = await p.evaluate(() => {
 const de = document.documentElement;
 const vw = de.clientWidth;
 const lebar = de.scrollWidth - vw;
 const pelanggar = [];
 for (const el of document.querySelectorAll("body *")) {
 const cs = getComputedStyle(el);
 if (cs.position === "fixed" || cs.position === "absolute") {
 // elemen dekoratif absolut tetap bisa memicu scroll bila lebar
 }
 if (cs.display === "none" || cs.visibility === "hidden") continue;
 const b = el.getBoundingClientRect();
 if (b.width < 1 || b.height < 1) continue;
 if (b.right > vw + 1.5 || b.left < -1.5) {
 pelanggar.push({
 tag: el.tagName.toLowerCase(),
 cls: (el.className || "").toString().slice(0, 70),
 kiri: Math.round(b.left),
 kanan: Math.round(b.right),
 teks: (el.textContent || "").trim().slice(0, 40),
 });
 }
 }
 const rusak = [...document.images]
 .filter((i) => i.complete && i.naturalWidth === 0)
 .map((i) => i.currentSrc || i.src);
 const teks = document.body.innerText;
 const kotor = [];
 const pola = [
 [/\bundefined\b/i, "undefined"],
 [/\bNaN\b/, "NaN"],
 [/\bnull\b/, "null"],
 [/lorem ipsum|dolor sit amet/i, "lorem"],
 [/\b(TODO|TBD|FIXME|coming soon|read more|click here|your text here)\b/i, "placeholder"],
 ];
 for (const [re, nama] of pola) {
 const hit = teks.match(re);
 if (hit) {
 const i = Math.max(0, teks.indexOf(hit[0]) - 60);
 kotor.push({ nama, cuplikan: teks.slice(i, i + 130).replace(/\s+/g, " ") });
 }
 }
 const dev =
 !!document.querySelector("nextjs-portal") ||
 !!document.querySelector("[data-nextjs-toast]") ||
 !!document.querySelector("[data-nextjs-dialog]") ||
 !!document.querySelector("next-dev-tools");
 return { lebar, pelanggar: pelanggar.slice(0, 5), rusak, kotor, dev };
 });

 const kunci = `${w}|${r}`;
 if (m.lebar > 1) laporan.overflow.push({ kunci, lebar: m.lebar, pelanggar: m.pelanggar });
 if (m.rusak.length) laporan.kotor.push({ kunci, jenis: "gambar-rusak", detail: m.rusak });
 if (m.kotor.length) laporan.kotor.push({ kunci, jenis: "teks", detail: m.kotor });
 if (m.dev) laporan.kotor.push({ kunci, jenis: "dev-badge" });
 if (errs.length) laporan.kotor.push({ kunci, jenis: "console", detail: [...errs] });
 }
 await ctx.close();
 }
 await b.close();
}

/* ---------- 4. keyboard ---------- */
{
 const b = await chromium.launch();
 const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
 const p = await ctx.newPage();
 await p.goto(BASE + "/", { waitUntil: "networkidle" });
 await p.evaluate(() => window.scrollTo(0, 0));
 await p.evaluate(() => document.body.focus());

 const urutan = [];
 for (let i = 0; i < 14; i++) {
 await p.keyboard.press("Tab");
 await p.waitForTimeout(60);
 const s = await p.evaluate(() => {
 const el = document.activeElement;
 if (!el || el === document.body) return { kosong: true };
 const cs = getComputedStyle(el);
 const r = el.getBoundingClientRect();
 const outline =
 cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0
 ? `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`
 : null;
 const shadow = cs.boxShadow !== "none" ? cs.boxShadow.slice(0, 60) : null;
 const bg = cs.backgroundColor;
 return {
 tag: el.tagName.toLowerCase(),
 teks: (el.innerText || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim().slice(0, 50),
 href: el.getAttribute("href"),
 outline,
 shadow,
 bg,
 terlihat: r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.opacity !== "0",
 pos: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
 kelas: (el.className || "").toString().slice(0, 60),
 };
 });
 urutan.push(s);
 }
 laporan.fokus = urutan;
 await p.screenshot({ path: `${OUT}/fokus-beranda.png` });
 await ctx.close();
 await b.close();
}

/* ---------- 5. reduced motion ---------- */
{
 const b = await chromium.launch();
 const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
 const p = await ctx.newPage();
 for (const r of ["/", "/destinasi", "/destinasi/jembatan-ampera", "/artikel/sejarah-jembatan-ampera", "/asisten"]) {
 await p.goto(BASE + r, { waitUntil: "networkidle" });
 await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
 await p.waitForTimeout(300);
 await p.evaluate(() => window.scrollTo(0, 0));
 await p.waitForTimeout(200);
 const m = await p.evaluate(() => {
 const takTerlihat = [];
 for (const el of document.querySelectorAll("main *")) {
 if (el.closest("[aria-hidden='true']")) continue;
 const cs = getComputedStyle(el);
 if (cs.display === "none" || cs.visibility === "hidden") continue;
 const b = el.getBoundingClientRect();
 if (b.width < 2 || b.height < 2) continue;
 const teksSendiri = [...el.childNodes]
 .filter((n) => n.nodeType === 3)
 .map((n) => n.textContent.trim())
 .join(" ")
 .trim();
 if (!teksSendiri) continue;
 const op = parseFloat(cs.opacity);
 if (op < 0.1) takTerlihat.push({ teks: teksSendiri.slice(0, 50), opacity: op });
 }
 const h1 = document.querySelector("h1");
 const hr = h1?.getBoundingClientRect();
 return {
 takTerlihat: takTerlihat.slice(0, 6),
 h1Terlihat: !!hr && hr.width > 2 && hr.height > 2 && parseFloat(getComputedStyle(h1).opacity) > 0.1,
 teksPanjang: document.querySelector("main").innerText.trim().length,
 animasi: [...document.querySelectorAll(".kartu-masuk, .label-masuk, .angka-naik")].map((e) => getComputedStyle(e).opacity),
 };
 });
 laporan.gerak.push({ r, ...m });
 }
 // usable: skip link + navigasi
 await p.goto(BASE + "/", { waitUntil: "networkidle" });
 await p.keyboard.press("Tab");
 const skip = await p.evaluate(() => {
 const el = document.activeElement;
 const r = el.getBoundingClientRect();
 return { teks: el.innerText.trim(), terlihat: r.width > 1 && r.height > 1, y: Math.round(r.y) };
 });
 laporan.gerak.push({ r: "skip-link", ...skip });
 await p.screenshot({ path: `${OUT}/reduced-motion.png` });
 await ctx.close();
 await b.close();
}

/* ---------- 2. asisten end-to-end ---------- */
{
 const b = await chromium.launch();
 const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
 const p = await ctx.newPage();
 const errs = [];
 p.on("console", (m) => {
 if (m.type() === "error") errs.push(m.text().slice(0, 200));
 });
 p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message.slice(0, 200)));

 await p.goto(BASE + "/asisten", { waitUntil: "networkidle" });

 /*
 * Tunggu hidrasi sebelum mengetik.
 *
 * `networkidle` hanya berarti tidak ada permintaan jaringan; React
 * belum tentu sudah memasang event handler. Kalau `fill` dan `Enter`
 * dikirim sebelum hidrasi selesai, teks masuk ke textarea tetapi
 * onSubmit belum terpasang, sehingga tidak ada jawaban yang pernah
 * muncul dan penantian berakhir timeout tanpa pesan yang jelas.
 *
 * Penanda hidrasi: menekan tombol kirim mengubah atribut disabled
 * saat isi textarea berubah. Sebelum itu, tombol selalu disabled.
 */
 const ta = p.locator('textarea[placeholder*="Tanya tentang"]').first();
 await ta.waitFor({ state: "visible", timeout: 20000 });
 await ta.fill("tes");
 await p
 .waitForFunction(
 () => {
 const btn = document.querySelector('button[aria-label="Kirim pertanyaan"]');
 return btn && !btn.disabled;
 },
 { timeout: 20000 },
 )
 .catch(() => {});
 await ta.fill("");

 const tanya = async (q, label) => {
 await ta.fill(q);
 await ta.press("Enter");

 /*
 * Tunggu jawaban muncul, bukan menunggu teks status.
 *
 * Dua kesalahan sebelumnya, keduanya ditemukan lewat pengukuran:
 *
 * 1. Menunggu `document.body.innerText` memuat "Dijawab dari arsip".
 * `.meta` memakai `text-transform: uppercase`, jadi teks di DOM
 * berbunyi "DIJAWAB DARI ARSIP" dan pencocokan peka huruf besar
 * tidak pernah cocok.
 * 2. `waitForFunction(fn, nilai, opsi)`, argumen kedua diperlakukan
 * sebagai nilai yang diteruskan ke fungsi, bukan opsi. Karena itu
 * `timeout` tidak pernah terbaca dan nilai pembandingnya menjadi
 * objek opsi itu sendiri.
 *
 * Sekarang yang diuji: jumlah balon jawaban Sari bertambah. Opsi
 * dikirim sebagai argumen ketiga, dan nilai pembanding dibungkus.
 */
 const sebelum = await p.evaluate(
 () => document.querySelectorAll('[role="log"] ol > li:not(.justify-end)').length,
 );

 /*
 * Penantian dibungkus try/catch.
 *
 * Sebelumnya satu jawaban yang lambat melempar galat dan
 * menghentikan seluruh skrip, sehingga pemeriksaan lain (rute,
 * overflow, fokus, reduced motion) kehilangan hasilnya padahal
 * sudah selesai dijalankan. Untuk alat verifikasi, satu kegagalan
 * harus tercatat sebagai temuan, bukan menghapus seluruh laporan.
 */
 let terpenuhi = true;
 try {
 await p.waitForFunction(
 (n) => document.querySelectorAll('[role="log"] ol > li:not(.justify-end)').length > n,
 sebelum,
 { timeout: 45000, polling: 400 },
 );
 } catch {
 terpenuhi = false;
 }
 // Tunggu indikator "sedang menyusun" hilang supaya teks tidak terbaca separuh.
 await p
 .waitForFunction(() => !document.body.innerText.includes("Menyusun jawaban"), undefined, {
 timeout: 20000,
 })
 .catch(() => {});
 await p.waitForTimeout(400);
 const d = await p.evaluate(() => {
 const items = [...document.querySelectorAll('[role="log"] ol > li')];
 const sari = items.filter((li) => !li.className.includes("justify-end"));
 const last = sari[sari.length - 1];
 const links = last ? [...last.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")) : [];
 const teks = last ? last.innerText.trim() : "";
 return { jumlah: items.length, teks, links, html: last ? last.innerHTML.slice(0, 400) : "" };
 });
 laporan.asisten[label] = {
 q,
 ...d,
 terpenuhi,
 kosong: d.teks.length === 0,
 galatMentah: /HTTP \d{3}|TypeError|undefined|NaN|error:/i.test(d.teks),
 ditolak: /belum ada di arsip/i.test(d.teks),
 mengutip: /\[\d+\]/.test(d.teks),
 };
 return d;
 };

 const a1 = await tanya("Apa yang membedakan Jembatan Ampera dari jembatan lain?", "arsip");
 // verifikasi setiap tautan rujukan benar-benar hidup
 const linkStatus = [];
 for (const href of a1.links) {
 const r = await p.request.get(BASE + href);
 linkStatus.push({ href, status: r.status() });
 }
 laporan.asisten.tautan = linkStatus;

 await tanya("Berapa harga tiket masuk Museum Balaputra Dewa?", "tiket");
 await tanya("Siapa presiden pertama Indonesia dan apa ibu kota Jepang?", "luar-topik");

 laporan.asisten.console = errs;
 await p.screenshot({ path: `${OUT}/asisten-akhir.png`, fullPage: false });
 await ctx.close();
 await b.close();
}

writeFileSync(`${OUT}/laporan.json`, JSON.stringify(laporan, null, 2));

/* ---------- ringkas ---------- */
console.log("=== RUTE ===");
for (const r of laporan.rute) {
 console.log(`${String(r.status).padEnd(4)} h1=${r.h1} ${r.rute ?? r.r} | ${r.h1Teks.join(" / ")}`);
}
console.log("\n=== OVERFLOW (hanya >1px) ===");
console.log(laporan.overflow.length ? JSON.stringify(laporan.overflow, null, 1) : "tidak ada");
console.log("\n=== KOTOR ===");
console.log(laporan.kotor.length ? JSON.stringify(laporan.kotor, null, 1) : "tidak ada");
console.log("\n=== FOKUS ===");
for (const f of laporan.fokus) console.log(JSON.stringify(f));
console.log("\n=== REDUCED MOTION ===");
console.log(JSON.stringify(laporan.gerak, null, 1));
console.log("\n=== ASISTEN ===");
console.log(JSON.stringify(laporan.asisten, null, 1));
