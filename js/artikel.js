/* ============================================================
   artikel.js - katalog artikel sejarah dan budaya
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render;

  var state = { q: "", kategori: "" };
  var grid, jumlah, kosong, input, selectKategori;

  function hasil() {
    var q = U.norm(state.q);
    return (SC.ARTIKEL || []).slice().sort(function (a, b) {
      return String(b.tanggal).localeCompare(String(a.tanggal));
    }).filter(function (a) {
      if (state.kategori && a.kategori !== state.kategori) return false;
      if (!q) return true;
      var isi = (a.bagian || []).map(function (b) { return (b.subjudul || "") + " " + (b.paragraf || []).join(" "); }).join(" ");
      var bak = U.norm([a.judul, a.kategori, a.ringkas, a.pendahuluan, isi].join(" "));
      return q.split(" ").every(function (t) { return bak.indexOf(t) >= 0; });
    });
  }

  function gambar() {
    var list = hasil();
    if (!list.length) {
      grid.innerHTML = "";
      kosong.hidden = false;
      kosong.innerHTML = "<strong>Artikel tidak ditemukan</strong>" +
        "Coba kata kunci lain seperti <i>ampera</i>, <i>sriwijaya</i>, <i>songket</i>, atau pilih kategori berbeda.";
      jumlah.textContent = "Tidak ada hasil";
      return;
    }
    kosong.hidden = true;
    grid.innerHTML = list.map(function (a, i) { return R.kartuArtikel(a, { delay: i % 3, visual: true }); }).join("");
    jumlah.textContent = "Menampilkan " + list.length + " dari " + (SC.ARTIKEL || []).length + " artikel";
    if (SC._revealRefresh) SC._revealRefresh();
  }

  function mulai() {
    grid = U.qs("#gridArtikel");
    jumlah = U.qs("#jumlahArtikel");
    kosong = U.qs("#kosongArtikel");
    input = U.qs("#cariArtikel");
    selectKategori = U.qs("#filterKategoriArtikel");
    if (!grid) return;

    selectKategori.innerHTML = '<option value="">Semua kategori</option>' +
      SC.KATEGORI_ARTIKEL.map(function (k) {
        var n = (SC.ARTIKEL || []).filter(function (a) { return a.kategori === k; }).length;
        return '<option value="' + U.esc(k) + '">' + U.esc(k) + " (" + n + ")</option>";
      }).join("");

    state.kategori = U.param("kategori", "");
    if (state.kategori && SC.KATEGORI_ARTIKEL.indexOf(state.kategori) < 0) state.kategori = "";
    selectKategori.value = state.kategori;

    input.value = U.param("q", "");
    state.q = input.value;

    input.addEventListener("input", U.debounce(function () {
      state.q = U.clampText(input.value, 80);
      gambar();
    }, 140));
    selectKategori.addEventListener("change", function () {
      state.kategori = selectKategori.value;
      gambar();
    });

    var kategoriCepat = U.qs("#kategoriArtikel");
    if (kategoriCepat) {
      kategoriCepat.innerHTML = SC.KATEGORI_ARTIKEL.map(function (k) {
        var n = (SC.ARTIKEL || []).filter(function (a) { return a.kategori === k; }).length;
        return '<button type="button" class="chip chip-gold" data-kat="' + U.esc(k) + '" style="cursor:pointer">' +
          U.esc(k) + " (" + n + ")</button>";
      }).join("");
      U.qsa("[data-kat]", kategoriCepat).forEach(function (b) {
        b.addEventListener("click", function () {
          selectKategori.value = b.getAttribute("data-kat");
          state.kategori = selectKategori.value;
          gambar();
        });
      });
    }

    gambar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();