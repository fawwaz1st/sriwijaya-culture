import pymupdf
d = pymupdf.open("guidebook_vibe_coding_competition_itfest_2026_11zon_1789113714150.pdf")
out=[]
for i,p in enumerate(d):
    out.append(f"===== PAGE {i+1} =====")
    out.append(p.get_text("text"))
open("_gb_text.txt","w",encoding="utf-8").write("\n".join(out))
print("ok", d.page_count)
