import { g as e, i as t, t as n } from "./default-CAKe9ffW.js";
import { t as r } from "./arrow-right-Z7jtJnlf.js";
import { i } from "./x-CXWFwwzx.js";
import { t as a } from "./circle-check-PxHdRpHr.js";
import { n as o, t as s } from "./file-text-lGWqWg17.js";
import { t as c } from "./printer-BDcaNACb.js";
import { C as l, b as u, p as d } from "./index-CI1XYnwk.js";

var f = l(u(), 1);
var p = d();

// =========================================================================
// DATASET RESMI RENSTRA 2025–2029 (Dokumen dist/renstra-2025-2029.pdf)
// =========================================================================
const ikuList2025 = [
  { no: 1, sektor: "Tata Kelola", indikator: "Nilai SAKIP", satuan: "Nilai", baseline: "64,55", t1: "68,30", t2: "69,98", t3: "70,36", t4: "71,76", t5: "73,20", t6: "74,60" },
  { no: 2, sektor: "Tata Kelola", indikator: "Indeks Pelayanan Publik (IPP)", satuan: "Angka", baseline: "2,05", t1: "2,26", t2: "2,48", t3: "2,73", t4: "3,00", t5: "3,30", t6: "3,63" },
  { no: 3, sektor: "Pangan & Gizi", indikator: "Indeks Ketahanan Pangan (IKP)", satuan: "Angka", baseline: "79,40", t1: "80,86", t2: "81,15", t3: "81,43", t4: "81,72", t5: "82,00", t6: "82,29" },
  { no: 4, sektor: "Pangan & Gizi", indikator: "Laju Pertumbuhan PDRB Sektor Pertanian", satuan: "%", baseline: "3,80", t1: "1–3", t2: "1–3", t3: "1–3", t4: "1–3", t5: "1–3", t6: "1–3" },
  { no: 5, sektor: "Pangan & Gizi", indikator: "Skor Pola Pangan Harapan (PPH)", satuan: "Angka", baseline: "93,86", t1: "93,90", t2: "94,00", t3: "94,01", t4: "94,02", t5: "94,03", t6: "94,05" },
  { no: 6, sektor: "Tanaman Pangan", indikator: "Peningkatan Produksi Tanaman Pangan", satuan: "%", baseline: "1,00", t1: "0,50", t2: "1,00", t3: "1,50", t4: "2,00", t5: "2,50", t6: "3,00" },
  { no: 7, sektor: "Horti & Perkebunan", indikator: "Peningkatan Produksi Hortikultura & Perkebunan", satuan: "%", baseline: "5,50", t1: "1,00", t2: "1,50", t3: "2,00", t4: "2,50", t5: "3,00", t6: "3,50" },
  { no: 8, sektor: "Peternakan", indikator: "Kenaikan Populasi Ternak", satuan: "%", baseline: "1,00", t1: "0,40", t2: "0,40", t3: "0,50", t4: "0,50", t5: "0,60", t6: "0,60" },
  { no: 9, sektor: "Perikanan", indikator: "Kenaikan Produksi Perikanan", satuan: "%", baseline: "1,02", t1: "0,50", t2: "1,20", t3: "1,90", t4: "2,90", t5: "3,70", t6: "4,90" }
];

