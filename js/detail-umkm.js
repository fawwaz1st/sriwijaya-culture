/* ============================================================
   detail-umkm.js - halaman detail satu UMKM

   Perhatian khusus pada kejujuran data. Untuk usaha berstatus
   "rujukan-umum", nama dan jenis produknya diketahui dari sumber
   publik, tetapi alamat, nomor kontak, dan akun media sosial tidak
   ditampilkan. Halaman menjelaskan mengapa, bukan menampilkan
   kolom kosong tanpa keterangan.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render;

  function pemberitahuanBelumTerverifikasi(u) {
    if (u.statusData === "demonstrasi") {
      return '<div class="legend-note">' +
        "<b>Entri contoh (demonstrasi).</b> Halaman ini ditampilkan untuk memperlihatkan cara kerja direktori UMKM. " +
        "Jenis produk yang dijual memang ada di Palembang, tetapi nama usaha, alamat, harga, dan kontak belum " +
        "diverifikasi bersama pemilik usaha. Karena itu seluruh kolom tersebut dikosongkan, bukan diisi perkiraan." +
      "</div>";
    }
    return '<div class="legend-note">' +
      "<b>Status data usaha ini.</b> Nama usaha dan jenis produknya bersumber dari rujukan publik yang tercantum " +
      "di bawah. Alamat, nomor kontak, jam operasional, dan akun media sosial belum diverifikasi, sehingga " +
      "tidak kami tampilkan. Halaman ini tidak menampilkan informasi kontak atau tautan yang tidak dapat dipastikan." +
    "</div>";
  }

  function bagianKontak(u) {
    var k = u.kontak || {};
    var s = u.sosial || {};
    var tombol = [];

    if (k.whatsapp) tombol.push('<a class="btn btn-primary" href="https://wa.me/' + U.esc(String(k.whatsapp).replace(/\D/g, "")) +
      '" target="_blank" rel="noopener">Hubungi melalui WhatsApp</a>');
    if (k.telepon) tombol.push('<a class="btn btn-outline" href="tel:' + U.esc(k.telepon) + '">Telepon ' + U.esc(k.telepon) + "</a>");
    if (s.instagram) tombol.push('<a class="btn btn-outline" href="' + U.esc(s.instagram) + '" target="_blank" rel="noopener">Kunjungi Instagram</a>');
    if (s.facebook) tombol.push('<a class="btn btn-outline" href="' + U.esc(s.facebook) + '" target="_blank" rel="noopener">Kunjungi Facebook</a>');
    if (s.tiktok) tombol.push('<a class="btn btn-outline" href="' + U.esc(s.tiktok) + '" target="_blank" rel="noopener">Kunjungi TikTok</a>');
    if (k.website) tombol.push('<a class="btn btn-outline" href="' + U.esc(k.website) + '" target="_blank" rel="noopener">Kunjungi Website Resmi</a>');
    if (k.email) tombol.push('<a class="btn btn-outline" href="mailto:' + U.esc(k.email) + '">Kirim Email</a>');

    if (!tombol.length) {
      return '<div class="empty"><strong>Kontak dan media sosial belum tersedia</strong>' +
        "Kami tidak menampilkan nomor telepon, akun media sosial, atau tautan apa pun yang belum dipastikan benar. " +
        "Menampilkan tautan yang salah akan lebih merugikan daripada tidak menampilkannya sama sekali. " +
        "Bila Anda pemilik usaha ini dan ingin datanya dicantumkan, sampaikan melalui halaman " +
        '<a href="tentang.html">Tentang Kami</a>.</div>';
    }
    return '<div class="contact-list">' + tombol.join("") + "</div>";
  }

  function bagianLokasi(u) {
    var html = "";
    if (u.alamat) {
      html = R.peta(u);
    } else {
      html = '<div class="empty"><strong>Lokasi menunggu verifikasi</strong>' +
        "Alamat usaha ini belum kami verifikasi, jadi kami tidak menampilkan peta. Menampilkan titik peta yang salah " +
        "dapat membuat pengunjung tersesat." +
        '<div class="flex mt-2" style="justify-content:center">' +
          '<a class="btn btn-outline" href="' + U.esc(U.mapsLink(u)) + '" target="_blank" rel="noopener">Cari di Google Maps</a>' +
        "</div>" +
        '<p class="map-note">Tombol di atas memerlukan koneksi internet dan hanya melakukan pencarian kata kunci, ' +
        "hasilnya dapat berupa beberapa lokasi dengan nama serupa.</p></div>";
    }
    return html;
  }

  function bagianUsahaTerkait(u) {
    var ids = (SC.UMKM_TERKAIT || {})[u.id] || [];
    var list = ids.map(U.findUMKM).filter(Boolean);
    if (!list.length) return "";
    return R.bagianTerkait("Usaha Lain yang Relevan",
      list.map(function (x, i) { return R.kartuUMKM(x, { delay: i % 3 }); }).join(""));
  }

  function bagianDestinasiTerkait(u) {
    /* Usaha dihubungkan ke destinasi hanya bila temanya jelas:
       songket dan kerajinan cocok dengan destinasi budaya, kuliner
       cocok dengan kawasan tepi sungai karena banyak dijual di sana. */
    var petaTema = {
      "Pempek": ["jembatan-ampera", "sungai-musi", "benteng-kuto-besak"],
      "Kuliner Khas": ["jembatan-ampera", "sungai-musi", "kampung-arab-al-munawar"],
      "Oleh-oleh": ["jembatan-ampera", "pulau-kemaro", "masjid-agung"],
      "Songket": ["kampung-kapitan", "kampung-arab-al-munawar", "masjid-agung"],
      "Kerajinan Tangan": ["kampung-kapitan", "kampung-arab-al-munawar"],
      "Kopi & Minuman": ["jembatan-ampera", "sungai-musi"]
    };
    var ids = petaTema[u.kategori] || [];
    var list = ids.map(U.findDestinasi).filter(Boolean);
    if (!list.length) return "";
    return R.bagianTerkait("Destinasi di Sekitar Kawasan Usaha Ini",
      list.map(function (d, i) { return R.kartuDestinasi(d, { delay: i % 3 }); }).join(""));
  }

  function gambarKosong() {
    var daftar = (SC.UMKM || []).map(function (u) {
      return '<li><a href="detail-umkm.html?id=' + encodeURIComponent(u.id) + '">' + U.esc(u.nama) + "</a></li>";
    }).join("");
    U.qs("#isiDetail").innerHTML =
      '<div class="empty" style="text-align:left">' +
        "<strong>Usaha yang diminta tidak ditemukan</strong>" +
        "<p>Tautan tidak memuat id usaha yang dikenal, atau id tersebut sudah berubah. Pilih salah satu entri berikut.</p>" +
        '<ul style="padding-left:20px">' + daftar + "</ul>" +
        '<p class="mt-2"><a class="btn btn-primary" href="umkm.html">Lihat direktori UMKM</a></p>' +
      "</div>";
    U.qs("#detailHero").style.display = "none";
  }

  function mulai() {
    var id = U.param("id");
    var u = id ? U.findUMKM(id) : null;
    if (!u) { gambarKosong(); return; }

    document.title = u.nama + " - Direktori UMKM Sriwijaya Culture";

    var fotoUtama = (u.gambar && u.gambar[0]) || null;
    U.qs("#detailHero").innerHTML =
      '<div class="hero-media">' +
        (fotoUtama ? '<img src="' + U.esc(fotoUtama.src) + '" alt="Foto ' + U.esc(u.nama) + '" width="1600" height="900">' : "") +
      "</div>" +
      '<div class="container detail-hero-inner">' +
        '<nav class="breadcrumb" aria-label="Jejak navigasi">' +
          '<a href="index.html">Beranda</a> &rsaquo; <a href="umkm.html">Direktori UMKM</a> &rsaquo; ' + U.esc(u.nama) +
        "</nav>" +
        "<h1>" + U.esc(u.nama) + "</h1>" +
        '<p class="lead" style="max-width:62ch">' + U.esc(u.ringkas) + "</p>" +
        '<div class="chips">' +
          R.chip(u.kategori, "chip chip-gold") +
          R.chip(u.wilayah, "chip") +
          R.chip((u.produk || []).length + " produk", "chip") +
        "</div>" +
      "</div>";

    var produk = (u.produk || []);
    var unggulan = produk.filter(function (p) { return p.unggulan; });

    U.qs("#isiDetail").innerHTML =
      pemberitahuanBelumTerverifikasi(u) +
      '<div class="detail-layout mt-3">' +
        '<div class="detail-main">' +
          '<section aria-labelledby="judulProfil">' +
            "<h2 id=\"judulProfil\">Profil Usaha</h2>" +
            "<p>" + U.esc(u.profil) + "</p>" +
            (u.sejarah ? "<h3>Sejarah Usaha</h3><p>" + U.esc(u.sejarah) + "</p>" : "") +
          "</section>" +
          '<section aria-labelledby="judulProduk">' +
            "<h2 id=\"judulProduk\">Produk Unggulan</h2>" +
            (unggulan.length
              ? "<p class=\"muted\">Produk yang ditandai unggulan berikut dipilih berdasarkan jenis usaha dan sumber yang dirujuk.</p>" +
                '<div class="grid grid-3">' + unggulan.map(function (p) { return R.kartuProduk(p); }).join("") + "</div>"
              : '<div class="empty"><strong>Produk unggulan belum ditetapkan</strong>' +
                "Kami belum memiliki dasar untuk menyatakan satu produk sebagai unggulan pada usaha ini.</div>") +
          "</section>" +
          (produk.length > unggulan.length
            ? '<section aria-labelledby="judulSemuaProduk">' +
                "<h2 id=\"judulSemuaProduk\">Produk Lain</h2>" +
                '<div class="grid grid-3">' +
                  produk.filter(function (p) { return !p.unggulan; }).map(function (p) { return R.kartuProduk(p); }).join("") +
                "</div>" +
              "</section>"
            : "") +
          '<section aria-labelledby="judulLokasiUMKM">' +
            "<h2 id=\"judulLokasiUMKM\">Lokasi Usaha</h2>" +
            bagianLokasi(u) +
          "</section>" +
          '<section aria-labelledby="judulKontak">' +
            "<h2 id=\"judulKontak\">Hubungi dan Ikuti Usaha</h2>" +
            bagianKontak(u) +
          "</section>" +
          '<section aria-labelledby="judulUlasanUMKM">' +
            "<h2 id=\"judulUlasanUMKM\">Ulasan dan Rekomendasi</h2>" +
            R.ulasan(u) +
            ((u.produk || []).filter(function (p) { return p.unggulan; }).length
              ? '<p class="small muted mt-2">Rekomendasi produk di halaman ini didasarkan pada penandaan unggulan di data usaha, ' +
                "bukan pada ulasan pelanggan yang belum tersedia.</p>"
              : "") +
          "</section>" +
          '<section aria-labelledby="judulSumberUMKM">' +
            "<h2 id=\"judulSumberUMKM\">Sumber Data</h2>" +
            R.daftarSumber(u.sumber, u.catatanVerifikasi) +
          "</section>" +
        "</div>" +
        '<aside class="detail-aside">' +
          '<div class="panel">' +
            "<h3>Ringkasan Usaha</h3>" +
            '<ul class="fact-list">' +
              "<li><span class=\"k\">Kategori</span><span class=\"v\">" + U.esc(u.kategori) + "</span></li>" +
              "<li><span class=\"k\">Wilayah</span><span class=\"v\">" + U.esc(u.wilayah) + "</span></li>" +
              "<li><span class=\"k\">Alamat</span><span class=\"v\">" +
                (u.alamat ? U.esc(u.alamat) : "Belum diverifikasi") + "</span></li>" +
              "<li><span class=\"k\">Jam</span><span class=\"v\">" + U.esc(u.jam ? u.jam.teks : "Belum diverifikasi") +
                (u.jam ? "<br>" + R.chipVerifikasi(u.jam.verifikasi) : "") + "</span></li>" +
              "<li><span class=\"k\">Status data</span><span class=\"v\">" +
                R.chipStatusData(u.statusData) + "</span></li>" +
            "</ul>" +
          "</div>" +
          '<div class="panel"><h3 class="mt-0">Simpan</h3>' +
            '<p class="small muted">Simpan usaha ini ke daftar favorit akun Anda.</p>' +
            R.favButton("umkm", u.id) +
          "</div>" +
          '<div class="panel"><h3 class="mt-0">Kisaran Harga</h3>' +
            "<p class=\"small muted mb-0\">" +
            "Kami tidak mencantumkan kisaran harga karena harga produk kuliner dan kerajinan berubah-ubah " +
            "dan tidak ada sumber resmi yang dapat kami rujuk. Untuk informasi harga, hubungi penjual langsung " +
            "melalui kontak di halaman ini bila tersedia.</p>" +
          "</div>" +
        "</aside>" +
      "</div>" +
      bagianUsahaTerkait(u) +
      bagianDestinasiTerkait(u);

    R.wireFavorit(document);
    if (SC._revealRefresh) SC._revealRefresh();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();