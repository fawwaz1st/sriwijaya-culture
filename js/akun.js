/* ============================================================
   akun.js - fitur akun (daftar, masuk, keluar, favorit)

   KEJUJURAN TEKNIS (ditampilkan juga di antarmuka):
   Website ini tidak memiliki backend atau database. Semua akun
   disimpan di localStorage browser pengguna, artinya:
     1. Akun hanya ada di perangkat ini, tidak dapat dipakai di
        perangkat lain.
     2. Data hilang bila pengguna membersihkan data browser.
     3. Ini BUKAN sistem autentikasi yang aman. Kata sandi disimpan
        sebagai hash SHA-256 dengan salt hanya untuk menghindari
        penyimpanan teks polos, bukan untuk melindungi dari penyerang
        yang memiliki akses ke perangkat.
   Kegunaan fitur ini adalah menunjukkan bahwa satu akun dapat
   menyimpan daftar favorit destinasi, UMKM, dan artikel, serta
   memberi sapaan yang sesuai saat pengunjung kembali.
   ============================================================ */
(function () {
  "use strict";

  window.SC = window.SC || {};
  var SC = window.SC, U = SC.util;

  var KEY_USERS = "sc-akun-daftar";
  var KEY_SESI = "sc-akun-sesi";

  /* ---------------- penyimpanan aman (localStorage bisa gagal) ---------------- */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------------- hashing ---------------- */

  function keHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ("00" + b.toString(16)).slice(-2);
    }).join("");
  }

  /* SHA-256 lewat Web Crypto. Bila tidak tersedia (konteks non-secure
     pada beberapa browser), jatuh ke fungsi hash sederhana dan
     memberi tahu pemanggil bahwa mode lemah sedang dipakai. */
  function hash(pw, salt) {
    var teks = salt + "::" + pw;
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(teks))
        .then(function (buf) { return { hash: keHex(buf), lemah: false }; });
    }
    /* fallback: FNV-1a yang diperluas. Bukan kriptografi, hanya untuk
       menghindari penyimpanan teks polos pada konteks non-secure. */
    var h1 = 0x811c9dc5, h2 = 0x1000193;
    for (var i = 0; i < teks.length; i++) {
      h1 ^= teks.charCodeAt(i); h1 = (h1 * 16777619) >>> 0;
      h2 = ((h2 << 5) - h2 + teks.charCodeAt(i)) >>> 0;
    }
    return Promise.resolve({ hash: "weak-" + h1.toString(16) + h2.toString(16), lemah: true });
  }

  function saltBaru() {
    var a = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
    else for (var i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
    return keHex(a.buffer);
  }

  /* ---------------- validasi input ---------------- */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function validasi(nama, email, pw, pw2, mode) {
    var err = [];
    nama = String(nama || "").trim();
    email = String(email || "").trim().toLowerCase();

    if (mode === "daftar") {
      if (nama.length < 2) err.push("Nama minimal 2 karakter.");
      if (nama.length > 40) err.push("Nama maksimal 40 karakter.");
      if (!EMAIL_RE.test(email)) err.push("Alamat email belum sesuai format yang benar.");
      if (email.length > 80) err.push("Alamat email terlalu panjang.");
      if (String(pw).length < 6) err.push("Kata sandi minimal 6 karakter.");
      if (String(pw).length > 200) err.push("Kata sandi terlalu panjang.");
      if (pw !== pw2) err.push("Ulangi kata sandi belum sama.");
    } else {
      if (!EMAIL_RE.test(email)) err.push("Masukkan alamat email yang benar.");
      if (!String(pw)) err.push("Masukkan kata sandi.");
    }
    return err;
  }

  /* ---------------- API akun ---------------- */

  SC.akun = {
    daftar: function (nama, email, pw, pw2) {
      var err = validasi(nama, email, pw, pw2, "daftar");
      if (err.length) return Promise.reject(new Error(err.join(" ")));

      var users = read(KEY_USERS, []);
      email = String(email).trim().toLowerCase();
      if (users.some(function (u) { return u.email === email; })) {
        return Promise.reject(new Error("Email ini sudah terdaftar di perangkat ini. Silakan masuk."));
      }
      var salt = saltBaru();
      return hash(pw, salt).then(function (r) {
        var user = {
          id: "u" + Date.now().toString(36),
          nama: String(nama).trim().slice(0, 40),
          email: email,
          salt: salt,
          hash: r.hash,
          lemah: r.lemah,
          dibuat: new Date().toISOString(),
          favorit: { destinasi: [], umkm: [], artikel: [] }
        };
        users.push(user);
        if (!write(KEY_USERS, users)) {
          throw new Error("Penyimpanan browser tidak dapat diakses. Akun tidak dapat dibuat.");
        }
        write(KEY_SESI, { email: email });
        return { nama: user.nama, email: user.email, lemah: r.lemah };
      });
    },

    masuk: function (email, pw) {
      var err = validasi("", email, pw, "", "masuk");
      if (err.length) return Promise.reject(new Error(err.join(" ")));

      var users = read(KEY_USERS, []);
      email = String(email).trim().toLowerCase();
      var user = users.filter(function (u) { return u.email === email; })[0];
      if (!user) {
        return Promise.reject(new Error("Email ini belum terdaftar di perangkat ini."));
      }
      return hash(pw, user.salt).then(function (r) {
        if (r.hash !== user.hash) throw new Error("Kata sandi belum sesuai.");
        write(KEY_SESI, { email: email });
        return { nama: user.nama, email: user.email, lemah: user.lemah };
      });
    },

    keluar: function () {
      try { localStorage.removeItem(KEY_SESI); } catch (e) {}
    },

    sesi: function () {
      var s = read(KEY_SESI, null);
      if (!s || !s.email) return null;
      var users = read(KEY_USERS, []);
      var user = users.filter(function (u) { return u.email === s.email; })[0];
      if (!user) return null;
      return { id: user.id, nama: user.nama, email: user.email, favorit: user.favorit || { destinasi: [], umkm: [], artikel: [] } };
    },

    _tulisUser: function (email, mut) {
      var users = read(KEY_USERS, []);
      var idx = -1;
      users.forEach(function (u, i) { if (u.email === email) idx = i; });
      if (idx < 0) return false;
      mut(users[idx]);
      return write(KEY_USERS, users);
    },

    /* Favorit disimpan per jenis supaya halaman dapat menyaring
       dengan mudah: destinasi, umkm, artikel. */
    toggleFavorit: function (jenis, id) {
      var sesi = SC.akun.sesi();
      if (!sesi) return { ok: false, alasan: "belum-masuk" };
      if (!SC.akun.FAVORIT_VALID[jenis]) return { ok: false, alasan: "jenis-tidak-valid" };
      var hasil = { ok: true, aktif: false };
      SC.akun._tulisUser(sesi.email, function (u) {
        u.favorit = u.favorit || { destinasi: [], umkm: [], artikel: [] };
        var arr = u.favorit[jenis] || [];
        var i = arr.indexOf(id);
        if (i >= 0) { arr.splice(i, 1); hasil.aktif = false; }
        else { arr.unshift(id); hasil.aktif = true; }
        u.favorit[jenis] = arr;
      });
      return hasil;
    },

    favorit: function (jenis) {
      var sesi = SC.akun.sesi();
      if (!sesi) return [];
      return (SC.akun.sesi().favorit[jenis] || []);
    },

    FAVORIT_VALID: { destinasi: true, umkm: true, artikel: true },

    /* Hitung rincian akun untuk halaman akun dan halaman ringkasan. */
    ringkas: function () {
      var users = read(KEY_USERS, []);
      var sesi = SC.akun.sesi();
      var fav = sesi ? sesi.favorit : { destinasi: [], umkm: [], artikel: [] };
      return {
        jumlahAkun: users.length,
        masuk: !!sesi,
        nama: sesi ? sesi.nama : null,
        email: sesi ? sesi.email : null,
        lemah: !!(sesi && (users.filter(function (u) { return u.email === sesi.email; })[0] || {}).lemah),
        favorit: {
          destinasi: (fav.destinasi || []).length,
          umkm: (fav.umkm || []).length,
          artikel: (fav.artikel || []).length
        }
      };
    },

    /* Hapus akun milik sesi aktif. Sisa akun lain tidak tersentuh. */
    hapusAkun: function () {
      var sesi = SC.akun.sesi();
      if (!sesi) return false;
      var users = read(KEY_USERS, []).filter(function (u) { return u.email !== sesi.email; });
      var ok = write(KEY_USERS, users);
      try { localStorage.removeItem(KEY_SESI); } catch (e) {}
      return ok;
    }
  };
})();