const ikkList2025 = [
  { no: 1, sektor: "Pangan & Gizi", indikator: "Angka Kecukupan Energi (AKE)", satuan: "kkal/kapita/hari", baseline: "1.982", t1: "2.100", t2: "2.100", t3: "2.100", t4: "2.100", t5: "2.100", t6: "2.100" },
  { no: 2, sektor: "Pangan & Gizi", indikator: "Angka Kecukupan Protein (AKP)", satuan: "g/kapita/hari", baseline: "58,5", t1: "57,0", t2: "57,0", t3: "57,0", t4: "57,0", t5: "57,0", t6: "57,0" },
  { no: 3, sektor: "Pangan & Gizi", indikator: "Penanganan Desa Rentan Rawan Pangan", satuan: "%", baseline: "100", t1: "100", t2: "100", t3: "100", t4: "100", t5: "100", t6: "100" },
  { no: 4, sektor: "Pangan & Gizi", indikator: "Keamanan Produk Pangan Segar (PSAT)", satuan: "%", baseline: "95,67", t1: "85,0", t2: "86,0", t3: "87,0", t4: "88,0", t5: "89,0", t6: "90,0" },
  { no: 5, sektor: "Pangan & Gizi", indikator: "Ketersediaan Energi Masyarakat", satuan: "kkal/kapita/hari", baseline: "2.899", t1: "2.400", t2: "2.400", t3: "2.400", t4: "2.400", t5: "2.400", t6: "2.400" },
  { no: 6, sektor: "Tanaman Pangan", indikator: "Produktivitas Tanaman Pangan", satuan: "%", baseline: "1,90", t1: "0,50", t2: "1,00", t3: "1,50", t4: "2,00", t5: "2,50", t6: "3,00" },
  { no: 7, sektor: "Tanaman Pangan", indikator: "Luas Panen Tanaman Pangan", satuan: "%", baseline: "1,90", t1: "1,91", t2: "1,92", t3: "1,93", t4: "1,94", t5: "1,95", t6: "1,96" },
  { no: 8, sektor: "Tanaman Pangan", indikator: "Lahan Terdampak Bencana Tertangani", satuan: "%", baseline: "100", t1: "100", t2: "100", t3: "100", t4: "100", t5: "100", t6: "100" },
  { no: 9, sektor: "Tata Kelola", indikator: "Cakupan Pembinaan Kelompok Tani", satuan: "%", baseline: "25,0", t1: "25,0", t2: "30,0", t3: "35,0", t4: "40,0", t5: "45,0", t6: "50,0" },
  { no: 10, sektor: "Horti & Perkebunan", indikator: "Produktivitas Hortikultura & Perkebunan", satuan: "%", baseline: "5,50", t1: "1,00", t2: "1,50", t3: "2,00", t4: "2,50", t5: "3,00", t6: "3,50" },
  { no: 11, sektor: "Horti & Perkebunan", indikator: "Penambahan Luas Panen Horti & Kebun", satuan: "%", baseline: "25,0", t1: "1,00", t2: "1,50", t3: "2,00", t4: "2,50", t5: "2,70", t6: "3,00" },
  { no: 12, sektor: "Peternakan", indikator: "Populasi Ternak Kecil (Kambing & Domba)", satuan: "Ekor", baseline: "257.889", t1: "1,50%", t2: "2,00%", t3: "2,50%", t4: "3,00%", t5: "3,50%", t6: "4,00%" },
  { no: 13, sektor: "Peternakan", indikator: "Vaksinasi Hewan Rentan Zoonosis", satuan: "%", baseline: "60,0", t1: "65,0", t2: "68,0", t3: "71,0", t4: "74,0", t5: "77,0", t6: "80,0" },
  { no: 14, sektor: "Perikanan", indikator: "Produksi Perikanan Budidaya", satuan: "Ton", baseline: "40.510", t1: "40.712", t2: "41.016", t3: "41.320", t4: "41.725", t5: "42.029", t6: "42.535" },
  { no: 15, sektor: "Perikanan", indikator: "Produksi Benih Ikan", satuan: "Ekor", baseline: "2.534.358.034", t1: "2.547.029.824", t2: "2.566.037.509", t3: "2.585.045.194", t4: "2.610.388.775", t5: "2.629.396.460", t6: "2.661.075.935" },
  { no: 16, sektor: "Perikanan", indikator: "Produksi Perikanan Tangkap", satuan: "Ton", baseline: "575,56", t1: "580,0", t2: "580,0", t3: "580,0", t4: "590,0", t5: "590,0", t6: "590,0" },
  { no: 17, sektor: "Perikanan", indikator: "Kelompok Masyarakat Pengawas (Pokmaswas)", satuan: "Kelompok", baseline: "5", t1: "5", t2: "5", t3: "5", t4: "5", t5: "5", t6: "5" },
  { no: 18, sektor: "Perikanan", indikator: "Produksi Pengolahan Hasil Perikanan", satuan: "Ton/Tahun", baseline: "120,89", t1: "121,5", t2: "123,5", t3: "125,0", t4: "126,5", t5: "128,0", t6: "130,0" }
];

