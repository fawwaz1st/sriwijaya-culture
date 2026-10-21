/* ============================================================
   asisten.js - asisten tanya jawab "Sari"

   CARA KERJA (ditampilkan juga di antarmuka agar tidak menyesatkan):
   Tingkat 1, selalu aktif, tanpa unduhan:
     Pencarian kata kunci berbobot. Setiap dokumen (destinasi, UMKM,
     artikel) dipecah menjadi field terpisah dengan bobot berbeda,
     lalu query pengguna dicocokkan dan diberi skor. Ini adalah
     information retrieval, bukan pembuatan teks bebas.
   Tingkat 2, opsional, perlu satu kali unduhan model:
     Pencarian semantik memakai model embedding ONNX
     (all-MiniLM-L6-v2) yang berjalan di browser dengan WebGPU.
     Model diunduh dari Hugging Face saat pengguna menyalakannya.
     Tanpa koneksi internet, tingkat ini tidak tersedia, dan asisten
     otomatis kembali ke tingkat 1.

   Asisten ini TIDAK mengarang jawaban. Semua kalimat jawaban disusun
   dari field data yang memang ada di berkas data-*.js. Bila tidak ada
   dokumen yang cocok, asisten mengatakan belum ada datanya dan
   menyarankan cara lain.
   ============================================================ */
