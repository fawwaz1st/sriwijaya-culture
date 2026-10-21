/* ============================================================
   detail-destinasi.js - halaman detail satu destinasi
   Membaca ?id= dari URL, mencari datanya, lalu menyusun halaman.
   Bila id tidak ada atau tidak dikenal, halaman menampilkan pesan
   yang jelas beserta daftar destinasi yang tersedia.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render;

  function bagianInfo(d) {
    var html = '<section aria-labelledby="judulInfo">' +
      '<h2 id="judulInfo">Informasi Umum</h2>' +
      '<p>' + U.esc(d.deskripsi) + "</p>" +
      R.fakta(d.fakta) +
    "</section>";

    html += '<section aria-labelledby="judulSejarah">' +
      "<h2 id=\"judulSejarah\">Sejarah Singkat</h2>" +
      "<p>" + U.esc(d.sejarah) + "</p>" +
      '<div class="legend-note">Bagian ini adalah ringkasan. Untuk pembahasan lengkap beserta sumbernya, ' +
      "buka artikel terkait di bagian bawah halaman.</div>" +
    "</section>";

    html += '<section aria-labelledby="judulTarik">' +
      "<h2 id=\"judulTarik\">Daya Tarik dan Aktivitas</h2>" +
      '<div class="grid grid-2" style="gap:8px 28px">' +
        "<div><h3 class=\"mt-0\" style=\"font-size:1rem\">Daya tarik utama</h3>" +
        '<ul class="duo-list" style="padding-left:20px">' + (d.dayaTarik || []).map(function (t) {
          return "<li>" + U.esc(t) + "</li>";
        }).join("") + "</ul></div>" +
        "<div><h3 class=\"mt-0\" style=\"font-size:1rem\">Aktivitas yang dapat dilakukan</h3>" +
        '<ul class="duo-list" style="padding-left:20px">' + (d.aktivitas || []).map(function (t) {
          return "<li>" + U.esc(t) + "</li>";
        }).join("") + "</ul></div>" +
      "</div>" +
    "</section>";

    return html;
  }

  /* Legenda ditampilkan terpisah dan diberi label jelas. Ini penting:
     pembaca harus tahu mana yang catatan rakyat dan mana yang sejarah. */
  function bagianLegenda(d) {
    if (!d.legenda) return "";
    return '<section aria-labelledby="judulLegenda">' +
      '<h2 id="judulLegenda">Legenda Warga</h2>' +
      '<div class="legend-note"><b>Catatan penting:</b> bagian ini berisi cerita rakyat, bukan catatan sejarah. ' +
      "Cerita ini tidak memiliki bukti arkeologis atau prasasti, dan ditampilkan karena hidup dalam ingatan warga " +
      "serta menjadi bagian dari daya tarik tempat ini.</div>" +
      '<h3 class="mt-2">' + U.esc(d.legenda.judul) + "</h3>" +
      "<p>" + U.esc(d.legenda.isi) + "</p>" +
    "</section>";
  }

  function bagianAkses(d) {
    return '<section aria-labelledby="judulAkses">' +
      "<h2 id=\"judulAkses\">Informasi Akses</h2>" +
      "<p>" + U.esc(d.akses) + "</p>" +
    "</section>";
  }

  function bagianDestinasiTerkait(d) {
    var list = (d.destinasiTerkait || []).map(U.findDestinasi).filter(Boolean);
    if (!list.length) return "";
    var kartu = list.map(function (t, i) {
      return R.kartuDestinasi(t, { delay: i % 3 });
    }).join("");
    return R.bagianTerkait("Destinasi Lain di Palembang", kartu);
  }

  function bagianArtikelTerkait(d) {
    var list = (d.artikelTerkait || []).map(U.findArtikel).filter(Boolean);
    if (!list.length) return "";
    var kartu = list.map(function (a, i) {
      return R.kartuArtikel(a, { delay: i % 3 });
    }).join("");
    return R.bagianTerkait("Bacaan Terkait", kartu);
  }

  function gambarKosong() {
    var daftar = (SC.DESTINASI || []).map(function (d) {
      return '<li><a href="detail-destinasi.html?id=' + encodeURIComponent(d.id) + '">' + U.esc(d.nama) + "</a></li>";
    }).join("");
    U.qs("#isiDetail").innerHTML =
      '<div class="empty" style="text-align:left">' +
        "<strong>Destinasi yang diminta tidak ditemukan</strong>" +
        "<p>Tautan yang Anda buka tidak memuat id destinasi yang dikenal, atau id tersebut sudah berubah. " +
        "Pilih salah satu destinasi di bawah ini.</p>" +
        '<ul style="padding-left:20px">' + daftar + "</ul>" +
        '<p class="mt-2"><a class="btn btn-primary" href="destinasi.html">Lihat semua destinasi</a></p>' +
      "</div>";
    U.qs("#detailHero").style.display = "none";
  }

  function mulai() {
    var id = U.param("id");
    var d = id ? U.findDestinasi(id) : null;
    if (!d) { gambarKosong(); return; }

    document.title = d.nama + " - Sriwijaya Culture";

    /* hero */
    var fotoUtama = (d.gambar && d.gambar[0]) || null;
    U.qs("#detailHero").innerHTML =
      '<div class="hero-media">' +
        (fotoUtama ? '<img src="' + U.esc(fotoUtama.src) + '" alt="Foto ' + U.esc(d.nama) + '" width="1600" height="900">' : "") +
      "</div>" +
      '<div class="container detail-hero-inner">' +
        '<nav class="breadcrumb" aria-label="Jejak navigasi">' +
          '<a href="index.html">Beranda</a> &rsaquo; <a href="destinasi.html">Destinasi Wisata</a> &rsaquo; ' +
          U.esc(d.nama) +
        "</nav>" +
        "<h1>" + U.esc(d.nama) + "</h1>" +
        '<p class="lead" style="max-width:62ch">' + U.esc(d.ringkas) + "</p>" +
        '<div class="chips">' +
          (d.kategori || []).map(function (k) { return R.chip(k, "chip"); }).join("") +
          R.chip(d.wilayah, "chip") +
          R.chip((d.gambar || []).length + " foto", "chip") +
        "</div>" +
      "</div>";

    /* isi */
    U.qs("#isiDetail").innerHTML =
      '<div class="detail-layout">' +
        '<div class="detail-main">' +
          '<section aria-labelledby="judulGaleri">' +
            '<h2 id="judulGaleri">Galeri Foto</h2>' +
            R.galeri("galeriDestinasi", d.gambar || [], d.nama) +
          "</section>" +
          bagianInfo(d) +
          bagianLegenda(d) +
          bagianAkses(d) +
          '<section aria-labelledby="judulUlasan">' +
            "<h2 id=\"judulUlasan\">Ulasan Pengunjung</h2>" +
            R.ulasan(d) +
          "</section>" +
          '<section aria-labelledby="judulSumber">' +
            "<h2 id=\"judulSumber\">Sumber Data</h2>" +
            R.daftarSumber(d.sumber) +
            (d.catatanVerifikasi
              ? '<div class="legend-note mt-2">' + U.esc(d.catatanVerifikasi) + "</div>"
              : "") +
          "</section>" +
        "</div>" +
        '<aside class="detail-aside">' +
          '<div class="panel">' +
            "<h3>Ringkasan Kunjungan</h3>" +
            '<ul class="fact-list">' +
              "<li><span class=\"k\">Tiket</span><span class=\"v\">" + U.esc(d.tiket.teks) +
                "<br>" + R.chipVerifikasi(d.tiket.verifikasi) + "</span></li>" +
              "<li><span class=\"k\">Jam</span><span class=\"v\">" + U.esc(d.jam.teks) +
                "<br>" + R.chipVerifikasi(d.jam.verifikasi) + "</span></li>" +
              "<li><span class=\"k\">Wilayah</span><span class=\"v\">" + U.esc(d.wilayah) + "</span></li>" +
            "</ul>" +
          "</div>" +
          '<div class="panel"><h3 class="mt-0">Simpan</h3>' +
            '<p class="small muted">Simpan destinasi ini ke daftar favorit akun Anda.</p>' +
            R.favButton("destinasi", d.id) +
          "</div>" +
          '<div class="panel"><h3 class="mt-0">Lokasi Destinasi</h3>' +
            R.peta(d) +
          "</div>" +
        "</aside>" +
      "</div>" +
      bagianArtikelTerkait(d) +
      bagianDestinasiTerkait(d);

    R.wireGaleri("galeriDestinasi", d.gambar || []);
    R.wireFavorit(document);
    if (SC._revealRefresh) SC._revealRefresh();

    /* tombol bagikan (memakai API berbagi perangkat bila tersedia,
       jika tidak, salin tautan) */
    var share = U.qs("#tombolBagikan");
    if (share) {
      share.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.share) {
          navigator.share({ title: d.nama + " - Sriwijaya Culture", url: url }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            SC.beritahu("Tautan halaman disalin.");
          }).catch(function () {
            SC.beritahu("Tautan: " + url, "info");
          });
        } else {
          SC.beritahu("Tautan: " + url, "info");
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();