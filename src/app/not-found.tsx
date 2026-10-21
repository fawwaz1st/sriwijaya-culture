import Link from "next/link";
import { Tombol } from "@/components/ui";

export default function TidakDitemukan() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-10">
      <p className="label-arsip">
        <span className="mr-2 text-kunyit-ink">404</span>Lembar tidak ditemukan
      </p>
      <h1 className="judul-arsip mt-3 max-w-[22ch] text-[clamp(2.5rem,6vw,4.5rem)]">
        Halaman ini tidak ada di arsip.
      </h1>
      <p className="prosa mt-4 max-w-[52ch]">
        Mungkin tautannya salah ketik, atau rekaman ini memang belum kami
        susun. Dua tempat paling berguna untuk melanjutkan ada di bawah.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Tombol href="/destinasi" panah>
          Katalog destinasi
        </Tombol>
        <Tombol href="/" varian="garis">
          Kembali ke beranda
        </Tombol>
      </div>
      <p className="mt-8 text-[0.8125rem] text-tinta-3">
        Kalau kamu yakin tautan ini seharusnya ada,{" "}
        <Link href="/tentang" className="tautan-arsip font-medium text-tinta">
          beri tahu tim
        </Link>
        .
      </p>
    </div>
  );
}
