/* ============================================================
   main.js - inti website Sriwijaya Culture
   Berisi: utilitas, tema terang/gelap, komponen navbar & footer,
   menu mobile, animasi reveal saat di-scroll, dan kerangka
   fitur akun.
   Tidak memerlukan Node.js, framework, maupun server.
   ============================================================ */
(function () {
  "use strict";

  window.SC = window.SC || {};

  /* ---------------- Utilitas ---------------- */

  var SC = window.SC;

  SC.util = {
    qs: function (sel, root) { return (root || document).querySelector(sel); },
    qsa: function (sel, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    },
    param: function (name, fallback) {
      var v = new URLSearchParams(window.location.search).get(name);
      return (v === null || v === "") ? (fallback === undefined ? null : fallback) : v;
    },
    /* Escape dipakai setiap kali data dimasukkan ke innerHTML.
       Data di repo ini kita tulis sendiri, tetapi setiap kali konten
       datang dari input pengguna (pencarian, nama akun) tetap harus
       di-escape supaya tidak bisa menyuntikkan HTML. */
    esc: function (s) {
      if (s === null || s === undefined) return "";
      return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    norm: function (s) {
      return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
    },
    bulanID: ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
              "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    tanggalID: function (iso) {
      if (!iso) return "";
      var p = String(iso).split("-");
      if (p.length !== 3) return iso;
      return parseInt(p[2], 10) + " " + SC.util.bulanID[parseInt(p[1], 10) - 1] + " " + p[0];
    },
    rupiah: function (n) {
      if (typeof n !== "number" || !isFinite(n)) return null;
      return "Rp" + n.toLocaleString("id-ID");
    },
    /* Batasi panjang input pengguna supaya tidak ada field raksasa. */
    clampText: function (s, max) {
      s = String(s === null || s === undefined ? "" : s);
      max = max || 120;
      return s.length > max ? s.slice(0, max) : s;
    },
    debounce: function (fn, wait) {
      var t = null;
      return function () {
        var args = arguments, self = this;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(self, args); }, wait || 160);
      };
    },
    mapsLink: function (item) {
      var q = item.mapsQuery || item.nama || item.judul || "";
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
    },
    ruteLink: function (item) {
      var q = item.mapsQuery || item.nama || "";
      return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
    },
    mapsEmbed: function (item) {
      if (!item.koordinat) return null;
      var lat = item.koordinat.lat, lng = item.koordinat.lng;
      var d = 0.006;
      var bbox = [lng - d, lat - d, lng + d, lat + d].map(function (n) { return n.toFixed(5); }).join("%2C");
      return "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox + "&layer=mapnik&marker=" +
        lat.toFixed(5) + "%2C" + lng.toFixed(5);
    },
    /* Cari data berdasarkan id, dipakai semua halaman detail. */
    findDestinasi: function (id) {
      return (SC.DESTINASI || []).filter(function (d) { return d.id === id; })[0] || null;
    },
    findUMKM: function (id) {
      return (SC.UMKM || []).filter(function (u) { return u.id === id; })[0] || null;
    },
    findArtikel: function (id) {
      return (SC.ARTIKEL || []).filter(function (a) { return a.id === id; })[0] || null;
    }
  };

  var U = SC.util;

  /* ---------------- Tema ---------------- */

  var TEMA_KEY = "sc-tema";

  SC.tema = {
    ambil: function () {
      try { return localStorage.getItem(TEMA_KEY) || ""; } catch (e) { return ""; }
    },
    terapkan: function (mode, simpan) {
      var root = document.documentElement;
      if (mode === "auto") {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", mode);
      }
      if (simpan) {
        try {
          if (mode === "auto") localStorage.removeItem(TEMA_KEY);
          else localStorage.setItem(TEMA_KEY, mode);
        } catch (e) { /* localStorage bisa diblokir, abaikan */ }
      }
      SC.util.qsa("[data-theme-toggle]").forEach(function (b) {
        b.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
        b.setAttribute("title", mode === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap");
      });
    },
    aktif: function () {
      var saved = SC.tema.ambil();
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    toggle: function () {
      var next = SC.tema.aktif() === "dark" ? "light" : "dark";
      SC.tema.terapkan(next, true);
    },
    init: function () {
      var saved = SC.tema.ambil();
      if (saved) SC.tema.terapkan(saved, false);
      if (window.matchMedia) {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        var handler = function () { if (!SC.tema.ambil()) SC.tema.terapkan("auto", false); };
        if (mq.addEventListener) mq.addEventListener("change", handler);
        else if (mq.addListener) mq.addListener(handler);
      }
    }
  };

  /* ---------------- Ikon SVG inline (bukan emoji) ---------------- */

  SC.ikon = {
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c1.2-3.6 3.8-5.4 7-5.4S17.8 16.4 19 20"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a7.5 7.5 0 0 1-7.5 7.5H8l-4 3v-4.6A7.5 7.5 0 0 1 4 12a7.5 7.5 0 0 1 7.5-7.5h1A7.5 7.5 0 0 1 20 12z"/><path d="M9 11h6M9 14.5h4"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6.5 16-2.5-6z"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ---------------- Struktur navigasi (satu sumber) ---------------- */

  SC.NAV = [
    { label: "Beranda", href: "index.html" },
    { label: "Destinasi Wisata", href: "destinasi.html" },
    { label: "Direktori UMKM", href: "umkm.html" },
    { label: "Artikel Sejarah & Budaya", href: "artikel.html" },
    { label: "Tentang Kami", href: "tentang.html" }
  ];

  function navItemHTML(item, current) {
    var aktif = current === item.href ? ' aria-current="page"' : "";
    return '<li><a href="' + item.href + '"' + aktif + ">" + U.esc(item.label) + "</a></li>";
  }

  /* ---------------- Render navbar ---------------- */

  function renderNav(mount, current) {
    var akun = SC.akun ? SC.akun.sesi() : null;

    var links = SC.NAV.map(function (i) { return navItemHTML(i, current); }).join("");

    var userBlock;
    if (akun) {
      userBlock =
        '<a class="nav-user" href="akun.html" title="Buka halaman akun">' +
        '<span style="width:20px;height:20px;display:grid;place-items:center">' + SC.ikon.user + "</span>" +
        "<span>" + U.esc(akun.nama.split(" ")[0]) + "</span></a>";
    } else {
      userBlock = '<a class="btn btn-gold btn-sm" href="akun.html">Masuk</a>';
    }

    mount.className = "nav";
    mount.innerHTML =
      '<div class="nav-inner">' +
        '<a class="brand" href="index.html">' +
          '<span class="brand-badge" aria-hidden="true">SC</span>' +
          '<span class="brand-name">Sriwijaya Culture' +
            "<small>Palembang, Sumatera Selatan</small>" +
          "</span>" +
        "</a>" +
        '<nav aria-label="Navigasi utama" style="margin-left:auto">' +
          '<ul class="nav-links">' + links + "</ul>" +
        "</nav>" +
        '<div class="nav-actions">' +
          userBlock +
          '<button class="icon-btn" type="button" data-theme-toggle aria-pressed="false" title="Ganti tema">' +
            SC.ikon.moon +
          "</button>" +
          '<button class="icon-btn nav-burger" type="button" id="navBurger" aria-expanded="false" aria-controls="navDrawer" aria-label="Buka menu">' +
            SC.ikon.menu +
          "</button>" +
        "</div>" +
      "</div>" +
      '<div class="nav-drawer" id="navDrawer">' +
        '<ul>' + SC.NAV.map(function (i) { return navItemHTML(i, current); }).join("") +
          '<li><a href="akun.html">' + (akun ? "Akun Saya" : "Masuk / Daftar") + "</a></li>" +
        "</ul>" +
      "</div>";

    /* tombol tema */
    U.qsa("[data-theme-toggle]", mount).forEach(function (b) {
      b.innerHTML = SC.tema.aktif() === "dark" ? SC.ikon.sun : SC.ikon.moon;
      b.addEventListener("click", function () {
        SC.tema.toggle();
        b.innerHTML = SC.tema.aktif() === "dark" ? SC.ikon.sun : SC.ikon.moon;
      });
    });

    /* drawer mobile */
    var burger = U.qs("#navBurger", mount);
    var drawer = U.qs("#navDrawer", mount);
    function setDrawer(open) {
      drawer.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      burger.innerHTML = open ? SC.ikon.close : SC.ikon.menu;
    }
    burger.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("open"));
    });
    U.qsa("a", drawer).forEach(function (a) {
      a.addEventListener("click", function () { setDrawer(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        setDrawer(false);
        burger.focus();
      }
    });
    /* tutup drawer bila layar dibesarkan kembali */
    window.addEventListener("resize", U.debounce(function () {
      if (window.innerWidth > 820 && drawer.classList.contains("open")) setDrawer(false);
    }, 200));
  }

  /* ---------------- Render footer ---------------- */

  function renderFooter(mount) {
    var tahun = new Date().getFullYear();
    mount.className = "footer";
    mount.innerHTML =
      '<div class="footer-inner">' +
        "<div>" +
          '<a class="brand" href="index.html" style="margin-bottom:12px">' +
            '<span class="brand-badge" aria-hidden="true">SC</span>' +
            '<span class="brand-name" style="color:#f2ead8">Sriwijaya Culture' +
              '<small style="color:#d4a017">Palembang, Sumatera Selatan</small>' +
            "</span>" +
          "</a>" +
          "<p>Sriwijaya Culture adalah platform informasi wisata, budaya, dan usaha lokal Kota Palembang. " +
          "Seluruh data disertai sumber dan ditandai bila belum terverifikasi.</p>" +
        "</div>" +
        "<div>" +
          "<h4>Wilayah Layanan</h4>" +
          "<p>Kota Palembang, Sumatera Selatan. Pengembangan berikutnya dapat mencakup kabupaten lain di Provinsi Sumatera Selatan.</p>" +
        "</div>" +
        "<div>" +
          "<h4>Tentang Situs</h4>" +
          "<ul>" +
            '<li><a href="tentang.html">Tentang Kami</a></li>' +
            '<li><a href="metodologi.html">Metodologi &amp; Sumber Data</a></li>' +
            '<li><a href="akun.html">Akun</a></li>' +
            '<li><a href="admin.html">Ringkasan Konten</a></li>' +
          "</ul>" +
        "</div>" +
      "</div>" +
      '<div class="footer-bottom">' +
        "<span>&copy; " + tahun + " Sriwijaya Culture. Dibuat untuk keperluan edukasi dan kompetisi.</span>" +
        "<span>Foto: Wikimedia Commons, lisensi bebas. Lihat <a href=\"metodologi.html#kredit\">kredit gambar</a>.</span>" +
      "</div>";
  }

  /* ---------------- Reveal saat scroll ---------------- */

  var revealObserver = null;

  function tanpakanReveal(items) {
    U.qsa(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Memakai satu observer untuk seluruh halaman. Daftar kartu yang
     dirender ulang setelah pencarian cukup memanggil SC._revealRefresh()
     agar kartu baru ikut diamati, tanpa membuat observer baru. */
  function initReveal() {
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tanpakanReveal();
      SC._revealRefresh = function () { tanpakanReveal(); };
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    U.qsa(".reveal").forEach(function (el) { revealObserver.observe(el); });

    SC._revealRefresh = function () {
      U.qsa(".reveal:not(.is-visible)").forEach(function (el) {
        revealObserver.observe(el);
      });
    };
    SC.__revealAh = true;
  }

  /* ---------------- Cek tautan internal ---------------- */

  /* Dipakai halaman metodologi: laporkan tautan internal yang tidak
     punya target file. Menghindari tautan rusak tanpa perlu server. */
  SC.tautanInternal = function () {
    return U.qsa('a[href$=".html"]').map(function (a) {
      return { href: a.getAttribute("href"), teks: (a.textContent || "").trim() };
    });
  };

  /* ---------------- Boot ---------------- */

  /* Boot dipisah dari definisi supaya berkas lain dapat memuat
     main.js lebih dulu tanpa harus menunggu DOM. Setiap halaman
     memanggil SC.mulai() dari skrip terakhirnya, setelah seluruh
     modul fitur selesai dimuat. */
  SC.mulai = function () {
    SC.tema.init();

    if (!document.__scMulai) {
      document.__scMulai = true;
      initReveal();
    }

    var current = window.location.pathname.split("/").pop() || "index.html";
    var navMount = U.qs("#navMount");
    if (navMount) renderNav(navMount, current);

    var footMount = U.qs("#footerMount");
    if (footMount) renderFooter(footMount);

    if (SC.asisten && SC.asisten.mount) SC.asisten.mount();
  };

  /* Bila halaman lupa memanggil SC.mulai(), jalankan otomatis saat
     DOM siap supaya situs tetap berfungsi. */
  var sudahMulai = false;
  SC.mulaiSekali = function () {
    if (sudahMulai) return;
    sudahMulai = true;
    SC.mulai();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", SC.mulaiSekali);
  } else {
    SC.mulaiSekali();
  }
})();