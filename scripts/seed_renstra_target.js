import mysql from 'mysql2/promise';

const renstra2025_iku = [
  { no: 1, sektor: "Tata Kelola", indikator: "Nilai SAKIP", satuan: "Nilai", b: "64,55", t1: "68,30", t2: "69,98", t3: "70,36", t4: "71,76", t5: "73,20", t6: "74,60" },
  { no: 2, sektor: "Tata Kelola", indikator: "Indeks Pelayanan Publik (IPP)", satuan: "Angka", b: "2,05", t1: "2,26", t2: "2,48", t3: "2,73", t4: "3,00", t5: "3,30", t6: "3,63" },
  { no: 3, sektor: "Pangan & Gizi", indikator: "Indeks Ketahanan Pangan (IKP)", satuan: "Angka", b: "79,40", t1: "80,86", t2: "81,15", t3: "81,43", t4: "81,72", t5: "82,00", t6: "82,29" },
  { no: 4, sektor: "Pangan & Gizi", indikator: "Laju Pertumbuhan PDRB Sektor Pertanian", satuan: "%", b: "3,80", t1: "1–3", t2: "1–3", t3: "1–3", t4: "1–3", t5: "1–3", t6: "1–3" },
  { no: 5, sektor: "Pangan & Gizi", indikator: "Skor Pola Pangan Harapan (PPH)", satuan: "Angka", b: "93,86", t1: "93,90", t2: "94,00", t3: "94,01", t4: "94,02", t5: "94,03", t6: "94,05" },
  { no: 6, sektor: "Tanaman Pangan", indikator: "Peningkatan Produksi Tanaman Pangan", satuan: "%", b: "1,00", t1: "0,50", t2: "1,00", t3: "1,50", t4: "2,00", t5: "2,50", t6: "3,00" },
  { no: 7, sektor: "Horti & Perkebunan", indikator: "Peningkatan Produksi Hortikultura & Perkebunan", satuan: "%", b: "5,50", t1: "1,00", t2: "1,50", t3: "2,00", t4: "2,50", t5: "3,00", t6: "3,50" },
  { no: 8, sektor: "Peternakan", indikator: "Kenaikan Populasi Ternak", satuan: "%", b: "1,00", t1: "0,40", t2: "0,40", t3: "0,50", t4: "0,50", t5: "0,60", t6: "0,60" },
  { no: 9, sektor: "Perikanan", indikator: "Kenaikan Produksi Perikanan", satuan: "%", b: "1,02", t1: "0,50", t2: "1,20", t3: "1,90", t4: "2,90", t5: "3,70", t6: "4,90" }
];

