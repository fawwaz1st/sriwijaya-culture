/**
 * Uji API asisten langsung: kirim pertanyaan nyata dan periksa header
 * mode yang dipakai, untuk memastikan model (bukan fallback) yang menjawab.
 */
const BASE = process.env.BASE_URL || "http://localhost:3100";

const PERTANYAAN = [
  "Apa yang membedakan Jembatan Ampera dari jembatan lain?",
  "Siapa presiden pertama Indonesia?",
  "Di mana saya bisa membeli songket asli?",
];

for (const q of PERTANYAAN) {
  const t0 = Date.now();
  try {
    const res = await fetch(BASE + "/api/asisten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: q }] }],
      }),
    });
    const teks = await res.text();
    const ms = Date.now() - t0;
    console.log(`\nQ: ${q}`);
    console.log(`   status=${res.status} mode=${res.headers.get("x-sari-mode")} sumber=${res.headers.get("x-sari-sumber")} ${ms}ms`);
    console.log(`   A: ${teks.replace(/\s+/g, " ").slice(0, 240)}`);
  } catch (e) {
    console.log(`\nQ: ${q}\n   GAGAL: ${e.message.slice(0, 100)}`);
  }
}
