/* ============================================================
   halaman-akun.js - render formulir masuk / daftar dan dashboard akun
   ============================================================ */
(function () {
  "use strict";

  var SC = window.SC, U = SC.util, R = SC.render;
  var mount;

  function alertBox(teks, jenis) {
    return '<p class="form-msg ' + (jenis || "") + '" role="status" aria-live="polite">' + U.esc(teks || "") + "</p>";
  }

  function penggunaBelumMasuk(mode, pesan) {
    var daftar = mode === "daftar";
    mount.innerHTML =
      '<div class="panel auth-wrap">' +
        '<div class="auth-tabs" role="tablist" aria-label="Pilih tindakan akun">' +
          '<button type="button" role="tab" aria-selected="' + (!daftar) + '" id="tabMasuk">Masuk</button>' +
          '<button type="button" role="tab" aria-selected="' + daftar + '" id="tabDaftar">Buat akun</button>' +
        "</div>" +
        '<form id="formAkun" class="auth-form" novalidate>' +
          (daftar
            ? '<div class="field"><label for="nama">Nama tampilan</label><input id="nama" name="nama" type="text" maxlength="40" required autocomplete="name" placeholder="Nama Anda"></div>'
            : "") +
          '<div class="field"><label for="email">Alamat email</label><input id="email" name="email" type="email" maxlength="80" required autocomplete="email" placeholder="nama@contoh.com"></div>' +
          '<div class="field"><label for="password">Kata sandi</label><input id="password" name="password" type="password" maxlength="200" required autocomplete="' + (daftar ? "new-password" : "current-password") + '" placeholder="Minimal 6 karakter"></div>' +
          (daftar
            ? '<div class="field"><label for="password2">Ulangi kata sandi</label><input id="password2" name="password2" type="password" maxlength="200" required autocomplete="new-password" placeholder="Ulangi kata sandi"></div>'
            : "") +
          '<button class="btn btn-primary" type="submit" id="kirimAkun">' + (daftar ? "Buat akun lokal" : "Masuk") + "</button>" +
          '<div id="pesanAkun">' + alertBox(pesan || "", "") + "</div>" +
        "</form>" +
        '<div class="demo-note mt-2"><b>Batasan:</b> Akun disimpan di localStorage peramban ini. Kata sandi di-hash, tetapi penyimpanan lokal bukan autentikasi aman. Akun tidak tersinkron antarperangkat dan hilang jika data peramban dibersihkan. Jangan gunakan kata sandi yang sama dengan akun penting Anda.</div>' +
      "</div>";

    U.qs("#tabMasuk", mount).addEventListener("click", function () { penggunaBelumMasuk("masuk"); });
    U.qs("#tabDaftar", mount).addEventListener("click", function () { penggunaBelumMasuk("daftar"); });
    U.qs("#formAkun", mount).addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.currentTarget;
      var tombol = U.qs("#kirimAkun", form);
      tombol.disabled = true;
      tombol.textContent = "Memproses...";

      var op = daftar
        ? SC.akun.daftar(U.qs("#nama", form).value, U.qs("#email", form).value,
            U.qs("#password", form).value, U.qs("#password2", form).value)
        : SC.akun.masuk(U.qs("#email", form).value, U.qs("#password", form).value);

      op.then(function (user) {
        if (user.lemah) {
          penggunaMasuk();
          SC.beritahu("Akun tersimpan. Peramban ini tidak mendukung Web Crypto, sehingga hash kata sandi memakai mode terbatas.", "info");
        } else {
          penggunaMasuk();
          SC.beritahu(daftar ? "Akun lokal berhasil dibuat." : "Anda berhasil masuk.");
        }
      }).catch(function (err) {
        tombol.disabled = false;
        tombol.textContent = daftar ? "Buat akun lokal" : "Masuk";
        U.qs("#pesanAkun", form).innerHTML = alertBox(err.message || "Terjadi kesalahan.", "err");
      });
    });
  }

  function itemFavorit(jenis, id) {
    var data = jenis === "destinasi" ? U.findDestinasi(id) :
      (jenis === "umkm" ? U.findUMKM(id) : U.findArtikel(id));
    if (!data) return "";
    var url = jenis === "destinasi" ? "detail-destinasi.html?id=" + encodeURIComponent(id) :
      (jenis === "umkm" ? "detail-umkm.html?id=" + encodeURIComponent(id) : "detail-artikel.html?id=" + encodeURIComponent(id));
    return '<li style="display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px dashed var(--line)">' +
      '<a href="' + url + '">' + U.esc(data.nama || data.judul) + "</a>" +
      '<button class="btn btn-outline btn-sm" type="button" data-hapus-fav data-jenis="' + U.esc(jenis) + '" data-id="' + U.esc(id) + '">Hapus</button>' +
    "</li>";
  }

  function seksiFavorit(jenis, ids, label) {
    var items = ids.map(function (id) { return itemFavorit(jenis, id); }).filter(Boolean);
    return '<section class="mt-3"><h3>' + U.esc(label) + " (" + items.length + ")</h3>" +
      (items.length
        ? '<ul style="list-style:none;padding:0;margin:0">' + items.join("") + "</ul>"
        : '<p class="muted">Belum ada favorit di kategori ini.</p>') +
    "</section>";
  }

  function penggunaMasuk() {
    var user = SC.akun.sesi();
    if (!user) { penggunaBelumMasuk("masuk"); return; }

    var ringkas = SC.akun.ringkas();
    mount.innerHTML =
      '<div class="panel">' +
        '<div class="flex spread"><div><p class="kicker">Selamat datang kembali</p><h2 class="mt-0">' + U.esc(user.nama) + "</h2><p class=\"muted mb-0\">" + U.esc(user.email) + "</p></div>" +
        '<button type="button" class="btn btn-outline" id="keluar">Keluar</button></div>' +
        '<div class="grid grid-3 mt-3">' +
          '<div class="panel"><b>' + ringkas.favorit.destinasi + "</b><div class=\"muted small\">Destinasi favorit</div></div>" +
          '<div class="panel"><b>' + ringkas.favorit.umkm + "</b><div class=\"muted small\">UMKM favorit</div></div>" +
          '<div class="panel"><b>' + ringkas.favorit.artikel + "</b><div class=\"muted small\">Artikel favorit</div></div>" +
        "</div>" +
        seksiFavorit("destinasi", user.favorit.destinasi || [], "Destinasi") +
        seksiFavorit("umkm", user.favorit.umkm || [], "UMKM") +
        seksiFavorit("artikel", user.favorit.artikel || [], "Artikel") +
        '<div class="legend-note mt-3"><b>Catatan penyimpanan:</b> daftar ini hanya ada di peramban dan perangkat saat ini. Tidak ada akun server atau sinkronisasi cloud.</div>' +
        '<div class="flex mt-3"><button type="button" class="btn btn-outline" id="hapusAkun">Hapus akun dan seluruh data lokal</button></div>' +
        '<div id="pesanHapus"></div>' +
      "</div>";

    U.qs("#keluar", mount).addEventListener("click", function () {
      SC.akun.keluar();
      penggunaBelumMasuk("masuk", "Anda telah keluar.");
      SC.beritahu("Anda telah keluar.");
    });

    U.qsa("[data-hapus-fav]", mount).forEach(function (b) {
      b.addEventListener("click", function () {
        SC.akun.toggleFavorit(b.getAttribute("data-jenis"), b.getAttribute("data-id"));
        penggunaMasuk();
        SC.beritahu("Favorit dihapus.");
      });
    });

    U.qs("#hapusAkun", mount).addEventListener("click", function () {
      var target = U.qs("#pesanHapus", mount);
      target.innerHTML = '<div class="legend-note mt-2"><b>Konfirmasi penghapusan.</b> Tindakan ini menghapus akun dan semua favorit lokal di perangkat ini. Perubahan tidak dapat dibatalkan. <div class="flex mt-1"><button type="button" class="btn btn-outline btn-sm" id="batalHapus">Batal</button><button type="button" class="btn btn-primary btn-sm" id="konfirmasiHapus">Ya, hapus akun dan data</button></div></div>';
      U.qs("#batalHapus", target).addEventListener("click", function () { target.innerHTML = ""; });
      U.qs("#konfirmasiHapus", target).addEventListener("click", function () {
        SC.akun.hapusAkun();
        penggunaBelumMasuk("masuk", "Akun lokal dan daftar favorit sudah dihapus.");
      });
    });
  }

  function mulai() {
    mount = U.qs("#authKonten");
    if (!mount) return;
    if (SC.akun.sesi()) penggunaMasuk();
    else penggunaBelumMasuk(U.param("daftar") === "1" ? "daftar" : "masuk");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai);
  else mulai();

  SC.mulai();
})();