const renstra2025_ikk = [
  { no: 1, sektor: "Pangan & Gizi", indikator: "Angka Kecukupan Energi (AKE)", satuan: "kkal/kapita/hari", b: "1.982", t1: "2.100", t2: "2.100", t3: "2.100", t4: "2.100", t5: "2.100", t6: "2.100" },
  { no: 2, sektor: "Pangan & Gizi", indikator: "Angka Kecukupan Protein (AKP)", satuan: "g/kapita/hari", b: "58,5", t1: "57,0", t2: "57,0", t3: "57,0", t4: "57,0", t5: "57,0", t6: "57,0" },
  { no: 3, sektor: "Pangan & Gizi", indikator: "Penanganan Desa Rentan Rawan Pangan", satuan: "%", b: "100", t1: "100", t2: "100", t3: "100", t4: "100", t5: "100", t6: "100" },
  { no: 4, sektor: "Pangan & Gizi", indikator: "Keamanan Produk Pangan Segar (PSAT)", satuan: "%", b: "95,67", t1: "85,0", t2: "86,0", t3: "87,0", t4: "88,0", t5: "89,0", t6: "90,0" },
  { no: 5, sektor: "Pangan & Gizi", indikator: "Ketersediaan Energi Masyarakat", satuan: "kkal/kapita/hari", b: "2.899", t1: "2.400", t2: "2.400", t3: "2.400", t4: "2.400", t5: "2.400", t6: "2.400" },
  { no: 6, sektor: "Tanaman Pangan", indikator: "Produktivitas Tanaman Pangan", satuan: "%", b: "1,90", t1: "0,50", t2: "1,00", t3: "1,50", t4: "2,00", t5: "2,50", t6: "3,00" },
  { no: 7, sektor: "Tanaman Pangan", indikator: "Luas Panen Tanaman Pangan", satuan: "%", b: "1,90", t1: "1,91", t2: "1,92", t3: "1,93", t4: "1,94", t5: "1,95", t6: "1,96" },
  { no: 8, sektor: "Tanaman Pangan", indikator: "Lahan Terdampak Bencana Tertangani", satuan: "%", b: "100", t1: "100", t2: "100", t3: "100", t4: "100", t5: "100", t6: "100" },
  { no: 9, sektor: "Tata Kelola", indikator: "Cakupan Pembinaan Kelompok Tani", satuan: "%", b: "25,0", t1: "25,0", t2: "30,0", t3: "35,0", t4: "40,0", t5: "45,0", t6: "50,0" },
  { no: 10, sektor: "Horti & Perkebunan", indikator: "Produktivitas Hortikultura & Perkebunan", satuan: "%", b: "5,50", t1: "1,00", t2: "1,50", t3: "2,00", t4: "2,50", t5: "3,00", t6: "3,50" },
  { no: 11, sektor: "Horti & Perkebunan", indikator: "Penambahan Luas Panen Horti & Kebun", satuan: "%", b: "25,0", t1: "1,00", t2: "1,50", t3: "2,00", t4: "2,50", t5: "2,70", t6: "3,00" },
  { no: 12, sektor: "Peternakan", indikator: "Populasi Ternak Kecil (Kambing & Domba)", satuan: "Ekor", b: "257.889", t1: "1,50%", t2: "2,00%", t3: "2,50%", t4: "3,00%", t5: "3,50%", t6: "4,00%" },
  { no: 13, sektor: "Peternakan", indikator: "Vaksinasi Hewan Rentan Zoonosis", satuan: "%", b: "60,0", t1: "65,0", t2: "68,0", t3: "71,0", t4: "74,0", t5: "77,0", t6: "80,0" },
  { no: 14, sektor: "Perikanan", indikator: "Produksi Perikanan Budidaya", satuan: "Ton", b: "40.510", t1: "40.712", t2: "41.016", t3: "41.320", t4: "41.725", t5: "42.029", t6: "42.535" },
  { no: 15, sektor: "Perikanan", indikator: "Produksi Benih Ikan", satuan: "Ekor", b: "2.534.358.034", t1: "2.547.029.824", t2: "2.566.037.509", t3: "2.585.045.194", t4: "2.610.388.775", t5: "2.629.396.460", t6: "2.661.075.935" },
  { no: 16, sektor: "Perikanan", indikator: "Produksi Perikanan Tangkap", satuan: "Ton", b: "575,56", t1: "580,0", t2: "580,0", t3: "580,0", t4: "590,0", t5: "590,0", t6: "590,0" },
  { no: 17, sektor: "Perikanan", indikator: "Kelompok Masyarakat Pengawas (Pokmaswas)", satuan: "Kelompok", b: "5", t1: "5", t2: "5", t3: "5", t4: "5", t5: "5", t6: "5" },
  { no: 18, sektor: "Perikanan", indikator: "Produksi Pengolahan Hasil Perikanan", satuan: "Ton/Tahun", b: "120,89", t1: "121,5", t2: "123,5", t3: "125,0", t4: "126,5", t5: "128,0", t6: "130,0" }
];

