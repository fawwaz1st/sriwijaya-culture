/* ============================================================
   render.js - pembuat HTML bersama untuk kartu, galeri, peta,
   daftar sumber, dan tombol favorit.

   Semua teks dari data di-escape sebelum masuk innerHTML.
   Semua halaman memakai fungsi di sini supaya tampilan kartu
   destinasi, UMKM, dan artikel benar-benar konsisten.
   ============================================================ */
(function () {
  "use strict";

  window.SC = window.SC || {};
  var SC = window.SC, U = SC.util;

  /* ---------------- label ---------------- */

  var LABEL_VERIFIKASI = {
    "tinggi": { teks: "Data terverifikasi", kelas: "chip" },
    "sedang": { teks: "Sumber tunggal", kelas: "chip" },
    "perlu-konfirmasi": { teks: "Perlu konfirmasi", kelas: "chip chip-demo" },
    "rendah": { teks: "Data lemah", kelas: "chip chip-demo" }
  };

  var LABEL_STATUS_DATA = {
    "rujukan-umum": { teks: "Nama usaha dari rujukan publik", kelas: "chip chip-gold" },
    "demonstrasi": { teks: "Data demonstrasi, bukan usaha terverifikasi", kelas: "chip chip-demo" }
  };

  var LABEL_STATUS_ARTIKEL = {
    "terverifikasi-sebagian": { teks: "Sumber tercantum", kelas: "chip" },
    "draf": { teks: "Draf, perlu verifikasi lanjutan", kelas: "chip chip-demo" }
  };

  SC.render = {
    chip: function (teks, kelas) {
      return '<span class="' + U.esc(kelas || "chip") + '">' + U.esc(teks) + "</span>";
    },

    chipVerifikasi: function (tingkat) {
      var l = LABEL_VERIFIKASI[tingkat];
      return l ? SC.render.chip(l.teks, l.kelas) : "";
    },

    chipStatusData: function (status) {
      var l = LABEL_STATUS_DATA[status];
      return l ? SC.render.chip(l.teks, l.kelas) : "";
    },

    chipStatusArtikel: function (status) {
      var l = LABEL_STATUS_ARTIKEL[status];
      return l ? SC.render.chip(l.teks, l.kelas) : "";
    },

    /* ---------------- tombol favorit ---------------- */

    /* Tombol ini memanggil SC.akun.toggleFavorit. Kalau pengguna
       belum masuk, jawabannya jujur: arahkan ke halaman akun,
       bukan berpura-pura menyimpan. */
    favButton: function (jenis, id, kecil) {
      var aktif = SC.akun && SC.akun.favorit(jenis).indexOf(id) >= 0;
      return '<button type="button" class="btn btn-outline' + (kecil ? " btn-sm" : "") +
        '" data-fav data-jenis="' + U.esc(jenis) + '" data-id="' + U.esc(id) + '"' +
        ' aria-pressed="' + (aktif ? "true" : "false") + '">' +
        (aktif ? "Tersimpan di favorit" : "Simpan ke favorit") + "</button>";
    },

    /* Dipasang sekali per halaman setelah kartu-kartu dibuat. */
    wireFavorit: function (root, onToggle) {
      U.qsa("[data-fav]", root || document).forEach(function (btn) {
        if (btn.dataset.wired === "1") return;
        btn.dataset.wired = "1";
        btn.addEventListener("click", function () {
          var jenis = btn.getAttribute("data-jenis");
          var id = btn.getAttribute("data-id");
          var hasil = SC.akun ? SC.akun.toggleFavorit(jenis, id) : { ok: false, alasan: "belum-masuk" };
          if (!hasil.ok) {
            SC.beritahu("Favorit memerlukan akun. Anda akan diarahkan ke halaman akun.", "info");
            setTimeout(function () { window.location.href = "akun.html?lanjut=" + encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search); }, 900);
            return;
          }
          btn.setAttribute("aria-pressed", hasil.aktif ? "true" : "false");
          btn.textContent = hasil.aktif ? "Tersimpan di favorit" : "Simpan ke favorit";
          SC.beritahu(hasil.aktif ? "Ditambahkan ke favorit." : "Dihapus dari favorit.", "ok");
          if (onToggle) onToggle(hasil);
        });
      });
    },

    /* ---------------- kartu ---------------- */

    kartuDestinasi: function (d, opsi) {
      opsi = opsi || {};
      var img = (d.gambar && d.gambar[0]) ? d.gambar[0] : null;
      var url = "detail-destinasi.html?id=" + encodeURIComponent(d.id);
      var tiketVerif = d.tiket && d.tiket.verifikasi;
      var chipTiket = tiketVerif === "tinggi" && d.tiket.teks.indexOf("Tidak berlaku tiket") === 0
        ? SC.render.chip("Tanpa tiket", "chip chip-gold")
        : (tiketVerif === "perlu-konfirmasi" ? SC.render.chip("Tiket perlu konfirmasi", "chip chip-demo") : "");

      var kelas = "card reveal" + (opsi.visual ? " card-visual" + (img ? "" : " no-photo") : "");
      return '<article class="' + kelas + '" data-delay="' + (opsi.delay || 0) + '">' +
        '<div class="card-media">' +
          (img
            ? '<img src="' + U.esc(img.src) + '" alt="Foto ' + U.esc(d.nama) + '" loading="lazy" width="1280" height="800">'
            : '<div style="display:grid;place-items:center;height:100%;color:var(--text-2)">Foto belum tersedia</div>') +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title"><a href="' + url + '">' + U.esc(d.nama) + "</a></h3>" +
          '<p class="card-text">' + U.esc(d.ringkas) + "</p>" +
          '<div class="card-meta">' +
            (opsi.visual
              ? SC.render.chip((d.kategori || [])[0] || d.wilayah)
              : (d.kategori || []).map(function (k) { return SC.render.chip(k); }).join("") +
                SC.render.chip(d.wilayah) +
                chipTiket) +
          "</div>" +
          '<div class="card-cta">' +
            '<a class="btn btn-primary btn-sm" href="' + url + '">Lihat Detail</a>' +
          "</div>" +
        "</div>" +
      "</article>";
    },

    kartuUMKM: function (u, opsi) {
      opsi = opsi || {};
      var img = (u.gambar && u.gambar[0]) ? u.gambar[0] : null;
      var unggulan = (u.produk || []).filter(function (p) { return p.unggulan; });
      var url = "detail-umkm.html?id=" + encodeURIComponent(u.id);

      var kelas = "card reveal" + (opsi.visual ? " card-visual" + (img ? "" : " no-photo") : "");
      return '<article class="' + kelas + '" data-delay="' + (opsi.delay || 0) + '">' +
        '<div class="card-media">' +
          (img
            ? '<img src="' + U.esc(img.src) + '" alt="Foto ' + U.esc(u.nama) + '" loading="lazy" width="1280" height="800">'
            : '<div style="display:grid;place-items:center;height:100%;color:var(--text-2)">Foto belum tersedia</div>') +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title"><a href="' + url + '">' + U.esc(u.nama) + "</a></h3>" +
          '<p class="card-text">' + U.esc(u.ringkas) + "</p>" +
          '<div class="card-meta">' +
            (opsi.visual
              ? SC.render.chip(u.kategori, "chip chip-gold")
              : SC.render.chip(u.kategori, "chip chip-gold") +
                SC.render.chip(u.wilayah) +
                SC.render.chip((u.produk || []).length + " produk") +
                SC.render.chipStatusData(u.statusData)) +
          "</div>" +
          (unggulan.length && !opsi.visual
            ? '<p class="small muted mb-0">Unggulan: ' +
              unggulan.slice(0, 3).map(function (p) { return U.esc(p.nama); }).join(", ") + "</p>"
            : "") +
          '<div class="card-cta">' +
            '<a class="btn btn-primary btn-sm" href="' + url + '">Lihat Detail Usaha</a>' +
          "</div>" +
        "</div>" +
      "</article>";
    },

    kartuArtikel: function (a, opsi) {
      opsi = opsi || {};
      var url = "detail-artikel.html?id=" + encodeURIComponent(a.id);
      var kelas = "card reveal" + (opsi.visual ? " card-visual" + (a.gambar ? "" : " no-photo") : "");
      return '<article class="' + kelas + '" data-delay="' + (opsi.delay || 0) + '">' +
        '<div class="card-media">' +
          (a.gambar
            ? '<img src="' + U.esc(a.gambar) + '" alt="' + U.esc(a.gambarCaption || a.judul) + '" loading="lazy" width="1280" height="800">'
            : '<div style="display:grid;place-items:center;height:100%;color:var(--text-2)">Gambar belum tersedia</div>') +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title"><a href="' + url + '">' + U.esc(a.judul) + "</a></h3>" +
          '<p class="card-text">' + U.esc(a.ringkas) + "</p>" +
          '<div class="card-meta">' +
            (opsi.visual
              ? SC.render.chip(a.kategori, "chip chip-gold")
              : SC.render.chip(a.kategori, "chip chip-gold") +
                SC.render.chip(U.tanggalID(a.tanggal)) +
                SC.render.chip((a.sumber || []).length + " sumber") +
                SC.render.chipStatusArtikel(a.status)) +
          "</div>" +
          '<div class="card-cta">' +
            '<a class="btn btn-primary btn-sm" href="' + url + '">Baca Selengkapnya</a>' +
          "</div>" +
        "</div>" +
      "</article>";
    },

    kartuProduk: function (p) {
      var harga = U.rupiah(p.harga);
      return '<article class="card product-card reveal">' +
        (p.unggulan ? '<span class="badge-unggulan">Produk Unggulan</span>' : "") +
        '<div class="card-media">' +
          (p.gambar
            ? '<img src="' + U.esc(p.gambar) + '" alt="' + U.esc(p.nama) + '" loading="lazy" width="1280" height="800">'
            : '<div style="display:grid;place-items:center;height:100%;color:var(--text-2);font-size:.85rem">Foto produk belum tersedia</div>') +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title">' + U.esc(p.nama) + "</h3>" +
          '<p class="card-text">' + U.esc(p.deskripsi) + "</p>" +
          '<div class="card-meta">' +
            (harga
              ? '<span class="price">' + U.esc(harga) + "</span>"
              : '<span class="price na">Hubungi penjual untuk informasi harga</span>') +
          "</div>" +
        "</div>" +
      "</article>";
    },

    /* ---------------- kartu arsip ---------------- */

    /* Kartu gaya katalog museum: foto di dalam bingkai, metadata
       melekat di tepi bawah, nomor inventaris di sudut. Berbeda
       dari .card yang dipakai di halaman katalog.

       `opsi.lebar` dipakai supaya kartu unggulan bisa lebih lebar
       dari kartu lain. Kelasnya menempel di <article> langsung,
       karena .grid-arsip > * hanya kena anak langsung grid. */
    kartuArsip: function (d, opsi) {
      opsi = opsi || {};
      var img = (d.gambar && d.gambar[0]) ? d.gambar[0] : null;
      var url = "detail-destinasi.html?id=" + encodeURIComponent(d.id);
      var sumber = (d.sumber || []).length;
      var koord = d.koordinat
        ? d.koordinat.lat.toFixed(4) + ", " + d.koordinat.lng.toFixed(4)
        : "koordinat belum diverifikasi";
      var kat = (d.kategori || [])[0] || "";
      var kelas = "arsip reveal" + (opsi.lebar ? " " + opsi.lebar : "");

      return '<article class="' + kelas + '" data-delay="' + (opsi.delay || 0) + '">' +
        '<div class="arsip-figure">' +
          '<span class="arsip-no">NO. ' + U.esc(String((opsi && opsi.no) || 1).padStart(2, "0")) + "</span>" +
          (img
            ? '<img src="' + U.esc(img.src) + '" alt="Foto ' + U.esc(d.nama) + '" loading="lazy" width="1280" height="800">'
            : '<div class="arsip-kosong">Foto belum tersedia</div>') +
        "</div>" +
        '<div class="arsip-body">' +
          '<h3 class="arsip-title"><a href="' + url + '">' + U.esc(d.nama) + "</a></h3>" +
          '<p class="arsip-text">' + U.esc(d.ringkas) + "</p>" +
          '<div class="arsip-rail">' +
            "<span><b>Kategori</b> " + U.esc(kat) + "</span>" +
            "<span><b>Wilayah</b> " + U.esc(d.wilayah) + "</span>" +
            "<span><b>Sumber</b> " + sumber + "</span>" +
            "<span><b>Koordinat</b> " + U.esc(koord) + "</span>" +
          "</div>" +
          '<div class="arsip-foot">' +
            '<a class="btn btn-primary btn-sm" href="' + url + '">Buka Arsip</a>' +
            SC.render.chipVerifikasi(d.tiket && d.tiket.verifikasi) +
          "</div>" +
        "</div>" +
      "</article>";
    },

    /* ---------------- mosaic & strip galeri ---------------- */

    /* Mosaic: satu foto besar di kiri, empat kecil di kanan.
       Dipakai beranda supaya bagian teratas terasa seperti galeri,
       bukan deretan kartu seragam. */
    mosaicDestinasi: function (daftar) {
      if (!daftar || !daftar.length) return "";
      return daftar.map(function (d, i) {
        var img = (d.gambar && d.gambar[0]) ? d.gambar[0] : null;
        var url = "detail-destinasi.html?id=" + encodeURIComponent(d.id);
        return '<a class="mosaic-item" href="' + url + '">' +
          (img
            ? '<img src="' + U.esc(img.src) + '" alt="Foto ' + U.esc(d.nama) + '" loading="lazy" width="1280" height="800">'
            : "") +
          '<span class="mosaic-label">' +
            (i === 0 ? "<span>Destinasi utama</span>" : "") +
            "<b>" + U.esc(d.nama) + "</b>" +
          "</span>" +
        "</a>";
      }).join("");
    },

    /* Strip galeri: satu foto per destinasi, bisa digeser ke samping. */
    stripGaleri: function (daftar) {
      if (!daftar || !daftar.length) return "";
      return daftar.map(function (d) {
        var img = (d.gambar && d.gambar[0]) ? d.gambar[0] : null;
        if (!img) return "";
        var url = "detail-destinasi.html?id=" + encodeURIComponent(d.id);
        return '<a href="' + url + '" title="' + U.esc(d.nama) + '">' +
          '<img src="' + U.esc(img.src) + '" alt="Foto ' + U.esc(d.nama) + '" loading="lazy" width="1280" height="800">' +
          "<b>" + U.esc(d.nama) + "</b>" +
        "</a>";
      }).join("");
    },

    /* ---------------- galeri ---------------- */

    /* Galeri: gambar utama, thumbnail, tombol sebelumnya/berikutnya,
       dan lightbox. Navigasi keyboard: panah kiri/kanan saat fokus
       berada di dalam galeri. */
    galeri: function (idGaleri, daftarFoto, judul) {
      if (!daftarFoto || !daftarFoto.length) {
        return '<div class="empty"><strong>Galeri foto belum tersedia</strong>' +
          "Belum ada foto yang dapat kami tampilkan untuk " + U.esc(judul || "destinasi ini") + ".</div>";
      }
      var banyak = daftarFoto.length > 1;
      var thumbs = daftarFoto.map(function (f, i) {
        return '<button type="button" data-thumb="' + i + '" aria-current="' + (i === 0 ? "true" : "false") +
          '" aria-label="Tampilkan foto ' + (i + 1) + '"><img src="' + U.esc(f.src) + '" alt="" loading="lazy"></button>';
      }).join("");

      return '<div class="galeri" id="' + U.esc(idGaleri) + '" data-index="0" tabindex="0" role="group" aria-label="Galeri foto ' + U.esc(judul || "") + '">' +
        '<figure class="gallery-main">' +
          '<img id="' + U.esc(idGaleri) + '-main" src="' + U.esc(daftarFoto[0].src) + '" alt="' + U.esc(daftarFoto[0].caption || judul) + '" width="1280" height="720">' +
          '<figcaption id="' + U.esc(idGaleri) + '-cap">' + U.esc(daftarFoto[0].caption || "") +
            (daftarFoto[0].kredit ? ' <span class="muted">(' + U.esc(daftarFoto[0].kredit) + ")</span>" : "") +
          "</figcaption>" +
          (banyak
            ? '<button type="button" class="gallery-nav prev" data-gallery-prev aria-label="Foto sebelumnya">' + SC.ikon.left + "</button>" +
              '<button type="button" class="gallery-nav next" data-gallery-next aria-label="Foto berikutnya">' + SC.ikon.right + "</button>"
            : "") +
        "</figure>" +
        (banyak ? '<div class="gallery-thumbs">' + thumbs + "</div>" : "") +
      "</div>";
    },

    /* Dipasang setelah HTML galeri masuk ke halaman. */
    wireGaleri: function (idGaleri, daftarFoto) {
      var root = U.qs("#" + idGaleri);
      if (!root || !daftarFoto || !daftarFoto.length) return;
      var img = U.qs("#" + idGaleri + "-main");
      var cap = U.qs("#" + idGaleri + "-cap");
      var idx = 0;

      function tampilkan(i) {
        idx = (i + daftarFoto.length) % daftarFoto.length;
        var f = daftarFoto[idx];
        img.src = f.src;
        img.alt = f.caption || "";
        cap.innerHTML = U.esc(f.caption || "") +
          (f.kredit ? ' <span class="muted">(' + U.esc(f.kredit) + ")</span>" : "");
        U.qsa("[data-thumb]", root).forEach(function (b) {
          b.setAttribute("aria-current", Number(b.getAttribute("data-thumb")) === idx ? "true" : "false");
        });
      }

      var prev = U.qs("[data-gallery-prev]", root);
      var next = U.qs("[data-gallery-next]", root);
      if (prev) prev.addEventListener("click", function () { tampilkan(idx - 1); });
      if (next) next.addEventListener("click", function () { tampilkan(idx + 1); });
      U.qsa("[data-thumb]", root).forEach(function (b) {
        b.addEventListener("click", function () { tampilkan(Number(b.getAttribute("data-thumb"))); });
      });

      /* klik gambar utama membuka lightbox ukuran besar */
      var main = U.qs(".gallery-main", root);
      if (main) {
        main.style.cursor = "zoom-in";
        main.addEventListener("click", function (e) {
          if (e.target.closest(".gallery-nav")) return;
          SC.render.lightbox(daftarFoto, idx);
        });
        main.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); SC.render.lightbox(daftarFoto, idx); }
        });
      }
      root.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); tampilkan(idx - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); tampilkan(idx + 1); }
      });
    },

    lightbox: function (daftarFoto, mulai) {
      var lb = U.qs("#lightbox");
      if (!lb) {
        lb = document.createElement("div");
        lb.id = "lightbox";
        lb.className = "lightbox";
        lb.setAttribute("role", "dialog");
        lb.setAttribute("aria-modal", "true");
        lb.setAttribute("aria-label", "Foto ukuran besar");
        lb.innerHTML =
          '<button type="button" class="lightbox-close" aria-label="Tutup foto">' + SC.ikon.close + "</button>" +
          (daftarFoto.length > 1
            ? '<button type="button" class="gallery-nav prev" data-lb-prev aria-label="Foto sebelumnya">' + SC.ikon.left + "</button>" +
              '<button type="button" class="gallery-nav next" data-lb-next aria-label="Foto berikutnya">' + SC.ikon.right + "</button>"
            : "") +
          '<img alt="">' +
          '<p class="sr-only" id="lightboxCap"></p>';
        document.body.appendChild(lb);
        U.qs(".lightbox-close", lb).addEventListener("click", function () { SC.render.tutupLightbox(); });
        lb.addEventListener("click", function (e) { if (e.target === lb) SC.render.tutupLightbox(); });
        document.addEventListener("keydown", function (e) {
          if (!lb.classList.contains("open")) return;
          if (e.key === "Escape") SC.render.tutupLightbox();
          if (e.key === "ArrowLeft") langkahLightbox(lb, -1);
          if (e.key === "ArrowRight") langkahLightbox(lb, 1);
        });
      }
      var i = (mulai || 0) % daftarFoto.length;
      lb.dataset.daftar = JSON.stringify(daftarFoto.map(function (f) {
        return { src: f.src, caption: f.caption || "", kredit: f.kredit || "" };
      }));
      lb.dataset.pemicu = "#" + (document.activeElement && document.activeElement.id
        ? document.activeElement.id : "");
      lb.classList.add("open");
      perbaruiLightbox(lb, daftarFoto, i);
      var c = U.qs(".lightbox-close", lb);
      if (c) c.focus();
      document.body.style.overflow = "hidden";

      var p = U.qs("[data-lb-prev]", lb), n = U.qs("[data-lb-next]", lb);
      if (p && !p.dataset.wired) {
        p.dataset.wired = "1";
        p.addEventListener("click", function () { langkahLightbox(lb, -1); });
      }
      if (n && !n.dataset.wired) {
        n.dataset.wired = "1";
        n.addEventListener("click", function () { langkahLightbox(lb, 1); });
      }
    },

    tutupLightbox: function () {
      var lb = U.qs("#lightbox");
      if (!lb) return;
      lb.classList.remove("open");
      document.body.style.overflow = "";
      var pemicu = lb.dataset.pemicu ? U.qs(lb.dataset.pemicu) : null;
      if (pemicu && pemicu.focus) pemicu.focus();
      delete lb.dataset.pemicu;
    },

    /* ---------------- peta ---------------- */

    /* Peta memakai sematan OpenStreetMap untuk koordinat yang sudah
       dicatat, dan selalu menyediakan tombol ke Google Maps. Peta
       memerlukan koneksi internet, ini disebutkan di bawah peta. */
    peta: function (item, labelAlamat) {
      var embed = U.mapsEmbed(item);
      var html = "";
      if (item.alamat || labelAlamat) {
        html += '<p class="mb-2"><b>Alamat:</b> ' +
          U.esc(item.alamat || labelAlamat) + "</p>";
      } else {
        html += '<p class="mb-2 muted">Alamat rinci belum tercatat untuk entri ini.</p>';
      }
      if (embed) {
        html += '<div class="map-embed"><iframe src="' + U.esc(embed) +
          '" title="Peta lokasi ' + U.esc(item.nama || "") +
          '" loading="lazy" width="640" height="360" style="width:100%;height:100%;border:0" referrerpolicy="no-referrer-when-downgrade"></iframe></div>';
        html += '<p class="map-note">Peta di atas memerlukan koneksi internet. ' +
          "Bila tidak ada koneksi, gunakan tombol di bawah untuk membuka lokasi di aplikasi peta.</p>";
      } else {
        html += '<div class="empty"><strong>Peta belum dapat ditampilkan</strong>' +
          "Koordinat entri ini belum kami verifikasi, sehingga kami tidak menampilkan titik peta yang mungkin salah. " +
          "Gunakan tombol di bawah untuk mencari lokasinya langsung di Google Maps.</div>";
        html += '<p class="map-note">Peta dan tombol memerlukan koneksi internet.</p>';
      }
      html += '<div class="flex mt-2">' +
        '<a class="btn btn-gold" href="' + U.esc(U.mapsLink(item)) + '" target="_blank" rel="noopener">Buka di Google Maps</a>';
      if (item.mapsQuery) {
        html += '<a class="btn btn-outline" href="' + U.esc(U.ruteLink(item)) + '" target="_blank" rel="noopener">Lihat Rute</a>';
      }
      html += "</div>";
      return html;
    },

    /* ---------------- ulasan ---------------- */

    /* Tidak ada satu pun ulasan rekaan di proyek ini. Fungsi ini
       memilih antara menampilkan data ulasan yang benar-benar ada
       atau menjelaskan bahwa datanya belum tersedia. */
    ulasan: function (entitas) {
      var u = entitas.ulasan || { status: "belum" };
      if (u.status !== "ada" || !u.daftar || !u.daftar.length) {
        return '<div class="empty"><strong>Ulasan pengunjung belum tersedia</strong>' +
          U.esc(u.pesan || "Website ini tidak menampilkan ulasan yang tidak dapat diverifikasi.") +
          '<p class="small muted mt-2 mb-0">Cara menambahkan ulasan yang sah: kumpulkan ulasan asli dari pengunjung ' +
          "melalui formulir yang datanya disimpan di layanan penyimpanan, atau cantumkan sumber ulasan pihak ketiga " +
          "beserta tautannya. Website ini tidak menyediakan formulir ulasan karena tidak memiliki tempat penyimpanan data.</p></div>";
      }
      var skor = u.rataRata;
      var bintang = Math.round(skor || 0);
      var daftar = u.daftar.map(function (r) {
        return '<div class="review-item">' +
          '<div class="review-head"><b>' + U.esc(r.nama) + "</b>" +
          (r.tanggal ? "<time>" + U.esc(U.tanggalID(r.tanggal)) + "</time>" : "") + "</div>" +
          '<div class="stars" aria-label="Nilai ' + U.esc(r.nilai) + ' dari 5">' +
            "★★★★★".slice(0, r.nilai) + "☆☆☆☆☆".slice(0, 5 - r.nilai) + "</div>" +
          "<p>" + U.esc(r.komentar) + "</p>" +
        "</div>";
      }).join("");

      return '<div class="rating-box mb-2">' +
          '<div><div class="rating-score">' + U.esc(Number(skor).toFixed(1)) + "</div>" +
            '<div class="small muted">dari 5</div></div>' +
          "<div><div class=\"stars\" aria-label=\"Nilai rata-rata " + U.esc(skor) + ' dari 5">' +
            "★★★★★".slice(0, bintang) + "☆☆☆☆☆".slice(0, 5 - bintang) + "</div>" +
            '<div class="small muted">' + u.daftar.length + " ulasan</div></div>" +
        "</div>" +
        (u.sumber ? '<p class="small muted">Sumber ulasan: ' + U.esc(u.sumber) + "</p>" : "") +
        daftar;
    },

    /* ---------------- sumber ---------------- */

    daftarSumber: function (sumber, catatan) {
      if (!sumber || !sumber.length) {
        return '<div class="empty"><strong>Daftar sumber belum tersedia</strong>' +
          "Entri ini belum memiliki rujukan yang dapat ditelusuri. Kami tidak menampilkan rujukan yang tidak dapat diperiksa.</div>";
      }
      var li = sumber.map(function (s) {
        var meta = [s.penulis, s.tahun].filter(Boolean).join(", ");
        return "<li>" +
          (s.url
            ? '<a href="' + U.esc(s.url) + '" target="_blank" rel="noopener">' + U.esc(s.judul) + "</a>"
            : "<b>" + U.esc(s.judul) + "</b>") +
          (meta ? '<div class="small muted">' + U.esc(meta) + "</div>" : "") +
          (s.catatan ? '<div class="small muted">Dipakai untuk: ' + U.esc(s.catatan) + "</div>" : "") +
          (s.verifikasi ? '<div class="small muted">' + SC.render.chipVerifikasi(s.verifikasi) + "</div>" : "") +
        "</li>";
      }).join("");
      return "<ol class=\"source-list\">" + li + "</ol>" +
        (catatan ? '<div class="legend-note mt-2">' + U.esc(catatan) + "</div>" : "");
    },

    /* ---------------- bagian fakta ---------------- */

    fakta: function (daftar) {
      if (!daftar || !daftar.length) return "";
      var li = daftar.map(function (f) {
        return "<li><span class=\"k\">" + U.esc(f.k) + "</span><span class=\"v\">" + U.esc(f.v) + "</span></li>";
      }).join("");
      return '<ul class="fact-list">' + li + "</ul>";
    },

    /* ---------------- kartu terkait ---------------- */

    bagianTerkait: function (judul, htmlKartu) {
      if (!htmlKartu) return "";
      return '<section class="section" style="padding-top:8px">' +
        '<div class="section-head"><h2>' + U.esc(judul) + "</h2></div>" +
        '<div class="grid grid-3">' + htmlKartu + "</div>" +
      "</section>";
    }
  };

  /* ---------------- pembantu lightbox ---------------- */

  /* Dipisah sebagai fungsi deklarasi supaya dapat dipakai dari
     handler yang dibuat sebelum definisinya dibaca. */
  function perbaruiLightbox(lb, daftarFoto, i) {
    var img = U.qs("img", lb);
    var cap = U.qs("#lightboxCap", lb);
    var f = daftarFoto[i];
    if (!f) return;
    img.src = f.src;
    img.alt = f.caption || "Foto ukuran besar";
    if (cap) cap.textContent = (f.caption || "") + (f.kredit ? " (" + f.kredit + ")" : "");
    lb.dataset.index = String(i);
  }

  function langkahLightbox(lb, arah) {
    var daftarFoto;
    try { daftarFoto = JSON.parse(lb.dataset.daftar || "[]"); } catch (e) { daftarFoto = []; }
    if (!daftarFoto.length) return;
    var i = (Number(lb.dataset.index) + arah + daftarFoto.length) % daftarFoto.length;
    perbaruiLightbox(lb, daftarFoto, i);
  }

  /* ---------------- notifikasi ringan ---------------- */

  /* Pengganti alert(): tidak memblokir, hilang sendiri, dan
     dapat dibaca pembaca layar melalui role="status". */
  SC.beritahu = function (pesan, jenis) {
    var box = U.qs("#scNotif");
    if (!box) {
      box = document.createElement("div");
      box.id = "scNotif";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      box.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:95;" +
        "max-width:min(420px,calc(100vw - 32px));pointer-events:none;display:grid;gap:8px";
      document.body.appendChild(box);
    }
    var item = document.createElement("div");
    var warna = jenis === "err" ? "#b3261e" : (jenis === "info" ? "#1a4a33" : "#1f5c3d");
    item.style.cssText = "pointer-events:auto;background:" + warna + ";color:#fff;padding:12px 16px;" +
      "border-radius:10px;font:600 .9rem/1.4 'Segoe UI',Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3)";
    item.textContent = U.clampText(pesan, 220);
    box.appendChild(item);
    setTimeout(function () {
      item.style.transition = "opacity 300ms";
      item.style.opacity = "0";
      setTimeout(function () { item.remove(); }, 320);
    }, jenis === "info" ? 2200 : 2000);
  };

  /* ---------------- status kosong ---------------- */

  SC.render.kosong = function (judul, pesan) {
    return '<div class="empty"><strong>' + U.esc(judul) + "</strong>" + U.esc(pesan) + "</div>";
  };
})();