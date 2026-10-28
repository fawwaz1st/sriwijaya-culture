/**
 * Audit QA menyeluruh.
 *
 * Bukan cuma "kelihatan bagus". Yang diperiksa:
 * 1. Overflow horizontal per elemen (bukan hanya halaman)
 * 2. Kontras teks terukur terhadap latar sebenarnya
 * 3. Target sentuh di bawah 28px (sulit dipakai di ponsel)
 * 4. Gambar tanpa alt, tautan tanpa teks, heading melompat
 * 5. Elemen yang keluar viewport
 * 6. Teks terpotong (scrollWidth > clientWidth)
 *
 * Pakai: node scripts/qa.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3100";

const RUTE = [
  "/",
  "/jelajah",
  "/favorit",
  "/destinasi",
  "/destinasi/jembatan-ampera",
  "/umkm",
  "/umkm/pempek-beringin",
  "/artikel",
  "/artikel/sejarah-jembatan-ampera",
  "/asisten",
  "/metodologi",
  "/tentang",
];

const LEBAR = [
  { nama: "390", w: 390, h: 844 },
  { nama: "768", w: 768, h: 1024 },
  { nama: "1440", w: 1440, h: 900 },
];

/** Kontras WCAG dari dua warna rgb. */
function kontras(fg, bg) {
  const lum = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = (r, g, b) => 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
  const a = L(fg[0], fg[1], fg[2]);
  const b = L(bg[0], bg[1], bg[2]);
  const terang = Math.max(a, b);
  const gelap = Math.min(a, b);
  return (terang + 0.05) / (gelap + 0.05);
}

const browser = await chromium.launch();
const temuan = [];

