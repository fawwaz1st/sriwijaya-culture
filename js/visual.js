/* ============================================================
   visual.js - pembuat visualisasi data (SVG murni, tanpa library)

   Prinsip: metadata adalah gambar. Tahun, koordinat, jumlah
   sumber, dan status verifikasi dirender sebagai elemen visual
   supaya pembaca bisa melihat pola, bukan cuma membaca paragraf.

   Semua fungsi mengembalikan string HTML yang sudah di-escape.
   ============================================================ */
(function () {
  "use strict";

  window.SC = window.SC || {};
  var SC = window.SC, U = SC.util;

  /* ---------- Palet kategori ---------- */
  /* Enam warna, tetap dalam satu keluarga (hijau-emas) supaya tidak
     terasa seperti palet acak. Kontras tiap warna terhadap teks
     terang sudah dihitung. */
  var WARNA_KATEGORI = {
    "Sejarah": "#8c4a2f",
    "Budaya":  "#a8741b",
    "Alam":    "#2a7a52",
    "Religi":  "#5b4a8c",
    "Edukasi": "#1f5c3d",
    "Kuliner": "#9c3b52"
  };

  SC.warnaKategori = function (k) { return WARNA_KATEGORI[k] || "#6b7a70"; };

  /* ---------- Peta atlas ---------- */

  /* Membangun peta SVG: sungai, jaringan jalan, lalu pin sadly
     untuk setiap Coordinat yang sudah diverifikasi. Titik yang
     belum terverifikasi tidak digambar, bukan digambar sebagai
     perkiraan. */
  SC.atlas = function (daftar, opsi) {
    opsi = opsi || {};
    var A = SC.ATLAS;
    if (!A) return "";

    var pad = A.pad, spanLon = A.spanLon, spanLat = A.spanLat;
    function sx(lon) { return pad + ((lon - A.roi.minLon) / spanLon) * (A.width - pad * 2); }
    function sy(lat) { return pad + ((A.roi.maxLat - lat) / spanLat) * (A.height - pad * 2); }

    /* Jalan: trunk tebal, primary sedang, secondary tipis.
       Semua abstraksi, bukan representasi presisi. */
    var jalanSvg = A.jalan.map(function (r) {
      var cls = r.cls === "trunk" ? "atlas-road trunk" : (r.cls === "primary" ? "atlas-road primary" : "atlas-road secondary");
      return '<path class="' + cls + '" d="' + r.d + '"/>';
    }).join("");

    /* Sungai: lebar, di atas jalan, dengan label miring mengikuti arah */
    var sungaiSvg = A.sungai.map(function (s) {
      var label = s.nama === "Sungai Musi"
        ? '<text class="atlas-river-label" x="470" y="300" transform="rotate(-46 470 300)">Sungai Musi</text>'
        : (s.nama === "Sungai Bendem"
          ? '<text class="atlas-river-label" x="712" y="240" transform="rotate(72 712 240)">Sungai Bendem</text>'
          : "");
      return '<g class="atlas-sungai"><path d="' + s.d + '"/>' + label + "</g>";
    }).join("");

    /* Pin: nomor urut, bukan nama panjang. Nama lengkap ada di
       daftar indeks di samping peta. Ini mencegah label bertumpuk
       di kawasan Bukit Kecil yang punya empat destinasi berdekatan.
       Nomor dihitung berurutan hanya untuk yang punya koordinat,
       supaya tidak ada nomor yang melompat. */
    var pins = "";
    var terpetakan = [];
    var urut = 0;
    (daftar || []).forEach(function (item) {
      if (!item.koordinat) return;
      urut++;
      var x = sx(item.koordinat.lng), y = sy(item.koordinat.lat);
      var no = urut;
      terpetakan.push({ no: no, item: item, x: x, y: y });
      var kat = (item.kategori && item.kategori[0]) || "Sejarah";
      pins +=
        '<g class="atlas-pin" tabindex="0" role="link" ' +
        'aria-label="' + U.esc(item.nama) + ", " + U.esc(item.wilayah || "") + '" ' +
        'data-atlas-no="' + no + '" data-atlas-id="' + U.esc(item.id) + '">' +
          '<circle class="atlas-halo" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="15"/>' +
          '<circle class="atlas-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9" ' +
            'fill="' + SC.warnaKategori(kat) + '"/>' +
          '<text class="atlas-num" x="' + x.toFixed(1) + '" y="' + (y + 3.2).toFixed(1) + '">' + no + "</text>" +
        "</g>";
    });

    /* Penanda bahwa ada satu destinasi tanpa koordinat */
    var tanpaKoordinat = (daftar || []).filter(function (x) { return !x.koordinat; });

    var jml = terpetakan.length;
    var tanpa = tanpaKoordinat.length;
    var aria = "Peta Kota Palembang. " + jml + " destinasi terpetakan" +
      (tanpa ? ", " + tanpa + " belum punya koordinat sehingga tidak digambar." : ".");

    return '<div class="atlas-wrap">' +
      '<svg class="atlas" viewBox="' + A.viewBox + '" role="img" ' +
        'aria-label="' + U.esc(aria) + '">' +
        '<rect class="atlas-bg" x="0" y="0" width="' + A.width + '" height="' + A.height + '"/>' +
        '<g class="atlas-roads">' + jalanSvg + "</g>" +
        '<g class="atlas-rivers">' + sungaiSvg + "</g>" +
        '<g class="atlas-pins">' + pins + "</g>" +
      "</svg>" +
      '<div class="atlas-legend">' +
        '<span><i></i> Destinasi terpetakan</span>' +
        '<span><i class="ring"></i> Belum ada koordinat</span>' +
      "</div>" +
    "</div>";
  };

  /* Daftar indeks di samping peta: nama, wilayah, koordinat.
     Angka dan koordinat adalah data, bukan hiasan. */
  SC.atlasIndex = function (daftar) {
    if (!daftar || !daftar.length) return "";
    var urut = 0;
    var rows = daftar.map(function (item) {
      var no = "-";
      if (item.koordinat) { urut++; no = urut; }
      var kat = (item.kategori && item.kategori[0]) || "";
      var koord = item.koordinat
        ? item.koordinat.lat.toFixed(4) + ", " + item.koordinat.lng.toFixed(4)
        : "belum ada koordinat";
      return '<a href="detail-destinasi.html?id=' + U.esc(item.id) + '">' +
        "<b>" + U.esc(String(no)) + "</b>" +
        '<span class="atlas-nama">' + U.esc(item.nama) +
          '<i class="atlas-cat" style="--c:' + SC.warnaKategori(kat) + '"></i>' +
        "</span>" +
        '<i class="atlas-koord">' + U.esc(koord) + "</i>" +
      "</a>";
    }).join("");
    return '<div class="atlas-index">' + rows + "</div>";
  };

  /* ---------- Grafik batang horizontal ---------- */

  /* Data kategori yang paling banyak. Setiap batang bisa diklik
     untuk menyaring daftar. */
  SC.barChart = function (item, opsi) {
    opsi = opsi || {};
    var data = (item || []).slice().sort(function (a, b) { return b.n - a.n; });
    if (!data.length) return "";
    var maks = Math.max.apply(null, data.map(function (d) { return d.n; }));
    var tinggiBar = 26, jarak = 12, tinggi = data.length * (tinggiBar + jarak);
    var lebarLabel = opsi.lebarLabel || 132;
    var lebarNilai = 46;
    var lebarGambar = 620;

    var bars = data.map(function (d, i) {
      var w = Math.max(3, (d.n / maks) * (lebarGambar - lebarLabel - lebarNilai));
      var y = i * (tinggiBar + jarak);
      var kat = d.kategori || "";
      return '<g class="chart-row" data-chart-cat="' + U.esc(kat) + '">' +
        '<text class="chart-cat" x="0" y="' + (y + tinggiBar / 2 + 3.4) + '">' + U.esc(d.label) + "</text>" +
        '<rect class="chart-bar" data-grow="1" x="' + lebarLabel + '" y="' + y + '" ' +
          'width="' + w.toFixed(1) + '" height="' + tinggiBar + '" rx="2" ' +
          'fill="' + (d.warna || SC.warnaKategori(kat)) + '"/>' +
        '<text class="chart-value" x="' + (lebarLabel + w + 8).toFixed(1) + '" y="' + (y + tinggiBar / 2 + 3.6) + '">' +
          U.esc(String(d.n)) + "</text>" +
      "</g>";
    }).join("");

    return '<svg class="chart" viewBox="0 0 ' + lebarGambar + " " + tinggi + '" ' +
      'role="img" aria-label="' + U.esc(opsi.aria || "Diagram batang") + '">' +
      bars + "</svg>";
  };

  /* ---------- Donat (kategori porsi) ---------- */

  SC.donutChart = function (item, opsi) {
    opsi = opsi || {};
    var data = (item || []).filter(function (d) { return d.n > 0; });
    if (!data.length) return "";
    var total = data.reduce(function (a, d) { return a + d.n; }, 0);
    var R = 58, r = 36, cx = 70, cy = 70;
    var offset = 0;
    var segs = data.map(function (d) {
      var frac = d.n / total;
      var a0 = offset * 2 * Math.PI - Math.PI / 2;
      var a1 = (offset + frac) * 2 * Math.PI - Math.PI / 2;
      offset += frac;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
      var x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
      var x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
      var x3 = cx + r * Math.cos(a0), y3 = cy + r * Math.sin(a0);
      var d = "M" + x0.toFixed(2) + " " + y0.toFixed(2) +
        "A" + R + " " + R + " 0 " + large + " 1 " + x1.toFixed(2) + " " + y1.toFixed(2) +
        "L" + x2.toFixed(2) + " " + y2.toFixed(2) +
        "A" + r + " " + r + " 0 " + large + " 0 " + x3.toFixed(2) + " " + y3.toFixed(2) + "Z";
      return '<path class="chart-donut-seg" d="' + d + '" fill="' + (d.warna || SC.warnaKategori(d.kategori || d.label)) + '">' +
        '<title>' + U.esc(d.label + ": " + d.n + " (" + Math.round(frac * 100) + "%)") + "</title></path>";
    }).join("");

    var legenda = data.map(function (d) {
      var frac = d.n / total;
      return '<li><i style="background:' + (d.warna || SC.warnaKategori(d.kategori || d.label)) + '"></i>' +
        "<span>" + U.esc(d.label) + "</span>" +
        '<b>' + d.n + '</b><i class="pct">' + Math.round(frac * 100) + "%</i></li>";
    }).join("");

    return '<div class="donut-wrap">' +
      '<svg class="donut" viewBox="0 0 140 140" role="img" ' +
        'aria-label="Diagram lingkaran: distribusi kategori">' +
        segs +
        '<text class="donut-total" x="70" y="66" text-anchor="middle">' + total + "</text>" +
        '<text class="donut-cap" x="70" y="80" text-anchor="middle">entri</text>' +
      "</svg>" +
      '<ul class="donut-legend">' + legenda + "</ul>" +
    "</div>";
  };

  /* ---------- Garis waktu ---------- */

  /* Sumbu waktu digambar proporsional: jarak titik mengikuti jarak
     tahun, bukan urutan daftar. Empat belas dari sembilan belas
     tonggak berada di rentang 1823 sampai 2023, jadi labelnya tidak
     mungkin ditumpangkan di atas sumbu. Solusinya bukan mengecilkan
     teks, tapi memisahkan dua tugas: sumbu SVG men_answer "kapan
     peristiwa itu menumpuk", daftar HTML men_answer "apa yang
     terjadi". Titik dan baris daftar saling menyorot.

     Warna titik mengikuti kategori record asal, jadi satu warna
     berarti satu hal di seluruh halaman. */
  SC.timeline = function (item, opsi) {
    opsi = opsi || {};
    var data = (item || []).filter(function (d) { return typeof d.tahun === "number"; });
    if (data.length < 2) return "";

    var min = Math.min.apply(null, data.map(function (d) { return d.tahun; }));
    var max = Math.max.apply(null, data.map(function (d) { return d.tahun; }));
    if (max === min) return "";

    /* Record asal dicari, bukan disalin, supaya warna, jumlah
       sumber, dan tautan selalu sama dengan halaman detail. */
    function cari(ref) {
      if (!ref) return null;
      var daftar = ref.jenis === "artikel" ? (SC.ARTIKEL || []) : (SC.DESTINASI || []);
      for (var i = 0; i < daftar.length; i++) {
        if (daftar[i].id === ref.id) return daftar[i];
      }
      return null;
    }
    function kategori(ref) {
      var r = cari(ref);
      if (r && r.kategori && r.kategori.length) return r.kategori[0];
      return "Sejarah";
    }
    function nSumber(ref) {
      var r = cari(ref);
      return r && r.sumber ? r.sumber.length : 0;
    }
    function tautan(ref) {
      if (!ref) return "#";
      return (ref.jenis === "artikel" ? "detail-artikel.html?id=" : "detail-destinasi.html?id=") +
        encodeURIComponent(ref.id);
    }

    /* Domain dibulatkan ke abad penuh supaya tick dan bar
       kepadatan bisa dihitung dengan basis yang sama. */
    var dasar = Math.floor(min / 100) * 100;
    var atas = Math.ceil(max / 100) * 100;
    var W = 900, H = 156;
    var padL = 46, padR = 26;
    var sumbuY = 64, lebar = W - padL - padR;
    function tx(t) { return padL + ((t - dasar) / (atas - dasar)) * lebar; }

    /* Tick tiap abad */
    var ticks = "";
    for (var t = dasar + 100; t < atas; t += 100) {
      ticks += '<line class="tl-tick" x1="' + tx(t).toFixed(1) + '" y1="' + (sumbuY - 5) + '" x2="' + tx(t).toFixed(1) + '" y2="' + (sumbuY + 5) + '"/>' +
        '<text class="tl-year" x="' + tx(t).toFixed(1) + '" y="' + (sumbuY - 11) + '" text-anchor="middle">' + t + "</text>";
    }

    /* Pita masa: rentang yang dicatat sumber, diberi label. */
    var eraSvg = "";
    (opsi.era || []).forEach(function (e) {
      var x1 = tx(e.dari), x2 = tx(e.sampai);
      eraSvg += '<rect class="tl-era" x="' + x1.toFixed(1) + '" y="18" width="' + (x2 - x1).toFixed(1) + '" height="13" rx="2"/>' +
        '<text class="tl-era-label" x="' + ((x1 + x2) / 2).toFixed(1) + '" y="12" text-anchor="middle">' + U.esc(e.label) + "</text>";
    });

    /* Titik peristiwa */
    var nodes = data.slice().sort(function (a, b) { return a.tahun - b.tahun; });
    var dots = nodes.map(function (d, i) {
      var x = tx(d.tahun);
      var kat = kategori(d.ref);
      return '<g class="tl-dot" tabindex="0" role="link" data-tl="' + i + '" ' +
        'aria-label="' + U.esc(d.tahun + ": " + d.label) + '" ' +
        'fill="' + SC.warnaKategori(kat) + '">' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + sumbuY + '" r="4.5"/>' +
        '<circle class="tl-dot-ring" cx="' + x.toFixed(1) + '" cy="' + sumbuY + '" r="9"/>' +
      "</g>";
    }).join("");

    /* Bar kepadatan per abad: menunjukkan di mana events menumpuk.
       Panjang batang dihitung dari jumlah peristiwa, bukan diketik. */
    var perAbad = {};
    nodes.forEach(function (d) {
      var k = Math.floor(d.tahun / 100) * 100;
      perAbad[k] = (perAbad[k] || 0) + 1;
    });
    var maksAbad = 0;
    for (var k in perAbad) if (perAbad[k] > maksAbad) maksAbad = perAbad[k];
    var lebarAbad = lebar / ((atas - dasar) / 100);
    var density = "";
    for (var ab = dasar; ab < atas; ab += 100) {
      var n = perAbad[ab] || 0;
      if (!n) continue;
      var h = Math.max(6, (n / maksAbad) * 34);
      var bx = tx(ab) + 3;
      density += '<rect class="tl-density" data-tl="' + ab + '" x="' + bx.toFixed(1) + '" ' +
        'y="' + (134 - h).toFixed(1) + '" width="' + Math.max(4, lebarAbad - 7).toFixed(1) + '" ' +
        'height="' + h.toFixed(1) + '" rx="1.5"/>' +
        '<text class="tl-density-n" x="' + (bx + Math.max(4, lebarAbad - 7) / 2).toFixed(1) + '" y="' + (130 - h).toFixed(1) + '" text-anchor="middle">' + n + "</text>";
    }

    var svg = '<svg class="timeline-svg" viewBox="0 0 ' + W + " " + H + '" role="img" ' +
      'aria-label="' + U.esc(opsi.aria || "Sumbu waktu, " + nodes.length + " tonggak antara " + min + " dan " + max) + '">' +
      eraSvg +
      '<line class="tl-axis" x1="' + padL + '" y1="' + sumbuY + '" x2="' + (W - padR) + '" y2="' + sumbuY + '"/>' +
      ticks + dots + density +
    "</svg>";

    /* Daftar tonggak: kronologis, satu kartu per peristiwa. */
    var list = nodes.map(function (d, i) {
      var kat = kategori(d.ref);
      var ns = nSumber(d.ref);
      return '<li class="tl-item" data-tl="' + i + '">' +
        '<a href="' + U.esc(tautan(d.ref)) + '">' +
          '<b class="tl-y">' + d.tahun + "</b>" +
          '<span class="tl-l">' + U.esc(d.label) + "</span>" +
          '<i class="tl-cat" style="--c:' + SC.warnaKategori(kat) + '"></i>' +
          '<em class="tl-src">' + ns + " sumber</em>" +
        "</a>" +
      "</li>";
    }).join("");

    return '<div class="timeline-wrap">' + svg +
      '<p class="tl-cat-note">Sumbu proporsional ' + min + " sampai " + max +
        " Masehi. Bar di bawah menghitung tonggak per abad.</p>" +
      '<ol class="tl-list">' + list + "</ol>" +
    "</div>";
  };

  /* Menyinkronkan titik sumbu dengan baris daftar: kursor atau fokus
     di titik menyorot barisnya, dan sebaliknya. */
  SC.sinkronTimeline = function (root) {
    var dots = U.qsa(".tl-dot", root || document);
    var items = U.qsa(".tl-item", root || document);
    if (!dots.length || !items.length) return;

    function aktifkan(i, nyala) {
      dots.forEach(function (d) { d.classList.toggle("is-active", nyala && d.getAttribute("data-tl") === i); });
      items.forEach(function (it) { it.classList.toggle("is-active", nyala && it.getAttribute("data-tl") === i); });
    }

    dots.forEach(function (d) {
      var i = d.getAttribute("data-tl");
      d.addEventListener("mouseenter", function () { aktifkan(i, true); });
      d.addEventListener("focus", function () { aktifkan(i, true); });
      d.addEventListener("blur", function () { aktifkan(i, false); });
      d.addEventListener("mouseleave", function () { aktifkan(i, false); });
      d.addEventListener("click", function () {
        var it = items[i];
        if (it) window.location.href = it.querySelector("a").getAttribute("href");
      });
      d.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        var it = items[i];
        if (it) window.location.href = it.querySelector("a").getAttribute("href");
      });
    });

    items.forEach(function (it) {
      var i = it.getAttribute("data-tl");
      it.addEventListener("mouseenter", function () { aktifkan(i, true); });
      it.addEventListener("mouseleave", function () { aktifkan(i, false); });
      it.addEventListener("focusin", function () { aktifkan(i, true); });
      it.addEventListener("focusout", function () { aktifkan(i, false); });
    });
  };

  /* ---------- Meter verifikasi ---------- */

  /* Menampilkan kadar data yang terverifikasi. Persentase dihitung
     dari data, bukan diketik. Struktur: label dan persentase di
     baris pertama, batang penuh di baris kedua, rincian di baris
     ketiga. Batang harus punya lebar yang pasti, kalau tidak
     percentage di dalam grid `auto` jadi nol dan bar tidak
     terlihat sama sekali. */
  SC.meter = function (terverifikasi, total, label, rincian) {
    if (!total) return "";
    var pct = Math.round((terverifikasi / total) * 100);
    var kelas = pct >= 70 ? "ok" : (pct >= 40 ? "warn" : "danger");
    return '<div class="meter-row">' +
      '<span class="t-meta meter-label">' + U.esc(label || "Data terverifikasi") + "</span>" +
      '<b class="t-figure meter-pct">' + pct + "%</b>" +
      '<div class="meter ' + kelas + '" role="img" aria-label="' +
        U.esc(terverifikasi + " dari " + total + " data terverifikasi, " + pct + " persen") + '">' +
        '<i style="--meter-pct:' + pct + '%"></i></div>' +
      '<span class="t-meta meter-count">' + U.esc(rincian || (terverifikasi + " / " + total + " entri")) + "</span>" +
    "</div>";
  };

  /* ---------- Statistik angka ---------- */

  SC.statGrid = function (item) {
    return '<div class="stat-grid">' + (item || []).map(function (s) {
      return '<div class="stat">' +
        '<span class="t-label">' + U.esc(s.label) + "</span>" +
        '<span class="t-figure" data-count="' + U.esc(String(s.nilai)) + '">0</span>' +
        (s.keterangan ? "<small>" + U.esc(s.keterangan) + "</small>" : "") +
      "</div>";
    }).join("") + "</div>";
  };

  /* ---------- Angka yang menghitung sendiri saat terlihat ---------- */

  /* Angka statis "24 foto" bisa basi. Angka dihitung dari data
     saat runtime, lalu menghitung naik saat elemen terlihat. */
  SC.hitungAngka = function (root) {
    var el = U.qsa("[data-count]", root || document);
    if (!el.length) return;

    var kurangi = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tampilkan(e) {
      var target = Number(e.getAttribute("data-count")) || 0;
      if (kurangi) { e.textContent = target.toLocaleString("id-ID"); return; }
      var mulai = performance.now();
      var durasi = 900;
      function langkah(now) {
        var p = Math.min(1, (now - mulai) / durasi);
        var eased = 1 - Math.pow(1 - p, 3);
        e.textContent = Math.round(target * eased).toLocaleString("id-ID");
        if (p < 1) requestAnimationFrame(langkah);
      }
      requestAnimationFrame(langkah);
    }

    if (!("IntersectionObserver" in window)) {
      el.forEach(tampilkan);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { tampilkan(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    el.forEach(function (e) { obs.observe(e); });
  };

  /* ---------- Garis progres scroll ---------- */

  SC.progresScroll = function () {
    var bar = U.qs(".progress-bar > i");
    if (!bar) return;
    function hitung() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      bar.style.width = (p * 100).toFixed(2) + "%";
    }
    window.addEventListener("scroll", U.debounce(hitung, 60), { passive: true });
    hitung();
  };

  /* ---------- Penyinkoan peta dan daftar ---------- */

  /* Saat kursor atau fokus masuk ke pin peta, baris yang cocok di
     daftar indeks ikut disorot. Dan sebaliknya. */
  SC.sinkronAtlas = function () {
    var pin = U.qsa(".atlas-pin");
    var baris = U.qsa(".atlas-index a");
    if (!pin.length || !baris.length) return;

    function aktifkan(id) {
      pin.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-atlas-id") === id);
      });
      baris.forEach(function (a) {
        var cocok = a.getAttribute("href").indexOf("id=" + id) >= 0;
        a.classList.toggle("is-active", cocok);
      });
    }

    pin.forEach(function (p) {
      var id = p.getAttribute("data-atlas-id");
      p.addEventListener("mouseenter", function () { aktifkan(id); });
      p.addEventListener("focus", function () { aktifkan(id); });
      p.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "detail-destinasi.html?id=" + encodeURIComponent(id);
      });
      p.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = "detail-destinasi.html?id=" + encodeURIComponent(id);
        }
      });
    });
    baris.forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        var m = a.getAttribute("href").match(/id=([^&]+)/);
        if (m) aktifkan(decodeURIComponent(m[1]));
      });
    });
  };

  /* ---------- Marquee: laras berjalan dengan tombol jeda ---------- */

  SC.marquee = function (item) {
    if (!item || !item.length) return "";
    var isi = item.map(function (t) { return "<span>" + U.esc(t) + "</span>"; }).join("");
    /* duplikasi supaya loop mulus */
    return '<div class="marquee" data-marquee>' +
      '<div class="marquee-track">' + isi + isi + "</div>" +
      '<button type="button" class="marquee-btn" data-marquee-toggle ' +
        'aria-label="Jeda atau lanjutkan teks berjalan" aria-pressed="false">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>' +
      "</button>" +
    "</div>";
  };

  SC.wireMarquee = function (root) {
    U.qsa("[data-marquee-toggle]", root || document).forEach(function (b) {
      if (b.dataset.wired === "1") return;
      b.dataset.wired = "1";
      b.addEventListener("click", function () {
        var m = b.closest("[data-marquee]");
        var dijeda = m.classList.toggle("paused");
        b.setAttribute("aria-pressed", dijeda ? "true" : "false");
        b.setAttribute("aria-label", dijeda ? "Lanjutkan teks berjalan" : "Jeda teks berjalan");
        b.innerHTML = dijeda
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l12 8-12 8z"/></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
      });
    });
  };
})();