const renstra2019_sasaran = [
  // Tanaman Pangan (1-4)
  { no: 1, sektor: "Tanaman Pangan", indikator: "Produksi Padi", satuan: "Ton", b: "158.078,16", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 2, sektor: "Tanaman Pangan", indikator: "Produksi Jagung", satuan: "Ton", b: "65.145,00", t1: "65.796,45", t2: "66.454,41", t3: "67.118,96", t4: "67.790,15", t5: "68.468,05" },
  { no: 3, sektor: "Tanaman Pangan", indikator: "Produksi Kedelai", satuan: "Ton", b: "125,00", t1: "156,25", t2: "195,31", t3: "244,14", t4: "305,18", t5: "381,47" },
  { no: 4, sektor: "Tanaman Pangan", indikator: "Produksi Ubi Kayu", satuan: "Ton", b: "212.100,00", t1: "214.221,00", t2: "216.363,21", t3: "218.526,84", t4: "220.712,11", t5: "222.919,23" },

  // Hortikultura (5-9)
  { no: 5, sektor: "Horti & Perkebunan", indikator: "Produksi Kentang", satuan: "Ton", b: "120.900,00", t1: "124.800,00", t2: "128.700,00", t3: "132.600,00", t4: "140.400,00", t5: "148.543,20" },
  { no: 6, sektor: "Horti & Perkebunan", indikator: "Produksi Salak", satuan: "Ton", b: "242.983,98", t1: "251.083,45", t2: "254.323,23", t3: "259.182,91", t4: "267.282,34", t5: "275.300,81" },
  { no: 7, sektor: "Horti & Perkebunan", indikator: "Produksi Pisang", satuan: "Ton", b: "8.392,02", t1: "9.277,36", t2: "9.888,80", t3: "11.074,01", t4: "11.414,72", t5: "11.757,16" },
  { no: 8, sektor: "Horti & Perkebunan", indikator: "Produksi Durian", satuan: "Ton", b: "3.975,00", t1: "4.382,44", t2: "4.601,56", t3: "4.831,64", t4: "5.073,22", t5: "5.323,88" },
  { no: 9, sektor: "Horti & Perkebunan", indikator: "Produksi Cabai", satuan: "Ton", b: "17.500,00", t1: "19.000,00", t2: "20.280,00", t3: "21.450,00", t4: "22.900,00", t5: "24.274,00" },

  // Perkebunan (10-15)
  { no: 10, sektor: "Horti & Perkebunan", indikator: "Produksi Kopi", satuan: "Ton", b: "1.068,73", t1: "1.168,73", t2: "1.218,73", t3: "1.268,73", t4: "1.318,73", t5: "1.368,73" },
  { no: 11, sektor: "Horti & Perkebunan", indikator: "Produksi Kelapa Dalam", satuan: "Ton", b: "9.033,50", t1: "9.050,10", t2: "9.070,30", t3: "9.088,60", t4: "9.107,00", t5: "9.125,30" },
  { no: 12, sektor: "Horti & Perkebunan", indikator: "Produksi Kelapa Deres (Gula)", satuan: "Ton", b: "10.148,00", t1: "10.265,80", t2: "10.291,20", t3: "10.329,20", t4: "10.360,90", t5: "10.392,60" },
  { no: 13, sektor: "Horti & Perkebunan", indikator: "Produksi Teh", satuan: "Ton", b: "1.989,50", t1: "1.996,50", t2: "2.003,50", t3: "2.010,50", t4: "2.017,60", t5: "2.024,60" },
  { no: 14, sektor: "Horti & Perkebunan", indikator: "Produksi Tembakau", satuan: "Ton", b: "130,50", t1: "131,80", t2: "133,10", t3: "133,60", t4: "134,30", t5: "135,60" },
  { no: 15, sektor: "Horti & Perkebunan", indikator: "Produksi Lada", satuan: "Ton", b: "112,05", t1: "117,50", t2: "119,25", t3: "120,50", t4: "121,00", t5: "121,50" },

  // Peternakan & Keswan (16-22)
  { no: 16, sektor: "Peternakan", indikator: "Populasi Sapi", satuan: "Ekor", b: "31.318", t1: "31.506", t2: "31.695", t3: "31.885", t4: "32.076", t5: "32.269" },
  { no: 17, sektor: "Peternakan", indikator: "Populasi Kambing/Domba", satuan: "Ekor", b: "260.780", t1: "261.824", t2: "262.348", t3: "263.873", t4: "263.398", t5: "263.925" },
  { no: 18, sektor: "Peternakan", indikator: "Populasi Domba Batur", satuan: "Ekor", b: "8.250", t1: "8.500", t2: "8.750", t3: "9.000", t4: "9.250", t5: "9.500" },
  { no: 19, sektor: "Peternakan", indikator: "Status Bebas 4 Penyakit Zoonosis", satuan: "Kejadian", b: "0", t1: "0", t2: "0", t3: "0", t4: "0", t5: "0" },
  { no: 20, sektor: "Peternakan", indikator: "Penurunan Kematian Unggas akibat AI", satuan: "Kejadian", b: "0,50", t1: "0,45", t2: "0,40", t3: "0,35", t4: "0,30", t5: "0,25" },
  { no: 21, sektor: "Peternakan", indikator: "Produksi Daging", satuan: "Ton", b: "4.738,06", t1: "4.747,54", t2: "4.757,03", t3: "4.766,54", t4: "4.776,08", t5: "4.785,63" },
  { no: 22, sektor: "Peternakan", indikator: "Unit Usaha Pangan Hewan Pra-NKV", satuan: "Unit", b: "3", t1: "3", t2: "3", t3: "3", t4: "3", t5: "3" },

  // Perikanan (23-25)
  { no: 23, sektor: "Perikanan", indikator: "Produksi Perikanan Budidaya", satuan: "Ton", b: "27.240", t1: "28.619", t2: "31.481", t3: "34.629", t4: "38.092", t5: "41.901" },
  { no: 24, sektor: "Perikanan", indikator: "Produksi Benih Ikan", satuan: "Ekor", b: "1.719.000.000", t1: "1.890.900.000", t2: "2.079.900.000", t3: "2.287.890.000", t4: "2.516.679.000", t5: "2.768.466.690" },
  { no: 25, sektor: "Perikanan", indikator: "Produksi Perikanan Tangkap", satuan: "Ton", b: "1.250", t1: "1.250", t2: "1.250", t3: "1.250", t4: "1.250", t5: "1.250" },

  // Ketahanan Pangan (26-34)
  { no: 26, sektor: "Pangan & Gizi", indikator: "Luas Lahan Tidur Tertanami", satuan: "Ha", b: "0", t1: "0", t2: "5", t3: "5", t4: "5", t5: "5" },
  { no: 27, sektor: "Pangan & Gizi", indikator: "Ketersediaan Pangan Utama", satuan: "Ton/Tahun", b: "123.433,99", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 28, sektor: "Pangan & Gizi", indikator: "Ketersediaan Energi & Protein per Kapita", satuan: "%", b: "77", t1: "80", t2: "85", t3: "90", t4: "95", t5: "97" },
  { no: 29, sektor: "Pangan & Gizi", indikator: "Penyediaan Cadangan Pangan Kabupaten", satuan: "%", b: "15", t1: "17", t2: "19", t3: "21", t4: "23", t5: "23" },
  { no: 30, sektor: "Pangan & Gizi", indikator: "Stabilitas Harga Pangan Pokok", satuan: "%", b: "10", t1: "10", t2: "10", t3: "10", t4: "10", t5: "10" },
  { no: 31, sektor: "Pangan & Gizi", indikator: "Skor Pola Pangan Harapan (PPH)", satuan: "Nilai", b: "85", t1: "85", t2: "90", t3: "92", t4: "93", t5: "95" },
  { no: 32, sektor: "Pangan & Gizi", indikator: "Cakupan Mutu & Keamanan Pangan", satuan: "%", b: "75", t1: "75", t2: "77", t3: "80", t4: "82", t5: "85" },
  { no: 33, sektor: "Pangan & Gizi", indikator: "Pengawasan Pupuk dan Pestisida", satuan: "Kegiatan", b: "1 monev, 4 rakor", t1: "1 monev, 4 rakor", t2: "1 monev, 4 rakor", t3: "1 monev, 4 rakor", t4: "1 monev, 4 rakor", t5: "1 monev, 4 rakor" },
  { no: 34, sektor: "Pangan & Gizi", indikator: "Persentase Penurunan Rawan Pangan", satuan: "%", b: "19", t1: "19", t2: "18", t3: "17", t4: "16", t5: "15" },

  // Tata Kelola, Kesejahteraan & Pelayanan (35-43)
  { no: 35, sektor: "Tata Kelola", indikator: "Cakupan Bina Kelompok Tani", satuan: "%", b: "90,00", t1: "90,00", t2: "90,00", t3: "90,00", t4: "90,00", t5: "90,00" },
  { no: 36, sektor: "Tata Kelola", indikator: "Cakupan Bina Kelompok Pembudidaya Ikan", satuan: "%", b: "18,10", t1: "18,80", t2: "20,00", t3: "24,00", t4: "27,30", t5: "30,00" },
  { no: 37, sektor: "Tata Kelola", indikator: "Nilai Tukar Petani (NTP) Pertanian", satuan: "%", b: "102 s.d 103", t1: "102 s.d 103", t2: "103 s.d 104", t3: "103 s.d 104", t4: "103 s.d 104", t5: "103 s.d 105" },
  { no: 38, sektor: "Tata Kelola", indikator: "Pertumbuhan Sektor Pertanian", satuan: "%", b: "2,5 s.d 3,5", t1: "2,7 s.d 3,7", t2: "2,7 s.d 3,7", t3: "3 s.d 4", t4: "3 s.d 4", t5: "3 s.d 4" },
  { no: 39, sektor: "Tata Kelola", indikator: "Rumah Tangga Miskin (RTM) Terfasilitasi", satuan: "RTM", b: "0", t1: "20", t2: "20", t3: "20", t4: "20", t5: "20" },
  { no: 40, sektor: "Tata Kelola", indikator: "Pelaksanaan Event Promosi Produk", satuan: "Kali", b: "12", t1: "4", t2: "6", t3: "4", t4: "6", t5: "4" },
  { no: 41, sektor: "Perikanan", indikator: "Konsumsi Ikan Masyarakat", satuan: "kg/kapita/tahun", b: "20,04", t1: "21,30", t2: "21,50", t3: "21,70", t4: "21,90", t5: "22,50" },
  { no: 42, sektor: "Tata Kelola", indikator: "Survei Kepuasan Masyarakat (SKM)", satuan: "Nilai", b: "68,00", t1: "70,00", t2: "72,00", t3: "74,00", t4: "76,00", t5: "78,00" },
  { no: 43, sektor: "Tata Kelola", indikator: "Nilai Akuntabilitas Kinerja (SAKIP)", satuan: "Nilai (Predikat)", b: "48,00 (C)", t1: "53 (CC)", t2: "58 (CC)", t3: "63 (B)", t4: "68 (B)", t5: "73 (BB)" }
];