// =========================================================================
// DATASET RESMI RENSTRA 2019–2022 (Dokumen dist/renstra.pdf)
// =========================================================================
const sasaranList2019 = [
  { no: 1, sektor: "Tanaman Pangan", indikator: "Produksi Padi", satuan: "Ton", baseline: "158.078,16", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 2, sektor: "Tanaman Pangan", indikator: "Produksi Jagung", satuan: "Ton", baseline: "65.145,00", t1: "65.796,45", t2: "66.454,41", t3: "67.118,96", t4: "67.790,15", t5: "68.468,05" },
  { no: 3, sektor: "Tanaman Pangan", indikator: "Produksi Kedelai", satuan: "Ton", baseline: "125,00", t1: "156,25", t2: "195,31", t3: "244,14", t4: "305,18", t5: "381,47" },
  { no: 4, sektor: "Tanaman Pangan", indikator: "Produksi Ubi Kayu", satuan: "Ton", baseline: "212.100,00", t1: "214.221,00", t2: "216.363,21", t3: "218.526,84", t4: "220.712,11", t5: "222.919,23" },
  { no: 5, sektor: "Horti & Perkebunan", indikator: "Produksi Kentang", satuan: "Ton", baseline: "120.900,00", t1: "124.800,00", t2: "128.700,00", t3: "132.600,00", t4: "140.400,00", t5: "148.543,20" },
  { no: 6, sektor: "Horti & Perkebunan", indikator: "Produksi Salak Pondoh", satuan: "Ton", baseline: "242.983,98", t1: "251.083,45", t2: "254.323,23", t3: "259.182,91", t4: "267.282,34", t5: "275.300,81" },
  { no: 7, sektor: "Horti & Perkebunan", indikator: "Produksi Pisang", satuan: "Ton", baseline: "8.392,02", t1: "9.277,36", t2: "9.888,80", t3: "11.074,01", t4: "11.414,72", t5: "11.757,16" },
  { no: 8, sektor: "Horti & Perkebunan", indikator: "Produksi Durian", satuan: "Ton", baseline: "3.975,00", t1: "4.382,44", t2: "4.601,56", t3: "4.831,64", t4: "5.073,22", t5: "5.323,88" },
  { no: 9, sektor: "Horti & Perkebunan", indikator: "Produksi Cabai", satuan: "Ton", baseline: "17.500,00", t1: "19.000,00", t2: "20.280,00", t3: "21.450,00", t4: "22.900,00", t5: "24.274,00" },
  { no: 10, sektor: "Horti & Perkebunan", indikator: "Produksi Kopi", satuan: "Ton", baseline: "1.068,73", t1: "1.168,73", t2: "1.218,73", t3: "1.268,73", t4: "1.318,73", t5: "1.368,73" },
  { no: 11, sektor: "Horti & Perkebunan", indikator: "Produksi Kelapa Dalam", satuan: "Ton", baseline: "9.033,50", t1: "9.050,10", t2: "9.070,30", t3: "9.088,60", t4: "9.107,00", t5: "9.125,30" },
  { no: 12, sektor: "Horti & Perkebunan", indikator: "Produksi Kelapa Deres (Gula)", satuan: "Ton", baseline: "10.148,00", t1: "10.265,80", t2: "10.291,20", t3: "10.329,20", t4: "10.360,90", t5: "10.392,60" },
  { no: 13, sektor: "Horti & Perkebunan", indikator: "Produksi Teh", satuan: "Ton", baseline: "1.989,50", t1: "1.996,50", t2: "2.003,50", t3: "2.010,50", t4: "2.017,60", t5: "2.024,60" },
  { no: 14, sektor: "Horti & Perkebunan", indikator: "Produksi Tembakau", satuan: "Ton", baseline: "130,50", t1: "131,80", t2: "133,10", t3: "133,60", t4: "134,30", t5: "135,60" },
  { no: 15, sektor: "Horti & Perkebunan", indikator: "Produksi Lada", satuan: "Ton", baseline: "112,05", t1: "117,50", t2: "119,25", t3: "120,50", t4: "121,00", t5: "121,50" },
  { no: 16, sektor: "Peternakan", indikator: "Populasi Sapi", satuan: "Ekor", baseline: "31.318", t1: "31.506", t2: "31.695", t3: "31.885", t4: "32.076", t5: "32.269" },
  { no: 17, sektor: "Peternakan", indikator: "Populasi Kambing/Domba", satuan: "Ekor", baseline: "260.780", t1: "261.824", t2: "262.348", t3: "263.873", t4: "263.398", t5: "263.925" },
  { no: 18, sektor: "Peternakan", indikator: "Populasi Domba Batur Dieng", satuan: "Ekor", baseline: "8.250", t1: "8.500", t2: "8.750", t3: "9.000", t4: "9.250", t5: "9.500" },
  { no: 19, sektor: "Peternakan", indikator: "Status Bebas 4 Zoonosis", satuan: "Kasus", baseline: "0", t1: "0", t2: "0", t3: "0", t4: "0", t5: "0" },
  { no: 20, sektor: "Peternakan", indikator: "Penurunan Kematian Unggas AI", satuan: "Kasus", baseline: "0,50", t1: "0,45", t2: "0,40", t3: "0,35", t4: "0,30", t5: "0,25" },
  { no: 21, sektor: "Peternakan", indikator: "Produksi Daging", satuan: "Ton", baseline: "4.738,06", t1: "4.747,54", t2: "4.757,03", t3: "4.766,54", t4: "4.776,08", t5: "4.785,63" },
  { no: 22, sektor: "Peternakan", indikator: "Unit Pangan Hewan Pra-NKV", satuan: "Unit", baseline: "3", t1: "3", t2: "3", t3: "3", t4: "3", t5: "3" },
  { no: 23, sektor: "Perikanan", indikator: "Produksi Perikanan Budidaya", satuan: "Ton", baseline: "27.240", t1: "28.619", t2: "31.481", t3: "34.629", t4: "38.092", t5: "41.901" },
  { no: 24, sektor: "Perikanan", indikator: "Produksi Benih Ikan", satuan: "Ekor", baseline: "1.719.000.000", t1: "1.890.900.000", t2: "2.079.900.000", t3: "2.287.890.000", t4: "2.516.679.000", t5: "2.768.466.690" },
  { no: 25, sektor: "Perikanan", indikator: "Produksi Perikanan Tangkap", satuan: "Ton", baseline: "1.250", t1: "1.250", t2: "1.250", t3: "1.250", t4: "1.250", t5: "1.250" },
  { no: 26, sektor: "Pangan & Gizi", indikator: "Luas Lahan Tidur Tertanami", satuan: "Ha", baseline: "0", t1: "0", t2: "5", t3: "5", t4: "5", t5: "5" },
  { no: 27, sektor: "Pangan & Gizi", indikator: "Ketersediaan Pangan Utama", satuan: "Ton/Tahun", baseline: "123.433,99", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 28, sektor: "Pangan & Gizi", indikator: "Ketersediaan Energi & Protein", satuan: "%", baseline: "77", t1: "80", t2: "85", t3: "90", t4: "95", t5: "97" },
  { no: 29, sektor: "Pangan & Gizi", indikator: "Cadangan Pangan Kabupaten", satuan: "%", baseline: "15", t1: "17", t2: "19", t3: "21", t4: "23", t5: "23" },
  { no: 30, sektor: "Pangan & Gizi", indikator: "Stabilitas Harga Pangan Pokok", satuan: "%", baseline: "10", t1: "10", t2: "10", t3: "10", t4: "10", t5: "10" },
  { no: 31, sektor: "Pangan & Gizi", indikator: "Skor Pola Pangan Harapan (PPH)", satuan: "Nilai", baseline: "85", t1: "85", t2: "90", t3: "92", t4: "93", t5: "95" },
  { no: 32, sektor: "Pangan & Gizi", indikator: "Cakupan Mutu & Keamanan Pangan", satuan: "%", baseline: "75", t1: "75", t2: "77", t3: "80", t4: "82", t5: "85" },
  { no: 33, sektor: "Pangan & Gizi", indikator: "Pengawasan Pupuk & Pestisida", satuan: "Kegiatan", baseline: "1 monev, 4 rakor", t1: "1 monev, 4 rakor", t2: "1 monev, 4 rakor", t3: "1 monev, 4 rakor", t4: "1 monev, 4 rakor", t5: "1 monev, 4 rakor" },
  { no: 34, sektor: "Pangan & Gizi", indikator: "Persentase Penurunan Rawan Pangan", satuan: "%", baseline: "19", t1: "19", t2: "18", t3: "17", t4: "16", t5: "15" },
  { no: 35, sektor: "Tata Kelola", indikator: "Cakupan Bina Kelompok Tani", satuan: "%", baseline: "90,00", t1: "90,00", t2: "90,00", t3: "90,00", t4: "90,00", t5: "90,00" },
  { no: 36, sektor: "Tata Kelola", indikator: "Cakupan Bina Kelompok Pembudidaya Ikan", satuan: "%", baseline: "18,10", t1: "18,80", t2: "20,00", t3: "24,00", t4: "27,30", t5: "30,00" },
  { no: 37, sektor: "Tata Kelola", indikator: "Nilai Tukar Petani (NTP) Pertanian", satuan: "%", baseline: "102 s.d 103", t1: "102 s.d 103", t2: "103 s.d 104", t3: "103 s.d 104", t4: "103 s.d 104", t5: "103 s.d 105" },
  { no: 38, sektor: "Tata Kelola", indikator: "Pertumbuhan Sektor Pertanian", satuan: "%", baseline: "2,5 s.d 3,5", t1: "2,7 s.d 3,7", t2: "2,7 s.d 3,7", t3: "3 s.d 4", t4: "3 s.d 4", t5: "3 s.d 4" },
  { no: 39, sektor: "Tata Kelola", indikator: "Rumah Tangga Miskin Terfasilitasi", satuan: "RTM", baseline: "0", t1: "20", t2: "20", t3: "20", t4: "20", t5: "20" },
  { no: 40, sektor: "Tata Kelola", indikator: "Pelaksanaan Event Promosi", satuan: "Kali", baseline: "12", t1: "4", t2: "6", t3: "4", t4: "6", t5: "4" },
  { no: 41, sektor: "Perikanan", indikator: "Konsumsi Ikan Masyarakat", satuan: "kg/kap/thn", baseline: "20,04", t1: "21,30", t2: "21,50", t3: "21,70", t4: "21,90", t5: "22,50" },
  { no: 42, sektor: "Tata Kelola", indikator: "Survei Kepuasan Masyarakat (SKM)", satuan: "Nilai", baseline: "68,00", t1: "70,00", t2: "72,00", t3: "74,00", t4: "76,00", t5: "78,00" },
  { no: 43, sektor: "Tata Kelola", indikator: "Nilai Akuntabilitas Kinerja (SAKIP)", satuan: "Nilai (Predikat)", baseline: "48,00 (C)", t1: "53 (CC)", t2: "58 (CC)", t3: "63 (B)", t4: "68 (B)", t5: "73 (BB)" }
];

