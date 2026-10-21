import pymupdf, os
d = pymupdf.open("guidebook_vibe_coding_competition_itfest_2026_11zon_1789113714150.pdf")
print("PAGES:", d.page_count)
os.makedirs("_gb", exist_ok=True)
for i, p in enumerate(d):
    pix = p.get_pixmap(dpi=110)
    pix.save(f"_gb/page{i+1:02d}.png")
print("rendered")
