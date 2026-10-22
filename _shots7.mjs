import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3100";
fs.mkdirSync("_shots7", { recursive: true });
const browser = await chromium.launch();

const tugas = [
  { nama: "beranda", url: "/", full: false },
  { nama: "destinasi", url: "/destinasi", full: false },
  { nama: "detail-destinasi", url: "/destinasi/jembatan-ampera", full: false },
  { nama: "umkm", url: "/umkm", full: false },
  { nama: "asisten", url: "/asisten", full: false },
];

for (const t of tugas) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto(BASE + t.url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `_shots7/${t.nama}.png` });
  await page.close();
  console.log("ok", t.nama);
}
await browser.close();
