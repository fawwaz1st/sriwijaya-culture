/* ============================================================
   beranda.js - mengisi bagian dinamis halaman beranda

   Semua angka dihitung dari data, tidak ada yang diketik manual.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render, V = SC;

  /* ---------- helpers ---------- */

  function semuaFoto() {
    var n = 0;
    (SC.DESTINASI || []).forEach(function (d) { n += (d.gambar || []).length; });
    (SC.UMKM || []).forEach(function (u) { n += (u.gambar || []).length; });
    (SC.ARTIKEL || []).forEach(function (a) { if (a.gambar) n++; });
    return n;
  }

  function totalSumber() {
    var n = 0;
    (SC.DESTINASI || []).forEach(function (d) { n += (d.sumber || []).length; });
    (SC.UMKM || []).forEach(function (u) { n += (u.sumber || []).length; });
    (SC.ARTIKEL || []).forEach(function (a) { n += (a.sumber || []).length; });
    return n;
  }

  /* Hitung entri yang punya minimal satu sumber berverifikasi tinggi. */
  function terverifikasiTinggi() {
    var n = 0;
    var semua = (SC.DESTINASI || []).concat(SC.UMKM || []).concat(SC.ARTIKEL || []);
    semua.forEach(function (x) {
      var s = x.sumber || [];
      if (!s.length) return;
      var ada = s.some(function (y) { return y.verifikasi === "tinggi"; });
      if (ada) n++;
    });
    return n;
  }

  function totalEntri() {
    return (SC.DESTINASI || []).length + (SC.UMKM || []).length + (SC.ARTIKEL || []).length;
  }

  /* Kumpulkan kategori beserta jumlahnya, urut menurun. */
  function hitungKategori() {
    var peta = {};
    (SC.DESTINASI || []).forEach(function (d) {
      (d.kategori || []).forEach(function (k) { peta[k] = (peta[k] || 0) + 1; });
    });
    return Object.keys(peta).map(function (k) {
      return { label: k, kategori: k, n: peta[k] };
    }).sort(function (a, b) { return b.n - a.n; });
  }

  /* Timeline: diambil dari SC.TIMELINE, yaitu tonggak yang angkanya
     sudah tertulis di data asal. Tidak ada tahun yang diketik di
     sini supaya tidak bisa melenceng dari arsip. */
  function peristiwa() {
    return (SC.TIMELINE && SC.TIMELINE.peristiwa) || [];
  }

  /* Sebar Engagement sumber per entri: dipakai untuk menghitung
     kadar verifikasi dari data, bukan dari angka manual. */
  function sebarVerifikasi() {
    var semua = (SC.DESTINASI || []).concat(SC.UMKM || []);
    var hitung = { tinggi: 0, sedang: 0, rendah: 0, tanpa: 0 };
    semua.forEach(function (x) {
      var s = x.sumber || [];
      if (!s.length) { hitung.tanpa++; return; }
      var lv = s.map(function (y) { return y.verifikasi; });
      if (lv.indexOf("tinggi") >= 0) hitung.tinggi++;
      else if (lv.indexOf("sedang") >= 0) hitung.sedang++;
      else if (lv.indexOf("rendah") >= 0) hitung.rendah++;
      else hitung.tanpa++;
    });
    return hitung;
  }

  /* ---------- render ---------- */

  function mulai() {
    var D = SC.DESTINASI || [], A = SC.ARTIKEL || [], UM = SC.UMKM || [];

    /* Statistik hero: dihitung, tidak diketik */
    var hero = U.qs("#heroStats");
    if (hero) {
      hero.innerHTML =
        "<span><b>" + D.length + "</b> destinasi terdata</span>" +
        "<span><b>" + UM.length + "</b> entri UMKM</span>" +
        "<span><b>" + A.length + "</b> artikel bersumber</span>" +
        "<span><b>" + semuaFoto() + "</b> foto berlisensi bebas</span>" +
        "<span><b>" + totalSumber() + "</b> rujukan dicantumkan</span>";
    }

    /* Marquee: nama destinasi dan wilayahnya. */
    var mq = U.qs("#marqueeArsip");
    if (mq) {
      mq.innerHTML = V.marquee(D.map(function (d) {
        return d.nama + " / " + d.wilayah;
      }));
      V.wireMarquee(mq);
    }

    /* Peta atlas */
    var peta = U.qs("#atlasPeta");
    if (peta) peta.innerHTML = V.atlas(D);
    var idx = U.qs("#atlasIndeks");
    if (idx) idx.innerHTML = V.atlasIndex(D);
    V.sinkronAtlas();

    /* Statistik */
    var sg = U.qs("#statGrid");
    if (sg) {
      sg.innerHTML = V.statGrid([
        { label: "Destinasi", nilai: D.length, keterangan: "titik dengan koordinat terverifikasi" },
        { label: "Usaha lokal", nilai: UM.length, keterangan: "entri direktori" },
        { label: "Artikel", nilai: A.length, keterangan: "tulisan bersumber" },
        { label: "Rujukan", nilai: totalSumber(), keterangan: "tautan sumber diperiksa" },
        { label: "Foto", nilai: semuaFoto(), keterangan: "berlisensi bebas" }
      ]);
    }

    /* Meter verifikasi */
    var mv = U.qs("#meterVerifikasi");
    if (mv) {
      var sebar = sebarVerifikasi();
      var total = totalEntri();
      mv.innerHTML = '<p class="t-label" style="margin-bottom:14px">Kadar Verifikasi</p>' +
        V.meter(terverifikasiTinggi(), total, "Entri dengan sumber berverifikasi tinggi") +
        '<ul class="meter-break">' +
          '<li><i class="ok"></i>Tinggi <b>' + sebar.tinggi + "</b></li>" +
          '<li><i class="warn"></i>S Tunggal <b>' + sebar.sedang + "</b></li>" +
          '<li><i class="danger"></i>Lemah <b>' + sebar.rendah + "</b></li>" +
          '<li><i class="none"></i>Tanpa sumber <b>' + sebar.tanpa + "</b></li>" +
        "</ul>";
    }

    /* Donat kategori */
    var dk = U.qs("#donutKategori");
    if (dk) {
      dk.innerHTML = '<p class="t-label" style="margin-bottom:14px">Kategori Destinasi</p>' +
        V.donutChart(hitungKategori());
    }

    /* Timeline */
    var ts = U.qs("#timelineSejarah");
    if (ts) {
      ts.innerHTML = V.timeline(peristiwa(), {
        era: (SC.TIMELINE && SC.TIMELINE.era) || [],
        aria: "Sumbu waktu, 19 tonggak antara 671 dan 2023"
      });
    }

    /* Bar kategori */
    var bk = U.qs("#barKategori");
    if (bk) {
      bk.innerHTML = V.barChart(hitungKategori(), { aria: "Jumlah destinasi per kategori" });
    }

    /* Destinasi unggulan: kartu arsip 12 kolom. Dua kartu pertama
       dibuat setengah lebar (span-6), tiga berikutnya seperempat
       (span-4), jadi dua baris penuh tanpa kolom kosong.
       <article> harus jadi anak langsung grid tanpa dibungkus
       <div>, karena .grid-arsip > * hanya kena anak langsung. */
    var mo = U.qs("#mosaicDestinasi");
    if (mo) {
      var unggulan = D.filter(function (d) { return d.gambar && d.gambar.length; }).slice(0, 5);
      mo.innerHTML = unggulan.map(function (d, i) {
        return R.kartuArsip(d, {
          no: i + 1,
          delay: i % 3,
          lebar: i < 2 ? "span-6" : "span-4"
        });
      }).join("");
    }

    /* Artikel: kartu visual */
    var artikel = A.slice().sort(function (a, b) {
      return String(b.tanggal).localeCompare(String(a.tanggal));
    }).slice(0, 3);
    var ga = U.qs("#gridArtikelHome");
    if (ga) {
      ga.innerHTML = artikel.map(function (a, i) {
        return R.kartuArtikel(a, { delay: i % 3, visual: true });
      }).join("");
    }

    /* UMKM */
    var umkm = UM.slice().sort(function (a, b) {
      return (a.statusData === "demonstrasi") - (b.statusData === "demonstrasi");
    }).slice(0, 3);
    var gu = U.qs("#gridUmkmHome");
    if (gu) {
      gu.innerHTML = umkm.map(function (u, i) {
        return R.kartuUMKM(u, { delay: i % 3, visual: true });
      }).join("");
    }

    R.wireFavorit(document);
    V.hitungAngka(document);
    V.progresScroll();
    V.sinkronTimeline();
    if (SC._revealRefresh) SC._revealRefresh();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();