const renstra2019_program = [
  { no: 1, sektor: "Pangan & Gizi", indikator: "Ketersediaan Energi per Kapita", satuan: "kkal/kap/hari", b: "2.544", t1: "2.644", t2: "2.744", t3: "2.744", t4: "2.794", t5: "2.844" },
  { no: 2, sektor: "Pangan & Gizi", indikator: "Ketersediaan Protein per Kapita", satuan: "gr/kap/hari", b: "56,71", t1: "57,71", t2: "58,21", t3: "58,71", t4: "59,21", t5: "59,21" },
  { no: 3, sektor: "Pangan & Gizi", indikator: "Ketersediaan Pangan Utama Daerah", satuan: "Ton", b: "123.433,99", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 4, sektor: "Pangan & Gizi", indikator: "Pengawasan Pupuk dan Pestisida", satuan: "Monev/Rakor", b: "1 monev, 4 rakor", t1: "1 monev, 4 rakor", t2: "1 monev, 4 rakor", t3: "1 monev, 4 rakor", t4: "1 monev, 4 rakor", t5: "1 monev, 4 rakor" },
  { no: 5, sektor: "Tanaman Pangan", indikator: "Pemanfaatan Lahan Tidur untuk Pangan", satuan: "Ha", b: "0", t1: "0", t2: "5", t3: "5", t4: "5", t5: "5" },
  { no: 6, sektor: "Tata Kelola", indikator: "Promosi Pemasaran Hasil Pertanian", satuan: "Kali", b: "12", t1: "4", t2: "6", t3: "4", t4: "6", t5: "4" },
  { no: 7, sektor: "Horti & Perkebunan", indikator: "Teknologi Produksi Kopi", satuan: "Ton", b: "1.068,73", t1: "1.168,73", t2: "1.218,73", t3: "1.268,73", t4: "1.318,73", t5: "1.368,73" },
  { no: 8, sektor: "Horti & Perkebunan", indikator: "Teknologi Produksi Durian", satuan: "Ton", b: "3.975,00", t1: "4.382,44", t2: "4.601,56", t3: "4.831,64", t4: "5.073,22", t5: "5.323,88" },
  { no: 9, sektor: "Horti & Perkebunan", indikator: "Teknologi Produksi Cabai", satuan: "Ton", b: "17.500,00", t1: "19.000,00", t2: "20.280,00", t3: "21.450,00", t4: "22.900,00", t5: "24.274,00" },
  { no: 10, sektor: "Tanaman Pangan", indikator: "Produksi Padi Utama", satuan: "Ton", b: "158.078,16", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 11, sektor: "Tanaman Pangan", indikator: "Produksi Jagung Utama", satuan: "Ton", b: "65.145,00", t1: "65.796,45", t2: "66.454,41", t3: "67.118,96", t4: "67.790,15", t5: "68.468,05" },
  { no: 12, sektor: "Horti & Perkebunan", indikator: "Produksi Lada Perkebunan", satuan: "Ton", b: "112,05", t1: "117,50", t2: "119,25", t3: "120,50", t4: "121,00", t5: "121,50" },
  { no: 13, sektor: "Tata Kelola", indikator: "Cakupan Bina Petani oleh Penyuluh", satuan: "%", b: "90,00", t1: "90,00", t2: "90,00", t3: "90,00", t4: "90,00", t5: "90,00" },
  { no: 14, sektor: "Peternakan", indikator: "Pencegahan Status Bebas 4 Zoonosis", satuan: "Kejadian", b: "0", t1: "0", t2: "0", t3: "0", t4: "0", t5: "0" },
  { no: 15, sektor: "Peternakan", indikator: "Pengembangan Populasi Domba Batur", satuan: "Ekor", b: "8.250", t1: "8.500", t2: "8.750", t3: "9.000", t4: "9.250", t5: "9.500" },
  { no: 16, sektor: "Peternakan", indikator: "Pengembangan Populasi Sapi", satuan: "Ekor", b: "31.318", t1: "31.506", t2: "31.695", t3: "31.885", t4: "32.076", t5: "32.269" },
  { no: 17, sektor: "Perikanan", indikator: "Budidaya dan Benih Ikan Air Tawar", satuan: "Ton", b: "27.240", t1: "28.619", t2: "31.481", t3: "34.629", t4: "38.092", t5: "41.901" }
];

