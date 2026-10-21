from playwright.sync_api import sync_playwright
BASE = "file:///C:/laragon/www/apps/SriwijayaCulture/index.html"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append((m.type, m.text)))
    pg.on("pageerror", lambda e: errs.append(("pageerror", str(e))))
    pg.goto(BASE, wait_until="load")
    pg.wait_for_timeout(800)
    print("konsole:", errs)
    for sel in ["#heroStats", "#marqueeArsip", "#atlasPeta", "#atlasIndeks", "#statGrid",
                "#meterVerifikasi", "#donutKategori", "#timelineSejarah", "#barKategori",
                "#mosaicDestinasi", "#gridArtikelHome", "#gridUmkmHome"]:
        info = pg.evaluate("""(s) => {
          const e = document.querySelector(s);
          if (!e) return "MISSING";
          const r = e.getBoundingClientRect();
          return `len=${e.innerHTML.length} h=${Math.round(r.height)} vis=${getComputedStyle(e).visibility} op=${getComputedStyle(e).opacity} cls=${e.className}`;
        }""", sel)
        print(f"{sel:22} {info}")
    b.close()
