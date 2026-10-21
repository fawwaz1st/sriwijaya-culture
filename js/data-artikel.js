/* ============================================================
   data-artikel.js - artikel sejarah dan budaya Palembang
   ------------------------------------------------------------
   ATURAN PENULISAN (penting untuk kredibilitas):
   - Setiap artikel wajib mencantumkan daftar sumber.
   - Perbedaan pendapat antar sejarawan ditulis sebagai perbedaan,
     bukan dipilih salah satu tanpa dasar.
   - Legenda diberi label legenda.
   - Field `status` bernilai:
       "terverifikasi-sebagian" = inti cerita didukung sumber, detail
                                  tertentu masih diperdebatkan.
       "draf"                   = masih berisi bagian yang perlu
                                  diverifikasi lebih lanjut.
   Artikel dengan status "draf" ditandai di antarmuka.
   ============================================================ */
window.SC = window.SC || {};

SC.KATEGORI_ARTIKEL = ["Sejarah", "Budaya", "Arsitektur", "Kuliner", "Warisan"];

SC.ARTIKEL = [
  {
    id: "sejarah-jembatan-ampera",
    judul: "Sejarah Jembatan Ampera: Dari Pampasan Perang sampai Ikon Kota",
    kategori: "Sejarah",
    ringkas:
      "Jembatan Ampera dibangun dari dana pampasan perang Jepang dan pernah memiliki mekanisme pengangkat yang kini tidak lagi dipakai. Artikel ini menelusuri asal-usulnya.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/ampera-1.jpg",
    gambarCaption: "Jembatan Ampera melintasi Sungai Musi.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Hampir setiap gambar tentang Palembang memuat Jembatan Ampera. Bangunan ini bukan sekadar jembatan penghubung dua kawasan kota, tetapi juga penanda perubahan besar dalam sejarah Palembang pada pertengahan abad ke-20. Nama Ampera sendiri merupakan akronim dari Amanat Penderitaan Rakyat.",
    bagian: [
      {
        subjudul: "Menghubungkan dua sisi kota",
        paragraf: [
          "Sebelum jembatan ini ada, hubungan antara kawasan Seberang Ilir dan Seberang Ulu di Kota Palembang hanya mengandalkan angkutan air. Sungai Musi yang membelah kota menjadi dua sisi cukup lebar sehingga penyeberangan menjadi bagian penting dari kehidupan sehari-hari.",
          "Kehadiran jembatan mengubah pola pergerakan warga. Kawasan di sisi utara dan selatan sungai mulai terhubung oleh jalur darat yang dapat dilalui sepanjang hari. Dalam catatan sejarahnya, saat dibangun jembatan ini menjadi salah satu yang terpanjang di Asia Tenggara."
        ]
      },
      {
        subjudul: "Pembangunan dan pendanaannya",
        paragraf: [
          "Pembangunan dimulai pada April 1962 setelah memperoleh persetujuan Presiden Soekarno. Biaya pembangunannya berasal dari dana pampasan perang Jepang. Tenaga ahli didatangkan dari Jepang, sedangkan perancangan teknisnya dikaitkan dengan Ir. Sutami.",
          "Jembatan mulai digunakan pada 1965. Dalam periode singkat setelahnya, jembatan ini sempat dinamai Jembatan Bung Karno. Nama itu kemudian diganti menjadi Ampera setelah perubahan situasi politik nasional pada 1965 sampai 1966."
        ]
      },
      {
        subjudul: "Bagian tengah yang pernah bisa diangkat",
        paragraf: [
          "Salah satu ciri yang paling sering dibicarakan adalah mekanisme pengangkat pada bagian tengah jembatan. Rancangannya memungkinkan bentang tengah terangkat secara vertikal agar kapal besar dapat melintas di bawahnya.",
          "Mekanisme itu tidak lagi dioperasikan sejak awal dekade 1970-an. Alasannya berkaitan dengan berkurangnya kebutuhan pengangkatan serta beratnya beban perawatan peralatan. Kondisi ini membuat Ampera kini tampil sebagai jembatan tetap, meski menara dan struktur pengangkatnya masih berdiri dan dapat dilihat."
        ]
      },
      {
        subjudul: "Bentang angka",
        paragraf: [
          "Panjang jembatan tercatat sekitar 1.117 meter dengan lebar sekitar 22 meter. Menaranya setinggi sekitar 63 meter, sedangkan tinggi jembatan dari permukaan air sekitar 11,5 meter. Bentang tengahnya disebut sekitar 71 meter, meskipun sumber yang berbeda menuliskan angka 71,5 meter dan 71,9 meter. Karena itu, artikel ini menggunakan pembulatan sekitar 71 meter."
        ]
      },
      {
        subjudul: "Yang masih diperdebatkan",
        paragraf: [
          "Tanggal peresmian jembatan paling banyak dikutip adalah 10 November 1965. Namun, sebuah jurnal akademik menyebut Presiden Soekarno tidak hadir langsung pada peresmian dan diwakili pejabat lain. Sebagian kanal juga menyebut tanggal yang berbeda, yaitu 30 September 1965.",
          "Karena sumber yang tersedia belum seragam, artikel ini tidak menetapkan tanggal peresmian sebagai fakta pasti. Yang dapat dikatakan dengan aman adalah bahwa jembatan mulai digunakan pada 1965."
        ]
      },
      {
        subjudul: "Kondisi sekarang",
        paragraf: [
          "Ampera tetap menjadi jalur lalu lintas utama dan sekaligus penanda kota. Kawasan di kedua ujungnya berkembang menjadi ruang publik, terutama Plaza Benteng Kuto Besak di sisi utara. Kapal wisata yang beroperasi di Sungai Musi menjadikan kolong jembatan sebagai salah satu titik lintasan tetap, sehingga jembatan ini dilihat dari dua arah sekaligus, dari atas dan dari air."
        ]
      }
    ],
    kesimpulan:
      "Jembatan Ampera menunjukkan bagaimana keputusan politik dan kondisi pascaperang membentuk wajah sebuah kota. Nilainya bukan hanya pada panjang dan tinggi strukturnya, tetapi pada perannya yang mempertemukan dua sisi Palembang yang sebelumnya dipisahkan sungai.",
    sumber: [
      { judul: "Jembatan Ampera", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Jembatan_Ampera", catatan: "Data teknis dan kronologi pembangunan." },
      { judul: "Jembatan Ampera, Lambang Eksotisme Kota Palembang", penulis: "BPPK Kementerian Keuangan RI", tahun: null, url: "https://bppk.kemenkeu.go.id/balai-diklat-keuangan-palembang/artikel/jembatan-ampera-lambang-eksotisme-kota-palembang-758825", catatan: "Latar pembiayaan dan konteks pembangunan." },
      { judul: "Sejarah Jembatan Ampera sebagai Ikon Kota Palembang", penulis: "Jurnal Historia, UIN Sunan Gunung Djati", tahun: null, url: "https://journal.uinsgd.ac.id/index.php/historia/article/download/18548/7909", catatan: "Catatan mengenai peresmian dan kehadiran pejabat." }
    ],
    destinasiTerkait: ["jembatan-ampera"],
    artikelTerkait: ["sejarah-sungai-musi", "sejarah-benteng-kuto-besak", "kerajaan-sriwijaya"]
  },

  {
    id: "sejarah-pulau-kemaro",
    judul: "Sejarah dan Legenda Pulau Kemaro",
    kategori: "Budaya",
    ringkas:
      "Pulau Kemaro menyimpan kelenteng sejak 1962 dan sebuah legenda cinta yang tidak boleh dibaca sebagai peristiwa sejarah. Artikel ini memisahkan keduanya dengan jelas.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/kemaro-2.jpg",
    gambarCaption: "Pagoda di kawasan Pulau Kemaro.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Pulau Kemaro adalah pulau kecil di tengah Sungai Musi yang paling sering dikaitkan dengan cerita cinta. Artikel ini memisahkan apa yang tercatat sebagai bangunan dan kawasan, dari apa yang hidup sebagai cerita rakyat. Pembaca perlu mengetahui perbedaan itu supaya tidak menempatkan legenda sebagai sumber sejarah.",
    bagian: [
      {
        subjudul: "Kawasan dan bangunannya",
        paragraf: [
          "Pulau Kemaro berada di tengah Sungai Musi dan masuk wilayah Kelurahan 1 Ilir, Kecamatan Ilir Timur II, Kota Palembang. Penduduk mengenalnya juga sebagai Pulau Cinta atau Pulau Jodoh.",
          "Di atas pulau berdiri Pagoda sembilan lantai dan Kelenteng Hok Tjing Bio yang lebih dikenal sebagai Klenteng Kwan Im. Kelenteng ini dibangun sejak 1962 menurut catatan Wikipedia bahasa Indonesia. Pulau menjadi salah satu pusat kegiatan umat Tridharma di Palembang dan ramai pada perayaan Cap Go Meh."
        ]
      },
      {
        subjudul: "Legenda Tan Bun An dan Siti Fatimah",
        label: "legenda",
        paragraf: [
          "Dikisahkan seorang pedagang Tionghoa bernama Tan Bun An datang ke Palembang dan jatuh cinta kepada Siti Fatimah, putri seorang bangsawan setempat. Untuk maskawin, ia meminta tujuh guci berisi emas dari negerinya. Ketika guci-guci itu tiba, Tan Bun An menyangka isinya sayuran busuk karena bagian atas guci memang berisi sayuran, lalu memerintahkan guci itu dibuang ke Sungai Musi.",
          "Setelah menyadari kesalahannya, ia menyesal. Dalam sebagian versi cerita, ia ikut terjun ke sungai. Dua makam yang berdampingan di depan kelenteng dikaitkan dengan kedua tokoh tersebut.",
          "Penting untuk ditegaskan: kisah ini adalah cerita rakyat yang dituliskan pada batu di samping kelenteng. Tidak ada bukti arkeologis atau prasasti yang menunjukkan bahwa Tan Bun An dan Siti Fatimah adalah tokoh historis. Artinya, legenda ini dapat dibaca sebagai cara masyarakat mengenang hubungan antarbudaya, bukan sebagai catatan peristiwa yang pernah terjadi."
        ]
      },
      {
        subjudul: "Julukan Pulau Maut",
        paragraf: [
          "Selain disebut Pulau Cinta, Pulau Kemaro pernah dikenal dengan julukan Pulau Maut. Julukan itu muncul karena arus sungai di sekitar pulau cukup kuat dan pernah menimbulkan korban. Julukan ini jarang dipakai lagi sekarang, tetapi menarik dicatat karena menunjukkan bahwa persepsi masyarakat terhadap satu tempat dapat berubah seiring waktu."
        ]
      },
      {
        subjudul: "Perayaan Cap Go Meh",
        paragraf: [
          "Saat perayaan Cap Go Meh, kawasan Pulau Kemaro menjadi salah satu tujuan utama warga Palembang dan wisatawan. Pada perayaan itu, dibuka jembatan ponton agar pengunjung dapat menyeberang tanpa perahu. Puncak perayaan biasanya berlangsung pada malam ke-15 setelah Tahun Baru Imlek."
        ]
      },
      {
        subjudul: "Yang perlu dikonfirmasi",
        paragraf: [
          "Angka luas pulau dan ketinggiannya hanya muncul di Wikipedia bahasa Indonesia dan belum dikonfirmasi sumber pemerintah. Biaya transportasi menyeberang berbeda-beda antar sumber dan tidak berasal dari pengelola resmi. Karena itu, artikel ini tidak memuat angka tarif dan menyarankan konfirmasi di dermaga."
        ]
      }
    ],
    kesimpulan:
      "Pulau Kemaro menunjukkan dua lapisan yang hidup bersama: bangunan dan kawasan yang dapat diukur, serta cerita yang diwariskan dari mulut ke mulut. Membaca keduanya secara terpisah membuat kita menghargai legenda tanpa mengorbankan ketepatan sejarah.",
    sumber: [
      { judul: "Pulau Kemaro", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Pulau_Kemaro", catatan: "Lokasi administratif, tahun pembangunan kelenteng, luas pulau." },
      { judul: "Pulau Kemaro, Pulau Cinta yang Pernah Dianggap Pulau Maut", penulis: "detikSumbagsel", tahun: null, url: "https://www.detik.com/sumbagsel/budaya/d-7539011/pulau-kemaro-pulau-cinta-yang-pernah-dianggap-pulau-maut", catatan: "Konteks julukan dan gambaran kawasan." },
      { judul: "Pulau Kemaro, Legenda Cinta di Bulan Purnama Cap Go Meh", penulis: "National Geographic Indonesia", tahun: null, url: "https://nationalgeographic.grid.id/amp/13287708/pulau-kemaro-legenda-cinta-di-bulan-purnama-cap-go-meh", catatan: "Perayaan Cap Go Meh dan tradisi." }
    ],
    destinasiTerkait: ["pulau-kemaro"],
    artikelTerkait: ["sejarah-sungai-musi", "tradisi-budaya-palembang", "sejarah-jembatan-ampera"]
  },

  {
    id: "sejarah-benteng-kuto-besak",
    judul: "Benteng Kuto Besak: Keraton Keempat Kesultanan Palembang",
    kategori: "Arsitektur",
    ringkas:
      "Dibangun 1780 sampai 1797, Kuto Besak adalah keraton keempat Kesultanan Palembang Darussalam. Banyak artikel keliru menyebut pembangunnya, artikel ini meluruskan kronologinya.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/bkb-1.jpg",
    gambarCaption: "Tembok bata merah Benteng Kuto Besak di tepi Sungai Musi.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Benteng Kuto Besak berdiri tepat di tepi Sungai Musi, di kawasan yang sekarang menjadi pusat Kota Palembang. Bangunan ini adalah keraton keempat Kesultanan Palembang Darussalam, dan menjadi saksi masa akhir kesultanan sebelum Belanda mengakhirinya.",
    bagian: [
      {
        subjudul: "Keraton keempat",
        paragraf: [
          "Dalam bahasa Palembang, Kuto Besak berarti keraton besar. Bangunan ini bukan keraton pertama. Sebelumnya terdapat Kuto Gawang, Beringin Janggut, dan Kuto Lama. Perpindahan keraton dari satu lokasi ke lokasi lain berkaitan dengan perubahan kondisi politik, keamanan, serta posisi strategis terhadap jalur pelayaran di Sungai Musi.",
          "Gagasan membangun keraton keempat berasal dari Sultan Mahmud Badaruddin I. Namun, pelaksanaan pembangunannya baru berlangsung pada masa pemerintahan Sultan Muhammad Bahauddin, yang memerintah sekitar 1776 sampai 1803. Perbedaan masa ini penting karena banyak artikel populer secara keliru menyebut Sultan Mahmud Badaruddin I sebagai pembangunnya. Sultan Mahmud Badaruddin I memerintah sekitar 1724 sampai 1758, jauh sebelum pembangunan dimulai."
        ]
      },
      {
        subjudul: "Kronologi pembangunan",
        paragraf: [
          "Pembangunan dimulai pada 1780 dan rampung serta mulai ditempati secara resmi pada 21 Februari 1797. Artinya, pengerjaannya berlangsung kurang lebih 17 tahun. Rentang waktu sepanjang itu wajar untuk struktur besar yang dibangun tanpa alat berat modern.",
          "Menurut catatan yang beredar, perekat bata pada dinding benteng memakai campuran batu kapur dari pedalaman Sungai Ogan dan putih telur. Catatan semacam ini perlu dibaca dengan hati-hati karena tidak selalu disertai rujukan primer, tetapi cukup banyak dikutip dalam pembahasan mengenai benteng ini."
        ]
      },
      {
        subjudul: "Bentuk dan pertahanan",
        paragraf: [
          "Tembok bata merahnya setinggi sekitar 9,14 meter dan tebal sekitar 2,13 meter. Di setiap sudut terdapat bastion atau menara pertahanan, sehingga jumlahnya empat. Di kawasan benteng masih dapat dijumpai meriam besi dan kuningan peninggalan masa kesultanan.",
          "Posisi benteng yang menghadap langsung ke Sungai Musi menunjukkan bahwa pertimbangan utamanya adalah penguasaan jalur pelayaran. Pada masa itu sungai adalah jalan utama, sehingga keraton yang menguasai tepi sungai menguasai pula pergerakan barang dan orang."
        ]
      },
      {
        subjudul: "Masa berakhirnya kesultanan",
        paragraf: [
          "Kesultanan Palembang Darussalam berakhir setelah konflik dengan pemerintah kolonial Belanda pada awal abad ke-19. Sultan Mahmud Badaruddin II dikalahkan lalu diasingkan ke Ternate. Setelah itu Kuto Lama dibongkar pada awal 1820-an dan di atas reruntuhannya pemerintah kolonial mendirikan bangunan baru yang kemudian menjadi gedung kantor residen.",
          "Peristiwa inilah yang menghubungkan Benteng Kuto Besak dengan Museum Sultan Mahmud Badaruddin II. Kedua lokasi berjarak dekat dan berada dalam satu rangkaian sejarah yang sama."
        ]
      },
      {
        subjudul: "Kondisi sekarang dan hal yang perlu dikonfirmasi",
        paragraf: [
          "Kawasan di dalam benteng sekarang digunakan sebagai markas Komando Daerah Militer II/Sriwijaya. Karena itu, akses ke area dalam tidak selalu terbuka untuk umum. Pelataran di depannya, yang dikenal sebagai Plaza Benteng Kuto Besak, justru terbuka setiap saat dan menjadi ruang publik serta pusat kuliner malam.",
          "Beberapa sumber sekunder menyebut tiket masuk sekitar Rp5.000 dan jam kunjungan sampai pukul 21.00. Angka itu belum dikonfirmasi pengelola. Pemberitaan pada 2025 menyebut rencana pembukaan benteng untuk umum masih dibahas antara pemerintah kota dan pihak Kodam. Karena status aksesnya masih berkembang, konfirmasi langsung tetap diperlukan."
        ]
      }
    ],
    kesimpulan:
      "Benteng Kuto Besak memperlihatkan bagaimana sebuah bangunan dapat berpindah fungsi tanpa berpindah tempat: dari pusat kekuasaan kesultanan, menjadi markas militer, lalu menjadi bagian dari ruang publik kota. Meluruskan kronologi pembangunannya penting supaya bangunan yang sudah berusia lebih dari dua abad ini tidak dikaitkan dengan masa pemerintahan yang salah.",
    sumber: [
      { judul: "Kuto Besak", penulis: "Wikipedia bahasa Inggris", tahun: null, url: "https://en.wikipedia.org/wiki/Kuto_Besak", catatan: "Kronologi pembangunan dan ukuran tembok." },
      { judul: "Benteng Kuto Besak", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Benteng_Kuto_Besak", catatan: "Keraton keempat dan konteks kesultanan." },
      { judul: "Usai Ditata, Benteng Kuto Besak Palembang Dibuka untuk Umum", penulis: "detikSumbagsel", tahun: 2025, url: "https://www.detik.com/sumbagsel/berita/d-8298084/usai-ditata-benteng-kuto-besak-palembang-dibuka-untuk-umum", catatan: "Status rencana pembukaan untuk umum." },
      { judul: "Kodam II/Sriwijaya Jadikan Benteng Kuto Besak Destinasi Wisata Unggulan", penulis: "detikSumbagsel", tahun: null, url: "https://www.detik.com/sumbagsel/berita/d-8551400/kodam-ii-sriwijaya-jadikan-benteng-kuto-besak-destinasi-wisata-unggulan", catatan: "Status pemanfaatan kawasan saat ini." }
    ],
    destinasiTerkait: ["benteng-kuto-besak"],
    artikelTerkait: ["sejarah-museum-smb2", "kerajaan-sriwijaya", "sejarah-sungai-musi"]
  },

  {
    id: "sejarah-museum-smb2",
    judul: "Museum Sultan Mahmud Badaruddin II: Dari Kantor Residen ke Museum Kota",
    kategori: "Sejarah",
    ringkas:
      "Gedung yang sekarang menjadi museum kota pernah menjadi kantor residen kolonial, markas militer Jepang, dan markas Kodam. Jejak perpindahan fungsinya mencatat perjalanan Palembang.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/museum-1.jpg",
    gambarCaption: "Gedung Museum Sultan Mahmud Badaruddin II.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Museum Sultan Mahmud Badaruddin II berdiri di atas lokasi yang sarat lapisan sejarah. Gedungnya bukan bangunan kesultanan, melainkan bangunan kolonial yang dibangun di atas reruntuhan Kuto Lama. Perjalanan fungsinya mencatat perubahan kekuasaan di Palembang dari masa kesultanan sampai masa kemerdekaan.",
    bagian: [
      {
        subjudul: "Latar pembangunan",
        paragraf: [
          "Setelah Sultan Mahmud Badaruddin II dikalahkan dan diasingkan, Kuto Lama dibongkar pada awal 1820-an. Di atas reruntuhannya, pemerintah kolonial Belanda mendirikan bangunan baru. Bangunan sekarang dibangun pada 1823 sampai 1825 dan mulai dipakai sebagai kantor residen kolonial pada 1825.",
          "Gedung ini juga dikenal dengan nama Gedung Siput. Gaya bangunannya disebut Indies Empire dengan adaptasi atap limas yang lazim di Palembang. Kombinasi gaya Eropa dengan atap limas menunjukkan bahwa bangunan kolonial di Palembang tidak sepenuhnya meninggalkan bentuk bangunan setempat."
        ]
      },
      {
        subjudul: "Berpindah fungsi beberapa kali",
        paragraf: [
          "Pada 1920-an bangunan direnovasi dengan penambahan kaca. Masa pendudukan Jepang, gedung ini dipakai sebagai markas militer. Setelah kemerdekaan, bangunan tersebut menjadi markas Kodam II/Sriwijaya.",
          "Pemerintah Kota Palembang kemudian memfungsikannya sebagai museum pada 1984. Statusnya sebagai museum kota dikukuhkan pada 2006. Rentetan perpindahan fungsi ini membuat gedung tersebut menjadi catatan hidup tentang pergantian kekuasaan di Palembang."
        ]
      },
      {
        subjudul: "Isi koleksi",
        paragraf: [
          "Koleksi museum mencakup benda dan dokumen dari masa Sriwijaya hingga Kesultanan Palembang Darussalam. Salah satu daya tariknya adalah lukisan dan koleksi yang berkaitan dengan Sultan Mahmud Badaruddin II, tokoh yang namanya dipakai untuk museum ini.",
          "Setelah pemugaran pada 2023, museum menambahkan tampilan digital seperti penjelasan dua bahasa dan penanda yang dapat dipindai. Penambahan ini membantu pengunjung yang belum akrab dengan konteks sejarah Palembang."
        ]
      },
      {
        subjudul: "Praktis berkunjung",
        paragraf: [
          "Menurut laman Indonesia Travel milik Kementerian Pariwisata dan Ekonomi Kreatif, tiket masuk sekitar Rp1.000 untuk pelajar, Rp2.000 untuk mahasiswa, Rp5.000 untuk umum, dan Rp20.000 untuk wisatawan mancanegara. Museum tutup pada hari Senin, sedangkan jam buka hari kerja sekitar pukul 08.00 sampai 15.30 dan akhir pekan sekitar pukul 09.00 sampai 14.30. Harga dan jam dapat berubah, konfirmasi ke pengelola.",
          "Lokasinya berdekatan dengan Benteng Kuto Besak, Monpera, dan Masjid Agung, sehingga dapat dikunjungi dalam satu rute jalan kaki."
        ]
      }
    ],
    kesimpulan:
      "Museum ini menarik bukan hanya karena koleksinya, tetapi karena gedungnya sendiri adalah bukti sejarah. Sebuah bangunan yang pernah menjadi kantor administrasi kolonial, markas militer, dan markas tentara nasional, sekarang dibuka untuk umum sebagai ruang belajar.",
    sumber: [
      { judul: "Museum Sultan Mahmud Badaruddin II, Destinasi Sejarah Palembang", penulis: "Indonesia Travel, Kementerian Pariwisata dan Ekonomi Kreatif", tahun: null, url: "https://www.indonesia.travel/id/id/travel-ideas/heritage/museum-sultan-mahmud-badaruddin-dua", catatan: "Harga tiket dan jam operasional." },
      { judul: "Sultan Mahmud Badaruddin II Museum", penulis: "Wikipedia bahasa Inggris", tahun: null, url: "https://en.wikipedia.org/wiki/Sultan_Mahmud_Badaruddin_II_Museum", catatan: "Sejarah bangunan dan perpindahan fungsi." },
      { judul: "Museum Sultan Mahmud Badaruddin II Palembang Tampil Modern dengan Sentuhan Digital", penulis: "Kompas TV", tahun: null, url: "https://www.youtube.com/watch?v=M8rjyC46O_Q", catatan: "Hasil pemugaran 2023." }
    ],
    destinasiTerkait: ["museum-smb2"],
    artikelTerkait: ["sejarah-benteng-kuto-besak", "kerajaan-sriwijaya", "tradisi-budaya-palembang"]
  },

  {
    id: "kerajaan-sriwijaya",
    judul: "Kerajaan Sriwijaya: Bukti Tertulis, Situs, dan Perdebatan Pusat Kerajaan",
    kategori: "Sejarah",
    ringkas:
      "Sriwijaya disebut dalam catatan pendeta Tiongkok dan prasasti di Palembang. Namun lokasi persis pusat kerajaannya masih diperdebatkan sampai sekarang.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/kedukan-1.jpg",
    gambarCaption: "Prasasti Kedukan Bukit.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Kerajaan Sriwijaya adalah salah satu kerajaan maritim terbesar dalam sejarah Asia Tenggara. Pengaruhnya meluas melalui jalur pelayaran, dan Palembang sering disebut sebagai wilayah pusatnya. Artikel ini menyajikan bukti yang tersedia sekaligus menjelaskan bagian mana yang masih diperdebatkan.",
    bagian: [
      {
        subjudul: "Bukti dari catatan luar",
        paragraf: [
          "Pendeta Tiongkok I Tsing mencatat bahwa ia mengunjungi Sriwijaya pada 671 dan tinggal selama enam bulan untuk mempelajari tata bahasa Sansekerta. Catatan itu juga menggambarkan wilayah tersebut sebagai pusat pembelajaran agama Buddha yang penting, tempat pendeta dari India dan Tiongkok singgah.",
          "Catatan semacam ini penting karena berasal dari pengamat luar, sehingga memberi gambaran tentang bagaimana Sriwijaya dilihat oleh dunia internasional pada masa itu. Nilainya terletak pada kegiatan keagamaan dan perdagangan yang berlangsung, bukan pada penggambaran batas wilayah."
        ]
      },
      {
        subjudul: "Prasasti yang ditemukan di Palembang",
        paragraf: [
          "Prasasti Kedukan Bukit ditemukan di kaki Bukit Seguntang. Prasastinya bertarikh 605 Saka atau sekitar 682 Masehi. Prasasti ini tercatat sebagai salah satu catatan berbahasa Melayu Kuno paling tua yang pernah ditemukan, dan menyebut Kadatuan Sriwijaya di tepian Sungai Musi serta menyebut Dapunta Hyang yang berangkat siddhayatra dari Minanga Tamwan.",
          "Prasasti Talang Tuwo bertarikh 606 Saka atau sekitar 684 Masehi. Isinya memuat 14 baris aksara Pallawa dalam bahasa Melayu Kuno, dan menceritakan pembuatan taman bernama Sriksetra serta memuat doa. Prasasti ini ditemukan pada 17 November 1920 oleh Residen Palembang saat itu, L.C. Westenenk, di kaki Bukit Seguntang atau Talang Tuwo. Sekarang prasasti tersebut disimpan di Museum Nasional Indonesia, Jakarta.",
          "Prasasti Telaga Batu ditemukan pada 1935 di Telaga Batu. Ketiga prasasti ini bersama temuan lain menjadi dasar penyusunan gambaran tentang Sriwijaya."
        ]
      },
      {
        subjudul: "Situs Karanganyar dan bukti arkeologi",
        paragraf: [
          "Interpretasi foto udara pada 1984 menunjukkan bahwa kawasan Karanganyar berbentuk bangunan air, berupa jaringan kanal, parit, kolam, dan pulau buatan. Penggalian arkeologi dilakukan pada 1985 dan berlanjut pada 1989.",
          "Temuan di kawasan ini meliputi pecahan tembikar, keramik dari dinasti Tang abad ke-7 sampai ke-10, dinasti Song abad ke-10 sampai ke-12, dinasti Yuan abad ke-13 sampai ke-14, dan dinasti Qing abad ke-17 sampai ke-19, serta manik-manik, struktur bata, damar, tali ijuk, dan sisa perahu. Struktur bata ditemukan pada kedalaman sekitar 30 sentimeter di Pulau Cempaka dengan orientasi timur ke barat.",
          "Perlu dicatat bahwa di situs ini tidak ditemukan candi atau bekas istana yang menonjol. Arkeolog menduga bangunan Sriwijaya banyak berbahan kayu dan bata sehingga cepat rusak karena kelembapan dan banjir rutin. Keadaan ini berbeda dengan Muaro Jambi yang menyisakan struktur bata dalam jumlah besar."
        ]
      },
      {
        subjudul: "Pusat kerajaan dan perdebatannya",
        paragraf: [
          "Banyak tulisan menyebut pusat Sriwijaya berada di Palembang. Dasar utamanya adalah keberadaan prasasti di wilayah ini serta sebaran temuan arkeologis. Teori Palembang dikaitkan dengan sejumlah sejarawan dan mendapat dukungan dari peneliti yang mengkaji jalur pelayaran masa itu.",
          "Namun, penyebutan Palembang sebagai pusat kerajaan tidak selalu menggambarkan satu titik yang pasti. Lokasi Minanga Tamwan yang disebut dalam Prasasti Kedukan Bukit masih diperdebatkan. Kandidat lain yang juga diduga sebagai pusat atau wilayah penting Sriwijaya antara lain Muaro Jambi di sepanjang Sungai Batanghari dan Muara Takus di pertemuan Sungai Kampar Kanan dan Kampar Kiri.",
          "Karena itu, cara paling aman menuliskannya adalah: ibu kota Sriwijaya diperkirakan berada di kawasan Palembang, meskipun lokasi persisnya masih diperdebatkan sejarawan. Perbedaan pendapat ini bukan tanda kekurangan data, melainkan bagian wajar dari penelitian sejarah."
        ]
      },
      {
        subjudul: "Kemunduran",
        paragraf: [
          "Sejumlah tulisan menyebut pengendapan lumpur di Sungai Musi dan anak-anak sungainya sebagai salah satu faktor kemunduran Sriwijaya. Endapan itu membuat kapal dagang yang datang semakin berkurang, karena kota semakin menjauh dari laut dan jalur pelayaran menjadi kurang nyaman.",
          "Selain faktor lingkungan, tekanan dari kekuatan politik lain juga sering dikaitkan dengan kemunduran Sriwijaya. Namun, artikel ini tidak menetapkan satu penyebab tunggal karena bukti yang ada belum cukup untuk menyimpulkan urutan peristiwanya secara pasti."
        ]
      },
      {
        subjudul: "Warisan yang masih dapat ditelusuri",
        paragraf: [
          "Jejak Sriwijaya di Palembang dapat dikunjungi melalui situs Karanganyar yang sekarang dikelola sebagai Taman Purbakala Kerajaan Sriwijaya, dan melalui prasasti yang disimpan di museum. Nama Sriwijaya juga dipakai untuk berbagai lembaga di Sumatera Selatan, termasuk satuan militer dan perguruan tinggi, yang menunjukkan bagaimana nama itu masih hidup dalam kesadaran masyarakat sekarang."
        ]
      }
    ],
    kesimpulan:
      "Sriwijaya adalah contoh bagaimana sejarah disusun dari potongan bukti. Prasasti, catatan pendeta, dan temuan arkeologi memberi gambaran yang cukup kuat tentang keberadaan dan peran kerajaan ini, tetapi belum menutup semua pertanyaan. Menyampaikan bagian yang masih diperdebatkan secara jujur justru memperkuat kredibilitas penulisan sejarah.",
    sumber: [
      { judul: "Sriwijaya", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Sriwijaya", catatan: "Gambaran umum, prasasti, dan perdebatan lokasi pusat." },
      { judul: "Prasasti Talang Tuo", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Prasasti_Talang_Tuo", catatan: "Tarikh, isi, dan riwayat penemuan." },
      { judul: "Prasasti Talang Tuo Peninggalan Kerajaan Sriwijaya", penulis: "Neliti", tahun: null, url: "https://media.neliti.com/media/publications/178235-ID-prasasti-talang-tuo-peninggalan-kerajaan.pdf", catatan: "Kajian isi prasasti." },
      { judul: "Taman Purbakala Kerajaan Sriwijaya", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Taman_Purbakala_Kerajaan_Sriwijaya", catatan: "Hasil penggalian dan jenis temuan." }
    ],
    destinasiTerkait: ["taman-purbakala-sriwijaya", "museum-smb2"],
    artikelTerkait: ["sejarah-sungai-musi", "sejarah-songket-palembang", "sejarah-benteng-kuto-besak"]
  },

  {
    id: "sejarah-songket-palembang",
    judul: "Songket Palembang: Motif, Status Warisan, dan Klaim yang Sering Salah",
    kategori: "Warisan",
    ringkas:
      "Songket Palembang adalah Warisan Budaya Takbenda Indonesia sejak 2013. Ada juga klaim UNESCO yang sering dikutip keliru, artikel ini menjelaskan status yang sebenarnya.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/songket-1.jpg",
    gambarCaption: "Kain songket Palembang dengan benang emas.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Songket adalah kain tenun yang dibuat dengan menambahkan benang emas atau perak pada kain dasar, sehingga menghasilkan efek berkilau. Palembang adalah salah satu daerah penghasil songket yang paling dikenal di Indonesia. Sayangnya, banyak informasi mengenai status warisan songket beredar secara tidak tepat.",
    bagian: [
      {
        subjudul: "Status warisan yang perlu diluruskan",
        paragraf: [
          "Songket Palembang ditetapkan sebagai Warisan Budaya Takbenda Indonesia pada 2013 oleh Kementerian Pendidikan dan Kebudayaan, dengan nomor pencatatan 201300009. Penetapan ini tercatat pada domain keterampilan dan kemahiran kerajinan tradisional.",
          "Di tingkat internasional, tradisi songket memang masuk Representative List of the Intangible Cultural Heritage of Humanity pada 2021. Namun, nominasi tersebut diajukan oleh Malaysia, bukan Indonesia. Halaman resmi UNESCO mencatatnya sebagai Songket dari Malaysia.",
          "Pembedaan ini perlu dikemukakan dengan jelas, terutama pada tulisan yang akan dibaca pelajar. Menyebut bahwa songket diakui UNESCO sebagai warisan Indonesia akan menimbulkan kesalahan informasi. Yang tepat: songket Palembang adalah Warisan Budaya Takbenda Indonesia sejak 2013, sedangkan inskripsi UNESCO 2021 adalah nominasi Malaysia."
        ]
      },
      {
        subjudul: "Dua versi asal-usul",
        paragraf: [
          "Versi pertama mengaitkan songket dengan masa Kerajaan Sriwijaya. Bukti yang biasa dikutip adalah arca di kompleks percandian Tanah Abang di Kabupaten Muara Enim, Sumatera Selatan, yang memperlihatkan kain songket. Pada masa itu, menenun songket disebut sebagai usaha sambilan penduduk setempat. Bahan sutra sebagian diproduksi petani ulat sutra lokal dan sebagian diimpor dari Tiongkok, sedangkan benang emas diolah dari emas yang dihasilkan beberapa daerah di Sumatera.",
          "Versi kedua mengaitkan songket dengan masa Kesultanan Palembang Darussalam yang berlangsung sekitar 1659 sampai 1823. Pada masa itu, yang berhak memakai songket adalah sultan, kerabat keraton, dan pembesar sebagai pelengkap pakaian kebesaran. Sumber lain bahkan menyebut songket sudah ada sebelum Palembang menjadi kesultanan, sekitar 1455 sampai 1659.",
          "Karena sumber berbeda memberi rentang waktu berbeda, artikel ini menulisnya sebagai dua kemungkinan: songket dipercaya telah ada sejak masa Sriwijaya atau setidaknya sejak masa Kesultanan Palembang Darussalam. Kata dipercaya penting dipakai karena bukti yang tersedia bersifat interpretatif."
        ]
      },
      {
        subjudul: "Bahan dan proses",
        paragraf: [
          "Bahan kain dasar yang umum dipakai adalah sutra, katun, atau campuran keduanya. Benang logam menjadi ciri khas karena menimbulkan efek kilau. Kain songket termasuk dalam keluarga tenunan brokat, yaitu tenunan dengan hiasan benang tambahan.",
          "Proses menenun songket tradisional memakan waktu lama. Satu kain dengan motif rumit dapat dikerjakan berminggu-minggu sampai berbulan-bulan bergantung tingkat kerumitannya dan jumlah perajin yang mengerjakan. Karena itu, harga kain songket tenun tangan biasanya jauh lebih tinggi daripada kain dengan pengerjaan mesin atau setengah mesin."
        ]
      },
      {
        subjudul: "Motif dan angka yang perlu diketahui",
        paragraf: [
          "Sumatera Selatan memiliki sekitar 71 motif songket, tetapi baru sekitar 22 motif yang terdaftar di Direktorat Jenderal Kekayaan Intelektual. Yang sudah terdaftar antara lain Bungo Intan, Lepus Pulis, Nampan Perak, dan Limar Beranti. Sisanya, termasuk motif seperti Berante Berakam, belum terdaftar.",
          "Selain motif songket Palembang, terdapat motif songket dari daerah lain di Sumatera seperti Pandai Sikek di Minangkabau. Motif seperti Saik Kalamai, Buah Palo, Barantai Putiah, dan Tampuak Manggih berasal dari Pandai Sikek dan tidak boleh dicampur dengan motif Palembang.",
          "Pada 2013 sampai 2019, lima jenis kain songket dari beberapa daerah ditetapkan sebagai Warisan Budaya Takbenda Indonesia, yaitu songket Palembang dan Sambas pada 2013, Pandai Sikek pada 2014, Beratan Bali pada 2018, dan Silungkang pada 2019."
        ]
      },
      {
        subjudul: "Relevansi sekarang",
        paragraf: [
          "Songket Palembang masih diproduksi dan diperdagangkan sampai sekarang, baik untuk keperluan pakaian adat, acara resmi, maupun suvenir. Beberapa perajin menerima pesanan khusus dengan motif dan warna yang ditentukan pembeli, termasuk pesanan dari luar negeri. Penelitian akademik mencatat bahwa kolaborasi antara perajin dan pemerintah daerah membantu memperkenalkan songket ke wisatawan.",
          "Yang perlu dijaga adalah kejelasan asal kain. Kain bermotif songket yang dikerjakan mesin memiliki nilai budaya dan ekonomi berbeda dari kain tenun tangan. Keduanya sah dijual, tetapi pembeli sebaiknya mengetahuinya."
        ]
      }
    ],
    kesimpulan:
      "Songket Palembang adalah warisan yang masih hidup, bukan hanya benda yang dipajang di museum. Ketepatan informasi tentang status, asal-usul, dan motifnya penting supaya penghargaan terhadap warisan ini tidak dibangun di atas klaim yang salah.",
    sumber: [
      { judul: "Songket", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Songket", catatan: "Jumlah motif dan status inskripsi UNESCO." },
      { judul: "Songket Palembang", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Songket_Palembang", catatan: "Asal-usul dan bahan." },
      { judul: "Daftar Warisan Budaya Takbenda Indonesia", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Daftar_Warisan_Budaya_Takbenda_Indonesia", catatan: "Nomor pencatatan songket Palembang 201300009." },
      { judul: "Songket Palembang: Warisan Budaya Takbenda yang Masih Dilestarikan", penulis: "detikSumbagsel", tahun: null, url: "https://www.detik.com/sumbagsel/budaya/d-7574427/songket-palembang-warisan-budaya-tak-benda-yang-masih-dilestarikan", catatan: "Versi kesultanan dan motif." },
      { judul: "Heritage Tenun Songket dan Budaya Lokal dalam Identitas Masyarakat Palembang", penulis: "Jurnal JMPIS, Dinasti Publisher", tahun: null, url: "https://dinastirev.org/JMPIS/article/download/2927/1716/11557", catatan: "Peran perajin dan promosi pemerintah." }
    ],
    destinasiTerkait: ["kampung-arab-al-munawar", "kampung-kapitan"],
    artikelTerkait: ["tradisi-budaya-palembang", "kerajaan-sriwijaya", "sejarah-sungai-musi"]
  },

  {
    id: "tradisi-budaya-palembang",
    judul: "Tradisi dan Kebudayaan Masyarakat Palembang",
    kategori: "Budaya",
    ringkas:
      "Palembang tumbuh dari pertemuan budaya Melayu, Tionghoa, Arab, dan kolonial. Jejaknya masih terlihat pada rumah, pakaian, kuliner, dan perayaan warga.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/kapitan-1.jpg",
    gambarCaption: "Rumah tua di Kampung Kapitan, jejak permukiman Tionghoa di Palembang.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Palembang dibentuk oleh perdagangan dan pelayaran. Karena Sungai Musi menjadi jalur yang menghubungkan pedalaman Sumatera dengan laut, kota ini menerima pengaruh dari berbagai asal. Jejak pertemuan itu masih dapat ditemui dalam bentuk bangunan, pakaian, makanan, dan perayaan.",
    bagian: [
      {
        subjudul: "Melayu sebagai dasar",
        paragraf: [
          "Budaya Melayu menjadi dasar kebudayaan Palembang. Bahasa Palembang, bentuk rumah, dan tata cara pergaulan tumbuh dari akar ini. Rumah limas dengan atap bertingkat dan bagian bangunan yang ditinggikan di atas tanah adalah salah satu bentuk arsitektur yang paling dikenali, dan sampai sekarang masih dapat dilihat di beberapa kawasan tepi sungai serta pada bangunan lembaga di kota.",
          "Kesultanan Palembang Darussalam meninggalkan jejak kuat pada tata cara dan pakaian. Beberapa unsur pakaian adat yang berasal dari masa kesultanan masih dipakai dalam acara resmi di Sumatera Selatan sekarang."
        ]
      },
      {
        subjudul: "Permukiman Tionghoa dan Arab",
        paragraf: [
          "Komunitas Tionghoa di Palembang membentuk permukiman di tepi Sungai Musi yang salah satunya dikenal sebagai Kampung Kapitan. Dua rumah tua di kawasan itu masih berdiri dan sebagian masih dihuni keturunan pemiliknya. Rumah-rumah itu memperlihatkan perpaduan arsitektur Palembang, kolonial, dan Tiongkok.",
          "Komunitas keturunan Arab membentuk permukiman di kawasan 13 Ulu yang dikenal sebagai Kampung Arab Al-Munawar. Di sana terdapat sekitar 17 bangunan rumah dan delapan di antaranya berstatus cagar budaya. Kawasan ini ditata pada 2018 bertepatan dengan penyelenggaraan Asian Games. Sungai Musi di bagian ini oleh warga setempat disebut laot atau laut.",
          "Kedua kawasan ini menjadi bukti bahwa Palembang tumbuh sebagai kota pelabuhan yang menerima pendatang, bukan kota yang tertutup."
        ]
      },
      {
        subjudul: "Perayaan yang masih berlangsung",
        paragraf: [
          "Perayaan Cap Go Meh di Pulau Kemaro adalah salah satu yang paling ramai. Pada perayaan itu, jembatan ponton dibuka agar pengunjung dapat menyeberang tanpa perahu. Kegiatan keagamaan umat Tridharma di kelenteng Pulau Kemaro juga berlangsung sepanjang tahun.",
          "Di sisi lain, pasar Ramadan di halaman Masjid Agung menjadi salah satu tradisi tahunan yang menghidupkan kawasan pusat kota. Kegiatan ini menunjukkan bagaimana ruang ibadah dan ruang ekonomi warga dapat bertemu pada periode tertentu."
        ]
      },
      {
        subjudul: "Kuliner sebagai identitas",
        paragraf: [
          "Pempek adalah contoh paling jelas dari akulturasi budaya di Palembang. Catatan sejarah kuliner menempatkan pempek sebagai tradisi budaya masyarakat Palembang dan Sumatera Selatan, berkembang dari pertemuan budaya Melayu dan Tionghoa. Bahan dasar ikan dan tepung, serta kuah cuko yang asam, menjadi penanda rasanya.",
          "Selain pempek, terdapat tekwan, model, lenggang, dan mie celor. Hidangan-hidangan ini memperlihatkan bahwa dalam kuliner Palembang, ikan menjadi bahan utama yang diolah dalam berbagai bentuk dan disajikan dengan kuah berbeda."
        ]
      },
      {
        subjudul: "Pelajaran dari warisan ini",
        paragraf: [
          "Yang menarik dari Palembang adalah bagaimana bermacam pengaruh tidak saling menghapus. Kampung Tionghoa, kampung Arab, arsitektur Melayu, dan bangunan kolonial berdiri dalam jarak yang tidak terlalu jauh, sebagian bahkan dalam satu rute jalan kaki.",
          "Menjaga ketepatan informasi tentang kawasan-kawasan ini penting karena sebagian masih dihuni dan sebagian berstatus cagar budaya. Mengunjungi tempat seperti ini memerlukan kesopanan, terutama karena ada yang berupa rumah tinggal, bukan objek wisata resmi."
        ]
      }
    ],
    kesimpulan:
      "Kebudayaan Palembang adalah hasil percampuran yang berlangsung berabad-abad. Memahami latar belakang tiap kawasan membuat kunjungan wisata bukan sekadar melihat bangunan, melainkan membaca proses sosial yang membentuk kota.",
    sumber: [
      { judul: "Kampung Kapitan", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Kampung_Kapitan", catatan: "Permukiman Tionghoa dan rumah kapiten." },
      { judul: "Kampung Arab Al Munawar", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Kampung_Arab_Al_Munawar", catatan: "Jumlah bangunan dan status cagar budaya." },
      { judul: "Gambaran Umum Kampung Arab Al Munawar", penulis: "Eprints Universitas Diponegoro", tahun: null, url: "https://eprints.undip.ac.id/59192/5/BAB_IV.pdf", catatan: "Sejarah permukiman dan arsitektur." },
      { judul: "Pempek Palembang: history, food making tradition and ethnic identity", penulis: "Penelitian akademik (ResearchGate)", tahun: null, url: "https://www.researchgate.net/publication/375854501_Pempek_Palembang_history_food_making_tradition_and_ethnic_identity", catatan: "Akulturasi budaya pada kuliner pempek." },
      { judul: "Masjid Agung Palembang", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Masjid_Agung_Palembang", catatan: "Arsitektur akulturasi dan pasar Ramadan." }
    ],
    destinasiTerkait: ["kampung-kapitan", "kampung-arab-al-munawar", "masjid-agung", "pulau-kemaro"],
    artikelTerkait: ["sejarah-songket-palembang", "sejarah-pulau-kemaro", "sejarah-sungai-musi"]
  },

  {
    id: "sejarah-sungai-musi",
    judul: "Sungai Musi: Jalur Pelayaran yang Membentuk Palembang",
    kategori: "Sejarah",
    ringkas:
      "Sungai Musi menghubungkan pedalaman Sumatera dengan laut. Perannya sejak masa Sriwijaya menjelaskan mengapa Palembang tumbuh menjadi kota penting.",
    tanggal: "2026-10-18",
    diperbarui: null,
    penulis: "Tim Sriwijaya Culture",
    gambar: "assets/images/musi-1.jpg",
    gambarCaption: "Sungai Musi di kawasan Palembang.",
    status: "terverifikasi-sebagian",
    pendahuluan:
      "Membaca sejarah Palembang tanpa membaca Sungai Musi akan sulit. Sungai ini membelah kota menjadi dua sisi, menjadi jalur utama orang dan barang, dan menjadi alasan mengapa sebuah kawasan tumbuh menjadi pusat perdagangan.",
    bagian: [
      {
        subjudul: "Geografi",
        paragraf: [
          "Sungai Musi adalah sungai lintas provinsi yang mengaliri Bengkulu dan Sumatera Selatan. Panjangnya tercatat sekitar 720 kilometer menurut Wikipedia bahasa Indonesia. Banyak media menulis 750 kilometer, sehingga angka yang lebih aman digunakan adalah sekitar 720 kilometer dengan catatan bahwa sumber lain menulis angka berbeda.",
          "Hulunya berada di Bukit Kelam sekitar 15 kilometer dari Curup, Kabupaten Rejang Lebong, Bengkulu. Sungai ini memancar dari dasar tebing dengan lebar sekitar 5 meter dan kedalaman yang sangat dangkal di titik awalnya. Muaranya berada di Selat Bangka. Luas daerah aliran sungainya sekitar 77.964 kilometer persegi.",
          "Di Kota Palembang, sungai ini membelah kota menjadi Seberang Ilir dan Seberang Ulu. Beberapa jembatan menghubungkan kedua sisi, dengan Jembatan Ampera sebagai yang paling dikenal."
        ]
      },
      {
        subjudul: "Peran pada masa Sriwijaya",
        paragraf: [
          "Posisi di tepi Sungai Musi memungkinkan Sriwijaya menguasai jalur perdagangan dan transportasi air. Sungai berfungsi sebagai penghubung antara pedalaman Sumatera dan dunia luar. Kapal dari India, Tiongkok, dan Asia Tenggara membawa kain, rempah, logam, dan keramik melalui jalur ini.",
          "Catatan I Tsing pada 671 menyebut ia tinggal enam bulan di Sriwijaya untuk belajar tata bahasa Sansekerta. Catatan itu menggambarkan wilayah tersebut sebagai pusat pembelajaran agama Buddha yang penting, dengan pendeta dari India dan Tiongkok singgah di sana. Gambaran ini menguatkan kesan bahwa kawasan tepi Sungai Musi pada masa itu merupakan simpul pertemuan internasional.",
          "Salah satu faktor yang disebut dalam kemunduran Sriwijaya berkaitan dengan pengendapan lumpur di Sungai Musi dan anak-anak sungainya. Endapan itu membuat kapal dagang yang datang semakin berkurang karena kota semakin menjauh dari laut dan jalur pelayaran menjadi kurang menguntungkan. Dengan berkurangnya kapal, pemasukan dari perdagangan juga menurun."
        ]
      },
      {
        subjudul: "Masa kesultanan dan kolonial",
        paragraf: [
          "Pada masa Kesultanan Palembang Darussalam, kawasan tepi Sungai Musi menjadi lokasi bangunan penting. Keraton Kuto Besak dibangun tepat di tepi sungai, yang menunjukkan bahwa penguasaan jalur pelayaran menjadi pertimbangan utama. Setelah Belanda mengakhiri kesultanan, bangunan administrasi kolonial juga didirikan di kawasan yang berdekatan dengan sungai.",
          "Permukiman pendatang tumbuh di tepi sungai, termasuk permukiman Tionghoa di kawasan yang sekarang dikenal sebagai Kampung Kapitan, dan permukiman keturunan Arab di kawasan 13 Ulu yang disebut Kampung Arab Al-Munawar. Pilihan lokasi kedua permukiman itu menunjukkan bahwa sungai adalah pusat kehidupan ekonomi kota."
        ]
      },
      {
        subjudul: "Sungai sebagai ruang wisata sekarang",
        paragraf: [
          "Sampai sekarang Sungai Musi tetap menjadi jalur transportasi bagi sebagian warga. Dalam beberapa tahun terakhir, sungai ini juga dikembangkan sebagai jalur wisata. Kapal wisata Musi Cruise dikutip dengan tiket promo sekitar Rp5.000 per orang menurut pemberitaan Antara dan kanal resmi pemerintah kota, dengan kapasitas sekitar 100 orang. Perahu ketek juga dipakai untuk menyusuri sungai dan menyeberang ke Pulau Kemaro.",
          "Jadwal dan titik keberangkatan berubah beberapa kali. Karena itu, artikel ini menyarankan konfirmasi melalui kanal Dinas Pariwisata sebelum datang, alih-alih mencantumkan jam yang mungkin sudah tidak berlaku."
        ]
      },
      {
        subjudul: "Catatan yang perlu dijaga",
        paragraf: [
          "Klaim bahwa Sungai Musi adalah sungai terpanjang di Sumatera atau terpanjang kedua di Sumatera tidak konsisten antar sumber. Karena itu artikel ini tidak memakai peringkat tersebut dan hanya menyebut panjang menurut sumber yang tersedia. Peringkat sungai mudah berubah ketika metode pengukuran atau daftar pembanding berubah."
        ]
      }
    ],
    kesimpulan:
      "Sungai Musi menjelaskan banyak hal tentang Palembang: mengapa kota tumbuh di titik tertentu, mengapa permukiman pendatang berada di tepi air, dan mengapa jembatan menjadi bangunan ikonik. Memahami sungai berarti memahami kerangka kota.",
    sumber: [
      { judul: "Sungai Musi", penulis: "Wikipedia bahasa Indonesia", tahun: null, url: "https://id.wikipedia.org/wiki/Sungai_Musi", catatan: "Panjang, hulu, muara, dan luas daerah aliran." },
      { judul: "Berapa Panjang Sungai Musi? Simak 7 Faktanya", penulis: "detikSumbagsel", tahun: null, url: "https://www.detik.com/sumbagsel/berita/d-7915826/berapa-panjang-sungai-musi-simak-7-faktanya", catatan: "Perbandingan angka panjang sungai." },
      { judul: "Kapal Wisata Musi Cruise Jadi Favorit Anak", penulis: "Antara", tahun: null, url: "https://megapolitan.antaranews.com/berita/343838/kapal-wisata-musi-cruise-jadi-favorit-anak", catatan: "Harga tiket kapal wisata dan kapasitas." },
      { judul: "Kuto Besak", penulis: "Wikipedia bahasa Inggris", tahun: null, url: "https://en.wikipedia.org/wiki/Kuto_Besak", catatan: "Posisi keraton di tepi sungai." }
    ],
    destinasiTerkait: ["sungai-musi", "jembatan-ampera", "pulau-kemaro"],
    artikelTerkait: ["kerajaan-sriwijaya", "sejarah-jembatan-ampera", "tradisi-budaya-palembang"]
  }
];