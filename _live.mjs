import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
for (const [name, url] of [["live-beranda","/"],["live-destinasi","/destinasi"],["live-detail","/destinasi/jembatan-ampera"],["live-metodologi","/metodologi"]]) {
  await p.goto("https://sriwijaya-culture.vercel.app" + url, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `_shot/${name}.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`${name}: overflow=${ov}`);
}
console.log("errors:", errs.length);
await b.close();
