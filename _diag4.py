from playwright.sync_api import sync_playwright
BASE = "file:///C:/laragon/www/apps/SriwijayaCulture/index.html"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    errs = []
    pg.on("console", lambda m: errs.append((m.type, m.text)))
    pg.on("pageerror", lambda e: errs.append(("pageerror", str(e))))
    pg.goto(BASE, wait_until="load")
    pg.wait_for_timeout(500)
    print("errs:", errs)
    print("refresh?", pg.evaluate("typeof SC._revealRefresh"))
    print("reveal total:", pg.evaluate("document.querySelectorAll('.reveal').length"))
    print("visible:", pg.evaluate("document.querySelectorAll('.reveal.is-visible').length"))
    # scroll
    pg.evaluate("""async () => {
      const step = window.innerHeight * 0.6;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 120));
      }
    }""")
    pg.wait_for_timeout(800)
    print("after scroll visible:", pg.evaluate("document.querySelectorAll('.reveal.is-visible').length"))
    print("still hidden:", pg.evaluate("""Array.from(document.querySelectorAll('.reveal:not(.is-visible)')).map(e=>e.tagName+'.'+e.className+'#'+(e.id||''))"""))
    print("body scrollHeight:", pg.evaluate("document.body.scrollHeight"))
    b.close()
