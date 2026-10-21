/* ============================================================
   umkm.js - halaman direktori UMKM

   Pencarian di sini mencari nama usaha, kategori, wilayah, nama
   produk, dan deskripsi produk. Jadi pengunjung dapat mencari
   "kapal selam" dan menemukan usaha yang menjual pempek kapal
   selam, tanpa harus tahu nama usahanya lebih dulu.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render;

  var state = { q: "", kategori: "" };
  var grid, jumlah, kosong, input, clearBtn, selectKategori;

  function bakTeks(u) {
    var produk = (u.produk || []).map(function (p) { return p.nama + " " + p.deskripsi; }).join(" ");
    return U.norm([u.nama, u.kategori, u.wilayah, u.ringkas, u.profil, produk].join(" "));
  }

  function hasil() {
    var q = U.norm(state.q);
    return (SC.UMKM || []).filter(function (u) {
      if (state.kategori && u.kategori !== state.kategori) return false;
      if (!q) return true;
      var bak = bakTeks(u);
      return q.split(" ").every(function (t) { return bak.indexOf(t) >= 0; });
    });
  }

  function gambar() {
    var list = hasil();
    if (!list.length) {
      grid.innerHTML = "";
      kosong.hidden = false;
      kosong.innerHTML = "<strong>Usaha tidak ditemukan</strong>" +
        "Coba gunakan nama usaha lain, pilih kategori berbeda, atau kosongkan kolom pencarian. " +
        "Pencarian juga dapat memakai nama produk, misalnya <i>kapal selam</i> atau <i>songket</i>.";
      jumlah.textContent = "Tidak ada hasil";
      return;
    }
    kosong.hidden = true;
    grid.innerHTML = list.map(function (u, i) { return R.kartuUMKM(u, { delay: i % 3, visual: true }); }).join("");
    jumlah.textContent = "Menampilkan " + list.length + " dari " + (SC.UMKM || []).length + " entri usaha";
    if (SC._revealRefresh) SC._revealRefresh();
  }

  function isiKategori() {
    selectKategori.innerHTML = '<option value="">Semua kategori</option>' +
      SC.KATEGORI_UMKM.map(function (k) {
        return '<option value="' + U.esc(k) + '">' + U.esc(k) + "</option>";
      }).join("");
  }

  function mulai() {
    grid = U.qs("#gridUMKM");
    jumlah = U.qs("#jumlahUMKM");
    kosong = U.qs("#kosongUMKM");
    input = U.qs("#cariUMKM");
    clearBtn = U.qs("#hapusCariUMKM");
    selectKategori = U.qs("#filterKategori");
    if (!grid) return;

    isiKategori();

    state.kategori = U.param("kategori", "");
    if (state.kategori && SC.KATEGORI_UMKM.indexOf(state.kategori) < 0) state.kategori = "";
    selectKategori.value = state.kategori;

    input.value = U.param("q", "");
    state.q = input.value;
    clearBtn.hidden = !state.q;

    input.addEventListener("input", U.debounce(function () {
      state.q = U.clampText(input.value, 80);
      clearBtn.hidden = !state.q;
      gambar();
    }, 140));
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; state.q = ""; clearBtn.hidden = true; gambar(); }
    });
    clearBtn.addEventListener("click", function () {
      input.value = ""; state.q = ""; clearBtn.hidden = true; input.focus(); gambar();
    });

    selectKategori.addEventListener("change", function () {
      state.kategori = selectKategori.value;
      gambar();
    });

    var reset = U.qs("#resetUMKM");
    if (reset) {
      reset.addEventListener("click", function () {
        input.value = ""; state.q = ""; state.kategori = "";
        selectKategori.value = "";
        clearBtn.hidden = true;
        gambar();
        SC.beritahu("Pencarian dan filter dikosongkan.");
      });
    }

    var kategoriCepat = U.qs("#kategoriCepat");
    if (kategoriCepat) {
      kategoriCepat.innerHTML = SC.KATEGORI_UMKM.map(function (k) {
        var n = (SC.UMKM || []).filter(function (u) { return u.kategori === k; }).length;
        return '<button type="button" class="chip chip-gold" data-kat="' + U.esc(k) + '" style="cursor:pointer">' +
          U.esc(k) + " (" + n + ")</button>";
      }).join("");
      U.qsa("[data-kat]", kategoriCepat).forEach(function (b) {
        b.addEventListener("click", function () {
          selectKategori.value = b.getAttribute("data-kat");
          state.kategori = selectKategori.value;
          gambar();
          U.qs("#gridUMKM").scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    gambar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();