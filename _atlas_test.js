// Render SVG uji untuk memeriksa hasil secara visual.
const fs = require("fs");
const d = JSON.parse(fs.readFileSync("_musi_svg.json", "utf8"));
// Muat data destinasi: file itu memakai window.SC dan SC global.
global.window = global;
require("./js/data-destinasi.js");
const DEST = global.SC.DESTINASI;
const ROI = d.roi, PAD = d.pad, spanLon = d.spanLon, spanLat = d.spanLat;
const W = d.width, H = d.height;
const sx = (lon) => PAD + ((lon - ROI.minLon) / spanLon) * (W - PAD * 2);
const sy = (lat) => PAD + ((ROI.maxLat - lat) / spanLat) * (H - PAD * 2);

let pins = "";
for (const x of DEST) {
  if (!x.koordinat) continue;
  const cx = sx(x.koordinat.lng).toFixed(1), cy = sy(x.koordinat.lat).toFixed(1);
  pins += `<circle cx="${cx}" cy="${cy}" r="5" fill="#d4a017" stroke="#0d2b1e" stroke-width="1.6"/>`;
  pins += `<text x="${cx}" y="${(cy - 9).toFixed(1)}" font-size="8" fill="#0d2b1e" text-anchor="middle">${x.nama}</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${d.viewBox}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#faf7f0"/>
<g stroke="#ded5c0" fill="none" stroke-linecap="round">
${d.roads.map((r) => `<path d="${r.d}" stroke-width="${r.w}"/>`).join("\n")}
</g>
<g stroke="#8fa8c8" fill="none" stroke-linecap="round" stroke-linejoin="round">
${d.rivers.map((r) => `<path d="${r.d}" stroke-width="9"/>`).join("\n")}
</g>
${pins}
</svg>`;
fs.writeFileSync("_atlas_test.svg", svg);
console.log("SVG bytes:", svg.length);
console.log("pins:", pins.split("<circle").length - 1);