for (const lebar of LEBAR) {
  const ctx = await browser.newContext({
    viewport: { width: lebar.w, height: lebar.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  for (const rute of RUTE) {
    const galat = [];
    page.on("pageerror", (e) => galat.push(e.message.slice(0, 120)));

    await page.goto(BASE + rute, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(400);

    const hasil = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const masalah = [];

      /** Kontras WCAG dari dua warna rgb. Didefinisikan di dalam
          evaluate karena berjalan di konteks browser. */
      const kontras = (fg, bg) => {
        const lum = (c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        const L = (r, g, b) => 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
        const a = L(fg[0], fg[1], fg[2]);
        const b = L(bg[0], bg[1], bg[2]);
        const terang = Math.max(a, b);
        const gelap = Math.min(a, b);
        return (terang + 0.05) / (gelap + 0.05);
      };

      const parseRGB = (s) => {
        const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
        return m ? [+m[1], +m[2], +m[3]] : null;
      };

      /** Cari latar efektif dengan menelusuri induk. */
      const latarEfektif = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          const c = parseRGB(bg);
          if (c && !/rgba\(.*,\s*0\)/.test(bg)) return c;
          n = n.parentElement;
        }
        return [11, 13, 12];
      };

      const terlihat = (el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return (
          cs.display !== "none" &&
          cs.visibility !== "hidden" &&
          Number(cs.opacity) > 0.1 &&
          r.width > 0 &&
          r.height > 0
        );
      };

      // 1. Overflow horizontal.
      // Anak dari container yang memang bisa digulir horizontal
      // (overflow-x: auto/scroll) dikecualikan, karena di sana elemen
      // lebih lebar dari viewport adalah perilaku yang disengaja.
      const dalamScroller = (el) => {
        let n = el.parentElement;
        while (n && n !== document.body) {
          const ox = getComputedStyle(n).overflowX;
          if (ox === "auto" || ox === "scroll") return true;
          n = n.parentElement;
        }
        return false;
      };

      for (const el of document.querySelectorAll("body *")) {
        if (!terlihat(el)) continue;
        if (dalamScroller(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.right > vw + 2 || r.left < -2) {
          masalah.push({
            tipe: "overflow",
            tag: el.tagName.toLowerCase(),
            cls: String(el.className || "").slice(0, 50),
            kiri: Math.round(r.left),
            kanan: Math.round(r.right),
          });
        }
      }

      // 2. Teks terpotong (bukan ellipsis yang disengaja)
      for (const el of document.querySelectorAll("p, h1, h2, h3, span, a, li")) {
        if (!terlihat(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.textOverflow === "ellipsis" || cs.overflow === "hidden") continue;
        if (el.children.length > 0) continue;
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          masalah.push({
            tipe: "teks-terpotong",
            teks: (el.textContent || "").trim().slice(0, 40),
            sw: el.scrollWidth,
            cw: el.clientWidth,
          });
        }
      }

      // 3. Target sentuh kecil.
      // Elemen sr-only (1x1, hanya untuk pembaca layar) dikecualikan.
      for (const el of document.querySelectorAll("a, button, input, textarea, select")) {
        if (!terlihat(el)) continue;
        if (el.classList.contains("sr-only")) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 24 || r.width < 16) {
          masalah.push({
            tipe: "target-kecil",
            tag: el.tagName.toLowerCase(),
            teks: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      }

      // 4. Kontras teks
      for (const el of document.querySelectorAll("p, h1, h2, h3, a, span, li, dt, dd, button")) {
        if (!terlihat(el)) continue;
        const txt = (el.textContent || "").trim();
        if (!txt || el.children.length > 0) continue;
        const cs = getComputedStyle(el);
        const fg = parseRGB(cs.color);
        if (!fg) continue;
        const bg = latarEfektif(el);
        const k = kontras(fg, bg);
        const px = parseFloat(cs.fontSize);
        const tebal = Number(cs.fontWeight) >= 700;
        const besar = px >= 24 || (px >= 18.66 && tebal);
        const minimum = besar ? 3 : 4.5;
        if (k < minimum) {
          masalah.push({
            tipe: "kontras",
            teks: txt.slice(0, 40),
            rasio: +k.toFixed(2),
            minimum,
            px: Math.round(px),
          });
        }
      }

      // 5. Gambar tanpa alt
      for (const img of document.querySelectorAll("img")) {
        if (!img.hasAttribute("alt")) {
          masalah.push({ tipe: "img-tanpa-alt", src: img.src.split("/").pop()?.slice(0, 30) });
        }
      }

      // 6. Tautan tanpa teks
      for (const a of document.querySelectorAll("a")) {
        if (!terlihat(a)) continue;
        const txt = (a.textContent || "").trim();
        if (!txt && !a.getAttribute("aria-label") && !a.querySelector("img,svg")) {
          masalah.push({ tipe: "tautan-kosong", href: a.getAttribute("href")?.slice(0, 30) });
        }
      }

      // 7. Heading melompat (h1 -> h3)
      const levels = [...document.querySelectorAll("h1,h2,h3,h4")]
        .filter(terlihat)
        .map((h) => Number(h.tagName[1]));
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] - levels[i - 1] > 1) {
          masalah.push({ tipe: "heading-lompat", dari: levels[i - 1], ke: levels[i] });
        }
      }

      // 8. Jumlah h1
      const h1 = document.querySelectorAll("h1").length;
      if (h1 !== 1) masalah.push({ tipe: "jumlah-h1", n: h1 });

      return masalah;
    });

    // Deduplikasi per tipe supaya laporan bisa dibaca.
    const unik = [];
    const kunci = new Set();
    for (const m of hasil) {
      const k = m.tipe + "|" + (m.teks || m.tag || m.src || m.href || m.ke || "");
      if (kunci.has(k)) continue;
      kunci.add(k);
      unik.push(m);
    }

    for (const m of unik) temuan.push({ lebar: lebar.nama, rute, ...m });
    if (galat.length) temuan.push({ lebar: lebar.nama, rute, tipe: "galat-js", pesan: galat[0] });

    const jumlah = unik.length;
    console.log(`${lebar.nama.padEnd(5)} ${rute.padEnd(34)} ${jumlah === 0 ? "OK" : jumlah + " temuan"}`);
  }
  await ctx.close();
}

await browser.close();

// --- Ringkasan per tipe ---
console.log("\n=== RINGKASAN ===");
const perTipe = {};
for (const t of temuan) perTipe[t.tipe] = (perTipe[t.tipe] || 0) + 1;
for (const [tipe, n] of Object.entries(perTipe).sort((a, b) => b[1] - a[1])) {
  console.log(`${tipe.padEnd(20)} ${n}`);
}

console.log("\n=== DETAIL (maks 40) ===");
for (const t of temuan.slice(0, 40)) {
  const info = t.teks || t.cls || t.src || t.href || t.pesan || `${t.dari}->${t.ke}` || "";
  const ekstra = t.rasio ? ` rasio=${t.rasio} min=${t.minimum}` : t.w ? ` ${t.w}x${t.h}` : "";
  console.log(`[${t.tipe}] ${t.lebar} ${t.rute} ${info}${ekstra}`);
}

console.log(`\nTotal temuan: ${temuan.length}`);
process.exitCode = temuan.length > 0 ? 1 : 0;