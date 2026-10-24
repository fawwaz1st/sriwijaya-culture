"use client";

import { useEffect, useState } from "react";

/**
 * Tirai pembuka.
 *
 * Muncul sekali per sesi, bukan setiap navigasi. Tujuannya memberi
 * kesan arsip yang dibuka, bukan memperlambat pengunjung: seluruh
 * animasi selesai dalam 1,2 detik dan tirai menutupi layar hanya
 * selama 0,5 detik pertama.
 *
 * Kenapa perlu JavaScript sama sekali: menentukan "sekali per sesi"
 * butuh penyimpanan peramban. Tanpa itu, tirai akan muncul lagi setiap
 * kali pengunjung kembali ke beranda, dan itu mengganggu.
 *
 * Aturan yang dipegang:
 *   - Kalau pengunjung meminta gerak dikurangi, tirai tidak dirender.
 *   - Kalau sesi sudah pernah melihatnya, tirai tidak dirender.
 *   - Tirai tidak pernah menangkap klik (`pointer-events: none`).
 *   - Kalau JavaScript mati, tirai tidak pernah muncul (dirender
 *     sebagai null saat state awal).
 */
export function TiraiBuka() {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    /*
     * Penentuan apakah tirai perlu tampil dilakukan di dalam callback
     * asinkron, bukan langsung di badan effect.
     *
     * Aturan React: setState sinkron di badan effect memicu render
     * berantai, dan eslint menandainya sebagai kesalahan. Yang dipakai
     * di sini adalah `requestAnimationFrame`: nilainya ditetapkan satu
     * frame setelah mount, jadi render pertama tetap murni dan tidak
     * ada kedipan karena tirai muncul sebelum halaman siap.
     */
    let id = 0;

    id = requestAnimationFrame(() => {
      const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (kurangiGerak) return;

      let sudah = false;
      try {
        sudah = sessionStorage.getItem("sriwijaya-tirai") === "1";
      } catch {
        // Storage bisa diblokir (mode privat ketat). Kalau begitu, lebih
        // baik tidak menampilkan tirai daripada mengganggu setiap muat.
        return;
      }
      if (sudah) return;

      setTampil(true);
      try {
        sessionStorage.setItem("sriwijaya-tirai", "1");
      } catch {
        // Diabaikan: tirai tetap tampil sekali ini.
      }

      // Lepas dari DOM setelah animasi selesai supaya tidak ada lapisan
      // transparan yang tertinggal di atas halaman.
      window.setTimeout(() => setTampil(false), 1400);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  if (!tampil) return null;

  return (
    <div className="tirai-buka" aria-hidden="true">
      <div className="tirai-tanda">
        <svg viewBox="0 0 28 28" className="h-9 w-9" fill="none" aria-hidden="true">
          <path
            d="M2 17c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
            stroke="#d9a832"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 22c4 0 4-3.2 8-3.2s4 3.2 8 3.2 4-2.4 8-2.4"
            stroke="#f2efe8"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M14 4v8M10 7.5l4-3.5 4 3.5"
            stroke="#f2efe8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="tirai-garis" />
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.28em] text-terang-3">
          Sriwijaya Culture
        </span>
      </div>
    </div>
  );
}
