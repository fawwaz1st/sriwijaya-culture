/**
 * Pemeriksaan lingkungan sebelum deploy.
 *
 * Menjawab satu pertanyaan: apakah situs ini akan berfungsi saat juri
 * membukanya? Setiap pemeriksaan punya status lulus/gagal yang jelas.
 *
 * Pakai: node scripts/check-env.mjs [baseUrl]
 */
const BASE = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";

const hasil = [];
const catat = (nama, lulus, detail) => {
 hasil.push({ nama, lulus, detail });
 console.log(`${lulus ? "LULUS" : "GAGAL"} ${nama}${detail ? ", " + detail : ""}`);
};

/* --- 1. Bentuk kunci API (kalau ada) -------------------------------------- */
const or = process.env.OPENROUTER_API_KEY;
if (or) {
 const bentukBenar = /^sk-or-v1-[a-f0-9]{64}$/.test(or);
 catat(
 "Bentuk OPENROUTER_API_KEY",
 bentukBenar,
 bentukBenar ? "format valid" : `format tidak valid (prefix "${or.slice(0, 9)}", panjang ${or.length})`,
 );
} else {
 catat("OPENROUTER_API_KEY", true, "tidak diisi, akan memakai rantai cadangan");
}

/* --- 2. Rute utama merespons -------------------------------------------- */
const rute = ["/", "/destinasi", "/umkm", "/artikel", "/asisten", "/metodologi", "/tentang"];
for (const r of rute) {
 try {
 const res = await fetch(BASE + r, { redirect: "follow" });
 catat(`Rute ${r}`, res.status === 200, `HTTP ${res.status}`);
 } catch (e) {
 catat(`Rute ${r}`, false, e.message.slice(0, 80));
 }
}

/* --- 3. Asisten menjawab dan menyebut mode ------------------------------ */
try {
 const res = await fetch(BASE + "/api/asisten", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 messages: [
 {
 id: "cek-1",
 role: "user",
 parts: [{ type: "text", text: "Apa itu Jembatan Ampera?" }],
 },
 ],
 }),
 });
 const mode = res.headers.get("x-sari-mode");
 const teks = await res.text();
 const adaJawaban = teks.length > 40 && !teks.includes('"type":"error"');
 catat(
 "Asisten menjawab",
 res.status === 200 && adaJawaban,
 `HTTP ${res.status} · mode=${mode} · ${teks.length} byte`,
 );
} catch (e) {
 catat("Asisten menjawab", false, e.message.slice(0, 80));
}

/* --- 4. Berkas penting ada ---------------------------------------------- */
for (const f of ["/images/ampera-1.jpg", "/sitemap.xml", "/robots.txt", "/opengraph-image"]) {
 try {
 const res = await fetch(BASE + f);
 catat(`Aset ${f}`, res.ok, `HTTP ${res.status}`);
 } catch (e) {
 catat(`Aset ${f}`, false, e.message.slice(0, 60));
 }
}

const gagal = hasil.filter((h) => !h.lulus);
console.log(`\n${hasil.length - gagal.length}/${hasil.length} lulus`);
process.exitCode = gagal.length ? 1 : 0;
