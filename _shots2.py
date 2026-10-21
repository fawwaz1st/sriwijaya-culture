import os, sys
from playwright.sync_api import sync_playwright

BASE = "file:///C:/laragon/www/apps/SriwijayaCulture/"
OUT = "_shots2"
os.makedirs(OUT, exist_ok=True)

PAGES = [
    ("index", "index.html"),
    ("destinasi", "destinasi.html"),
    ("umkm", "umkm.html"),
    ("artikel", "artikel.html"),
    ("tentang", "tentang.html"),
    ("metodologi", "metodologi.html"),
    ("akun", "akun.html"),
    ("admin", "admin.html"),
    ("detail-destinasi", "detail-destinasi.html?id=kampung-arab-al-munawar"),
    ("detail-umkm", "detail-umkm.html"),
    ("detail-artikel", "detail-artikel.html"),
]

VPS = [("d", 1440, 900), ("t", 820, 900), ("m", 390, 844)]

errs_all = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for tag, w, h in VPS:
        pg = b.new_page(viewport={"width": w, "height": h})
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        for name, f in PAGES:
            errs.clear()
            pg.goto(BASE + f, wait_until="load")
            pg.wait_for_timeout(600)
            # scroll agar reveal terpicu; scroll-behavior smooth dimatikan
            # supaya window.scrollTo langsung sampai, bukan dianimasikan
            pg.evaluate("""async () => {
              document.documentElement.style.scrollBehavior = 'auto';
              const step = window.innerHeight * 0.6;
              for (let y = 0; y <= document.body.scrollHeight; y += step) {
                window.scrollTo(0, y);
                await new Promise(r => setTimeout(r, 110));
              }
              window.scrollTo(0, document.body.scrollHeight);
              await new Promise(r => setTimeout(r, 250));
              window.scrollTo(0, 0);
              await new Promise(r => setTimeout(r, 150));
            }""")
            pg.wait_for_timeout(400)
            hidden = pg.evaluate("document.querySelectorAll('.reveal:not(.is-visible)').length")
            ov = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            pg.screenshot(path=f"{OUT}/{name}-{tag}-full.png", full_page=True)
            pg.screenshot(path=f"{OUT}/{name}-{tag}-top.png")
            if errs:
                errs_all.append((f, tag, errs[:3]))
            print(f"{tag} {name} overflow={ov} err={len(errs)} revealHidden={hidden}")
        pg.close()
    b.close()

print("\n=== ERROR ===")
if errs_all:
    for f, tag, e in errs_all:
        print(f, tag, e)
else:
    print("tidak ada")
