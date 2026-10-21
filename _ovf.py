from playwright.sync_api import sync_playwright
BASE = "file:///C:/laragon/www/apps/SriwijayaCulture/index.html"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844})
    pg.goto(BASE, wait_until="load")
    pg.wait_for_timeout(700)
    bad = pg.evaluate("""() => {
      const w = document.documentElement.clientWidth;
      const clipped = el => {
        let n = el.parentElement;
        while (n && n !== document.body) {
          const o = getComputedStyle(n);
          if (o.overflowX !== 'visible' || o.overflow !== 'visible') return true;
          n = n.parentElement;
        }
        return false;
      };
      const out = [];
      document.querySelectorAll("body *").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.right > w + 1 && !clipped(el)) {
          out.push(`${el.tagName}.${el.className||''}#${el.id||''} left=${Math.round(r.left)} right=${Math.round(r.right)} w=${Math.round(r.width)} txt=${(el.textContent||'').trim().slice(0,40)}`);
        }
      });
      return {sw: document.documentElement.scrollWidth, cw: w, out: out.slice(0, 25)};
    }""")
    print("scrollWidth", bad["sw"], "clientWidth", bad["cw"])
    for x in bad["out"]: print(x)
    b.close()
