/**
 * Render keluaran audit menjadi gambar bukti untuk lampiran log.
 *
 * Skrip ini menjalankan auditnya sendiri lalu merender hasilnya, jadi
 * tidak bergantung pada berkas sementara di folder mana pun. Sebelumnya
 * ia membaca `_shot/*.txt` yang bisa saja sudah dihapus, dan itu membuat
 * lampiran log tidak bisa dibuat ulang.
 *
 * Jalankan: node scripts/bukti-audit.mjs
 * Prasyarat: server hidup di PORT (default 3100).
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const PORT = process.env.PORT || "3100";
mkdirSync("docs/bukti", { recursive: true });

function jalankan(skrip) {
  try {
    return execFileSync("node", [skrip], {
      encoding: "utf8",
      env: { ...process.env, BASE_URL: `http://localhost:${PORT}` },
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch (e) {
    // Skrip audit mengembalikan kode keluar bukan-nol bila ada temuan;
    // keluarannya tetap berguna, jadi dipakai.
    return (e.stdout || "") + (e.stderr || "");
  }
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function halaman(judul, isi) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body { margin:0; background:#0b0d0c; color:#e8e4dc; font-family:ui-monospace,"Cascadia Code",Consolas,monospace; padding:28px 32px; }
    h1 { font-size:15px; letter-spacing:.14em; text-transform:uppercase; color:#d9a832; margin:0 0 4px; font-weight:500; }
    .sub { font-size:12px; color:#8f8a80; margin-bottom:18px; }
    pre { font-size:12.5px; line-height:1.65; margin:0; white-space:pre-wrap; word-break:break-word; }
  </style></head><body>
    <h1>${esc(judul)}</h1>
    <div class="sub">Sriwijaya Culture · keluaran apa adanya</div>
    <pre>${esc(isi)}</pre>
  </body></html>`;
}

const berkas = [
  ["10-audit-final", "Audit akhir: 10 halaman × 5 lebar layar", "scripts/audit-final.mjs"],
  ["11-uji-keamanan", "Uji keamanan endpoint asisten: 8 skenario", "scripts/uji-keamanan.mjs"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 });

for (const [nama, judul, skrip] of berkas) {
  const isi = jalankan(skrip).replace(/\u001b\[[0-9;]*m/g, "");
  await page.setContent(halaman(judul, isi), { waitUntil: "load" });
  await page.waitForTimeout(250);
  const buf = await page.screenshot({ fullPage: true });
  writeFileSync(`docs/bukti/${nama}.png`, buf);
  console.log(`${nama}.png  ${Math.round(buf.length / 1024)} KB`);
}

await browser.close();
