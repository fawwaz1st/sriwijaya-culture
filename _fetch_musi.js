// Pengambil geometri Sungai Musi dari OpenStreetMap (Overpass).
// Dipakai sekali untuk membangun peta SVG statis di beranda.
// Ambil geometri Sungai Musi lewat API OSM resmi (bukan Overpass).
const fs = require("fs");
const UA = { "User-Agent": "SriwijayaCulture/1.0 (site build; contact via project repo)" };

async function json(url) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(url + " -> HTTP " + r.status);
  return r.json();
}

(async () => {
  const nom = await json(
    "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" +
      encodeURIComponent("Sungai Musi, Palembang")
  );
  console.log("nominatim:", nom.map((n) => [n.osm_type, n.osm_id, n.type, n.display_name.slice(0, 60)]));

  // Area padat kota, API OSM membatasi 50rb node per permintaan.
  // Jadi ambil per ubin (tile) kecil lalu gabungkan.
  const tiles = [
    ["104.755", "-2.998", "104.775", "-2.985"],  // muara / 16 Ilir
    ["104.770", "-2.988", "104.790", "-2.972"],  // Seberang Ulu II
    ["104.725", "-2.995", "104.745", "-2.975"],  // hulu / Gandus
    ["104.745", "-3.010", "104.765", "-2.995"],  // hilir
    ["104.705", "-3.020", "104.730", "-3.000"],  // hulu jauh
  ];
  const all = { nodes: {}, ways: {} };
  for (const t of tiles) {
    const url = "https://api.openstreetmap.org/api/0.6/map.json?bbox=" + t.join(",");
    const resp = await fetch(url, { headers: UA });
    if (!resp.ok) { console.log("tile", t.join(","), "HTTP", resp.status, (await resp.text()).slice(0, 120)); continue; }
    const d = await resp.json();
    let w = 0;
    for (const e of d.elements) {
      if (e.type === "node") all.nodes[e.id] = e;
      if (e.type === "way") { all.ways[e.id] = e; w++; }
    }
    console.log("tile", t.join(","), "->", Object.keys(all.nodes).length, "node,", w, "way kumulatif");
  }
  const riverWays = Object.values(all.ways).filter(
    (x) => x.tags && (x.tags.waterway === "river" || x.tags.waterway === "riverbank")
  );
  console.log("waterway ways:", riverWays.length);
  riverWays.forEach((w) => console.log("  way", w.id, JSON.stringify(w.tags.name || "-"), "nodes=" + (w.nodes || []).length));

  fs.writeFileSync("_osm_map.json", JSON.stringify({ nodes: all.nodes, ways: all.ways }));
  console.log("tersimpan _osm_map.json");
})().catch((e) => { console.log("ERR", e.message); process.exit(1); });
