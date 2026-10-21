/* ============================================================
   detail-artikel.js - halaman baca artikel lengkap

   Struktur halaman mengikuti urutan yang diminta: judul, gambar
   utama beserta keterangan, penulis dan tanggal, pendahuluan,
   pembahasan, peristiwa penting, nilai budaya, kondisi sekarang,
   kesimpulan, lalu daftar sumber.

   Karena artikel bersifat lokal (disusun dari data yang ada),
   halaman ini menambahkan kata kunci navigasi ringkas berupa
   daftar isi yang dihasilkan dari subjudul. Daftar isi itu
   berguna untuk artikel panjang dan dapat dinavigasi keyboard.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render;

  function slug(s, i) {
    return "bagian-" + (i + 1);
  }

  function daftarIsi(a) {
    if ((a.bagian || []).length < 3) return "";
    var li = a.bagian.map(function (b, i) {
      return '<li><a href="#' + slug(b.subjudul, i) + '">' + U.esc(b.subjudul) + "</a></li>";
    }).join("");
    return '<nav class="panel mb-2" aria-label="Daftar isi artikel">' +
      "<h3 class=\"mt-0\">Daftar Isi</h3>" +
      '<ul style="padding-left:18px;margin:0">' + li + "</ul></nav>";
  }

  function bagianIsi(a) {
    return (a.bagian || []).map(function (b, i) {
      var label = b.label === "legenda"
        ? '<div class="legend-note">Bagian berikut adalah cerita rakyat, bukan catatan sejarah.</div>'
        : "";
      return '<section id="' + slug(b.subjudul, i) + '" aria-labelledby="h-' + slug(b.subjudul, i) + '">' +
        '<h2 id="h-' + slug(b.subjudul, i) + '">' + U.esc(b.subjudul) + "</h2>" +
        label +
        (b.paragraf || []).map(function (p) { return "<p>" + U.esc(p) + "</p>"; }).join("") +
      "</section>";
    }).join("");
  }

  function bagianTerkait(a) {
    var artikel = (a.artikelTerkait || []).map(U.findArtikel).filter(Boolean);
    var destinasi = (a.destinasiTerkait || []).map(U.findDestinasi).filter(Boolean);
    var html = "";

    if (destinasi.length) {
      html += '<section class="section" style="padding-top:8px">' +
        '<div class="section-head">' +
          "<h2>Jelajahi Destinasi Terkait</h2>" +
          "<p class=\"lead\">Artikel ini membahas latar belakang tempat berikut. Buka halaman destinasi untuk " +
          "melihat foto, lokasi pada peta, dan informasi kunjungan.</p>" +
        "</div>" +
        '<div class="grid grid-3">' +
          destinasi.map(function (d, i) { return R.kartuDestinasi(d, { delay: i % 3 }); }).join("") +
        "</div>" +
      "</section>";
    }
    if (artikel.length) {
      html += '<section class="section" style="padding-top:8px">' +
        '<div class="section-head"><h2>Artikel Lain</h2></div>' +
        '<div class="grid grid-3">' +
          artikel.map(function (x, i) { return R.kartuArtikel(x, { delay: i % 3 }); }).join("") +
        "</div>" +
      "</section>";
    }
    return html;
  }

  function gambarKosong() {
    var daftar = (SC.ARTIKEL || []).map(function (a) {
      return '<li><a href="detail-artikel.html?id=' + encodeURIComponent(a.id) + '">' + U.esc(a.judul) + "</a></li>";
    }).join("");
    U.qs("#isiArtikel").innerHTML =
      '<div class="empty" style="text-align:left">' +
        "<strong>Artikel yang diminta tidak ditemukan</strong>" +
        "<p>Tautan tidak memuat id artikel yang dikenal. Pilih salah satu artikel berikut.</p>" +
        '<ul style="padding-left:20px">' + daftar + "</ul>" +
        '<p class="mt-2"><a class="btn btn-primary" href="artikel.html">Lihat katalog artikel</a></p>' +
      "</div>";
    U.qs("#artikelHero").style.display = "none";
  }

  function mulai() {
    var id = U.param("id");
    var a = id ? U.findArtikel(id) : null;
    if (!a) { gambarKosong(); return; }

    document.title = a.judul + " - Sriwijaya Culture";

    U.qs("#artikelHero").innerHTML =
      '<div class="hero-media">' +
        (a.gambar ? '<img src="' + U.esc(a.gambar) + '" alt="' + U.esc(a.gambarCaption || a.judul) + '" width="1600" height="900">' : "") +
      "</div>" +
      '<div class="container detail-hero-inner">' +
        '<nav class="breadcrumb" aria-label="Jejak navigasi">' +
          '<a href="index.html">Beranda</a> &rsaquo; <a href="artikel.html">Artikel Sejarah &amp; Budaya</a> &rsaquo; ' +
          U.esc(a.kategori) +
        "</nav>" +
        '<h1 style="max-width:26ch">' + U.esc(a.judul) + "</h1>" +
        '<p class="lead" style="max-width:62ch">' + U.esc(a.ringkas) + "</p>" +
        '<div class="chips">' +
          R.chip(a.kategori, "chip chip-gold") +
          R.chipStatusArtikel(a.status) +
          R.chip((a.sumber || []).length + " sumber", "chip") +
        "</div>" +
      "</div>";

    U.qs("#isiArtikel").innerHTML =
      '<div class="detail-layout">' +
        '<article class="detail-main article-body">' +
          '<figure style="margin-top:0">' +
            (a.gambar ? '<img src="' + U.esc(a.gambar) + '" alt="' + U.esc(a.gambarCaption || a.judul) +
              '" width="1600" height="900" style="border-radius:var(--r-md);box-shadow:var(--shadow-1)">' : "") +
            '<figcaption>' + U.esc(a.gambarCaption || "") +
              "<br>Foto: Wikimedia Commons, lisensi bebas. Rincian pada halaman metodologi.</figcaption>" +
          "</figure>" +
          '<div class="article-meta">' +
            "<span>Penulis: <b>" + U.esc(a.penulis) + "</b></span>" +
            "<span>Diterbitkan: <time datetime=\"" + U.esc(a.tanggal) + "\">" + U.esc(U.tanggalID(a.tanggal)) + "</time></span>" +
            (a.diperbarui ? "<span>Diperbarui: <time datetime=\"" + U.esc(a.diperbarui) + "\">" + U.esc(U.tanggalID(a.diperbarui)) + "</time></span>" : "") +
            "<span>Status: " + R.chipStatusArtikel(a.status) + "</span>" +
          "</div>" +

          '<div class="legend-note mb-2"><b>Cara membaca artikel ini.</b> Bagian yang didukung sumber ditulis ' +
          "sebagai pernyataan. Bagian yang masih diperdebatkan ditulis sebagai perbedaan pendapat. " +
          "Cerita rakyat diberi label legenda. Daftar sumber ada di bagian akhir halaman.</div>" +

          daftarIsi(a) +

          "<h2>Pendahuluan</h2>" +
          "<p>" + U.esc(a.pendahuluan) + "</p>" +

          bagianIsi(a) +

          "<h2>Kesimpulan</h2>" +
          "<p>" + U.esc(a.kesimpulan) + "</p>" +

          '<section id="sumber" aria-labelledby="judulSumberArtikel">' +
            "<h2 id=\"judulSumberArtikel\">Daftar Sumber Referensi</h2>" +
            "<p class=\"small muted\">Setiap sumber berikut benar-benar dibuka dan diperiksa isinya. " +
            "Untuk sumber yang hanya mendukung sebagian klaim, keterangannya dicantumkan.</p>" +
            R.daftarSumber(a.sumber) +
          "</section>" +

          '<div class="flex mt-3 no-print">' +
            '<a class="btn btn-outline" href="artikel.html">&larr; Kembali ke katalog artikel</a>' +
            '<button class="btn btn-outline" type="button" id="tombolBagikan">Bagikan artikel ini</button>' +
            '<button class="btn btn-outline" type="button" id="tombolCetak" aria-label="Cetak artikel atau simpan sebagai PDF">Cetak / simpan sebagai PDF</button>' +
          "</div>" +
        "</article>" +

        '<aside class="detail-aside">' +
          '<div class="panel">' +
            "<h3 class=\"mt-0\">Ringkasan Artikel</h3>" +
            '<ul class="fact-list">' +
              "<li><span class=\"k\">Kategori</span><span class=\"v\">" + U.esc(a.kategori) + "</span></li>" +
              "<li><span class=\"k\">Jumlah bagian</span><span class=\"v\">" + (a.bagian || []).length + "</span></li>" +
              "<li><span class=\"k\">Sumber</span><span class=\"v\">" + (a.sumber || []).length + "</span></li>" +
              "<li><span class=\"k\">Status</span><span class=\"v\">" + R.chipStatusArtikel(a.status) + "</span></li>" +
            "</ul>" +
          "</div>" +
          '<div class="panel"><h3 class="mt-0">Simpan</h3>' +
            '<p class="small muted">Simpan artikel ini ke favorit akun Anda.</p>' +
            R.favButton("artikel", a.id) +
          "</div>" +
          (a.destinasiTerkait && a.destinasiTerkait.length
            ? '<div class="panel"><h3 class="mt-0">Destinasi Terkait</h3>' +
              '<ul style="padding-left:18px;margin:0">' +
                a.destinasiTerkait.map(U.findDestinasi).filter(Boolean).map(function (d) {
                  return '<li><a href="detail-destinasi.html?id=' + encodeURIComponent(d.id) + '">' +
                    U.esc(d.nama) + "</a></li>";
                }).join("") +
              "</ul>" +
              '<a class="btn btn-primary btn-sm mt-2" href="detail-destinasi.html?id=' +
                U.esc(a.destinasiTerkait[0]) + '">Jelajahi Destinasi</a>' +
              "</div>"
            : "") +
        "</aside>" +
      "</div>" +
      bagianTerkait(a);

    R.wireFavorit(document);

    var share = U.qs("#tombolBagikan");
    if (share) {
      share.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.share) {
          navigator.share({ title: a.judul + " - Sriwijaya Culture", url: url }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            SC.beritahu("Tautan artikel disalin.");
          }).catch(function () { SC.beritahu("Tautan: " + url, "info"); });
        } else {
          SC.beritahu("Tautan: " + url, "info");
        }
      });
    }

    var cetak = U.qs("#tombolCetak");
    if (cetak) {
      cetak.addEventListener("click", function () {
        /* Penjelasan jujur: tombol ini membuka dialog cetak bawaan
           peramban. Pengguna dapat memilih "Simpan sebagai PDF".
           Kami tidak mengklaim menyimpan berkas secara otomatis. */
        SC.beritahu("Dialog cetak peramban akan dibuka. Pilih Simpan sebagai PDF untuk menyimpan artikel.", "info");
        setTimeout(function () { window.print(); }, 600);
      });
    }

    if (SC._revealRefresh) SC._revealRefresh();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();