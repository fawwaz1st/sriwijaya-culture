/* ============================================================
   admin.js - ringkasan isi data dan pemeriksaan tautan internal

   Halaman ini tidak memerlukan login. Tujuannya memberi pemilik
   situs satu tempat untuk melihat status data tanpa membuka
   berkas JavaScript satu per satu.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util;

  var LABEL = {
    "tinggi": "Terverifikasi",
    "sedang": "Sumber tunggal",
    "perlu-konfirmasi": "Perlu konfirmasi",
    "rendah": "Data lemah"
  };

  function mulai() {
    var dest = SC.DESTINASI || [], umkm = SC.UMKM || [], art = SC.ARTIKEL || [];

    /* kartu statistik */
    var perluKonfirmasi = dest.filter(function (d) {
      return d.tiket.verifikasi === "perlu-konfirmasi" || d.jam.verifikasi === "perlu-konfirmasi";
    }).length;
    var demo = umkm.filter(function (u) { return u.statusData === "demonstrasi"; }).length;
    var totalSumber = art.reduce(function (n, a) { return n + (a.sumber || []).length; }, 0);
    var totalFoto = dest.reduce(function (n, d) { return n + (d.gambar || []).length; }, 0) +
      umkm.reduce(function (n, u) { return n + (u.gambar || []).length; }, 0);

    U.qs("#kartuStatistik").innerHTML =
      kartuStat("Destinasi", dest.length, perluKonfirmasi + " perlu konfirmasi") +
      kartuStat("Entri UMKM", umkm.length, demo + " data demonstrasi") +
      kartuStat("Artikel", art.length, totalSumber + " rujukan sumber") +
      kartuStat("Foto terdata", totalFoto, "semua berlisensi bebas");

    /* tabel verifikasi destinasi */
    U.qs("#tabelVerifikasi").innerHTML = dest.map(function (d) {
      return "<tr><td>" + U.esc(d.nama) + "</td><td>" + U.esc(LABEL[d.tiket.verifikasi] || d.tiket.verifikasi) +
        "</td><td>" + U.esc(LABEL[d.jam.verifikasi] || d.jam.verifikasi) + "</td></tr>";
    }).join("");

    /* tabel UMKM */
    U.qs("#tabelUMKM").innerHTML = umkm.map(function (u) {
      return "<tr><td>" + U.esc(u.nama) + "</td><td>" + U.esc(u.kategori) + "</td><td>" +
        U.esc(u.statusData === "demonstrasi" ? "Demonstrasi" : "Rujukan publik") + "</td></tr>";
    }).join("");

    /* pemeriksaan tautan internal.
       Daftar berkas yang benar-benar ada di proyek ini. Bila ada
       tautan ke berkas yang tidak ada, baris ditandai merah. */
    var berkasAda = [
      "index.html", "destinasi.html", "detail-destinasi.html", "umkm.html", "detail-umkm.html",
      "artikel.html", "detail-artikel.html", "tentang.html", "akun.html", "metodologi.html", "admin.html"
    ];
    var tautan = SC.tautanInternal();
    var petaUnik = {};
    tautan.forEach(function (t) {
      var href = t.href.split("#")[0].split("?")[0];
      if (!href) return;
      petaUnik[href] = petaUnik[href] || { href: href, jumlah: 0 };
      petaUnik[href].jumlah += 1;
    });
    var daftar = Object.keys(petaUnik).map(function (k) { return petaUnik[k]; }).sort(function (a, b) {
      return a.href.localeCompare(b.href);
    });
    var rusak = daftar.filter(function (t) { return berkasAda.indexOf(t.href) < 0; });

    U.qs("#hasilCekTautan").innerHTML =
      '<p class="small muted">Total tautan internal unik: <b>' + daftar.length + "</b>. " +
      "Tautan bermasalah: <b>" + rusak.length + "</b>.</p>" +
      (rusak.length
        ? '<div class="legend-note">Ada tautan ke berkas yang tidak ada: ' +
          rusak.map(function (t) { return "<code>" + U.esc(t.href) + "</code>"; }).join(", ") + "</div>"
        : '<div class="legend-note">Semua tautan internal mengarah ke berkas yang ada di proyek ini.</div>') +
      '<div class="table-wrap mt-2"><table class="mini-table"><thead><tr><th>Berkas tujuan</th><th>Jumlah tautan</th><th>Status</th></tr></thead><tbody>' +
      daftar.map(function (t) {
        var ok = berkasAda.indexOf(t.href) >= 0;
        return "<tr><td>" + U.esc(t.href) + "</td><td>" + t.jumlah + "</td><td>" +
          (ok ? "Ada" : "Tidak ditemukan") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  function kartuStat(label, nilai, catatan) {
    return '<div class="panel reveal"><div class="small muted">' + U.esc(label) + "</div>" +
      '<div style="font:700 2rem var(--font-head);color:var(--accent-text);line-height:1.1">' + nilai + "</div>" +
      '<div class="small muted">' + U.esc(catatan) + "</div></div>";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();