async function seed() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'pertasis';

  console.log(`[SEED] Connecting to MySQL ${user}@${host}:${port}/${database}...`);
  const conn = await mysql.createConnection({ host, port, user, password, database });

  console.log('[SEED] Truncating table renstra_target...');
  await conn.query("TRUNCATE TABLE renstra_target");

  const insertSql = `
    INSERT INTO renstra_target (
      periode, jenis_tabel, kategori_sektor, no_urut, indikator, satuan,
      baseline_tahun, baseline_nilai, t1, t2, t3, t4, t5, t6,
      sumber_tabel, sumber_dokumen
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let totalInserted = 0;

  // 1. Insert Renstra 2025–2029 (IKU)
  for (const item of renstra2025_iku) {
    await conn.query(insertSql, [
      '2025-2029', 'IKU', item.sektor, item.no, item.indikator, item.satuan,
      2024, item.b, item.t1, item.t2, item.t3, item.t4, item.t5, item.t6,
      'Tabel 4.5', 'Renstra Distankan & KP Kab. Banjarnegara 2025–2029'
    ]);
    totalInserted++;
  }
  console.log(`[SEED] Inserted ${renstra2025_iku.length} records for 2025–2029 IKU (Tabel 4.5).`);

  // 2. Insert Renstra 2025–2029 (IKK)
  for (const item of renstra2025_ikk) {
    await conn.query(insertSql, [
      '2025-2029', 'IKK', item.sektor, item.no, item.indikator, item.satuan,
      2024, item.b, item.t1, item.t2, item.t3, item.t4, item.t5, item.t6,
      'Tabel 4.7', 'Renstra Distankan & KP Kab. Banjarnegara 2025–2029'
    ]);
    totalInserted++;
  }
  console.log(`[SEED] Inserted ${renstra2025_ikk.length} records for 2025–2029 IKK (Tabel 4.7).`);

  // 3. Insert Renstra 2019–2022 (Sasaran Renstra / Tabel 4.1)
  for (const item of renstra2019_sasaran) {
    await conn.query(insertSql, [
      '2019-2022', 'SASARAN_RENSTRA', item.sektor, item.no, item.indikator, item.satuan,
      2017, item.b, item.t1, item.t2, item.t3, item.t4, item.t5, null,
      'Tabel 4.1', 'Renstra Distankan & KP Kab. Banjarnegara 2019–2022'
    ]);
    totalInserted++;
  }
  console.log(`[SEED] Inserted ${renstra2019_sasaran.length} records for 2019–2022 Sasaran (Tabel 4.1).`);

  // 4. Insert Renstra 2019–2022 (Program RPJMD / Tabel 7.2)
  for (const item of renstra2019_program) {
    await conn.query(insertSql, [
      '2019-2022', 'PROGRAM_RPJMD', item.sektor, item.no, item.indikator, item.satuan,
      2017, item.b, item.t1, item.t2, item.t3, item.t4, item.t5, null,
      'Tabel 7.2', 'Renstra Distankan & KP Kab. Banjarnegara 2019–2022'
    ]);
    totalInserted++;
  }
  console.log(`[SEED] Inserted ${renstra2019_program.length} records for 2019–2022 Program (Tabel 7.2).`);

  const [verify] = await conn.query(`
    SELECT periode, jenis_tabel, COUNT(*) as jumlah
    FROM renstra_target
    GROUP BY periode, jenis_tabel
    ORDER BY periode, jenis_tabel
  `);
  console.log('[SEED] Verification summary:');
  console.table(verify);
  console.log(`[SEED] Total ${totalInserted} official records seeded successfully.`);

  await conn.end();
}

seed().catch(err => {
  console.error('[SEED] Error:', err);
  process.exit(1);
});
