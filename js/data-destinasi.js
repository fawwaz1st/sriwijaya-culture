/* ============================================================
   data-destinasi.js - dataset destinasi wisata Palembang
   ------------------------------------------------------------
   ATURAN DATA (dibaca juri, tolong jujur):
   - Setiap angka/klaim punya field `sumber` atau ditandai `verifikasi`.
   - `verifikasi: "tinggi"` = didukung sumber yang saling menguatkan.
   - `verifikasi: "sedang"` = satu sumber terpercaya, belum ada pembanding.
   - `verifikasi: "perlu-konfirmasi"` = angka beredar di internet tanpa
     sumber resmi. UI menampilkan peringatan, bukan menampilkannya sebagai fakta.
   - Legenda rakyat WAJIB ditulis sebagai legenda, bukan peristiwa sejarah.
   ============================================================ */
window.SC = window.SC || {};

SC.KATEGORI_DESTINASI = ["Sejarah", "Budaya", "Alam", "Religi", "Edukasi", "Kuliner"];

SC.DESTINASI = [
  {
    id: "jembatan-ampera",
    nama: "Jembatan Ampera",
    namaLengkap: "Jembatan Ampera (Amanat Penderitaan Rakyat)",
    kategori: ["Sejarah", "Alam"],
    wilayah: "Seberang Ilir - Seberang Ulu",
    ringkas:
      "Jembatan ikon Kota Palembang yang melintasi Sungai Musi, menghubungkan kawasan Seberang Ilir dan Seberang Ulu. Bagian tengahnya pernah dapat diangkat untuk memberi jalan kapal besar.",
    gambar: [
      { src: "assets/images/ampera-1.jpg", caption: "Jembatan Ampera melintasi Sungai Musi.", kredit: "Wikimedia Commons, CC BY-SA 4.0" },
      { src: "assets/images/ampera-2.jpg", caption: "Ampera pada malam hari, ikon panorama kota.", kredit: "Wikimedia Commons, CC BY-SA 3.0" },
      { src: "assets/images/ampera-3.jpg", caption: "Kawasan Ampera dan jalur LRT Palembang.", kredit: "Wikimedia Commons, CC BY-SA 4.0" }
    ],
    deskripsi:
      "Jembatan Ampera adalah bangunan paling dikenal di Palembang. Namanya adalah akronim dari Amanat Penderitaan Rakyat. Jembatan ini melintasi Sungai Musi dan menjadi penghubung utama antara kawasan Seberang Ilir dan Seberang Ulu. Panjangnya tercatat sekitar 1.117 meter dengan lebar sekitar 22 meter, dan saat dibangun menjadi salah satu jembatan terpanjang di Asia Tenggara. Bagian tengah jembatan pernah dirancang dapat diangkat secara vertikal agar kapal besar bisa melintas di bawahnya, tetapi mekanisme itu tidak lagi dioperasikan sejak awal dekade 1970-an.",
    sejarah:
      "Pembangunan dimulai April 1962 setelah mendapat persetujuan Presiden Soekarno. Biayanya berasal dari dana pampasan perang Jepang, dengan tenaga ahli dari Jepang dan perancangan teknis yang dikaitkan dengan Ir. Sutami. Jembatan mulai digunakan pada 1965. Pada 1965 sampai 1966 jembatan ini sempat dinamai Jembatan Bung Karno, lalu namanya diubah menjadi Ampera setelah perubahan situasi politik nasional.",
    dayaTarik: [
      "Panorama Sungai Musi dan lalu lintas kapal dari atas jembatan.",
      "Deretan lampu jembatan saat malam, salah satu titik foto favorit di Palembang.",
      "Menara setinggi sekitar 63 meter dan bentang tengah yang pernah bisa diangkat.",
      "Pemandangan Plaza Benteng Kuto Besak dan kawasan 16 Ilir di kedua sisi jembatan."
    ],
    aktivitas: [
      "Berjalan kaki menyusuri trotoar jembatan pada pagi atau sore hari.",
      "Berfoto dari Plaza Benteng Kuto Besak atau tepian Sungai Musi.",
      "Naik kapal wisata Musi Cruise yang melewati kolong jembatan.",
      "Menikmati kuliner malam di kawasan sekitar Plaza BKB."
    ],
    alamat: "Membentang dari kawasan 16 Ilir (Seberang Ilir) ke kawasan 7 Ulu (Seberang Ulu), Kota Palembang.",
    koordinat: { lat: -2.9917, lng: 104.7635 },
    mapsQuery: "Jembatan Ampera Palembang",
    tiket: { verifikasi: "tinggi", teks: "Tidak berlaku tiket. Jembatan ini jalan raya umum dan dapat dilalui kapan saja." },
    jam: { verifikasi: "tinggi", teks: "Akses 24 jam sebagai jalan raya. Waktu terbaik untuk foto adalah pagi dan menjelang malam." },
    akses:
      "Berada di pusat kota Palembang. Bisa dicapai dengan kendaraan pribadi, angkutan kota, LRT (stasiun terdekat di kawasan Ampera), atau berjalan kaki dari kawasan 16 Ilir dan Plaza Benteng Kuto Besak.",
    fakta: [
      { k: "Panjang", v: "sekitar 1.117 meter" },
      { k: "Lebar", v: "sekitar 22 meter" },
      { k: "Tinggi menara", v: "sekitar 63 meter" },
      { k: "Tinggi dari air", v: "sekitar 11,5 meter" },
      { k: "Bentang tengah", v: "sekitar 71 meter (sumber menulis 71,5 dan 71,9 meter)" },
      { k: "Mulai dibangun", v: "April 1962" },
      { k: "Digunakan", v: "1965" }
    ],
    ulasan: {
      status: "belum",
      pesan: "Informasi ulasan pengunjung belum tersedia. Website ini tidak menampilkan ulasan yang tidak dapat diverifikasi."
    },
    sumber: [
      { judul: "Jembatan Ampera", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Jembatan_Ampera", verifikasi: "tinggi" },
      { judul: "Jembatan Ampera, Lambang Eksotisme Kota Palembang", penulis: "BPPK Kementerian Keuangan RI", url: "https://bppk.kemenkeu.go.id/balai-diklat-keuangan-palembang/artikel/jembatan-ampera-lambang-eksotisme-kota-palembang-758825", verifikasi: "tinggi" },
      { judul: "Sejarah Jembatan Ampera sebagai Ikon Kota Palembang", penulis: "Jurnal Historia, UIN Sunan Gunung Djati", url: "https://journal.uinsgd.ac.id/index.php/historia/article/download/18548/7909", verifikasi: "sedang" }
    ],
    tanggalDiperbarui: "2026-10-18",
    artikelTerkait: ["sejarah-jembatan-ampera"],
    destinasiTerkait: ["benteng-kuto-besak", "sungai-musi", "museum-smb2", "masjid-agung"]
  },

  {
    id: "pulau-kemaro",
    nama: "Pulau Kemaro",
    namaLengkap: "Pulau Kemaro",
    kategori: ["Budaya", "Religi"],
    wilayah: "Ilir Timur II",
    ringkas:
      "Pulau kecil di tengah Sungai Musi dengan Pagoda sembilan lantai dan Kelenteng Hok Tjing Bio. Terkenal karena legenda cinta Tan Bun An dan Siti Fatimah.",
    gambar: [
      { src: "assets/images/kemaro-2.jpg", caption: "Pagoda di kawasan Pulau Kemaro.", kredit: "Wikimedia Commons, CC BY 4.0" }
    ],
    deskripsi:
      "Pulau Kemaro adalah pulau kecil di tengah Sungai Musi yang masuk wilayah Kelurahan 1 Ilir, Kecamatan Ilir Timur II. Di atas pulau berdiri Pagoda sembilan lantai dan Kelenteng Hok Tjing Bio, yang lebih dikenal sebagai Klenteng Kwan Im. Pulau ini menjadi salah satu pusat kegiatan umat Tridharma di Palembang dan ramai dikunjungi saat perayaan Cap Go Meh. Penduduk setempat mengenalnya juga sebagai Pulau Cinta atau Pulau Jodoh.",
    sejarah:
      "Kelenteng Hok Tjing Bio di pulau ini dibangun sejak 1962 menurut catatan Wikipedia bahasa Indonesia. Pulau Kemaro juga dikaitkan dengan kisah masa Sriwijaya, tetapi perlu ditegaskan bahwa kisah Tan Bun An dan Siti Fatimah adalah legenda rakyat yang dituliskan pada batu di samping kelenteng. Tidak ada bukti arkeologis atau prasasti yang menyatakan kedua tokoh itu pernah hidup sebagai tokoh historis. Pulau ini pernah pula dijuluki Pulau Maut karena arus sungai di sekitarnya kuat dan pernah menimbulkan korban.",
    legenda: {
      judul: "Legenda Tan Bun An dan Siti Fatimah",
      isi:
        "Dikisahkan seorang pedagang Tionghoa bernama Tan Bun An datang ke Palembang dan jatuh cinta kepada Siti Fatimah, putri seorang bangsawan setempat. Tan Bun An meminta dari negerinya tujuh guci berisi emas untuk maskawin. Karena guci-guci yang tiba ternyata dikiranya berisi sayuran busuk, ia memerintahkan guci itu dibuang ke Sungai Musi. Setelah menyadari isinya adalah emas, ia menyesal. Pulau ini dipercaya terbentuk dari endapan tanah dan guci tersebut. Dua makam yang berdampingan di depan kelenteng dikaitkan dengan kedua tokoh itu. Cerita ini adalah cerita rakyat, tidak ditulis sebagai peristiwa sejarah di website ini."
    },
    dayaTarik: [
      "Pagoda sembilan lantai, salah satu bangunan bertingkat paling mencolok di Sungai Musi.",
      "Kelenteng Hok Tjing Bio dan altar persembahan.",
      "Makam yang dikaitkan dengan legenda Tan Bun An dan Siti Fatimah, berdampingan di depan kelenteng.",
      "Ritual warga Tridharma dan perayaan Cap Go Meh.",
      "Pemandangan Sungai Musi dari pulau, terutama saat matahari terbenam."
    ],
    aktivitas: [
      "Ziarah dan bersembahyang bagi umat Tridharma.",
      "Berfoto di halaman pagoda dan tepi sungai.",
      "Menyusuri pulau dengan berjalan kaki, luasnya terbatas sehingga cukup ditempuh dalam satu jam.",
      "Menyeberang dengan perahu ketek atau kapal wisata dari dermaga sekitar kawasan 16 Ilir.",
      "Menyaksikan langsung prosesi Cap Go Meh yang biasanya disertai jembatan ponton."
    ],
    alamat: "Kelurahan 1 Ilir, Kecamatan Ilir Timur II, Kota Palembang. Pulau berada di tengah Sungai Musi.",
    mapsQuery: "Pulau Kemaro Palembang",
    tiket: {
      verifikasi: "sedang",
      teks:
        "Masuk ke pulau tidak dikenakan tiket resmi. Biaya yang perlu disiapkan adalah transportasi air. Harga sewa perahu ketek berbeda-beda antar sumber, mulai dari sekitar Rp20.000 sampai Rp250.000 tergantung jenis perahu dan rute. Angka ini tidak berasal dari sumber resmi Dinas Pariwisata, konfirmasi di dermaga sebelum berangkat."
    },
    jam: {
      verifikasi: "perlu-konfirmasi",
      teks: "Jam buka resmi belum terverifikasi. Beberapa sumber menyebut sekitar pukul 09.00 sampai 19.00. Konfirmasi ke pengelola atau lewat dermaga penyeberangan."
    },
    akses:
      "Dijangkau melalui jalur air. Perahu ketek dan kapal wisata berangkat dari dermaga di sekitar kawasan Pasar 16 Ilir dan Dermaga Point Benteng Kuto Besak. Sebagian sumber juga menyebut dermaga lain, sehingga sebaiknya konfirmasi rute terdekat saat tiba di tepi Sungai Musi.",
    fakta: [
      { k: "Luas pulau", v: "sekitar 79 hektare (menurut Wikipedia bahasa Indonesia)" },
      { k: "Ketinggian", v: "sekitar 5 meter di atas permukaan laut (sumber yang sama)" },
      { k: "Bangunan utama", v: "Pagoda 9 lantai dan Kelenteng Hok Tjing Bio" },
      { k: "Kelenteng dibangun", v: "sejak 1962 (menurut Wikipedia bahasa Indonesia)" }
    ],
    ulasan: {
      status: "belum",
      pesan: "Informasi ulasan pengunjung belum tersedia."
    },
    sumber: [
      { judul: "Pulau Kemaro", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Pulau_Kemaro", verifikasi: "sedang" },
      { judul: "Pulau Kemaro, Pulau Cinta yang Pernah Dianggap Pulau Maut", penulis: "detikSumbagsel", url: "https://www.detik.com/sumbagsel/budaya/d-7539011/pulau-kemaro-pulau-cinta-yang-pernah-dianggap-pulau-maut", verifikasi: "sedang" },
      { judul: "Pulau Kemaro, Legenda Cinta di Bulan Purnama Cap Go Meh", penulis: "National Geographic Indonesia", url: "https://nationalgeographic.grid.id/amp/13287708/pulau-kemaro-legenda-cinta-di-bulan-purnama-cap-go-meh", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Luas pulau dan tinggi pulau hanya muncul di Wikipedia bahasa Indonesia, belum dikonfirmasi sumber pemerintah. Angka luas 79 hektare juga tidak akurat sebagai luas geografis: Pulau Kemaro adalah delta kecil dan tidak seluas itu. Angka tarif transportasi air bervariasi antar sumber dan tidak berasal dari pengelola resmi. Kisah Tan Bun An dan Siti Fatimah wajib dibaca sebagai legenda. Koordinat tidak dicatat karena tidak ada titik utama yang dapat diverifikasi; tautan Google Maps tersedia.",
    artikelTerkait: ["sejarah-pulau-kemaro"],
    destinasiTerkait: ["sungai-musi", "jembatan-ampera", "kampung-kapitan", "benteng-kuto-besak"]
  },

  {
    id: "benteng-kuto-besak",
    nama: "Benteng Kuto Besak",
    namaLengkap: "Benteng Kuto Besak (Keraton Kuto Besak)",
    kategori: ["Sejarah"],
    wilayah: "Bukit Kecil",
    ringkas:
      "Keraton berbenteng dari abad ke-18 di tepi Sungai Musi, pusat Kesultanan Palembang Darussalam. Kini kawasan dalam benteng merupakan markas Kodam II/Sriwijaya.",
    gambar: [
      { src: "assets/images/bkb-1.jpg", caption: "Tembok bata Benteng Kuto Besak.", kredit: "Wikimedia Commons, CC BY 2.0" },
      { src: "assets/images/bkb-2.jpg", caption: "Sudut benteng dan bastion.", kredit: "Wikimedia Commons, CC BY-SA 4.0" }
    ],
    deskripsi:
      "Benteng Kuto Besak adalah keraton berbenteng yang menjadi pusat Kesultanan Palembang Darussalam sebelum kesultanan itu diakhiri oleh pemerintah kolonial Belanda. Dalam bahasa Palembang, Kuto Besak berarti keraton besar. Bangunan ini berdiri tepat di tepi Sungai Musi sehingga pada masanya menguasai jalur pelayaran. Saat ini kawasan di dalam benteng digunakan sebagai markas Komando Daerah Militer II/Sriwijaya, sedangkan pelataran di depannya menjadi ruang terbuka publik yang dikenal sebagai Plaza Benteng Kuto Besak.",
    sejarah:
      "Pembangunan dimulai tahun 1780 dan rampung serta mulai ditempati secara resmi pada 21 Februari 1797, sehingga memakan waktu kurang lebih 17 tahun. Perekat bata konon memakai campuran batu kapur dari pedalaman Sungai Ogan dan putih telur. Gagasan membangun keraton keempat ini berasal dari Sultan Mahmud Badaruddin I, sedangkan pelaksanaan pembangunannya berlangsung pada masa pemerintahan Sultan Muhammad Bahauddin yang memerintah sekitar 1776 sampai 1803. Kuto Besak adalah keraton keempat setelah Kuto Gawang, Beringin Janggut, dan Kuto Lama.",
    dayaTarik: [
      "Tembok bata merah setinggi kurang lebih 9,14 meter dan tebal sekitar 2,13 meter.",
      "Empat bastion atau menara pertahanan di setiap sudut benteng.",
      "Meriam besi dan kuningan peninggalan masa kesultanan.",
      "Plaza Benteng Kuto Besak, ruang terbuka publik dengan latar Jembatan Ampera dan Sungai Musi."
    ],
    aktivitas: [
      "Berjalan di pelataran plaza benteng pada pagi atau sore hari.",
      "Berfoto dengan latar tembok bata dan Jembatan Ampera.",
      "Menikmati kuliner malam di kawasan Plaza BKB.",
      "Mengunjungi Museum Sultan Mahmud Badaruddin II dan Monpera yang berjarak dekat."
    ],
    alamat: "Jalan Sultan Mahmud Badarudin, 19 Ilir, Kecamatan Bukit Kecil, Kota Palembang.",
    koordinat: { lat: -2.9914, lng: 104.7592 },
    mapsQuery: "Benteng Kuto Besak Palembang",
    tiket: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Plaza di depan benteng terbuka untuk umum. Untuk masuk ke area dalam benteng, konfirmasi langsung ke pengelola atau pos penjagaan karena kawasan masih digunakan Kodam II/Sriwijaya. Beberapa sumber sekunder menyebut tiket sekitar Rp5.000, angka ini belum dikonfirmasi pengelola."
    },
    jam: {
      verifikasi: "perlu-konfirmasi",
      teks: "Plaza terbuka setiap saat. Sumber sekunder menyebut jam kunjungan 08.00 sampai 21.00 untuk area dalam, belum ada konfirmasi resmi."
    },
    akses:
      "Berada di pusat kota, dapat dicapai dengan kendaraan pribadi atau angkutan kota. Berdekatan dengan Museum Sultan Mahmud Badaruddin II, Monpera, Masjid Agung, dan Jembatan Ampera sehingga bisa dikunjungi dalam satu rute jalan kaki.",
    fakta: [
      { k: "Mulai dibangun", v: "1780" },
      { k: "Ditempati resmi", v: "21 Februari 1797" },
      { k: "Tinggi tembok", v: "sekitar 9,14 meter" },
      { k: "Tebal tembok", v: "sekitar 2,13 meter" },
      { k: "Jumlah bastion", v: "4, di setiap sudut" },
      { k: "Fungsi sekarang", v: "Kawasan Markas Kodam II/Sriwijaya" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Kuto Besak", penulis: "Wikipedia bahasa Inggris", url: "https://en.wikipedia.org/wiki/Kuto_Besak", verifikasi: "tinggi" },
      { judul: "Benteng Kuto Besak", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Benteng_Kuto_Besak", verifikasi: "sedang" },
      { judul: "Usai Ditata, Benteng Kuto Besak Palembang Dibuka untuk Umum", penulis: "detikSumbagsel", url: "https://www.detik.com/sumbagsel/berita/d-8298084/usai-ditata-benteng-kuto-besak-palembang-dibuka-untuk-umum", verifikasi: "sedang" },
      { judul: "Kodam II/Sriwijaya Jadikan Benteng Kuto Besak Destinasi Wisata Unggulan", penulis: "detikSumbagsel", url: "https://www.detik.com/sumbagsel/berita/d-8551400/kodam-ii-sriwijaya-jadikan-benteng-kuto-besak-destinasi-wisata-unggulan", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Banyak artikel populer menulis benteng ini dibangun oleh Sultan Mahmud Badaruddin I. Itu tidak sesuai kronologi, karena masa pemerintahannya sekitar 1724 sampai 1758 sedangkan pembangunan berjalan 1780 sampai 1797. Yang tepat: gagasan dari Sultan Mahmud Badaruddin I, pelaksanaan pada masa Sultan Muhammad Bahauddin.",
    artikelTerkait: ["sejarah-benteng-kuto-besak"],
    destinasiTerkait: ["museum-smb2", "monpera", "masjid-agung", "jembatan-ampera"]
  },

  {
    id: "masjid-agung",
    nama: "Masjid Agung Palembang",
    namaLengkap: "Masjid Agung Sultan Mahmud Badaruddin I Jayo Wikramo",
    kategori: ["Religi", "Budaya", "Sejarah"],
    wilayah: "Bukit Kecil",
    ringkas:
      "Masjid utama Kota Palembang dan terbesar di Sumatera Selatan. Memiliki dua menara dari dua masa berbeda: menara abad ke-18 dengan pengaruh Tiongkok dan menara bergaya Ottoman setinggi 45 meter.",
    gambar: [
      { src: "assets/images/masjid-1.jpg", caption: "Bangunan utama Masjid Agung Palembang.", kredit: "Wikimedia Commons, CC BY-SA 4.0" },
      { src: "assets/images/masjid-2.jpg", caption: "Masjid Agung pada malam hari.", kredit: "Wikimedia Commons, CC BY-SA 4.0" }
    ],
    deskripsi:
      "Masjid Agung Palembang adalah masjid utama kota dan termasuk yang terbesar di Pulau Sumatera. Kompleksnya mencakup lahan sekitar 15.400 meter persegi. Yang membuatnya khas adalah keberadaan dua menara dari masa yang berbeda: menara lama dari abad ke-18 setinggi sekitar 20 meter dengan pengaruh arsitektur Tiongkok, dan menara baru bergaya Ottoman setinggi sekitar 45 meter dengan 12 sisi. Kombinasi dua menara dengan gaya berbeda ini tidak umum pada arsitektur masjid di Indonesia.",
    sejarah:
      "Pembangunan dimulai tahun 1738 Masehi pada masa pemerintahan Sultan Mahmud Badaruddin I Jayo Wikramo, di samping Kraton Tengkuruk atau Kuto Kecik, dan rampung sekitar tahun 1748. Masjid lama sebelumnya berdiri di kompleks Kuto Gawang dan hancur ketika diserang VOC pada 1659. Menara lama dibangun pada masa Sultan Ahmad Najamudin yang memerintah sekitar 1758 sampai 1774. Pada 1848 pemerintah kolonial memperluas bangunan dengan menambahkan serambi bergaya neoklasik berkolom Doric, lalu perluasan lagi pada 1879 dan penambahan lahan pada 1897. Sekitar periode inilah nama Masjid Agung mulai digunakan. Menara lama direstorasi pada 1916 dan kolom bangunan ditinggikan pada 1930.",
    dayaTarik: [
      "Arsitektur akulturasi Melayu, Tiongkok, dan Eropa dengan atap limas bertingkat.",
      "Dua menara dari dua masa berbeda, menara lama abad ke-18 dan menara Ottoman setinggi sekitar 45 meter.",
      "Mimbar dan mihrab asli serta kaligrafi pada dinding.",
      "Jam matahari penunjuk waktu salat.",
      "Al-Quran raksasa di gedung sisi kanan masjid, berukuran sekitar 177 sentimeter kali 140 sentimeter menurut catatan yang beredar.",
      "Halaman depan yang berubah menjadi pasar selama bulan Ramadan."
    ],
    aktivitas: [
      "Salat berjamaah dan kegiatan ibadah harian.",
      "Mengamati arsitektur dua menara dan bangunan lama.",
      "Mengunjungi kompleks pada siang hari di luar waktu salat untuk melihat bangunan.",
      "Menikmati suasana pasar Ramadan jika berkunjung pada bulan Ramadan."
    ],
    alamat: "Kawasan 19 Ilir, Kecamatan Bukit Kecil, Kota Palembang, dekat Pasar 16 Ilir.",
    koordinat: { lat: -2.98748, lng: 104.75997 },
    mapsQuery: "Masjid Agung Palembang",
    tiket: {
      verifikasi: "tinggi",
      teks: "Tidak ada tiket masuk. Masjid ini tempat ibadah aktif yang terbuka untuk umum."
    },
    jam: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Masjid buka mengikuti jadwal ibadah. Beberapa sumber tidak resmi menyebut kunjungan wisata sekitar pukul 04.00 sampai 21.00. Sebaiknya hindari jam salat dan konfirmasi ke pengurus masjid."
    },
    akses:
      "Berada di pusat kota, dekat Pasar 16 Ilir dan Benteng Kuto Besak. Dapat dicapai dengan kendaraan pribadi, angkutan kota, atau berjalan kaki dari kawasan Ampera dan Plaza BKB.",
    fakta: [
      { k: "Pembangunan dimulai", v: "1738 M" },
      { k: "Rampung", v: "sekitar 1748 M" },
      { k: "Luas kompleks", v: "sekitar 15.400 meter persegi" },
      { k: "Menara lama", v: "sekitar 20 meter, pengaruh arsitektur Tiongkok" },
      { k: "Menara baru", v: "sekitar 45 meter, 12 sisi, gaya Ottoman" },
      { k: "Perluasan kolonial", v: "1848, 1879, 1897" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Masjid Agung Palembang", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Masjid_Agung_Palembang", verifikasi: "tinggi" },
      { judul: "Great Mosque of Palembang", penulis: "Wikipedia bahasa Inggris", url: "https://en.wikipedia.org/wiki/Great_Mosque_of_Palembang", verifikasi: "tinggi" },
      { judul: "Masjid Agung Palembang", penulis: "Indonesia Travel, Kementerian Pariwisata dan Ekonomi Kreatif", url: "https://www.indonesia.travel/nl/nl/destination/sumatra/south-sumatra/masjid-agung-palembang", verifikasi: "tinggi" },
      { judul: "Masjid Agung Palembang: Sejarah dan Pesonanya", penulis: "detikSumbagsel", url: "https://www.detik.com/sumbagsel/wisata/d-6767076/masjid-agung-palembang-sejarah-dan-pesonanya", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Ejaan nama muncul dalam dua bentuk di sumber: Jayo Wikramo dan Jaya Wikrama. Website ini mengikuti ejaan pada kotak informasi Wikipedia bahasa Indonesia, yaitu Jayo Wikramo. Tanggal rampung 26 Mei 1748 hanya muncul di satu sumber media, sehingga website ini menulis rentang tahun.",
    artikelTerkait: ["tradisi-budaya-palembang"],
    destinasiTerkait: ["benteng-kuto-besak", "museum-smb2", "monpera", "kampung-arab-al-munawar"]
  },

  {
    id: "museum-smb2",
    nama: "Museum Sultan Mahmud Badaruddin II",
    namaLengkap: "Museum Sultan Mahmud Badaruddin II",
    kategori: ["Sejarah", "Budaya", "Edukasi"],
    wilayah: "Bukit Kecil",
    ringkas:
      "Museum kota yang menempati gedung bekas kantor residen kolonial abad ke-19. Koleksinya mengisahkan Palembang dari masa Sriwijaya sampai Kesultanan Palembang Darussalam.",
    gambar: [
      { src: "assets/images/museum-1.jpg", caption: "Gedung Museum Sultan Mahmud Badaruddin II.", kredit: "Wikimedia Commons, CC BY 2.0" },
      { src: "assets/images/museum-2.jpg", caption: "Koleksi lukisan bertema Sultan Mahmud Badaruddin II.", kredit: "Wikimedia Commons, CC BY 4.0" }
    ],
    deskripsi:
      "Museum Sultan Mahmud Badaruddin II, biasa disingkat Museum SMB II, menempati gedung bekas kantor residen kolonial Sumatera Selatan dari abad ke-19. Bangunannya bergaya Indies Empire dengan adaptasi atap limas khas Palembang, terdiri dari dua lantai. Gedung lama ini juga dikenal dengan nama Gedung Siput. Koleksinya mencakup benda dan dokumen dari masa Sriwijaya hingga Kesultanan Palembang Darussalam. Setelah dipugar, museum menambahkan tampilan digital seperti penjelasan dua bahasa dan penanda yang dapat dipindai. Bangunan ini juga menampung dinas pariwisata kota.",
    sejarah:
      "Setelah Kuto Lama dibongkar pada awal 1820-an menyusul kekalahan Sultan Mahmud Badaruddin II yang kemudian diasingkan ke Ternate, pemerintah kolonial mendirikan bangunan baru di atas reruntuhannya. Bangunan sekarang dibangun pada 1823 sampai 1825 dan mulai dipakai sebagai kantor residen kolonial pada 1825. Pada 1920-an bangunan direnovasi dengan penambahan kaca. Masa pendudukan Jepang bangunan ini dipakai sebagai markas militer, dan setelah kemerdekaan menjadi markas Kodam II/Sriwijaya. Pemerintah Kota Palembang memfungsikannya sebagai museum pada 1984, dan statusnya sebagai museum kota dikukuhkan pada 2006. Bangunan dipugar pada 2023 dengan penambahan fitur digital.",
    dayaTarik: [
      "Koleksi sejarah Palembang dari masa Sriwijaya sampai kesultanan.",
      "Gedung bergaya Indies Empire dengan atap limas, salah satu bangunan kolonial bersejarah di kota.",
      "Tampilan digital hasil pemugaran 2023, termasuk penanda interaktif dan penjelasan bahasa Inggris.",
      "Penjualan suvenir seperti tanjak, gantungan kunci, mug, dan kaus."
    ],
    aktivitas: [
      "Menyusuri ruang pameran dua lantai.",
      "Mengikuti penjelasan koleksi dari papan informasi dan penanda digital.",
      "Membeli suvenir di area museum.",
      "Melanjutkan rute jalan kaki ke Benteng Kuto Besak dan Monpera."
    ],
    alamat: "Jalan Sultan Mahmud Badarudin, 19 Ilir, Kecamatan Bukit Kecil, Kota Palembang.",
    koordinat: { lat: -2.990313, lng: 104.761067 },
    mapsQuery: "Museum Sultan Mahmud Badaruddin II Palembang",
    tiket: {
      verifikasi: "sedang",
      teks:
        "Menurut laman Indonesia Travel milik Kementerian Pariwisata dan Ekonomi Kreatif: Rp1.000 untuk pelajar, Rp2.000 untuk mahasiswa, Rp5.000 untuk umum, dan Rp20.000 untuk wisatawan mancanegara. Harga dapat berubah, konfirmasi ke pengelola."
    },
    jam: {
      verifikasi: "sedang",
      teks: "Selasa sampai Minggu. Hari kerja sekitar 08.00 sampai 15.30, akhir pekan dan hari libur nasional sekitar 09.00 sampai 14.30. Tutup pada hari Senin."
    },
    akses:
      "Berada di pusat kota, berdekatan dengan Benteng Kuto Besak, Monpera, dan Masjid Agung. Dapat dicapai dengan kendaraan pribadi, angkutan kota, atau berjalan kaki dari kawasan Plaza BKB.",
    fakta: [
      { k: "Nama gedung lama", v: "Residentiehuis atau Gedung Siput" },
      { k: "Bangunan sekarang", v: "dibangun 1823 sampai 1825" },
      { k: "Dipakai sebagai museum", v: "1984, dikukuhkan 2006" },
      { k: "Pemugaran terakhir", v: "2023" },
      { k: "Gaya", v: "Indies Empire dengan atap limas Palembang" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Museum Sultan Mahmud Badaruddin II, Destinasi Sejarah Palembang", penulis: "Indonesia Travel, Kementerian Pariwisata dan Ekonomi Kreatif", url: "https://www.indonesia.travel/id/id/travel-ideas/heritage/museum-sultan-mahmud-badaruddin-dua", verifikasi: "tinggi" },
      { judul: "Sultan Mahmud Badaruddin II Museum", penulis: "Wikipedia bahasa Inggris", url: "https://en.wikipedia.org/wiki/Sultan_Mahmud_Badaruddin_II_Museum", verifikasi: "tinggi" },
      { judul: "Museum Sultan Mahmud Badaruddin II Palembang Tampil Modern dengan Sentuhan Digital", penulis: "Kompas TV", url: "https://www.youtube.com/watch?v=M8rjyC46O_Q", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Dimensi bangunan hanya disebutkan pada satu artikel sehingga website ini tidak menampilkan angka pastinya. Harga tiket bersumber dari laman Kementerian Pariwisata, tetapi tetap dapat berubah tanpa pemberitahuan.",
    artikelTerkait: ["sejarah-museum-smb2", "kerajaan-sriwijaya"],
    destinasiTerkait: ["benteng-kuto-besak", "monpera", "masjid-agung", "jembatan-ampera"]
  },

  {
    id: "monpera",
    nama: "Monumen Perjuangan Rakyat",
    namaLengkap: "Museum dan Monumen Perjuangan Rakyat (Monpera)",
    kategori: ["Sejarah", "Edukasi"],
    wilayah: "Bukit Kecil",
    ringkas:
      "Monumen dan museum berbentuk segi enam untuk mengenang Perang Lima Hari Lima Malam, pertempuran rakyat Palembang pada 1 sampai 5 Januari 1947.",
    gambar: [
      { src: "assets/images/monpera-1.jpg", caption: "Bangunan Monumen Perjuangan Rakyat Palembang.", kredit: "Wikimedia Commons, CC BY 4.0" }
    ],
    deskripsi:
      "Monpera adalah monumen dan museum di pusat Kota Palembang yang didedikasikan untuk mengenang Perang Lima Hari Lima Malam, yaitu pertempuran rakyat Palembang menghadapi Agung Militer Belanda II pada 1 sampai 5 Januari 1947. Bangunannya berbentuk segi enam dan berdiri di atas lahan sekitar 23.565 meter persegi. Di dalam monumen terdapat museum dengan koleksi yang mencatat perjuangan rakyat Sumatera Selatan. Puncak monumen memberi pemandangan kota dan Jembatan Ampera.",
    sejarah:
      "Gagasan pembangunan muncul dari sesepuh pejuang kemerdekaan Republik Indonesia di Sumatera Selatan yang tergabung dalam Legiun Veteran Republik Indonesia. Usulan itu disampaikan dalam rapat pada 2 Agustus 1970. Peletakan batu pertama dilakukan pada 17 Agustus 1975. Pembangunan museum berjalan bertahap pada 1980 sampai 1988 dengan anggaran Pemerintah Daerah Tingkat I Sumatera Selatan, dan diresmikan pada 23 Februari 1988. Monumen direnovasi pada Januari 2022, dan setelah renovasi museum di dalamnya lebih dikenal masyarakat.",
    dayaTarik: [
      "Museum dengan koleksi sekitar 368 item, termasuk 178 foto dokumentasi perjuangan.",
      "Pakaian dinas pahlawan, senjata seperti pistol, meriam kecepek, pedang sabil, dan ranjau darat.",
      "Mata uang dari masa VOC, Hindia Belanda, dan Jepang.",
      "Patung tokoh pahlawan Sumatera Selatan.",
      "Puncak monumen dengan panorama kota dan Jembatan Ampera."
    ],
    aktivitas: [
      "Melihat koleksi museum dan diorama perjuangan.",
      "Naik ke puncak monumen untuk melihat panorama kota.",
      "Mengunjungi Monpera dalam satu rute dengan Benteng Kuto Besak dan Museum SMB II.",
      "Dokumentasi untuk keperluan belajar sejarah bagi pelajar dan mahasiswa."
    ],
    alamat: "Jalan Merdeka Nomor 1, Kelurahan 19 Ilir, Kota Palembang. Sumber berbeda menyebut Kecamatan Bukit Kecil dan Ilir Barat I, konfirmasi sebelum berkunjung.",
    koordinat: { lat: -2.9898306, lng: 104.7607194 },
    mapsQuery: "Monumen Perjuangan Rakyat Monpera Palembang",
    tiket: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Sumber berbeda menyebut angka berbeda, mulai Rp1.000 sampai Rp5.000. RRI menyebut Rp5.000 per orang. Website ini tidak menetapkan angka pasti, konfirmasi ke pengelola."
    },
    jam: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Sumber berbeda. RRI menyebut 08.00 sampai 18.00. Sumber lain menyebut Senin sampai Jumat 08.00 sampai 15.45 dan akhir pekan 08.00 sampai 11.30. Konfirmasi ke pengelola sebelum berkunjung."
    },
    akses:
      "Berada di kawasan pusat kota, dapat dicapai dengan kendaraan pribadi atau angkutan kota. Berjarak jalan kaki dari Benteng Kuto Besak dan Museum SMB II.",
    fakta: [
      { k: "Peristiwa yang dikenang", v: "Perang Lima Hari Lima Malam, 1 sampai 5 Januari 1947" },
      { k: "Batu pertama", v: "17 Agustus 1975" },
      { k: "Pembangunan museum", v: "1980 sampai 1988" },
      { k: "Diresmikan", v: "23 Februari 1988" },
      { k: "Luas lahan", v: "sekitar 23.565 meter persegi" },
      { k: "Koleksi", v: "sekitar 368 item dan 568 buku" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Monumen Perjuangan Rakyat (Monpera) Palembang, Simbol Sejarah dan Keindahan Kota Palembang", penulis: "RRI", url: "https://rri.co.id/palembang/berita-lain/777382/monumen-perjuangan-rakyat-monpera-palembang-simbol-sejarah-dan-keindahan-kota-palembang", verifikasi: "sedang" },
      { judul: "Museum Monumen Perjuangan Rakyat", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Museum_Monumen_Perjuangan_Rakyat", verifikasi: "sedang" },
      { judul: "Wajah Baru Museum Monpera", penulis: "Gatra", url: "https://www.gatra.com/news-543872-sumbangsel-wajah-baru-museum-monpera-objek-wisata-sejarah-perang-lima-hari-lima-malam.html", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Kotak informasi Wikipedia bahasa Indonesia menulis tahun peresmian 1980, bertentangan dengan isi artikelnya sendiri dan sumber media yang menyebut 1988. Website ini memakai 1988. Klaim tinggi monumen 43 meter hanya muncul di satu blog dan tidak digunakan di sini.",
    artikelTerkait: ["tradisi-budaya-palembang"],
    destinasiTerkait: ["benteng-kuto-besak", "museum-smb2", "masjid-agung", "jembatan-ampera"]
  },

  {
    id: "kampung-kapitan",
    nama: "Kampung Kapitan",
    namaLengkap: "Kampung Kapitan",
    kategori: ["Budaya", "Sejarah"],
    wilayah: "Seberang Ulu I",
    ringkas:
      "Permukiman Tionghoa tertua di Palembang, di tepi Sungai Musi sisi barat Jembatan Ampera. Tersisa dua rumah tua bergaya Tionghoa yang masih dihuni keturunan kapiten.",
    gambar: [
      { src: "assets/images/kapitan-1.jpg", caption: "Rumah tua di Kampung Kapitan.", kredit: "Wikimedia Commons, CC BY 2.0" }
    ],
    deskripsi:
      "Kampung Kapitan adalah permukiman Tionghoa tertua di Palembang, terletak di tepi Sungai Musi pada sisi barat Jembatan Ampera. Kawasan ini terdaftar dalam Sistem Registrasi Nasional Cagar Budaya. Yang tersisa sekarang adalah dua rumah tua bergaya Tionghoa, yaitu rumah kayu dan rumah batu, yang dihubungkan selasar di bagian tengah. Rumahnya berbentuk panggung dengan perpaduan arsitektur tradisional Palembang, kolonial, dan Tiongkok. Sebagian bangunan masih dihuni keturunan kapiten.",
    sejarah:
      "Kampung ini terbentuk sejak masa kolonial Belanda. Pemimpin komunitas Tionghoa Palembang pertama yang tercatat adalah Tjoa Kie Tjuan dengan pangkat mayor pada periode 1830 sampai 1855, yang kemudian digantikan putranya Tjoa Han Him dengan pangkat kapiten. Dari jabatan kapiten inilah nama Kampung Kapitan berasal. Sumber berbeda memberi rentang waktu berbeda mengenai tahun awal permukiman, sehingga website ini menulisnya sebagai permukiman dari masa kolonial Belanda tanpa menetapkan tahun pasti.",
    dayaTarik: [
      "Dua rumah kapiten yang masih dihuni keturunan, rumah kayu dan rumah batu.",
      "Altar pemujaan leluhur yang menyimpan abu keturunan kapiten.",
      "Foto dan lukisan kapiten, termasuk lukisan dengan efek optik mata yang seolah mengikuti pengunjung.",
      "Kompas di pintu sebagai perlambang nenek moyang pelaut.",
      "Arsitektur akulturasi tiga budaya: Palembang, kolonial, dan Tiongkok."
    ],
    aktivitas: [
      "Melihat rumah kapiten dari luar dan bertanya kepada penghuni bila diizinkan masuk.",
      "Mendengarkan cerita keluarga kapiten dari penghuni.",
      "Berfoto di depan rumah tua dengan latar Sungai Musi.",
      "Mendatangi kawasan lewat jalur air dari arah Benteng Kuto Besak."
    ],
    alamat: "Jalan K.H. Azhari, Kelurahan 7 Ulu, Kecamatan Seberang Ulu I, Kota Palembang.",
    koordinat: { lat: -2.9961095, lng: 104.7638501 },
    mapsQuery: "Kampung Kapitan Palembang",
    tiket: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Belum ada sumber resmi yang menyebut tiket masuk. Klaim gratis yang beredar tidak memiliki dasar resmi. Karena bangunan masih dihuni, mintalah izin kepada penghuni sebelum masuk."
    },
    jam: {
      verifikasi: "perlu-konfirmasi",
      teks: "Belum ada jam kunjungan resmi. Kunjungan sebaiknya dilakukan pada siang hari dan dikonfirmasi kepada penghuni."
    },
    akses:
      "Dapat dicapai melalui jalur darat dari kawasan Seberang Ulu, atau melalui jalur air dari sekitar Benteng Kuto Besak. Berada di sisi barat Jembatan Ampera.",
    fakta: [
      { k: "Status", v: "terdaftar dalam Sistem Registrasi Nasional Cagar Budaya" },
      { k: "Bangunan tersisa", v: "dua rumah tua, yaitu rumah kayu dan rumah batu" },
      { k: "Pemimpin tercatat", v: "Tjoa Kie Tjuan, mayor 1830 sampai 1855" },
      { k: "Asal nama", v: "jabatan kapiten Tjoa Han Him" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Kampung Kapitan", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Kampung_Kapitan", verifikasi: "sedang" },
      { judul: "Chinese Civilization Trace: Palembang Heritage", penulis: "Indonesia Travel, Kementerian Pariwisata dan Ekonomi Kreatif", url: "https://www.indonesia.travel/gb/en/travel-ideas/adventure/kampung-kapitan", verifikasi: "sedang" },
      { judul: "Kampung Kapitan", penulis: "Indonesia Virtual Tour", url: "https://indonesiavirtualtour.com/wisata-virtual/kampung-kapitan", verifikasi: "rendah" }
    ],
    catatanVerifikasi:
      "Tahun 1644 hanya disebut Wikipedia bahasa Indonesia, sementara artikel yang sama juga menulis abad ke-16 yang tidak konsisten dengan angka tersebut. Detail siapa kapiten pertama juga berbeda antar sumber. Website ini menulis rentang masa kolonial Belanda daripada menetapkan satu tahun.",
    artikelTerkait: ["tradisi-budaya-palembang"],
    destinasiTerkait: ["benteng-kuto-besak", "sungai-musi", "jembatan-ampera", "kampung-arab-al-munawar"]
  },

  {
    id: "sungai-musi",
    nama: "Sungai Musi",
    namaLengkap: "Sungai Musi dan Wisata Sungai",
    kategori: ["Alam", "Budaya"],
    wilayah: "Membelah Kota Palembang",
    ringkas:
      "Sungai yang membelah Palembang menjadi Seberang Ilir dan Seberang Ulu. Sejak masa Sriwijaya sampai sekarang menjadi jalur transportasi utama dan tulang punggung wisata kota.",
    gambar: [
      { src: "assets/images/musi-1.jpg", caption: "Sungai Musi di kawasan Palembang.", kredit: "Wikimedia Commons, CC BY-SA 4.0" },
      { src: "assets/images/musi-2.jpg", caption: "Perahu tradisional di Sungai Musi.", kredit: "Wikimedia Commons, CC BY-SA 4.0" }
    ],
    deskripsi:
      "Sungai Musi adalah sungai lintas provinsi yang mengaliri Bengkulu dan Sumatera Selatan. Panjangnya tercatat sekitar 720 kilometer menurut Wikipedia bahasa Indonesia, meskipun banyak media menulis 750 kilometer. Hulu sungai berada di Bukit Kelam sekitar 15 kilometer dari Curup, Kabupaten Rejang Lebong, Bengkulu, dan bermuara di Selat Bangka. Di Kota Palembang sungai ini membelah kota menjadi dua kawasan, yaitu Seberang Ilir dan Seberang Ulu, yang dihubungkan beberapa jembatan termasuk Jembatan Ampera. Sungai ini memiliki nilai ekonomi dan budaya tinggi karena menjadi jalur perdagangan sejak masa Sriwijaya dan masih menjadi jalur transportasi masyarakat sampai sekarang.",
    sejarah:
      "Posisi tepi Sungai Musi membuat Sriwijaya mampu menguasai jalur perdagangan dan transportasi air. Sungai menjadi penghubung antara pedalaman Sumatera dan dunia luar. Kapal dari India, Tiongkok, dan Asia Tenggara membawa kain, rempah, logam, serta keramik. Pendeta Tiongkok I Tsing mencatat pada 671 bahwa ia tinggal enam bulan di Sriwijaya untuk mempelajari tata bahasa Sansekerta, dan menggambarkan wilayah itu sebagai pusat pembelajaran agama Buddha yang penting. Pengendapan lumpur di Sungai Musi dan anak-anak sungainya disebut sebagai salah satu faktor kemunduran Sriwijaya, karena kapal dagang yang datang semakin berkurang dan kota semakin menjauh dari laut.",
    dayaTarik: [
      "Panorama sungai dengan Jembatan Ampera sebagai latar.",
      "Kapal wisata Musi Cruise yang beroperasi beberapa kali sehari dan memiliki kapasitas sekitar 100 orang.",
      "Perahu ketek wisata menyusuri Sungai Musi dan anak sungainya.",
      "Rumah limas dan permukiman tua di tepi sungai, seperti Kampung Kapitan dan Kampung Arab Al-Munawar.",
      "Dermaga tradisional dengan kegiatan bongkar muat barang."
    ],
    aktivitas: [
      "Naik kapal wisata untuk menyusuri Sungai Musi.",
      "Menyeberang ke Pulau Kemaro dengan perahu ketek.",
      "Menikmati matahari terbenam dari tepi sungai atau Plaza Benteng Kuto Besak.",
      "Mengamati kehidupan permukiman tepi sungai dari atas perahu."
    ],
    alamat: "Mengalir melalui Kota Palembang. Titik keberangkatan kapal wisata dan perahu ketek tersebar di beberapa dermaga, konfirmasi ke Dinas Pariwisata Kota Palembang untuk jadwal dan titik terbaru.",
    koordinat: { lat: -2.9917, lng: 104.7635 },
    mapsQuery: "Sungai Musi Palembang",
    tiket: {
      verifikasi: "sedang",
      teks:
        "Kapal wisata Musi Cruise dikutip dengan tiket promo sekitar Rp5.000 per orang menurut pemberitaan Antara dan kanal resmi pemerintah kota. Perahu ketek sekitar Rp25.000 per orang menurut satu sumber media. Harga dan jadwal berubah beberapa kali, konfirmasi melalui kanal Dinas Pariwisata."
    },
    jam: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Kapal wisata dilaporkan beroperasi sekitar tiga trip per hari pada pagi, sore, dan malam. Jam pastinya berbeda antar sumber dan pernah berubah setelah kapal sempat tidak beroperasi. Sungai sendiri tentu saja dapat dilihat setiap saat dari tepinya."
    },
    akses:
      "Beberapa dermaga disebut oleh sumber berbeda, antara lain kawasan Dermaga Point Benteng Kuto Besak, Dermaga Pasar 16 Ilir untuk perahu ketek, dan dermaga lain di Tangga Buntung. Karena titik keberangkatan dapat berubah, konfirmasi dulu sebelum datang.",
    fakta: [
      { k: "Panjang", v: "sekitar 720 kilometer menurut Wikipedia (media lain menulis 750 kilometer)" },
      { k: "Hulu", v: "Bukit Kelam, dekat Curup, Kabupaten Rejang Lebong, Bengkulu" },
      { k: "Muara", v: "Selat Bangka" },
      { k: "Luas daerah aliran sungai", v: "sekitar 77.964 kilometer persegi" },
      { k: "Kapal wisata", v: "Musi Cruise, kapasitas sekitar 100 orang" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Sungai Musi", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Sungai_Musi", verifikasi: "tinggi" },
      { judul: "Kapal Wisata Musi Cruise Jadi Favorit Anak", penulis: "Antara", url: "https://megapolitan.antaranews.com/berita/343838/kapal-wisata-musi-cruise-jadi-favorit-anak", verifikasi: "sedang" },
      { judul: "Kapal Wisata Musi Cruise Sungai Musi Beroperasi Kembali", penulis: "Monpera.id", url: "https://monpera.id/kapal-wisata-musi-cruise-sungai-musi-beroperasi-kembali", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Klaim bahwa Sungai Musi adalah sungai terpanjang atau terpanjang kedua di Sumatera tidak konsisten antar sumber. Website ini menghindari peringkat tersebut dan hanya menyebut angka panjang menurut sumber. Jadwal dan titik dermaga berubah-ubah sehingga tidak ditulis sebagai data pasti.",
    artikelTerkait: ["sejarah-sungai-musi"],
    destinasiTerkait: ["jembatan-ampera", "pulau-kemaro", "benteng-kuto-besak", "kampung-arab-al-munawar"]
  },

  {
    id: "taman-purbakala-sriwijaya",
    nama: "Taman Purbakala Kerajaan Sriwijaya",
    namaLengkap: "Taman Purbakala Kerajaan Sriwijaya (Situs Karanganyar)",
    kategori: ["Sejarah", "Edukasi", "Alam"],
    wilayah: "Gandus",
    ringkas:
      "Situs arkeologi bekas kawasan permukiman dan taman masa Sriwijaya di tepi utara Sungai Musi. Di dalamnya ada museum dan replika Prasasti Kedukan Bukit.",
    gambar: [
      { src: "assets/images/tpks-1.jpg", caption: "Kawasan Taman Purbakala Kerajaan Sriwijaya.", kredit: "Wikimedia Commons, CC BY-SA 4.0" },
      { src: "assets/images/tpks-2.jpg", caption: "Pendopo berarsitektur rumah limas di dalam taman.", kredit: "Wikimedia Commons, CC BY-SA 3.0" },
      { src: "assets/images/tpks-3.jpg", caption: "Museum Sriwijaya di dalam kawasan.", kredit: "Wikimedia Commons, CC BY-SA 3.0" }
    ],
    deskripsi:
      "Taman Purbakala Kerajaan Sriwijaya adalah situs arkeologi di tepi utara Sungai Musi yang dikaitkan dengan Kerajaan Sriwijaya. Sebelumnya kawasan ini dikenal sebagai Situs Karanganyar. Di dalam kawasan ditemukan jaringan kanal, parit, dan kolam yang tersusun teratur, yang menunjukkan bahwa kawasan ini bukan bentukan alam semata. Di dalam taman berdiri Museum Sriwijaya dan pendopo berarsitektur rumah limas yang menyimpan replika Prasasti Kedukan Bukit dalam kotak kaca. Perlu dicatat bahwa di situs ini tidak ditemukan candi atau bekas istana yang menonjol seperti di Muaro Jambi.",
    sejarah:
      "Interpretasi foto udara pada 1984 menunjukkan bahwa kawasan ini berbentuk bangunan air berupa jaringan kanal, parit, kolam, dan pulau buatan. Penggalian arkeologi dilakukan pada 1985 dan berlanjut pada 1989. Pemerintah Provinsi Sumatera Selatan kemudian memugar kawasan dan merapikan kanal, lalu meresmikan tempat ini sebagai objek wisata pada 22 Desember 1994. Temuan di kawasan ini meliputi pecahan tembikar, keramik dari dinasti Tang abad ke-7 sampai ke-10, dinasti Song abad ke-10 sampai ke-12, dinasti Yuan abad ke-13 sampai ke-14, dan dinasti Qing abad ke-17 sampai ke-19, serta manik-manik, struktur bata, damar, tali ijuk, dan sisa perahu. Struktur bata ditemukan pada kedalaman sekitar 30 sentimeter di Pulau Cempaka dengan orientasi timur ke barat. Arkeolog menduga bangunan Sriwijaya banyak berbahan kayu dan bata sehingga cepat rusak karena kelembapan dan banjir rutin.",
    dayaTarik: [
      "Museum Sriwijaya dengan koleksi temuan dari kawasan situs.",
      "Pendopo berarsitektur rumah limas.",
      "Replika Prasasti Kedukan Bukit dalam kotak kaca.",
      "Jaringan kanal kuno yang masih dapat ditelusuri bentuknya.",
      "Area terbuka hijau yang luas, cocok untuk kunjungan keluarga."
    ],
    aktivitas: [
      "Melihat koleksi museum dan replika prasasti.",
      "Berjalan mengelilingi kawasan bekas jaringan kanal.",
      "Belajar sejarah Sriwijaya secara langsung di lokasi temuan.",
      "Berfoto di area pendopo dan taman."
    ],
    alamat: "Jalan Syakhyakirti, Kelurahan Karanganyar, Kecamatan Gandus, Kota Palembang. Satu sumber lain menyebut Kecamatan Ilir Barat II, sehingga alamat sebaiknya dikonfirmasi.",
    koordinat: { lat: -3.0150361, lng: 104.7344139 },
    mapsQuery: "Taman Purbakala Kerajaan Sriwijaya Palembang",
    tiket: {
      verifikasi: "sedang",
      teks:
        "Menurut pemberitaan detikSumbagsel Februari 2024, tiket sekitar Rp5.000 per orang untuk wisatawan domestik maupun mancanegara, ditambah parkir sekitar Rp5.000 untuk mobil dan Rp2.000 untuk sepeda motor. Harga dapat berubah."
    },
    jam: {
      verifikasi: "sedang",
      teks: "Menurut sumber yang sama, buka sekitar pukul 08.00 sampai 18.00 dan buka pada akhir pekan serta hari libur nasional. Konfirmasi ke pengelola untuk hari kerja."
    },
    akses:
      "Berada di kawasan Gandus, agak ke arah barat dari pusat kota. Dapat dicapai dengan kendaraan pribadi atau angkutan kota. Waktu tempuh dari pusat kota sekitar 30 sampai 45 menit tergantung lalu lintas.",
    fakta: [
      { k: "Nama lama", v: "Situs Karanganyar" },
      { k: "Interpretasi foto udara", v: "1984" },
      { k: "Penggalian", v: "1985 dan 1989" },
      { k: "Diresmikan sebagai objek wisata", v: "22 Desember 1994" },
      { k: "Salah satu temuan", v: "keramik dinasti Tang sampai Qing" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Taman Purbakala Kerajaan Sriwijaya", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Taman_Purbakala_Kerajaan_Sriwijaya", verifikasi: "sedang" },
      { judul: "Taman Purbakala Kerajaan Sriwijaya, Situs untuk Belajar Sejarah", penulis: "detikSumbagsel", url: "https://www.detik.com/sumbagsel/berita/d-7197590/taman-purbakala-kerajaan-sriwijaya-situs-untuk-belajar-sejarah", verifikasi: "sedang" },
      { judul: "Sriwijaya Kingdom Archaeological Park", penulis: "Wikipedia bahasa Inggris", url: "https://en.wikipedia.org/wiki/Sriwijaya_Kingdom_Archaeological_Park", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Alamat kecamatan berbeda antar sumber. Wikipedia dan referensi yang mengacu Balai Pelestarian menyebut Gandus, sumber lain menyebut Ilir Barat II. Website ini memakai Gandus dan mencantumkan catatan bahwa ada sumber berbeda. Angka tiket berasal dari pemberitaan 2024, bukan dari pengelola langsung.",
    artikelTerkait: ["kerajaan-sriwijaya", "sejarah-sungai-musi"],
    destinasiTerkait: ["museum-smb2", "sungai-musi", "benteng-kuto-besak", "masjid-agung"]
  },

  {
    id: "kampung-arab-al-munawar",
    nama: "Kampung Arab Al-Munawar",
    namaLengkap: "Kampung Arab Al-Munawar (Kampung Wisata Al-Munawar)",
    kategori: ["Budaya", "Religi", "Sejarah"],
    wilayah: "Seberang Ulu II",
    ringkas:
      "Kampung wisata di tepi Sungai Musi, salah satu permukiman tua keturunan Arab di Palembang, dengan rumah panggung dan bangunan cagar budaya.",
    gambar: [
      { src: "assets/images/musi-2.jpg", caption: "Kehidupan tepi Sungai Musi di kawasan Seberang Ulu.", kredit: "Wikimedia Commons, CC BY-SA 4.0" }
    ],
    deskripsi:
      "Kampung Arab Al-Munawar adalah kampung wisata di tepi Sungai Musi yang menjadi salah satu permukiman tua keturunan Arab di Palembang. Kawasan ini terletak di Kelurahan 13 Ulu. Sungai Musi di bagian ini oleh sebagian warga setempat disebut laot atau laut. Di kampung ini terdapat sekitar 17 bangunan rumah, dan delapan di antaranya berstatus cagar budaya, termasuk Rumah Tinggi, Rumah Kembar Laut, serta rumah limas dan rumah batu. Kampung ini dihuni beberapa marga keturunan Arab dan dikelola sebagai kampung wisata. Kawasan ini ditata pada 2018 dalam rangka Asian Games.",
    sejarah:
      "Kampung ini sudah ada sejak masa kolonial Belanda. Namanya berasal dari tokoh sepuh Habib Hasan Abdurrahman Al-Munawar, yang menjadi pemimpin komunitas setelah Belanda melakukan pendekatan kepada komunitas Arab di Palembang dan memberinya pangkat kapten. Beberapa sumber akademik menyebut pendirinya adalah Habib Sayid Abdurrahman bin Muhammad Al-Munawar yang lahir pada pertengahan abad ke-18. Sultan Palembang Darussalam dikisahkan menghadiahkan kawasan 13 Ulu sebagai tempat bermukim kaum Arab. Sumber akademik menyebut usia kampung ini antara 200 sampai 300 tahun.",
    dayaTarik: [
      "Arsitektur rumah Arab-Palembang, termasuk rumah panggung di tepi sungai.",
      "Bangunan cagar budaya seperti Rumah Tinggi dan Rumah Kembar Laut.",
      "Kehidupan sehari-hari komunitas keturunan Arab di Palembang.",
      "Masjid tua di lingkungan kampung.",
      "Akses jalur air dari Sungai Musi serta jalur darat."
    ],
    aktivitas: [
      "Berjalan menyusuri gang kampung dan mengamati rumah-rumah tua.",
      "Berdialog dengan warga mengenai sejarah kampung.",
      "Berfoto di tepi Sungai Musi dengan latar rumah panggung.",
      "Mengunjungi bagian kampung melalui jalur air dari arah pusat kota."
    ],
    alamat: "Jalan K.H. A. Azhari, Lorong Al-Munawar, Kelurahan 13 Ulu, Kecamatan Seberang Ulu II, Kota Palembang.",
    koordinat: { lat: -2.9874825, lng: 104.7729826 },
    mapsQuery: "Kampung Arab Al-Munawar 13 Ulu Palembang",
    tiket: {
      verifikasi: "perlu-konfirmasi",
      teks:
        "Belum ada sumber resmi yang mencantumkan tiket masuk. Ada klaim sekitar Rp5.000 yang beredar di unggahan komunitas, tetapi tidak memiliki dasar resmi. Konfirmasi ke pengelola kampung wisata."
    },
    jam: {
      verifikasi: "sedang",
      teks: "Menurut Wikipedia bahasa Indonesia, dapat dikunjungi setiap hari kecuali Jumat, sekitar pukul 08.30 sampai 17.00. Konfirmasi ke pengelola karena jam dapat berubah."
    },
    akses:
      "Dapat dicapai melalui jalur darat dari kawasan Seberang Ulu, atau melalui jalur air dari Sungai Musi. Berada di sisi timur Jembatan Ampera, beberapa kilometer mengikuti tepi sungai.",
    fakta: [
      { k: "Jumlah bangunan", v: "sekitar 17 rumah, 8 di antaranya cagar budaya" },
      { k: "Contoh bangunan", v: "Rumah Tinggi, Rumah Kembar Laut, Rumah Limas, Rumah Batu" },
      { k: "Penataan kawasan", v: "2018, bertepatan dengan Asian Games" },
      { k: "Usia kampung", v: "sekitar 200 sampai 300 tahun menurut sumber akademik" }
    ],
    ulasan: { status: "belum", pesan: "Informasi ulasan pengunjung belum tersedia." },
    sumber: [
      { judul: "Kampung Arab Al Munawar", penulis: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Kampung_Arab_Al_Munawar", verifikasi: "sedang" },
      { judul: "Gambaran Umum Kampung Arab Al Munawar", penulis: "Eprints Universitas Diponegoro", url: "https://eprints.undip.ac.id/59192/5/BAB_IV.pdf", verifikasi: "sedang" },
      { judul: "Kampung Arab Al-Munawar", penulis: "Repositori UIN Raden Fatah", url: "https://repository.radenfatah.ac.id/14875/3/BAB%203.pdf", verifikasi: "sedang" }
    ],
    catatanVerifikasi:
      "Koordinat diambil dari Jalan Al-Munawar di Seberang Ulu II, Palembang (OpenStreetMap, diakses 18 Oktober 2026) dan berada di lokasi yang sama dengan alamat tercatat. Angka tiket masuk belum terverifikasi.",
    artikelTerkait: ["tradisi-budaya-palembang"],
    destinasiTerkait: ["sungai-musi", "kampung-kapitan", "masjid-agung", "pulau-kemaro"]
  }
];