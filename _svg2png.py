import sys
from playwright.sync_api import sync_playwright

svg = open("_atlas_test.svg", encoding="utf-8").read()
html = "<html><body style='margin:0;background:#fff'>" + svg + "</body></html>"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 900, "height": 706})
    pg.set_content(html)
    pg.wait_for_timeout(400)
    pg.screenshot(path="_atlas_test.png", full_page=True)
    b.close()
print("ok")
