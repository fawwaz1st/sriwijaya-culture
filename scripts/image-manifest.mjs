import fs from "node:fs";
import path from "node:path";
const dir = "public/images";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".jpg"));
const out = {};
for (const f of files) {
  const b = fs.readFileSync(path.join(dir, f));
  let i = 2, w = 0, h = 0;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break;
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  out["/images/" + f] = { w, h, r: +(w / h).toFixed(4), o: w >= h ? "l" : "p" };
}
const ts = `/* eslint-disable */\n/**\n * Dimensi asli setiap foto, dibaca dari berkas JPEG saat build.\n * Dipakai untuk mempertahankan rasio asli foto: foto potret tetap\n * potret, foto lebar tetap lebar. Memaksa semua foto ke satu rasio\n * membuat koleksi ini terlihat seperti template.\n *\n * DIHASILKAN oleh scripts/image-manifest.mjs\n */\nexport const FOTO = ${JSON.stringify(out, null, 2)} as const;\n\nexport type SrcFoto = keyof typeof FOTO;\n\nexport function rasio(src: string): number {\n  const f = (FOTO as Record<string, { r: number }>)[src];\n  return f ? f.r : 1.5;\n}\n\nexport function potret(src: string): boolean {\n  const f = (FOTO as Record<string, { o: string }>)[src];\n  return f ? f.o === "p" : false;\n}\n`;
fs.writeFileSync("src/lib/foto.ts", ts);
console.log("foto.ts ditulis:", Object.keys(out).length, "berkas");
console.log("potret:", Object.values(out).filter(x=>x.o==="p").length, "| lanskap:", Object.values(out).filter(x=>x.o==="l").length);
