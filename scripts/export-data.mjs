/**
 * Port data arsip dari JS lama (window.SC.*) ke modul TypeScript.
 *
 * Dipakai sekali saat migrasi supaya tidak ada data yang diketik ulang
 * (sumber kebenaran tetap berkas JS lama di commit baseline).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

// Berkas data lama menassign ke window.SC, jadi sediakan window global.
globalThis.window = globalThis;
for (const f of [
  "js/data-destinasi.js",
  "js/data-artikel.js",
  "js/data-umkm.js",
  "js/data-timeline.js",
  "js/data-atlas.js",
]) {
  if (existsSync(join(root, f))) require(join(root, f));
}

const SC = globalThis.SC;
if (!SC) throw new Error("window.SC tidak termuat, cek berkas data lama.");

const outDir = join(root, "src", "lib", "data");
mkdirSync(outDir, { recursive: true });

const banner = `/* eslint-disable */
/**
 * DIHASILKAN OTOMATIS oleh scripts/export-data.mjs.
 * Jangan diedit manual. Sumber: js/data-*.js (commit baseline).
 */
`;

/**
 * Jalur gambar di data lama masih "assets/images/x.jpg".
 * Di Next.js berkas statis dilayani dari public/, jadi path-nya
 * harus jadi "/images/x.jpg".
 */
const rewritePaths = (value) => {
  if (Array.isArray(value)) return value.map(rewritePaths);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = rewritePaths(v);
    return out;
  }
  if (typeof value === "string" && value.startsWith("assets/images/")) {
    return "/" + value.replace("assets/", "");
  }
  return value;
};

const emit = (name, value) => {
  const file = join(outDir, `${name}.ts`);
  const json = JSON.stringify(rewritePaths(value), null, 2);
  writeFileSync(file, `${banner}export const ${name} = ${json} as const;\n`, "utf8");
  return file;
};

const files = [
  emit("destinasi", SC.DESTINASI),
  emit("artikel", SC.ARTIKEL),
  emit("umkm", SC.UMKM),
  emit("timeline", SC.TIMELINE),
  emit("atlas", SC.ATLAS),
  emit("kategoriDestinasi", SC.KATEGORI_DESTINASI),
  emit("kategoriArtikel", SC.KATEGORI_ARTIKEL),
  emit("kategoriUMKM", SC.KATEGORI_UMKM),
  emit("umkmTerkait", SC.UMKM_TERKAIT),
  emit("varianPempek", SC.VARIAN_PEMPEK),
];

for (const f of files) {
  const size = readFileSync(f, "utf8").length;
  console.log(`${f.replace(root + "\\", "")} (${size} byte)`);
}
console.log("OK");
