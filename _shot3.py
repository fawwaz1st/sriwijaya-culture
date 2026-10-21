import os
from playwright.sync_api import sync_playwright
BASE = "file:///C:/laragon/www/apps/SriwijayaCulture/"
OUT = "_shots3"
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE + "index.html", wait_until="load")
    pg.wait_for_timeout(400)
    pg.evaluate("""async () => {
      const step = window.innerHeight * 0.6;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 110));
      }
      window.scrollTo(0, 0);
    }""")
    pg.wait_for_timeout(700)
    print("visible:", pg.evaluate("document.querySelectorAll('.reveal.is-visible').length"),
          "total:", pg.evaluate("document.querySelectorAll('.reveal').length"))
    print("errors:", errs)
    pg.screenshot(path=f"{OUT}/index-full.png", full_page=True)
    b.close()
