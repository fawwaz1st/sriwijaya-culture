import type { Metadata } from "next";
import { PanelFavorit } from "@/components/panel-favorit";

export const metadata: Metadata = {
  title: "Favorit",
  description: "Daftar entri arsip yang Anda simpan di perangkat ini.",
};

export default function HalamanFavorit() {
  return (
    <div className="masuk-katalog mx-auto max-w-[1760px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header>
        <p className="meta-emas">Favorit</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h1 className="display max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)] text-terang">
            Yang Anda simpan.
          </h1>
          <p className="max-w-[42ch] pb-2 text-[0.875rem] leading-relaxed text-terang-2">
            Daftar ini tersimpan di perangkat ini. Tanpa akun, tanpa server,
            dan tanpa data palsu.
          </p>
        </div>
      </header>
      <PanelFavorit />
    </div>
  );
}
