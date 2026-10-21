// OSM -> SVG atlas Kota Palembang.
//
//  1. Potong way sungai ke wilayah interest (ROI) yang mencakup
//     seluruh destinasi, lalu ambil sebagai garis tengah.
//  2. Ambil jalan utama (trunk/primary/secondary) sebagai tekstur
//     plan kota, digambar tipis di belakang sungai.
//  3. Konversi lon/lat ke viewBox SVG.
//
// Semua koordinat berasal dari OpenStreetMap (ODbL).
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("_osm_map.json", "utf8"));
const nodes = data.nodes, ways = data.ways;

// ROI: mencakup 9 destinasi + margin
const ROI = { minLat: -3.026, maxLat: -2.977, minLon: 104.723, maxLon: 104.787 };
const dalam = (n) => n.lat >= ROI.minLat && n.lat <= ROI.maxLat && n.lon >= ROI.minLon && n.lon <= ROI.maxLon;

console.log("way total:", Object.keys(ways).length);

const W = 1000, PAD = 40;
const spanLon = ROI.maxLon - ROI.minLon, spanLat = ROI.maxLat - ROI.minLat;
const H = Math.round((W - PAD * 2) * spanLat / spanLon + PAD * 2);
const sx = (lon) => PAD + ((lon - ROI.minLon) / spanLon) * (W - PAD * 2);
const sy = (lat) => PAD + ((ROI.maxLat - lat) / spanLat) * (H - PAD * 2);
console.log("viewBox 0 0", W, H, "rasio", (H / W).toFixed(3));

function potong(nodeIds) {
  let out = [], run = [];
  for (const nid of nodeIds) {
    const n = nodes[nid];
    if (!n) continue;
    if (dalam(n)) run.push(nid);
    else { if (run.length > 1) out.push(run); run = []; }
  }
  if (run.length > 1) out.push(run);
  return out;
}

/* Douglas-Peucker: buang titik yang jauh dari garis lurus antara
   dua ujung, rekursif. Unlike uji "segitiga pipih" yang lebih jelas
   memangkas lekukan, DP mempertahankan bentuk kurba. */
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    if (j <= i + 1) continue;
    const [x1, y1] = pts[i], [x2, y2] = pts[j];
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    let maxD = -1, maxK = -1;
    for (let k = i + 1; k < j; k++) {
      const [xk, yk] = pts[k];
      const d = Math.abs(dy * xk - dx * yk + x2 * y1 - y2 * x1) / len;
      if (d > maxD) { maxD = d; maxK = k; }
    }
    if (maxD > tol) {
      keep[maxK] = 1;
      stack.push([i, maxK], [maxK, j]);
    }
  }
  const out = [];
  for (let i = 0; i < pts.length; i++) if (keep[i]) out.push(i);
  return out;
}

/* Sederhanakan polyline di ruang piksel dengan Douglas-Peucker. */
function sederhanakan(seg, tolPx) {
  if (seg.length <= 2) return seg;
  const px = seg.map((nid) => {
    const n = nodes[nid];
    return [sx(n.lon), sy(n.lat)];
  });
  const idx = dp(px, tolPx);
  return idx.map((k) => seg[k]);
}

const rivers = [];
for (const id in ways) {
  const w = ways[id];
  if (!w.tags || w.tags.waterway !== "river") continue;
  for (const seg of potong((w.nodes || []).filter((nid) => nodes[nid]))) {
    const simple = sederhanakan(seg, 0.9);
    if (simple.length < 2) continue;
    const d = simple.map((nid, i) => {
      const n = nodes[nid];
      return (i ? "L" : "M") + sx(n.lon).toFixed(0) + " " + sy(n.lat).toFixed(0);
    }).join(" ");
    rivers.push({ name: w.tags.name || "Sungai", d, pts: simple.length });
  }
}
console.log("segmen sungai:", rivers.length, rivers.map((r) => r.name + "(" + r.pts + ")").join(", "));

const JALAN = { trunk: 1.4, primary: 1.0, secondary: .6 };
const roads = [];
for (const id in ways) {
  const w = ways[id];
  if (!w.tags || !JALAN[w.tags.highway]) continue;
  const ns = (w.nodes || []).filter((nid) => nodes[nid]);
  if (ns.length < 2) continue;
  // Ambil hanya rentai berurutan yang di dalam ROI. Memfilter per node
  // akan memutus jalan jadi lompatan panjang, jadi potong per rentai.
  const runs = [];
  let run = [];
  for (const nid of ns) {
    if (dalam(nodes[nid])) run.push(nid);
    else { if (run.length > 1) runs.push(run); run = []; }
  }
  if (run.length > 1) runs.push(run);
  for (const seg of runs) {
    const simple = sederhanakan(seg, 0.35);
    if (simple.length < 2) continue;
    const d = simple.map((nid, i) => {
      const n = nodes[nid];
      return (i ? "L" : "M") + sx(n.lon).toFixed(0) + " " + sy(n.lat).toFixed(0);
    }).join(" ");
    roads.push({ d, w: JALAN[w.tags.highway], cls: w.tags.highway });
  }
}
console.log("segmen jalan:", roads.length);
const perClass = {};
roads.forEach((r) => { perClass[r.cls] = (perClass[r.cls] || 0) + 1; });
console.log("per kelas:", JSON.stringify(perClass));

let labelAt = null;
const musi = rivers.find((r) => r.name === "Sungai Musi");
if (musi) {
  const m = musi.d.match(/M([\d.]+) ([\d.]+)/);
  if (m) labelAt = { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

fs.writeFileSync("_musi_svg.json", JSON.stringify({
  viewBox: "0 0 " + W + " " + H,
  width: W, height: H,
  roi: ROI, pad: PAD, spanLon, spanLat,
  rivers, roads, labelAt,
}));
console.log("\ntersimpan _musi_svg.json");
console.log("contoh jalan:", roads[0] ? roads[0].d.slice(0, 110) : "-");
console.log("bytes:", JSON.stringify({ rivers, roads }).length);
