/**
 * lib/data-sources.js — Pemetaan Sumber Data Halaman Publik SISPERTANI.
 * Menghubungkan domain unggahan internal dengan halaman publik dan data pembanding/rujukan eksternal
 * dalam bahasa lugas yang mudah dipahami staf dinas dan pimpinan daerah.
 */

export const DATA_SOURCES_MAP = [
  {
    domain: "fsva-desa",
    halamanLabel: "Peta Kerentanan Pangan (FSVA)",
    halamanUrl: "/fsva",
    bidang: "ketahanan-pangan",
    tabelUtama: "fsva_desa_indikator",
    namaDataLokal: "Data 278 Desa Hasil Validasi Lapangan",
    sumberLuar: "BAPANAS (Indeks Ketahanan Pangan Nasional)",
    keterangan: "Menampilkan skor prioritas kerentanan pangan desa se-Banjarnegara didampingi acuan nasional."
  },
  {
    domain: "harga-pasar",
    halamanLabel: "Harga Pasar Harian",
    halamanUrl: "/price-volatility",
    bidang: "ketahanan-pangan",
    tabelUtama: "harga_pasar_banjarnegara",
    namaDataLokal: "Pantauan Harga Harian Pasar Tradisional",
    sumberLuar: "Panel Harga BAPANAS Jawa Tengah",
    keterangan: "Menampilkan fluktuasi harga bahan pokok harian di pasar-pasar Banjarnegara."
  },
  {
    domain: "psat-pduk",
    halamanLabel: "Keamanan Pangan (PSAT)",
    halamanUrl: "/psat-pduk",
    bidang: "ketahanan-pangan",
    tabelUtama: "psat_pduk",
    namaDataLokal: "Hasil Uji Sampel & Izin Edar PDUK",
    sumberLuar: "Standar Otoritas Kompeten Pangan Daerah Jateng",
    keterangan: "Hasil inspeksi uji cepat residu pestisida pangan segar asal tumbuhan."
  },
  {
    domain: "lumbung",
    halamanLabel: "Cadangan Beras & Lumbung",
    halamanUrl: "/food-security",
    bidang: "ketahanan-pangan",
    tabelUtama: "lumbung_pangan",
    namaDataLokal: "Kapasitas & Cadangan Lumbung Desa",
    sumberLuar: "BAPANAS / Bulog (Cadangan Beras Pemerintah)",
    keterangan: "Ketersediaan stok lumbung pangan masyarakat per kecamatan."
  },
  {
    domain: "neraca-pangan",
    halamanLabel: "Neraca Pangan Komposit",
    halamanUrl: "/food-security",
    bidang: "ketahanan-pangan",
    tabelUtama: "neraca_pangan_komposit",
    namaDataLokal: "Ketersediaan Bersih vs Kebutuhan Konsumsi",
    sumberLuar: "Neraca Pangan Nasional BAPANAS",
    keterangan: "Status surplus atau defisit komoditas pangan pokok kabupaten."
  },
  {
    domain: "harga-produsen",
    halamanLabel: "Harga di Tingkat Petani / Produsen",
    halamanUrl: "/nilai-ekonomi/pangan",
    bidang: "ketahanan-pangan",
    tabelUtama: "harga_produsen",
    namaDataLokal: "Harga Komoditas di Tingkat Petani",
    sumberLuar: "Panel Harga Produsen Badan Pangan Nasional",
    keterangan: "Harga acuan dasar per komoditas sebagai dasar valuasi ekonomi daerah."
  },
  {
    domain: "tanaman-pangan",
    halamanLabel: "Produksi Padi & Palawija",
    halamanUrl: "/food-crops",
    bidang: "tanaman-pangan",
    tabelUtama: "padi_produksi",
    namaDataLokal: "Luas Tanam & Produksi Padi/Palawija",
    sumberLuar: "BPS Banjarnegara (Statistik Pertanian)",
    keterangan: "Realisasi panen dan sasaran tanam komoditas pangan utama."
  },
  {
    domain: "hortikultura",
    halamanLabel: "Sayuran & Buah-buahan",
    halamanUrl: "/horticulture",
    bidang: "horti-perkebunan",
    tabelUtama: "horti_produksi",
    namaDataLokal: "Luas Panen & Volume Hortikultura",
    sumberLuar: "BPS Banjarnegara",
    keterangan: "Data produksi komoditas sayuran dataran tinggi dan buah unggulan."
  },
  {
    domain: "perkebunan",
    halamanLabel: "Produksi Perkebunan",
    halamanUrl: "/plantation",
    bidang: "horti-perkebunan",
    tabelUtama: "perkebunan_produksi",
    namaDataLokal: "Areal Tanaman & Hasil Perkebunan",
    sumberLuar: "Dinas Perkebunan Provinsi Jawa Tengah",
    keterangan: "Komoditas kopi, teh, kelapa, dan tembakau rakyat."
  },
  {
    domain: "peternakan",
    halamanLabel: "Populasi & Produksi Ternak",
    halamanUrl: "/livestock",
    bidang: "peternakan",
    tabelUtama: "ternak_populasi",
    namaDataLokal: "Populasi Ternak & Pemotongan RPH",
    sumberLuar: "BPS ST2023 (Sensus Peternakan)",
    keterangan: "Statistik ternak besar, kecil, unggas, serta plasma nutfah Domba Batur."
  },
  {
    domain: "perikanan",
    halamanLabel: "Budidaya & Tangkap Ikan",
    halamanUrl: "/fisheries",
    bidang: "perikanan",
    tabelUtama: "ikan_produksi_jenis",
    namaDataLokal: "Produksi Kolam, Waduk & Pembenihan",
    sumberLuar: "Kementerian Kelautan dan Perikanan (KKP)",
    keterangan: "Hasil budidaya 10 jenis ikan air tawar konsumsi dan ikan hias."
  },
  {
    domain: "kelembagaan",
    halamanLabel: "Kelembagaan Tani & Penyuluhan",
    halamanUrl: "/farmers",
    bidang: "tanaman-pangan",
    tabelUtama: "kelembagaan_pertanian",
    namaDataLokal: "Direktori Poktan, Gapoktan & KWT Binaan",
    sumberLuar: "SIMLUHTAN Kementan & Sensus BPS ST2023",
    keterangan: "Profil kelembagaan tani, unit usaha alsintan, dan ketenagaan penyuluh."
  },
  {
    domain: "bantuan",
    halamanLabel: "Sebaran Bantuan Pemerintah",
    halamanUrl: "/government-assistance",
    bidang: "admin",
    tabelUtama: "bantuan_program",
    namaDataLokal: "Alokasi Program & Rincian Penerima",
    sumberLuar: "Dokumen Pelaksanaan Anggaran (DPA APBD & APBN)",
    keterangan: "Realisasi bantuan sarana prasarana, bibit, dan alsintan ke kelompok tani."
  },
  {
    domain: "lahan",
    halamanLabel: "Luas & Penggunaan Lahan",
    halamanUrl: "/lahan",
    bidang: "admin",
    tabelUtama: "lahan_penggunaan",
    namaDataLokal: "Kategori Penggunaan Lahan Kabupaten",
    sumberLuar: "Badan Informasi Geospasial (BIG) & ATR/BPN",
    keterangan: "Distribusi tutupan lahan sawah, tegalan, perkebunan, dan hutan rakyat."
  },
  {
    domain: "ekonomi",
    halamanLabel: "Nilai Ekonomi Komoditas",
    halamanUrl: "/nilai-ekonomi/pangan",
    bidang: "admin",
    tabelUtama: "nilai_ekonomi_tahunan",
    namaDataLokal: "Input Estimasi Nilai Ekonomi Daerah",
    sumberLuar: "BPS (PDRB Sektor Pertanian Banjarnegara)",
    keterangan: "Valuasi perputaran ekonomi komoditas pertanian per tahun anggaran."
  },
  {
    domain: "renstra",
    halamanLabel: "Target Kinerja Renstra",
    halamanUrl: "/renstra",
    bidang: "admin",
    tabelUtama: "renstra_target",
    namaDataLokal: "Target Indikator Kinerja Renstra Dinas",
    sumberLuar: "Dokumen Renstra & RKPD Pemkab Banjarnegara",
    keterangan: "Capaian indikator makro produksi dan ketahanan pangan daerah."
  }
];