const programList2019 = [
  { no: 1, sektor: "Pangan & Gizi", indikator: "Ketersediaan Energi per Kapita", satuan: "kkal/kap/hari", baseline: "2.544", t1: "2.644", t2: "2.744", t3: "2.744", t4: "2.794", t5: "2.844" },
  { no: 2, sektor: "Pangan & Gizi", indikator: "Ketersediaan Protein per Kapita", satuan: "gr/kap/hari", baseline: "56,71", t1: "57,71", t2: "58,21", t3: "58,71", t4: "59,21", t5: "59,21" },
  { no: 3, sektor: "Pangan & Gizi", indikator: "Ketersediaan Pangan Utama Daerah", satuan: "Ton", baseline: "123.433,99", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 4, sektor: "Pangan & Gizi", indikator: "Pengawasan Pupuk dan Pestisida", satuan: "Monev/Rakor", baseline: "1 monev, 4 rakor", t1: "1 monev, 4 rakor", t2: "1 monev, 4 rakor", t3: "1 monev, 4 rakor", t4: "1 monev, 4 rakor", t5: "1 monev, 4 rakor" },
  { no: 5, sektor: "Tanaman Pangan", indikator: "Pemanfaatan Lahan Tidur untuk Pangan", satuan: "Ha", baseline: "0", t1: "0", t2: "5", t3: "5", t4: "5", t5: "5" },
  { no: 6, sektor: "Tata Kelola", indikator: "Promosi Pemasaran Hasil Pertanian", satuan: "Kali", baseline: "12", t1: "4", t2: "6", t3: "4", t4: "6", t5: "4" },
  { no: 7, sektor: "Horti & Perkebunan", indikator: "Teknologi Produksi Kopi", satuan: "Ton", baseline: "1.068,73", t1: "1.168,73", t2: "1.218,73", t3: "1.268,73", t4: "1.318,73", t5: "1.368,73" },
  { no: 8, sektor: "Horti & Perkebunan", indikator: "Teknologi Produksi Durian", satuan: "Ton", baseline: "3.975,00", t1: "4.382,44", t2: "4.601,56", t3: "4.831,64", t4: "5.073,22", t5: "5.323,88" },
  { no: 9, sektor: "Horti & Perkebunan", indikator: "Teknologi Produksi Cabai", satuan: "Ton", baseline: "17.500,00", t1: "19.000,00", t2: "20.280,00", t3: "21.450,00", t4: "22.900,00", t5: "24.274,00" },
  { no: 10, sektor: "Tanaman Pangan", indikator: "Produksi Padi Utama", satuan: "Ton", baseline: "158.078,16", t1: "158.868,55", t2: "159.662,89", t3: "160.461,21", t4: "161.263,51", t5: "162.069,83" },
  { no: 11, sektor: "Tanaman Pangan", indikator: "Produksi Jagung Utama", satuan: "Ton", baseline: "65.145,00", t1: "65.796,45", t2: "66.454,41", t3: "67.118,96", t4: "67.790,15", t5: "68.468,05" },
  { no: 12, sektor: "Horti & Perkebunan", indikator: "Produksi Lada Perkebunan", satuan: "Ton", baseline: "112,05", t1: "117,50", t2: "119,25", t3: "120,50", t4: "121,00", t5: "121,50" },
  { no: 13, sektor: "Tata Kelola", indikator: "Cakupan Bina Petani oleh Penyuluh", satuan: "%", baseline: "90,00", t1: "90,00", t2: "90,00", t3: "90,00", t4: "90,00", t5: "90,00" },
  { no: 14, sektor: "Peternakan", indikator: "Pencegahan Status Bebas 4 Zoonosis", satuan: "Kasus", baseline: "0", t1: "0", t2: "0", t3: "0", t4: "0", t5: "0" },
  { no: 15, sektor: "Peternakan", indikator: "Pengembangan Populasi Domba Batur", satuan: "Ekor", baseline: "8.250", t1: "8.500", t2: "8.750", t3: "9.000", t4: "9.250", t5: "9.500" },
  { no: 16, sektor: "Peternakan", indikator: "Pengembangan Populasi Sapi", satuan: "Ekor", baseline: "31.318", t1: "31.506", t2: "31.695", t3: "31.885", t4: "32.076", t5: "32.269" },
  { no: 17, sektor: "Perikanan", indikator: "Budidaya dan Benih Ikan Air Tawar", satuan: "Ton", baseline: "27.240", t1: "28.619", t2: "31.481", t3: "34.629", t4: "38.092", t5: "41.901" }
];

