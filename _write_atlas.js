// Tulis js/data-atlas.js final dari _musi_svg.json.
const fs = require("fs");
const d = JSON.parse(fs.readFileSync("_musi_svg.json", "utf8"));

const clsLabel = { trunk: "trunk", primary: "primary", secondary: "secondary" };
const jalan = d.roads.map((r) => ({ cls: r.cls, d: r.d }));
const sungai = d.rivers.map((r) => ({ nama: r.name, d: r.d }));

const header = `/* ============================================================
   data-atlas.js - geometri peta Kota Palembang

   Data diambil dari OpenStreetMap (lisensi ODbL), lalu disederhanakan
   dengan Douglas-Peucker supaya muat dalam berkas tanpa server.

   Filosofi: peta ini bukan ilustrasi dekoratif. Sungai dan jalan
   digambar dari koordinat asli, jadi posisinya jujur. Destinasi
   tanpa koordinat terverifikasi tidak digambar.

   Sumber: OpenStreetMap contributors, diakses 20 Oktober 2026.
   ============================================================ */
window.SC = window.SC || {};

SC.ATLAS = {
  viewBox: "${d.viewBox}",
  width: ${d.width},
  height: ${d.height},
  roi: { minLat: ${d.roi.minLat}, maxLat: ${d.roi.maxLat}, minLon: ${d.roi.minLon}, maxLon: ${d.roi.maxLon} },
  pad: ${d.pad},
  spanLon: ${d.spanLon},
  spanLat: ${d.spanLat},

  /* jalan utama: tekstur plan kota, digambar di bawah sungai */
  jalan: [
${jalan.map((r) => `    { cls: "${r.cls}", d: "${r.d}" }`).join(",\n")}
  ],

  /* sungai */
  sungai: [
${sungai.map((r) => `    { nama: ${JSON.stringify(r.nama)}, d: "${r.d}" }`).join(",\n")}
  ]
};
`;

fs.writeFileSync("js/data-atlas.js", header);
console.log("js/data-atlas.js ditulis:", header.length, "bytes");
console.log("jalan:", jalan.length, "sungai:", sungai.length);
