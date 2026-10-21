import Link from "next/link";
import { Tombol } from "@/components/ui";

export default function TidakDitemukan() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[1600px] flex-col justify-center px-5 py-28 sm:px-8 lg:px-12">
      <p className="meta-emas">404</p>
      <h1 className="display mt-3 max-w-[18ch] text-[clamp(2.5rem,7vw,5rem)] text-terang">
        Halaman ini tidak ada di arsip.
      </h1>
      <p className="baca-malam mt-4 max-w-[50ch]">
        Mungkin tautannya salah ketik, atau rekaman ini memang belum kami susun.
        Dua tempat paling berguna untuk melanjutkan ada di bawah.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Tombol href="/destinasi" panah>
          Katalog destinasi
        </Tombol>
        <Tombol href="/" varian="garis">
          Kembali ke beranda
        </Tombol>
      </div>
      <p className="mt-8 text-[0.8125rem] text-terang-3">
        Kalau kamu yakin tautan ini seharusnya ada,{" "}
        <Link href="/tentang" className="tautan font-medium text-terang">
          beri tahu tim
        </Link>
        .
      </p>
    </div>
  );
}