// Helper gaya badge sektor terstandarisasi (design-system.md)
function getSectorBadge(sektor) {
  const s = (sektor || "").toLowerCase();
  if (s.includes("pangan") && !s.includes("tanaman")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200", children: sektor });
  }
  if (s.includes("tanaman")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200", children: sektor });
  }
  if (s.includes("peternakan")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200", children: sektor });
  }
  if (s.includes("perikanan")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200", children: sektor });
  }
  if (s.includes("horti") || s.includes("kebun")) {
    return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200", children: sektor });
  }
  return (0, p.jsx)("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200", children: sektor });
}

// =========================================================================
// KOMPONEN UNIFIED: RENSTRA VIEW (Digunakan untuk 2025–2029 dan 2019–2022)
// =========================================================================
function RenstraView({ periode }) {
  const is2025 = periode === "2025-2029";
  const [activeTab, setActiveTab] = (0, f.useState)("sasaran");
  const [selectedSektor, setSelectedSektor] = (0, f.useState)("semua");
  const [searchQuery, setSearchQuery] = (0, f.useState)("");
  const [remoteData, setRemoteData] = (0, f.useState)(null);

  // Fallback data lokal faktual
  const defaultSasaran = is2025 ? ikuList2025 : sasaranList2019;
  const defaultProgram = is2025 ? ikkList2025 : programList2019;

  // Fetch data dinamis dari REST API
  (0, f.useEffect)(() => {
    let active = true;
    const apiUrl = `/api/v1/renstra/target?periode=${periode}`;
    fetch(apiUrl)
      .then(res => res.json())
      .then(json => {
        if (active && json && Array.isArray(json.data) && json.data.length > 0) {
          const formatted = json.data.map(item => ({
            no: item.no_urut,
            sektor: item.kategori_sektor,
            indikator: item.indikator,
            satuan: item.satuan,
            baseline: item.baseline_nilai || "-",
            t1: item.t1 || "-",
            t2: item.t2 || "-",
            t3: item.t3 || "-",
            t4: item.t4 || "-",
            t5: item.t5 || "-",
            t6: item.t6 || null,
            jenis: (item.jenis_tabel || "").toUpperCase()
          }));
          setRemoteData(formatted);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [periode]);

  // Pisahkan sasaran vs program
  const currentDataset = (0, f.useMemo)(() => {
    if (remoteData && remoteData.length > 0) {
      if (is2025) {
        return activeTab === "sasaran"
          ? remoteData.filter(d => d.jenis === "IKU")
          : remoteData.filter(d => d.jenis === "IKK");
      } else {
        return activeTab === "sasaran"
          ? remoteData.filter(d => d.jenis === "SASARAN_RENSTRA")
          : remoteData.filter(d => d.jenis === "PROGRAM_RPJMD");
      }
    }
    return activeTab === "sasaran" ? defaultSasaran : defaultProgram;
  }, [remoteData, activeTab, is2025, defaultSasaran, defaultProgram]);

  // Filter Sektor & Search Query
  const filteredData = (0, f.useMemo)(() => {
    return currentDataset.filter(item => {
      const matchSektor = selectedSektor === "semua" || item.sektor.toLowerCase().includes(selectedSektor.toLowerCase());
      const matchQuery = !searchQuery || item.indikator.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSektor && matchQuery;
    });
  }, [currentDataset, selectedSektor, searchQuery]);

  const totalSasaran = is2025 ? 9 : 43;
  const totalProgram = is2025 ? 18 : 17;

  return (0, p.jsxs)("div", {
    className: "flex flex-col gap-6",
    children: [
      // 1. TOP METRIC CARDS (3 Kartu Identik)
      (0, p.jsxs)("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
        children: [
          (0, p.jsxs)("div", {
            className: "bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs text-left",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Indikator Sasaran" }),
                  (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center", children: (0, p.jsx)(e, { className: "w-4 h-4" }) })
                ]
              }),
              (0, p.jsxs)("div", { className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums", children: [totalSasaran, " Indikator"] }),
              (0, p.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: is2025 ? "Sasaran kinerja utama dinas (Tabel 4.5)" : "Indikator sasaran daerah & komoditas (Tabel 4.1)" })
            ]
          }),
          (0, p.jsxs)("div", {
            className: "bg-white border border-slate-200 border-l-4 border-l-blue-700 rounded-lg p-5 shadow-xs text-left",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Indikator Program" }),
                  (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center", children: (0, p.jsx)(a, { className: "w-4 h-4" }) })
                ]
              }),
              (0, p.jsxs)("div", { className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums", children: [totalProgram, " Indikator"] }),
              (0, p.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: is2025 ? "Target indikator kinerja kunci (Tabel 4.7)" : "Indikator program urusan RPJMD (Tabel 7.2)" })
            ]
          }),
          (0, p.jsxs)("div", {
            className: "bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-5 shadow-xs text-left",
            children: [
              (0, p.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, p.jsx)("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Periode Dokumen" }),
                  (0, p.jsx)("span", { className: "w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center", children: (0, p.jsx)(i, { className: "w-4 h-4" }) })
                ]
              }),
              (0, p.jsx)("div", { className: "text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums", children: is2025 ? "2025–2029" : "2019–2022" }),
              (0, p.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: is2025 ? "Penjabaran RPJMD 2025–2029" : "Penggabungan OPD & Permendagri 90/2019" })
            ]
          })
        ]
      }),

      // 2. STRATEGIC PILLARS (Grid 4 Kotak)
      (0, p.jsxs)("div", {
        className: "print-block bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs text-left",
        children: [
          (0, p.jsxs)("h3", {
            className: "text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2",
            children: [
              (0, p.jsx)(s, { size: 18, className: "text-emerald-700" }),
              is2025 ? "Sasaran Strategis Renstra 2025–2029" : "Sasaran Strategis Renstra 2019–2022"
            ]
          }),
          (0, p.jsxs)("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5",
            children: [
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "01" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Ketahanan Pangan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Target Skor PPH 94,05 dan Indeks Ketahanan Pangan (IKP) 82,29." : "Target Skor PPH 95, cadangan pangan 23%, dan ketersediaan 162.069 ton." })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "02" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Pertanian & Peternakan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Laju produksi pangan, hortikultura, perkebunan, dan kenaikan populasi ternak." : "Produksi komoditas fisik: Padi, Kentang, Salak, Kopi, dan Domba Batur." })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "03" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Produksi Perikanan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Peningkatan produksi budidaya (42 rb ton), benih, dan hilirisasi olahan ikan." : "Peningkatan perikanan budidaya (41,9 rb ton) dan benih (2,76 miliar ekor)." })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "p-4 rounded-lg border border-slate-200 bg-slate-50/60",
                children: [
                  (0, p.jsxs)("div", {
                    className: "flex items-center gap-2 mb-1.5",
                    children: [
                      (0, p.jsx)("span", { className: "w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center", children: "04" }),
                      (0, p.jsx)("span", { className: "font-semibold text-xs text-slate-900", children: "Tata Kelola & Layanan" })
                    ]
                  }),
                  (0, p.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: is2025 ? "Target nilai SAKIP 74,60 dan Indeks Pelayanan Publik (IPP) 3,63." : "Target SAKIP predikat BB (73), SKM 78, dan Nilai Tukar Petani (NTP) 105." })
                ]
              })
            ]
          })
        ]
      }),

      // 3. TABEL MATRIKS TARGET MULTI-TAHUN TERPADU
      (0, p.jsxs)("div", {
        className: "print-block bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden text-left",
        children: [
          (0, p.jsxs)("div", {
            className: "p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3",
            children: [
              (0, p.jsxs)("div", {
                children: [
                  (0, p.jsx)("h3", {
                    className: "text-sm sm:text-base font-bold text-slate-900",
                    children: is2025 ? "Matriks Target Kinerja 2025–2029" : "Matriks Target Kinerja 2019–2022"
                  }),
                  (0, p.jsx)("p", {
                    className: "text-xs text-slate-500 mt-0.5",
                    children: activeTab === "sasaran"
                      ? (is2025 ? "Indikator Sasaran Kinerja Utama (IKU Dinas — Tabel 4.5)" : "Indikator Sasaran & Komoditas Fisik Renstra (Tabel 4.1)")
                      : (is2025 ? "Indikator Kinerja Kunci Program (IKK — Tabel 4.7)" : "Indikator Program Urusan Penyelenggaraan RPJMD (Tabel 7.2)")
                  })
                ]
              }),
              (0, p.jsxs)("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  (0, p.jsxs)("div", {
                    className: "inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold",
                    children: [
                      (0, p.jsx)("button", {
                        type: "button",
                        onClick: () => setActiveTab("sasaran"),
                        className: activeTab === "sasaran"
                          ? "px-3 py-1 rounded-md bg-white text-emerald-800 shadow-2xs font-bold"
                          : "px-3 py-1 text-slate-600 hover:text-slate-900",
                        children: "Indikator Sasaran"
                      }),
                      (0, p.jsx)("button", {
                        type: "button",
                        onClick: () => setActiveTab("program"),
                        className: activeTab === "program"
                          ? "px-3 py-1 rounded-md bg-white text-emerald-800 shadow-2xs font-bold"
                          : "px-3 py-1 text-slate-600 hover:text-slate-900",
                        children: "Indikator Program"
                      })
                    ]
                  }),
                  (0, p.jsxs)("select", {
                    "aria-label": "Filter Sektor",
                    value: selectedSektor,
                    onChange: e => setSelectedSektor(e.target.value),
                    className: "bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer",
                    children: [
                      (0, p.jsx)("option", { value: "semua", children: "Semua Sektor" }),
                      (0, p.jsx)("option", { value: "pangan", children: "Pangan & Gizi" }),
                      (0, p.jsx)("option", { value: "tanaman", children: "Tanaman Pangan" }),
                      (0, p.jsx)("option", { value: "horti", children: "Hortikultura & Kebun" }),
                      (0, p.jsx)("option", { value: "peternakan", children: "Peternakan" }),
                      (0, p.jsx)("option", { value: "perikanan", children: "Perikanan" }),
                      (0, p.jsx)("option", { value: "tata kelola", children: "Tata Kelola / Layanan" })
                    ]
                  }),
                  (0, p.jsx)("input", {
                    type: "text",
                    placeholder: "Cari indikator...",
                    value: searchQuery,
                    onChange: e => setSearchQuery(e.target.value),
                    className: "bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-36"
                  })
                ]
              })
            ]
          }),

          // Tabel Responsif
          (0, p.jsx)("div", {
            key: `table-wrap-${periode}-${activeTab}-${selectedSektor}`,
            className: "overflow-x-auto",
            children: (0, p.jsxs)("table", {
              className: "w-full text-left text-xs border-collapse min-w-[760px]",
              children: [
                (0, p.jsx)("thead", {
                  children: (0, p.jsxs)("tr", {
                    className: "border-b border-slate-200 bg-slate-50/80 text-slate-600",
                    children: [
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] w-12 text-center", children: "No" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Sektor" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px]", children: "Indikator Kinerja" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-center", children: "Satuan" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right bg-slate-100/70", children: is2025 ? "2024" : "2017" }),
                      (0, p.jsx)("th", { className: `p-3 font-bold uppercase tracking-wider text-[11px] text-right ${is2025 ? "bg-emerald-50/80 text-emerald-800" : ""}`, children: is2025 ? "2025" : "2018" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "2026" : "2019" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "2027" : "2020" }),
                      (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right", children: is2025 ? "2028" : "2021" }),
                      (0, p.jsx)("th", { className: `p-3 font-bold uppercase tracking-wider text-[11px] text-right ${is2025 ? "bg-blue-50/60 text-blue-900 font-bold" : "bg-emerald-50/80 text-emerald-900 font-bold"}`, children: is2025 ? "2029" : "2022" }),
                      is2025 && (0, p.jsx)("th", { className: "p-3 font-bold uppercase tracking-wider text-[11px] text-right text-slate-400", children: "2030" })
                    ].filter(Boolean)
                  })
                }),
                (0, p.jsx)("tbody", {
                  className: "divide-y divide-slate-100",
                  children: filteredData.length === 0 ? (
                    (0, p.jsx)("tr", {
                      children: (0, p.jsx)("td", {
                        colSpan: is2025 ? 11 : 10,
                        className: "p-8 text-center text-slate-500 text-xs italic",
                        children: "Tidak ada indikator yang sesuai dengan filter pencarian."
                      })
                    })
                  ) : (
                    filteredData.map((item, idx) => (0, p.jsxs)("tr", {
                      key: `row-${item.no}-${idx}`,
                      className: "hover:bg-slate-50/80 transition-colors",
                      children: [
                        (0, p.jsx)("td", { className: "p-3 text-center font-bold text-slate-500 tabular-nums", children: item.no }),
                        (0, p.jsx)("td", { className: "p-3 font-semibold", children: getSectorBadge(item.sektor) }),
                        (0, p.jsx)("td", { className: "p-3 font-semibold text-slate-900", children: item.indikator }),
                        (0, p.jsx)("td", { className: "p-3 text-center font-medium text-slate-500 text-[11px]", children: item.satuan }),
                        (0, p.jsx)("td", { className: "p-3 text-right font-medium text-slate-700 tabular-nums bg-slate-50/50", children: item.baseline }),
                        (0, p.jsx)("td", { className: `p-3 text-right tabular-nums ${is2025 ? "font-bold text-emerald-800 bg-emerald-50/40" : "font-medium text-slate-600"}`, children: item.t1 }),
                        (0, p.jsx)("td", { className: "p-3 text-right font-medium text-slate-600 tabular-nums", children: item.t2 }),
                        (0, p.jsx)("td", { className: "p-3 text-right font-medium text-slate-600 tabular-nums", children: item.t3 }),
                        (0, p.jsx)("td", { className: "p-3 text-right font-medium text-slate-600 tabular-nums", children: item.t4 }),
                        (0, p.jsx)("td", { className: `p-3 text-right font-bold tabular-nums ${is2025 ? "text-blue-900 bg-blue-50/30" : "text-emerald-900 bg-emerald-50/40"}`, children: item.t5 }),
                        is2025 && (0, p.jsx)("td", { className: "p-3 text-right font-normal text-slate-400 tabular-nums", children: item.t6 || "-" })
                      ].filter(Boolean)
                    }))
                  )
                })
              ]
            })
          })
        ]
      }),

      // 4. SUMBER DOKUMEN & TAUTAN UNDUH (Footer Card)
      (0, p.jsxs)("div", {
        className: "print-block bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs text-left",
        children: [
          (0, p.jsx)("h3", {
            className: "text-sm sm:text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4",
            children: "Sumber Dokumen Resmi"
          }),
          (0, p.jsxs)("ul", {
            className: "space-y-3 text-xs text-slate-600 leading-relaxed",
            children: [
              (0, p.jsxs)("li", {
                className: "flex items-start gap-2.5",
                children: [
                  (0, p.jsx)(r, { size: 14, className: "text-emerald-600 mt-0.5 shrink-0" }),
                  (0, p.jsx)("span", {
                    children: is2025
                      ? "Data merujuk dokumen Rencana Strategis Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2025–2029 (penjabaran RPJMD 2025–2029)."
                      : "Data merujuk dokumen Rencana Strategis Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2019–2022 (Perda No. 9/2018 & Permendagri No. 90/2019)."
                  })
                ]
              }),
              (0, p.jsxs)("li", {
                className: "flex items-start gap-2.5 pt-2 border-t border-slate-100",
                children: [
                  (0, p.jsx)(s, { size: 14, className: "text-slate-400 mt-0.5 shrink-0" }),
                  (0, p.jsxs)("span", {
                    className: "text-slate-500 text-[11px]",
                    children: [
                      "Tautan berkas resmi: ",
                      (0, p.jsx)("a", {
                        href: is2025 ? "/renstra-2025-2029.pdf" : "/renstra.pdf",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-emerald-700 font-semibold underline hover:text-emerald-800",
                        children: is2025 ? "Renstra 2025–2029 (PDF)" : "Renstra 2019–2022 (PDF)"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

// =========================================================================
// MAIN PAGE COMPONENT: RENSTRA & RKPD
// =========================================================================
function RenstraPage() {
  const [selectedPeriod, setSelectedPeriod] = (0, f.useState)("2025-2029");
  const downloadPdfHref = selectedPeriod === "2025-2029" ? "/renstra-2025-2029.pdf" : "/renstra.pdf";

  return (0, p.jsx)(n, {
    children: (0, p.jsxs)("section", {
      className: "flex flex-col gap-6 py-2 text-left notranslate",
      translate: "no",
      children: [
        // Header Halaman Terpadu
        (0, p.jsxs)("header", {
          className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5",
          children: [
            (0, p.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [
                (0, p.jsx)("h1", {
                  className: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight",
                  children: "Renstra & RKPD"
                }),
                (0, p.jsx)("p", {
                  className: "text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-3xl mt-1",
                  children: selectedPeriod === "2025-2029"
                    ? "Target Kinerja Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2025–2029"
                    : "Target Kinerja Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara 2019–2022"
                })
              ]
            }),
            (0, p.jsxs)("div", {
              className: "flex flex-wrap items-center gap-2.5 shrink-0",
              children: [
                (0, p.jsxs)("div", {
                  className: "flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs",
                  children: [
                    (0, p.jsx)("span", { className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wide", children: "Periode:" }),
                    (0, p.jsxs)("select", {
                      "aria-label": "Pilih Periode Renstra",
                      value: selectedPeriod,
                      onChange: e => setSelectedPeriod(e.target.value),
                      className: "bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer pr-1",
                      children: [
                        (0, p.jsx)("option", { value: "2025-2029", children: "Renstra 2025–2029" }),
                        (0, p.jsx)("option", { value: "2019-2022", children: "Renstra 2019–2022" })
                      ]
                    })
                  ]
                }),
                (0, p.jsxs)("a", {
                  href: downloadPdfHref,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-all shadow-2xs",
                  children: [
                    (0, p.jsx)(s, { size: 14 }),
                    "Unduh Dokumen"
                  ]
                }),
                (0, p.jsxs)("button", {
                  onClick: () => window.print(),
                  className: "inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs transition-all",
                  children: [
                    (0, p.jsx)(c, { size: 14 }),
                    "Cetak Laporan"
                  ]
                })
              ]
            })
          ]
        }),

        // Unified View Component
        (0, p.jsx)(RenstraView, { key: `view-${selectedPeriod}`, periode: selectedPeriod })
      ]
    })
  });
}

export { RenstraPage as default };
