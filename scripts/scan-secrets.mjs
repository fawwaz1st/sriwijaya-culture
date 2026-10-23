/**
 * Pindai kunci API di seluruh riwayat git dan berkas kerja.
 * Jalankan: node scripts/scan-secrets.mjs
 */
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const POLA = [
  { nama: "OpenRouter", re: /sk-or-v1-[a-f0-9]{64}/g },
  { nama: "Groq", re: /gsk_[A-Za-z0-9]{40,80}/g },
  { nama: "OpenAI", re: /sk-[A-Za-z0-9]{40,}/g },
  { nama: "Anthropic", re: /sk-ant-[A-Za-z0-9-_]{40,}/g },
  { nama: "GitHub token", re: /gh[pousr]_[A-Za-z0-9]{36,}/g },
  { nama: "Google API", re: /AIza[A-Za-z0-9_-]{35}/g },
  { nama: "Vercel", re: /[a-zA-Z0-9]{24,}\b/ },
];

const LEWATI = new Set([".git", "node_modules", ".next", "_shot", "docs/bukti"]);
const EKST = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".env", ".yml", ".yaml", ".txt", ".example"]);

function berkas(dir, hasil = []) {
  for (const nama of readdirSync(dir)) {
    const p = join(dir, nama);
    if (LEWATI.has(nama) || [...LEWATI].some((l) => p.includes(`/${l}/`) || p.includes(`\\${l}\\`))) continue;
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) berkas(p, hasil);
    else if (EKST.has(extname(nama)) || nama.startsWith(".env")) hasil.push(p);
  }
  return hasil;
}

console.log("=== PINDAI BERKAS KERJA ===");
let temuanKerja = 0;
for (const p of berkas(".")) {
  if (p.includes(".env.local") && !p.includes(".env.example")) {
    console.log(`  [dilewati, berkas lokal] ${p}`);
    continue;
  }
  let isi;
  try { isi = readFileSync(p, "utf8"); } catch { continue; }
  for (const { nama, re } of POLA) {
    if (nama === "Vercel") continue;
    const m = isi.match(re);
    if (m) {
      // Abaikan placeholder yang jelas
      const nyata = m.filter((x) => !/x{8,}|…|\.\.\.|placeholder|contoh|example/i.test(x));
      if (nyata.length) {
        console.log(`  !! ${nama} di ${p}: ${nyata[0].slice(0, 16)}…`);
        temuanKerja++;
      }
    }
  }
}
console.log(temuanKerja === 0 ? "  bersih" : `  ${temuanKerja} temuan`);

console.log("\n=== PINDAI RIWAYAT GIT ===");
try {
  const log = execSync("git log --all -p -- .", { encoding: "utf8", maxBuffer: 200 * 1024 * 1024 });
  let temuanGit = 0;
  for (const { nama, re } of POLA) {
    if (nama === "Vercel") continue;
    const m = log.match(re);
    if (m) {
      const nyata = [...new Set(m)].filter((x) => !/x{8,}|…|placeholder|contoh|example/i.test(x));
      if (nyata.length) {
        console.log(`  !! ${nama} di riwayat: ${nyata.length} kemunculan, contoh ${nyata[0].slice(0, 14)}…`);
        temuanGit++;
      }
    }
  }
  console.log(temuanGit === 0 ? "  bersih" : `  ${temuanGit} jenis kunci ditemukan`);
} catch (e) {
  console.log("  gagal membaca riwayat:", e.message.slice(0, 80));
}

console.log("\n=== CEK .gitignore ===");
const gi = readFileSync(".gitignore", "utf8");
for (const pola of [".env", ".env.local", ".next", "node_modules"]) {
  console.log(`  ${gi.includes(pola) ? "OK" : "HILANG"}  ${pola}`);
}