(function () {
  "use strict";

  window.SC = window.SC || {};
  var SC = window.SC, U = SC.util;

  var STORAGE_BUKTI = "sc-asisten-bukti";

  /* ---------- 1. Membangun indeks dari data yang sudah ada ---------- */

  /* Bobot field: nama paling menentukan, diikuti kategori,
     ringkasan, dan isi. Angka ini hasil penyetelan manual: field
     judul diberi bobot tinggi supaya "ampera" menemukan Jembatan
     Ampera lebih dulu daripada artikel yang hanya menyebutnya. */
  var BOBOT = { nama: 4.0, kategori: 2.0, ringkas: 1.6, isi: 1.0 };

  function potongSukuKata(s) {
    return U.norm(s)
      .replace(/[^a-z0-9\u00c0-\u024f\s-]/g, " ")
      .split(/\s+/)
      .filter(function (t) { return t.length > 1; });
  }

  /* Kata umum bahasa Indonesia yang tidak membantu pencarian. */
  var STOPWORD = {
    yang: 1, dan: 1, di: 1, ke: 1, dari: 1, untuk: 1, pada: 1, ada: 1,
    itu: 1, ini: 1, dengan: 1, adalah: 1, atau: 1, apa: 1, apakah: 1,
    saya: 1, mau: 1, ingin: 1, bisa: 1, bagaimana: 1, berapa: 1, mana: 1,
    dimana: 1, kemana: 1, ada: 1, tidak: 1, bukan: 1, juga: 1, akan: 1,
    sudah: 1, belum: 1, tentang: 1, soal: 1, tolong: 1, mohon: 1,
    kak: 1, dong: 1, ya: 1, sih: 1, nya: 1, punya: 1,
    tempat: 1, wisata: 1, info: 1, informasi: 1, tau: 1, tahu: 1,
    minta: 1, kasih: 1, cari: 1, carikan: 1, rekomendasi: 1
  };

  function kataKunci(s) {
    return potongSukuKata(s).filter(function (t) { return !STOPWORD[t]; });
  }

  /* Dokumen indeks disusun dari data yang sudah ada di berkas lain.
     Tidak ada duplikasi konten: kita hanya mengumpulkan teks. */
  function dokumenDariData() {
    var docs = [];

    (SC.DESTINASI || []).forEach(function (d) {
      docs.push({
        jenis: "destinasi",
        id: d.id,
        url: "detail-destinasi.html?id=" + encodeURIComponent(d.id),
        label: "Destinasi wisata",
        nama: d.nama,
        kategori: (d.kategori || []).join(" ") + " " + (d.wilayah || ""),
        ringkas: d.ringkas,
        isi: [
          d.deskripsi, d.sejarah, d.akses,
          (d.dayaTarik || []).join(" "),
          (d.aktivitas || []).join(" "),
          d.tiket && d.tiket.teks, d.jam && d.jam.teks,
          (d.fakta || []).map(function (f) { return f.k + " " + f.v; }).join(" "),
          d.alamat
        ].filter(Boolean).join(" "),
        /* metadata terstruktur dipakai lapisan intent di bawah */
        meta: {
          kategori: d.kategori || [],
          wilayah: d.wilayah || "",
          adaKoordinat: !!d.koordinat,
          tiketTerverifikasi: d.tiket && d.tiket.verifikasi === "tinggi",
          gambar: (d.gambar || [])[0] ? (d.gambar || [])[0].src : null
        }
      });
    });

    (SC.UMKM || []).forEach(function (u) {
      docs.push({
        jenis: "umkm",
        id: u.id,
        url: "detail-umkm.html?id=" + encodeURIComponent(u.id),
        label: "UMKM",
        nama: u.nama,
        kategori: u.kategori + " " + (u.wilayah || ""),
        ringkas: u.ringkas,
        isi: [
          u.profil, u.sejarah, u.alamat, u.jam && u.jam.teks,
          (u.produk || []).map(function (p) { return p.nama + " " + p.deskripsi; }).join(" ")
        ].filter(Boolean).join(" "),
        meta: {
          kategori: [u.kategori],
          wilayah: u.wilayah || "",
          statusData: u.statusData,
          produk: (u.produk || []).map(function (p) { return p.nama; }),
          adaKontak: !!(u.kontak && (u.kontak.telepon || u.kontak.whatsapp || u.kontak.website)),
          gambar: (u.gambar || [])[0] ? (u.gambar || [])[0].src : null
        }
      });
    });

    (SC.ARTIKEL || []).forEach(function (a) {
      docs.push({
        jenis: "artikel",
        id: a.id,
        url: "detail-artikel.html?id=" + encodeURIComponent(a.id),
        label: "Artikel",
        nama: a.judul,
        kategori: a.kategori + " " + a.status,
        ringkas: a.ringkas,
        isi: [
          a.pendahuluan, a.kesimpulan,
          (a.bagian || []).map(function (b) {
            return b.subjudul + " " + (b.paragraf || []).join(" ");
          }).join(" "),
          (a.sumber || []).map(function (s) { return s.judul + " " + (s.penulis || ""); }).join(" ")
        ].filter(Boolean).join(" "),
        meta: {
          kategori: [a.kategori],
          status: a.status,
          punyaSumber: (a.sumber || []).length,
          destinasiTerkait: a.destinasiTerkait || [],
          gambar: a.gambar
        }
      });
    });

    return docs;
  }

  /* ---------- 2. Skoring ---------- */

  var INDEKS = null;

  function bangunIndeks() {
    if (INDEKS) return INDEKS;
    var docs = dokumenDariData();

    /* hitung frekuensi dokumen untuk idf */
    var df = {};
    docs.forEach(function (d) {
      var himpunan = {};
      ["nama", "kategori", "ringkas", "isi"].forEach(function (f) {
        potongSukuKata(d[f] || "").forEach(function (t) { himpunan[t] = 1; });
      });
      Object.keys(himpunan).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
    });

    var N = docs.length || 1;
    docs.forEach(function (d) {
      d.tf = {};
      /* hitungan frekuensi berbobot per field */
      ["nama", "kategori", "ringkas", "isi"].forEach(function (f) {
        var w = BOBOT[f];
        potongSukuKata(d[f] || "").forEach(function (t) {
          d.tf[t] = (d.tf[t] || 0) + w;
        });
      });
      /* idf per suku kata */
      d.idf = {};
      Object.keys(d.tf).forEach(function (t) {
        d.idf[t] = Math.log(1 + N / (1 + (df[t] || 1)));
      });
    });

    INDEKS = { docs: docs, df: df, N: N };
    return INDEKS;
  }

  /* Skor kosinus sederhana antara query dan dokumen. */
  function cariTeks(query, batas) {
    var idx = bangunIndeks();
    var terms = kataKunci(query);
    if (!terms.length) return [];

    var qtf = {};
    terms.forEach(function (t) { qtf[t] = (qtf[t] || 0) + 1; });

    var hasil = idx.docs.map(function (d) {
      var skor = 0, cocok = 0;
      Object.keys(qtf).forEach(function (t) {
        var tf = d.tf[t];
        if (!tf) return;
        cocok += 1;
        var idf = d.idf[t] !== undefined ? d.idf[t] : Math.log(1 + idx.N / (1 + 1));
        skor += (1 + Math.log(tf)) * idf * qtf[t];
      });
      /* bonus bila seluruh kata query muncul, supaya "pulau kemaro"
         tidak kalah oleh dokumen yang hanya memuat "pulau". */
      var kelengkapan = cocok / Object.keys(qtf).length;
      skor *= (0.55 + 0.45 * kelengkapan);
      /* sedikit penalti untuk dokumen yang sangat panjang, agar
         hasil tidak selalu jatuh ke artikel panjang. */
      var panjang = Math.max(1, Object.keys(d.tf).length);
      skor = skor / Math.log(2 + panjang / 40);
      return { doc: d, skor: skor, kelengkapan: kelengkapan, cocok: cocok };
    });

    return hasil
      .filter(function (r) { return r.skor > 0 && r.cocok > 0; })
      .sort(function (a, b) { return b.skor - a.skor; })
      .slice(0, batas || 4);
  }

  /* ---------- 3. Lapisan niat (intent) ---------- */

  /* Mendeteksi pertanyaan yang punya bentuk jawaban spesifik, seperti
     kategori, wilayah, atau status data. Ini membuat jawaban lebih
     tepat daripada sekadar mengembalikan daftar hasil pencarian. */
  function deteksiNiat(q) {
    var s = U.norm(q);
    var niat = { jenis: null, kategori: null, wilayah: null, jenisDoc: null, filter: null };

    SC.KATEGORI_DESTINASI.concat(SC.KATEGORI_UMKM, SC.KATEGORI_ARTIKEL).forEach(function (k) {
      if (s.indexOf(U.norm(k)) >= 0) niat.kategori = k;
    });

    var wilayahList = [];
    (SC.DESTINASI || []).forEach(function (d) { if (d.wilayah) wilayahList.push(d.wilayah); });
    (SC.UMKM || []).forEach(function (u) { if (u.wilayah) wilayahList.push(u.wilayah); });
    wilayahList.forEach(function (w) {
      var bagian = U.norm(w).split(/[\s-]+/).filter(function (t) { return t.length > 3; });
      bagian.forEach(function (t) { if (s.indexOf(t) >= 0) niat.wilayah = w; });
    });

    if (/artikel|sejarah|baca|budaya|sumber|asal.usul|kerajaan|songket|sriwijaya/.test(s)) niat.jenisDoc = "artikel";
    if (/umkm|usaha|toko|jual|produk|pempek|beli|oleh.oleh|perajin|pedagang/.test(s)) niat.jenisDoc = "umkm";
    if (/destinasi|wisata|tempat|kunjung|jalan.jalan|liburan|tiket|masuk/.test(s)) niat.jenisDoc = "destinasi";

    if (/tiket|harga.masuk|biaya.masuk|bayar/.test(s)) niat.jenis = "tiket";
    else if (/jam.buka|jam.operasional|buka.jam|tutup/.test(s)) niat.jenis = "jam";
    else if (/dimana|lokasi|alamat|di.mana|letak|maps|peta|rute/.test(s)) niat.jenis = "lokasi";
    else if (/itu.apa|apa.itu|apa.yang|jelaskan|ceritakan|tentang/.test(s)) niat.jenis = "ringkas";
    else if (/berapa|jumlah|total|banyak/.test(s)) niat.jenis = "jumlah";
    else if (/kuliner|makan|lapar|khas|makanan|pempek|tekwan|mie/.test(s)) niat.jenis = "kuliner";

    if (/belum.diverifikasi|terverifikasi|sumber|kredibel|valid|benar/.test(s)) niat.filter = "verifikasi";
    return niat;
  }

  /* ---------- 4. Penyusun jawaban ---------- */

  var SARAN_DEFAULT = ["Jembatan Ampera", "Pulau Kemaro", "Pempek", "Songket", "Kerajaan Sriwijaya"];

  function labelJenis(j) {
    return { destinasi: "Destinasi wisata", umkm: "UMKM", artikel: "Artikel" }[j] || j;
  }

  function tautan(doc) {
    return '<a href="' + U.esc(doc.url) + '">' + U.esc(doc.nama) + "</a>";
  }

  function jawabJumlah(niat, hasil) {
    if (niat.jenisDoc === "destinasi" || niat.kategori && niat.jenisDoc !== "artikel" && niat.jenisDoc !== "umkm" && niat.jenis !== "kuliner") {
      var n = (SC.DESTINASI || []).length;
      var per = SC.KATEGORI_DESTINASI.map(function (k) {
        var c = (SC.DESTINASI || []).filter(function (d) { return (d.kategori || []).indexOf(k) >= 0; }).length;
        return c ? U.esc(k) + " (" + c + ")" : null;
      }).filter(Boolean).join(", ");
      return "Ada " + n + " destinasi wisata di daftar saat ini. Sebaran kategorinya: " + per +
        '. <a href="destinasi.html">Buka halaman destinasi wisata</a>.';
    }
    if (niat.jenisDoc === "umkm" || niat.jenis === "kuliner") {
      var nu = (SC.UMKM || []).length;
      var per2 = SC.KATEGORI_UMKM.map(function (k) {
        var c = (SC.UMKM || []).filter(function (u) { return u.kategori === k; }).length;
        return c ? U.esc(k) + " (" + c + ")" : null;
      }).filter(Boolean).join(", ");
      return "Direktori memuat " + nu + " entri usaha. Sebaran kategori: " + per2 +
        '. Termasuk entri contoh yang diberi label demonstrasi di antarmuka. <a href="umkm.html">Buka direktori UMKM</a>.';
    }
    if (niat.jenisDoc === "artikel") {
      return "Tersedia " + (SC.ARTIKEL || []).length + " artikel sejarah dan budaya, masing-masing menyertakan daftar sumber. " +
        '<a href="artikel.html">Buka katalog artikel</a>.';
    }
    return null;
  }

  function jawabKategori(niat) {
    if (!niat.kategori) return null;
    var masukDestinasi = (SC.DESTINASI || []).filter(function (d) {
      return (d.kategori || []).indexOf(niat.kategori) >= 0;
    });
    var masukUmkm = (SC.UMKM || []).filter(function (u) { return u.kategori === niat.kategori; });
    var masukArtikel = (SC.ARTIKEL || []).filter(function (a) { return a.kategori === niat.kategori; });

    var total = masukDestinasi.length + masukUmkm.length + masukArtikel.length;
    if (!total) return null;

    var bagian = [];
    if (masukDestinasi.length) {
      bagian.push("<b>" + masukDestinasi.length + " destinasi</b>: " +
        masukDestinasi.slice(0, 5).map(function (d) { return U.esc(d.nama); }).join(", "));
    }
    if (masukUmkm.length) {
      bagian.push("<b>" + masukUmkm.length + " entri UMKM</b>: " +
        masukUmkm.slice(0, 5).map(function (u) { return U.esc(u.nama); }).join(", "));
    }
    if (masukArtikel.length) {
      bagian.push("<b>" + masukArtikel.length + " artikel</b>: " +
        masukArtikel.slice(0, 4).map(function (a) { return U.esc(a.judul); }).join(", "));
    }
    var saran = masukDestinasi.length
      ? ' <a href="destinasi.html?kategori=' + encodeURIComponent(niat.kategori) + '">Lihat semua di kategori ' +
        U.esc(niat.kategori) + "</a>."
      : (masukUmkm.length ? ' <a href="umkm.html?kategori=' + encodeURIComponent(niat.kategori) + '">Lihat di direktori UMKM</a>.' : "");
    return "Untuk kategori <b>" + U.esc(niat.kategori) + "</b>, " + bagian.join(" &middot; ") + "." + saran;
  }

  function jawabNiat(niat, hasil) {
    /* 1. pertanyaan verifikasi: jawab dengan status data apa adanya */
    if (niat.filter === "verifikasi") {
      var high = (SC.DESTINASI || []).filter(function (d) {
        return d.tiket && d.tiket.verifikasi === "tinggi";
      });
      return "Setiap entri menandai tingkat verifikasi data. Untuk tiket masuk, yang berstatus terverifikasi tinggi " +
        "hanya " + high.map(function (d) { return U.esc(d.nama); }).join(", ") + ". " +
        "Entri lain menampilkan peringatan konfirmasi, karena angkanya beredar di internet tanpa sumber resmi. " +
        'Detail metode ada di <a href="metodologi.html">halaman metodologi</a>.';
    }

    /* 2. pertanyaan kategori */
    var kat = jawabKategori(niat);
    if (kat && !hasil.length) return kat;

    if (!hasil.length) {
      if (kat) return kat;
      var jml = jawabJumlah(niat, hasil);
      if (jml) return jml;
      return null;
    }

    var doc = hasil[0].doc;
    var nama = U.esc(doc.nama);

    /* 3. tiket dan jam hanya untuk destinasi */
    if ((niat.jenis === "tiket" || niat.jenis === "jam") ) {
      if (doc.jenis === "destinasi") {
        var d = U.findDestinasi(doc.id);
        var teks = niat.jenis === "tiket" ? (d.tiket && d.tiket.teks) : (d.jam && d.jam.teks);
        var ver = niat.jenis === "tiket" ? (d.tiket && d.tiket.verifikasi) : (d.jam && d.jam.verifikasi);
        if (teks) {
          var label = ver === "tinggi" ? "" :
            " <i>Catatan: informasi ini berstatus " + U.esc(ver || "perlu konfirmasi") +
            ", jadi angka dapat berubah.</i>";
          return "<b>" + nama + "</b>: " + U.esc(teks) + label + " Selengkapnya di " + tautan(doc) + ".";
        }
      }
      return "Informasi " + (niat.jenis === "tiket" ? "tiket" : "jam operasional") + " untuk " + nama +
        " belum tersedia di data kami. Silakan konfirmasi langsung ke pengelola.";
    }

    /* 4. lokasi dan peta */
    if (niat.jenis === "lokasi") {
      if (doc.jenis === "destinasi") {
        var d2 = U.findDestinasi(doc.id);
        var bagian = [];
        if (d2.alamat) bagian.push(U.esc(d2.alamat));
        if (d2.koordinat) bagian.push("Koordinat " + d2.koordinat.lat + ", " + d2.koordinat.lng);
        var peta = d2.koordinat
          ? ' <a href="' + U.esc(U.mapsLink(d2)) + '" target="_blank" rel="noopener">Buka di Google Maps</a>'
          : ' <a href="' + U.esc(U.mapsLink(d2)) + '" target="_blank" rel="noopener">Cari lokasinya di Google Maps</a>';
        return "<b>" + nama + "</b>: " + (bagian.join(" &middot; ") || "alamat belum tercatat") + "." + peta +
          ". Peta tersemat ada di " + tautan(doc) + ".";
      }
      if (doc.jenis === "umkm") {
        var u = U.findUMKM(doc.id);
        if (!u.alamat) {
          return "<b>" + nama + "</b>: lokasi usaha ini belum diverifikasi, jadi kami tidak menampilkan alamatnya. " +
            'Alasan dan cara melengkapinya ada di <a href="metodologi.html">halaman metodologi</a>. ' +
            "Untuk saat ini, peta hanya tersedia untuk destinasi wisata yang koordinatnya sudah dicatat.";
        }
      }
    }

    /* 5. produk/jumlah untuk UMKM */
    if (doc.jenis === "umkm") {
      var u2 = U.findUMKM(doc.id);
      var produk = (u2.produk || []).slice(0, 4).map(function (p) {
        return U.esc(p.nama) + (p.unggulan ? " (unggulan)" : "");
      }).join(", ");
      var st = u2.statusData === "demonstrasi"
        ? " Entri ini berlabel data demonstrasi."
        : " Nama usaha bersumber dari rujukan publik; kontak belum diverifikasi.";
      return "<b>" + nama + "</b>: " + produk + "." + st + " Rinciannya di " + tautan(doc) + ".";
    }

    /* 6. jawaban umum -> ringkasan hasil teratas + daftar alternatif */
    return null;
  }

  function susunDaftar(hasil, batas) {
    if (!hasil.length) return "";
    var li = hasil.slice(0, batas || 3).map(function (r) {
      return '<li><a href="' + U.esc(r.doc.url) + '">' + U.esc(r.doc.nama) + "</a> " +
        '<span class="muted small">(' + labelJenis(r.doc.jenis) + ")</span></li>";
    }).join("");
    return "<ul style=\"margin:6px 0 0;padding-left:18px\">" + li + "</ul>";
  }

  /* ---------- 5. Fungsi utama ---------- */

  /* Jika pencarian semantik aktif, kita gabung hasilnya dengan
     hasil kata kunci. Hasil semantik hanya dapat mempromosikan
     dokumen, tidak pernah menggantikan penilaian kata kunci lebih
     dari separuh skor, supaya kata kunci yang tepat tetap menang. */
  function gabungSkor(hasilKataKunci, hasilSemantik) {
    if (!hasilSemantik || !hasilSemantik.length) return hasilKataKunci;
    var peta = {};
    hasilKataKunci.forEach(function (r) {
      peta[r.doc.jenis + ":" + r.doc.id] = {
        doc: r.doc, skor: r.skor, kelengkapan: r.kelengkapan, cocok: r.cocok
      };
    });
    var maksSem = hasilSemantik[0].skor || 1;
    hasilSemantik.forEach(function (s) {
      var key = s.doc.jenis + ":" + s.doc.id;
      var bonus = 0.5 * (s.skor / maksSem);
      if (peta[key]) peta[key].skor += bonus;
      else peta[key] = { doc: s.doc, skor: bonus, kelengkapan: 0.5, cocok: 1 };
    });
    return Object.keys(peta).map(function (k) { return peta[k]; })
      .sort(function (a, b) { return b.skor - a.skor; });
  }

  SC.asisten = {
    /* dipakai untuk uji mandiri dan untuk halaman metodologi */
    _cari: cariTeks,
    _niat: deteksiNiat,
    _dokumen: dokumenDariData,

    tanya: function (teks) {
      teks = U.clampText(teks, 300);
      var bersih = teks.trim();
      if (!bersih) return null;

      var niat = deteksiNiat(bersih);
      var hasil = cariTeks(bersih, 5);

      var jawaban = jawabNiat(niat, hasil);
      if (jawaban) return { html: jawaban, hasil: hasil };

      if (hasil.length) {
        var top = hasil[0].doc;
        var ringkas = U.esc(top.ringkas || top.isi.slice(0, 220));
        var head = "Saya menemukan <b>" + U.esc(top.nama) + "</b> (" + labelJenis(top.jenis) + "): " + ringkas +
          ' <a href="' + U.esc(top.url) + '">buka halaman lengkapnya</a>.';
        var lanjut = hasil.length > 1
          ? " Mungkin juga relevan:" + susunDaftar(hasil.slice(1), 3)
          : "";
        return { html: head + lanjut, hasil: hasil };
      }

      if (niat.kategori) {
        var k = jawabKategori(niat);
        if (k) return { html: k + ' Selebihnya lihat <a href="destinasi.html">destinasi</a>, <a href="umkm.html">UMKM</a>, atau <a href="artikel.html">artikel</a>.', hasil: [] };
      }
      if (niat.wilayah) {
        var dest = (SC.DESTINASI || []).filter(function (d) { return d.wilayah === niat.wilayah; });
        var um = (SC.UMKM || []).filter(function (u) { return u.wilayah === niat.wilayah; });
        if (dest.length || um.length) {
          var kal = "Di wilayah <b>" + U.esc(niat.wilayah) + "</b> tercatat " +
            dest.length + " destinasi dan " + um.length + " entri UMKM. ";
          kal += dest.slice(0, 4).map(function (d) { return U.esc(d.nama); }).join(", ");
          return { html: kal + ".", hasil: [] };
        }
      }

      return {
        html: "Data saya belum memuat yang Anda cari. Asisten ini hanya menjawab berdasarkan " +
          "daftar destinasi, UMKM, dan artikel yang ada di website, jadi tidak dapat menambah " +
          "informasi di luar itu. Coba kata kunci lain seperti nama tempat, kategori, atau topik, misalnya: " +
          SARAN_DEFAULT.slice(0, 4).map(function (s) { return "<i>" + U.esc(s) + "</i>"; }).join(", ") + ".",
        hasil: []
      };
    },

    /* ---------- 6. Pencarian semantik opsional (WebGPU) ---------- */

    semantik: {
      aktif: false,
      memuat: false,
      device: null,
      extractor: null,
      vektor: null,
      pesan: "",

      /* Dukungan diperiksa sebelum mengunduh apa pun. Kalau tidak
         ada WebGPU maupun WebAssembly, fitur ini dimatikan dan
         asisten tetap berjalan pada tingkat kata kunci. */
      didukung: function () {
        return typeof WebAssembly === "object";
      },

      nyalakan: function (onProgress) {
        var self = SC.asisten.semantik;
        if (self.aktif || self.memuat) return Promise.resolve(self.aktif);
        if (!self.didukung()) {
          self.pesan = "Peramban ini tidak mendukung WebAssembly, sehingga pencarian semantik tidak dapat dijalankan.";
          return Promise.resolve(false);
        }
        self.memuat = true;
        self.pesan = "Menyiapkan model...";

        /* Transformers.js dimuat dari CDN secara dinamis (bukan
           npm), dan hanya ketika fitur ini dipilih pengguna. */
        return import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js")
          .then(function (mod) {
            var pipe = mod.pipeline;
            var device = (navigator.gpu ? "webgpu" : "wasm");
            self.pesan = "Mengunduh model embedding (all-MiniLM-L6-v2, sekitar 23 MB)...";
            if (onProgress) onProgress(self.pesan);
            return pipe("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
              device: device,
              dtype: "q8",
              progress_callback: function (p) {
                if (p && p.status === "progress" && p.file && onProgress) {
                  onProgress("Mengunduh " + p.file + " " + Math.round(p.progress || 0) + "%");
                }
              }
            }).then(function (extractor) {
              self.extractor = extractor;
              self.device = device;
              return self.hitungVektorDokumen();
            });
          })
          .then(function () {
            self.aktif = true;
            self.memuat = false;
            self.pesan = "Model siap. Pencarian semantik aktif pada perangkat " +
              (self.device === "webgpu" ? "GPU" : "CPU");
            return true;
          })
          .catch(function (e) {
            self.aktif = false;
            self.memuat = false;
            self.pesan = "Model gagal dimuat, kemungkinan karena tidak ada koneksi internet. " +
              "Asisten tetap berjalan dengan pencarian kata kunci.";
            return false;
          });
      },

      hitungVektorDokumen: function () {
        var self = SC.asisten.semantik;
        var docs = bangunIndeks().docs;
        /* Teks yang di-embed dipotong supaya hemat waktu: judul,
           kategori, dan ringkasan sudah mewakili isi dokumen. */
        var teks = docs.map(function (d) {
          return (d.nama + ". " + d.kategori + ". " + (d.ringkas || d.isi.slice(0, 300)));
        });
        return self.extractor(teks, { pooling: "mean", normalize: true }).then(function (out) {
          var arr = out.tolist ? out.tolist() : out;
          self.vektor = arr;
          self.docs = docs;
          return true;
        });
      },

      cari: function (query, batas) {
        var self = SC.asisten.semantik;
        if (!self.aktif || !self.vektor) return Promise.resolve([]);
        return self.extractor([query], { pooling: "mean", normalize: true }).then(function (out) {
          var q = (out.tolist ? out.tolist() : out)[0];
          var hasil = self.vektor.map(function (v, i) {
            var dot = 0;
            for (var j = 0; j < q.length; j++) dot += q[j] * v[j];
            return { doc: self.docs[i], skor: dot };
          });
          return hasil
            .sort(function (a, b) { return b.skor - a.skor; })
            .slice(0, batas || 5);
        }).catch(function () { return []; });
      }
    }
  };

  /* ---------- 7. Antarmuka mengambang ---------- */

  SC.asisten.mount = function () {
    if (U.qs("#aiFab") || U.qs("#aiPanel")) return;

    var fab = document.createElement("button");
    fab.id = "aiFab";
    fab.className = "ai-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Buka asisten Sari");
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "aiPanel");
    fab.innerHTML = SC.ikon.chat;

    var panel = document.createElement("section");
    panel.id = "aiPanel";
    panel.className = "ai-panel";
    panel.setAttribute("aria-label", "Asisten Sari");
    panel.innerHTML =
      '<div class="ai-head">' +
        '<span class="brand-badge" aria-hidden="true" style="width:34px;height:34px;font-size:.9rem">S</span>' +
        "<span><b>Sari</b><span class=\"status\" id=\"aiStatus\">Asisten konten Sriwijaya Culture</span></span>" +
        '<button class="icon-btn" type="button" id="aiClose" aria-label="Tutup asisten">' + SC.ikon.close + "</button>" +
      "</div>" +
      '<div class="ai-log" id="aiLog" role="log" aria-live="polite"></div>' +
      '<div class="ai-suggest" id="aiSuggest"></div>' +
      '<form class="ai-form" id="aiForm">' +
        '<label class="sr-only" for="aiInput">Tulis pertanyaan</label>' +
        '<input id="aiInput" type="text" maxlength="300" autocomplete="off" placeholder="Tanya soal wisata, UMKM, atau sejarah..." />' +
        '<button type="submit" aria-label="Kirim pertanyaan">' + SC.ikon.send + "</button>" +
      "</form>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var log = U.qs("#aiLog", panel);
    var form = U.qs("#aiForm", panel);
    var input = U.qs("#aiInput", panel);
    var suggest = U.qs("#aiSuggest", panel);
    var status = U.qs("#aiStatus", panel);

    function push(html, kelas) {
      var div = document.createElement("div");
      div.className = "ai-msg " + (kelas || "bot");
      div.innerHTML = html;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
      return div;
    }

    function buka(open) {
      panel.classList.toggle("open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        if (!log.childElementCount) sapaan();
        input.focus();
      }
    }

    function sapaan() {
      var sesi = SC.akun ? SC.akun.sesi() : null;
      var halo = sesi ? "Halo " + U.esc(sesi.nama.split(" ")[0]) + "!" : "Halo!";
      push(halo + " Saya <b>Sari</b>, asisten yang membaca daftar destinasi, UMKM, dan artikel di situs ini. " +
        "Saya menjawab dengan mencari di data yang ada, bukan mengarang. Silakan pilih salah satu contoh atau tulis pertanyaan Anda.");
      tampilkanSaran(["Tiket Jembatan Ampera", "Destinasi kategori Religi", "Produk Pempek Beringin",
        "Sejarah Kerajaan Sriwijaya", "Usaha songket", "Data mana yang sudah terverifikasi?"]);
    }

    function tampilkanSaran(list) {
      suggest.innerHTML = "";
      list.forEach(function (t) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = t;
        b.addEventListener("click", function () { kirim(t); });
        suggest.appendChild(b);
      });
    }

    function tampilkanSemantikToggle() {
      if (U.qs("#aiSemToggle", suggest)) return;
      var b = document.createElement("button");
      b.type = "button";
      b.id = "aiSemToggle";
      b.textContent = "Aktifkan pencarian semantik (butuh internet)";
      b.addEventListener("click", function () {
        b.disabled = true;
        status.textContent = "Menyiapkan model...";
        var sem = SC.asisten.semantik;
        sem.nyalakan(function (pesan) { status.textContent = U.clampText(pesan, 60); })
          .then(function (ok) {
            status.textContent = sem.pesan.slice(0, 70);
            b.remove();
            push(ok
              ? "Pencarian semantik aktif di perangkat " + (sem.device === "webgpu" ? "GPU" : "CPU") +
                ". Sekarang pertanyaan yang memakai kata berbeda dari data tetap bisa ditemukan, " +
                "misalnya <i>tempat dengan cerita cinta</i> dapat menemukan Pulau Kemaro."
              : U.esc(sem.pesan));
          });
      });
      suggest.appendChild(b);
    }

    function kirim(teks) {
      var bersih = U.clampText(teks, 300).trim();
      if (!bersih) return;
      push(U.esc(bersih), "user");
      input.value = "";

      var sem = SC.asisten.semantik;
      var kerja = sem.aktif
        ? sem.cari(bersih, 5).then(function (hasilSem) {
            var hasilKata = cariTeks(bersih, 5);
            return { html: SC.asisten.tanya(bersih), gabung: gabungSkor(hasilKata, hasilSem) };
          })
        : Promise.resolve({ html: SC.asisten.tanya(bersih), gabung: null });

      var loading = push('<span class="ai-typing">Sari sedang mencari di data...</span>');

      kerja.then(function (r) {
        var jawaban = r.html;
        if (r.gabung && r.gabung.length) {
          /* ketika semantik aktif, hasil gabungan dipakai untuk
             melengkapi daftar saran bila jawaban berupa daftar umum */
          if (jawaban && jawaban.hasil && !jawaban.hasil.length && r.gabung.length) {
            jawaban = {
              html: "Berdasarkan kemiripan makna, yang paling dekat dengan pertanyaan Anda:" +
                susunDaftar(r.gabung, 3),
              hasil: r.gabung
            };
          }
        }
        loading.remove();
        if (!jawaban) {
          push("Pertanyaan itu belum bisa saya jawab dari data yang ada.");
          return;
        }
        push(jawaban.html);
      }).catch(function (e) {
        loading.remove();
        push("Terjadi kendala saat mencari data: " + U.esc(U.clampText(e && e.message, 120)) +
          ". Coba lagi atau buka halaman destinasi, UMKM, dan artikel langsung.");
      });
    }

    fab.addEventListener("click", function () { buka(!panel.classList.contains("open")); });
    U.qs("#aiClose", panel).addEventListener("click", function () { buka(false); fab.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) { buka(false); fab.focus(); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      kirim(input.value);
    });

    /* Penawaran pencarian semantik muncul setelah dua pertanyaan,
       supaya pengguna sempat mencoba mode tanpa unduhan dulu. */
    var jumlahTanya = 0;
    form.addEventListener("submit", function () {
      jumlahTanya += 1;
      if (jumlahTanya >= 2 && SC.asisten.semantik.didukung()) tampilkanSemantikToggle();
    });

    /* bukti penggunaan: catat jumlah pertanyaan agar halaman
       metodologi dapat menampilkannya sebagai data nyata */
    var bukti = 0;
    try { bukti = parseInt(localStorage.getItem(STORAGE_BUKTI) || "0", 10) || 0; } catch (e) {}
    form.addEventListener("submit", function () {
      bukti += 1;
      try { localStorage.setItem(STORAGE_BUKTI, String(bukti)); } catch (e) {}
    });
  };

  SC.asisten.jumlahPertanyaan = function () {
    try { return parseInt(localStorage.getItem(STORAGE_BUKTI) || "0", 10) || 0; } catch (e) { return 0; }
  };
})();