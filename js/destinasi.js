/* ============================================================
   destinasi.js - halaman katalog destinasi wisata

   Halaman ini sengaja sederhana: satu kolom pencarian saja.
   Filter kategori dan wilayah tidak ditampilkan sebagai pilihan
   karena daftar destinasi sudah cukup pendek untuk ditelusuri
   dengan pencarian nama. Tautan kategori dari asisten tetap
   berfungsi: bila URL memuat ?kategori=..., halaman menampilkan
   penanda filter aktif yang dapat dihapus.
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util;

  var state = { q: "", kategori: null };
  var grid, jumlah, empty, input, clearBtn, filterBar;

  function hasil() {
    var q = U.norm(state.q);
    return (SC.DESTINASI || []).filter(function (d) {
      if (state.kategori && (d.kategori || []).indexOf(state.kategori) < 0) return false;
      if (!q) return true;
      /* Pencarian mencakup nama, wilayah, kategori, dan ringkasan
         supaya kata seperti "religi" atau "uluan" tetap menemukan
         destinasi yang relevan, bukan hanya nama persis. */
      var bak = U.norm([d.nama, d.wilayah, (d.kategori || []).join(" "), d.ringkas, d.alamat].join(" "));
      return q.split(" ").every(function (t) { return bak.indexOf(t) >= 0; });
    });
  }

  function gambar(filtered) {
    var list = hasil();
    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      empty.innerHTML = '<strong>Destinasi tidak ditemukan</strong>' +
        "Coba gunakan nama destinasi lain, atau hapus kata pencarian untuk melihat seluruh " +
        (SC.DESTINASI || []).length + " destinasi yang tersedia.";
      jumlah.textContent = "Tidak ada hasil";
      return;
    }
    empty.hidden = true;
    grid.innerHTML = list.map(function (d, i) {
      return SC.render.kartuDestinasi(d, { delay: i % 3, visual: true });
    }).join("");
    jumlah.textContent = "Menampilkan " + list.length + " dari " + (SC.DESTINASI || []).length + " destinasi";
    SC.render.wireFavorit(grid);
    /* kartu baru perlu diamati ulang oleh IntersectionObserver */
    if (SC._revealRefresh) SC._revealRefresh();
  }

  function renderFilterBar() {
    if (!state.kategori) { filterBar.hidden = true; filterBar.innerHTML = ""; return; }
    filterBar.hidden = false;
    filterBar.innerHTML = '<span class="chip chip-gold">Filter kategori: ' + U.esc(state.kategori) + "</span>" +
      '<button type="button" class="btn btn-outline btn-sm" id="hapusFilter">Hapus filter kategori</button>';
    U.qs("#hapusFilter", filterBar).addEventListener("click", function () {
      state.kategori = null;
      var url = new URL(window.location.href);
      url.searchParams.delete("kategori");
      window.history.replaceState({}, "", url);
      renderFilterBar();
      gambar();
    });
  }

  function mulai() {
    grid = U.qs("#gridDestinasi");
    jumlah = U.qs("#jumlahHasil");
    empty = U.qs("#kosongDestinasi");
    input = U.qs("#cariDestinasi");
    clearBtn = U.qs("#hapusCari");
    filterBar = U.qs("#filterAktif");
    if (!grid) return;

    state.kategori = U.param("kategori");
    if (state.kategori && SC.KATEGORI_DESTINASI.indexOf(state.kategori) < 0) state.kategori = null;

    input.value = U.param("q", "");
    state.q = input.value;

    input.addEventListener("input", U.debounce(function () {
      state.q = U.clampText(input.value, 80);
      clearBtn.hidden = !state.q;
      gambar();
    }, 140));
    /* Escape mengosongkan kolom, ini kebiasaan yang diharapkan
       pengguna pada kolom pencarian. */
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; state.q = ""; clearBtn.hidden = true; gambar(); }
    });
    clearBtn.hidden = !state.q;
    clearBtn.addEventListener("click", function () {
      input.value = ""; state.q = ""; clearBtn.hidden = true; input.focus(); gambar();
    });

    renderFilterBar();
    gambar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();