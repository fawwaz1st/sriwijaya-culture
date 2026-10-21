/* ============================================================
   metodologi.js - tabel kredit gambar + ringkasan cakupan data

   Data kredit di bawah diambil dari metadata Wikimedia Commons
   saat berkas diunduh (field LicenseShortName dan Artist).
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util;

  var KREDIT = [
    { berkas: "ampera-1.jpg", objek: "Jembatan Ampera", lisensi: "CC BY-SA 4.0", penulis: "Hillun Vilayl Napis (WMID)" },
    { berkas: "ampera-2.jpg", objek: "Jembatan Ampera malam hari", lisensi: "CC BY-SA 3.0", penulis: "Spartacks Compatriot" },
    { berkas: "ampera-3.jpg", objek: "Kawasan Ampera dan LRT Palembang", lisensi: "CC BY-SA 4.0", penulis: "Herusutimbul" },
    { berkas: "kemaro-2.jpg", objek: "Pagoda Pulau Kemaro", lisensi: "CC BY 4.0", penulis: "Cendy00" },
    { berkas: "bkb-1.jpg", objek: "Benteng Kuto Besak", lisensi: "CC BY 2.0", penulis: "Kontributor Flickr melalui Wikimedia Commons" },
    { berkas: "bkb-2.jpg", objek: "Sudut Benteng Kuto Besak", lisensi: "CC BY-SA 4.0", penulis: "Iwan Said" },
    { berkas: "masjid-1.jpg", objek: "Masjid Agung Palembang", lisensi: "CC BY-SA 4.0", penulis: "Swarabakti" },
    { berkas: "masjid-2.jpg", objek: "Masjid Agung Palembang malam hari", lisensi: "CC BY-SA 4.0", penulis: "Amr.photos" },
    { berkas: "museum-1.jpg", objek: "Museum Sultan Mahmud Badaruddin II", lisensi: "CC BY 2.0", penulis: "Kontributor Flickr melalui Wikimedia Commons" },
    { berkas: "museum-2.jpg", objek: "Koleksi lukisan Museum SMB II", lisensi: "CC BY 4.0", penulis: "Cendy00" },
    { berkas: "monpera-1.jpg", objek: "Monumen Perjuangan Rakyat", lisensi: "CC BY 4.0", penulis: "Rubioxo" },
    { berkas: "kapitan-1.jpg", objek: "Rumah tua Kampung Kapitan", lisensi: "CC BY 2.0", penulis: "baka_neko_baka" },
    { berkas: "musi-1.jpg", objek: "Sungai Musi", lisensi: "CC BY-SA 4.0", penulis: "Cynthia.veronica" },
    { berkas: "musi-2.jpg", objek: "Perahu di Sungai Musi", lisensi: "CC BY-SA 4.0", penulis: "Oka1302" },
    { berkas: "tpks-1.jpg", objek: "Taman Purbakala Kerajaan Sriwijaya", lisensi: "CC BY-SA 4.0", penulis: "Firzafp" },
    { berkas: "tpks-2.jpg", objek: "Pendopo Taman Purbakala", lisensi: "CC BY-SA 3.0", penulis: "Gunkarta" },
    { berkas: "tpks-3.jpg", objek: "Museum Sriwijaya", lisensi: "CC BY-SA 3.0", penulis: "Gunkarta" },
    { berkas: "songket-1.jpg", objek: "Kain songket Palembang", lisensi: "CC BY-SA 4.0", penulis: "Afrinaldi" },
    { berkas: "songket-2.jpg", objek: "Proses menenun songket", lisensi: "CC BY-SA 4.0", penulis: "Swarabakti" },
    { berkas: "pempek-1.jpg", objek: "Pempek Palembang", lisensi: "CC BY-SA 4.0", penulis: "Masdepjimin" },
    { berkas: "pempek-2.jpg", objek: "Pempek campur", lisensi: "CC BY-SA 3.0", penulis: "Midori" },
    { berkas: "pempek-3.jpg", objek: "Pempek keriting", lisensi: "CC BY 4.0", penulis: "Sweetyku" },
    { berkas: "kedukan-1.jpg", objek: "Prasasti Kedukan Bukit", lisensi: "CC BY-SA 4.0", penulis: "Gunkarta" },
    { berkas: "kedukan-2.jpg", objek: "Prasasti Kedukan Bukit", lisensi: "CC BY-SA 4.0", penulis: "Gunkarta" }
  ];

  function mulai() {
    var tabel = U.qs("#tabelKredit");
    if (tabel) {
      tabel.innerHTML = KREDIT.map(function (k) {
        return "<tr><td>" + U.esc(k.berkas) + "</td><td>" + U.esc(k.objek) + "</td><td>" +
          U.esc(k.lisensi) + "</td><td>" + U.esc(k.penulis) + "</td></tr>";
      }).join("");
    }

    /* ringkasan cakupan data, dihitung dari data nyata */
    var ringkas = U.qs("#ringkasData");
    if (ringkas) {
      var dest = SC.DESTINASI || [], umkm = SC.UMKM || [], art = SC.ARTIKEL || [];
      var perluKonfirmasi = dest.filter(function (d) {
        return d.tiket.verifikasi === "perlu-konfirmasi" || d.jam.verifikasi === "perlu-konfirmasi";
      }).length;
      var demo = umkm.filter(function (u) { return u.statusData === "demonstrasi"; }).length;
      var sumber = art.reduce(function (n, a) { return n + (a.sumber || []).length; }, 0);
      ringkas.innerHTML =
        "<li>Destinasi terdata: <b>" + dest.length + "</b>, di antaranya <b>" + perluKonfirmasi +
          "</b> memiliki tiket atau jam yang perlu konfirmasi.</li>" +
        "<li>Entri UMKM: <b>" + umkm.length + "</b>, di antaranya <b>" + demo +
          "</b> berlabel data demonstrasi.</li>" +
        "<li>Artikel: <b>" + art.length + "</b> dengan total <b>" + sumber + "</b> rujukan sumber.</li>" +
        "<li>Foto berlisensi bebas: <b>" + KREDIT.length + "</b> berkas.</li>";
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();