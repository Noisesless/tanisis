/**
 * lib/domains.js — konfigurasi domain data untuk dasbor admin
 * (template/export/import Excel) + loader kolom dinamis dari information_schema.
 *
 * Prinsip:
 *  - Kolom Excel dibaca dinamis dari DB (selalu sinkron dengan skema).
 *  - Kolom teknis di-skip: id, kecamatan_id (diganti kolom "Kecamatan"),
 *    desa_norm (auto-generate), created_at/updated_at, sumber (auto 'manual').
 *  - Tipe json/longtext di-skip (data kompleks — mis. st2023_desa.ternak).
 *  - key = natural key upsert; baris dengan kombinasi kunci sama → UPDATE.
 *  - Normalisasi nama kecamatan/desa = cermin database/import/lib.mjs (normKey,
 *    alias Purwareja Klampok/Purwanegara/Wanadadi; desa_norm = UPPERCASE).
 *
 * Tabel infrastruktur yang TIDAK dikelola via dasbor (by design):
 *   kecamatan, desa, dataset_sumber, sync_log (referensi/metadata),
 *   kth_detail (FK kompleks — TODO), lahan_desa (kolom json/longtext).
 */
import { q } from "../db.js";
import fs from "node:fs";

// Kolom teknis yang tidak pernah muncul di Excel
const SKIP_COLS = new Set(["id", "kecamatan_id", "desa_id", "desa_norm", "created_at", "updated_at", "sumber"]);
// Tipe data yang tidak diedit via Excel
const SKIP_TYPES = new Set(["json", "longtext"]);

// Label ramah admin untuk kolom yang sering muncul (sisanya derivasi otomatis)
const LABELS = {
  kecamatan: "Kecamatan", desa: "Desa", tahun: "Tahun", jenis: "Jenis",
  komoditas: "Komoditas", kelompok: "Kelompok", tanaman: "Tanaman", kategori: "Kategori",
  wilayah: "Wilayah", arah: "Arah (Masuk/Keluar)", lokasi: "Lokasi (RPH)",
  obyek: "Obyek", tempat: "Tempat", jenis_alat: "Jenis Alat", jenis_budidaya: "Jenis Budidaya",
  nama: "Nama Program", sumber_dana: "Sumber Dana (APBD/APBN)", nilai_rupiah: "Nilai (Rupiah)",
  sektor: "Sektor", penerima_jumlah: "Jumlah Penerima", penerima_jenis: "Jenis Penerima",
  dampak_level: "Tingkat Dampak", dampak_catatan: "Catatan Dampak",
  apbd_miliar: "APBD (Miliar Rp)", apbn_miliar: "APBN (Miliar Rp)",
  bantuan_miliar: "Bantuan (Miliar Rp)", kenaikan_produksi_pct: "Kenaikan Produksi (%)",
  produksi_ton: "Produksi (Ton)", produksi_kg: "Produksi (Kg)", nilai_ribu_rp: "Nilai (Ribu Rp)",
  luas_ha: "Luas (Ha)", luas_panen_ha: "Luas Panen (Ha)", rata_ku_ha: "Rata-rata (Ku/Ha)",
  jumlah: "Jumlah Unit", jumlah_ekor: "Jumlah (Ekor)", luas_m2: "Luas (M²)",
  luas_tambahan: "Luas Tambahan (Ha)", volume_kg: "Volume (Kg)",
  lumbung_unit: "Lumbung (Unit)", lumbung_kapasitas_ton: "Kapasitas Lumbung (Ton)",
  gudang_luas_m2: "Luas Gudang (M²)", gudang_kapasitas_ton_bulan: "Kapasitas Gudang (Ton/Bulan)",
  inflasi_pct: "Inflasi (%)", indikator: "Indikator", target: "Target",
  tahun_target: "Tahun Target", sumber_dokumen: "Sumber Dokumen",
  kelompok_tani: "Kelompok Tani", anggota_tani: "Anggota Tani",
  kelompok_perikanan: "Kelompok Perikanan", anggota_perikanan: "Anggota Perikanan",
  gapoktan: "Gapoktan", anggota_gapoktan: "Anggota Gapoktan",
  kth: "KTH", kth_pemula: "KTH Pemula", kth_madya: "KTH Madya", kth_utama: "KTH Utama",
  rumah_tangga_petani: "Rumah Tangga Petani", petani: "Petani",
  rt_anggota_kelompok: "RT Anggota Kelompok", rt_bukan_anggota_kelompok: "RT Bukan Anggota Kelompok",
  rtup: "RTUP", rt_perikanan: "RT Perikanan",
  rt_perikanan_budidaya: "RT Perikanan Budidaya", rt_perikanan_tangkap: "RT Perikanan Tangkap",
  nilai: "Nilai", satuan: "Satuan",
  bidang: "Bidang", volume: "Volume", harga_produsen: "Harga Produsen (Rp)",
  triwulan: "Triwulan (1-4; kosong = tahunan)",
  nama_kelompok: "Nama Kelompok", jumlah_anggota: "Jumlah Anggota",
  produk_andalan: "Produk Andalan", tahun_registrasi: "Tahun Registrasi",
  varietas: "Varietas", produktivitas: "Produktivitas (Kg/Ha)",
  produksi: "Produksi (Ton)", ketersediaan_benih: "Ketersediaan Benih", luas_lahan: "Luas Lahan (Ha)",
  luas_rencana: "Luas Rencana (Ha)", luas_tanam: "Luas Tanam (Ha)", luas_panen: "Luas Panen (Ha)",
  produksi_rencana: "Produksi Rencana (Ton)", produksi_aktual: "Produksi Aktual (Ton)",
  bulan_mulai: "Bulan Mulai", bulan_panen: "Bulan Panen",
  jenis_lembaga: "Jenis Lembaga",
  id_simluhtan: "ID Simluhtan",
  no_sk_pengukuhan: "No. SK Pengukuhan",
  nama_ketua: "Nama Ketua",
  kontak_hp: "Kontak HP / WA",
  kelas_kemampuan: "Kelas Kemampuan",
  subsektor_utama: "Subsektor Utama",
  status_aktif: "Status Aktif",
  tahun_berdiri: "Tahun Berdiri",
  id_kusuka: "ID KUSUKA KKP",
  nama_lengkap: "Nama Lengkap",
  nik: "NIK",
  no_sertifikat_halal: "No. Sertifikat Halal",
  lembaga_penerbit: "Lembaga Penerbit Sertifikat",
  unit_tugas: "Unit Tugas / RPH-RPU",
  status_sertifikasi: "Status Sertifikasi",
  tahun_kelulusan: "Tahun Kelulusan / Pelatihan",
  nama_p4s: "Nama P4S",
  pengelola: "Pengelola / Pimpinan",
  bidang_kejuruan: "Bidang Kejuruan / Pelatihan",
  klasifikasi_akreditasi: "Klasifikasi Akreditasi",
  no_register_bppsdmp: "No. Register BPPSDMP",
  nama_upja: "Nama UPJA",
  manajer: "Nama Manajer UPJA",
  gapoktan_induk: "Gapoktan Induk",
  jenis_alsintan_dikelola: "Jenis Alsintan Dikelola",
  jumlah_alsintan: "Jumlah Alsintan (Unit)",
  status_operasional: "Status Operasional",
  nama_kep: "Nama KEP",
  bpp: "Nama BPP",
  bentuk_kep: "Bentuk Badan Usaha",
  dasar_hukum: "Dasar Hukum Pembentukan",
  ada_struktur: "Struktur Organisasi (Ada/Tidak)",
  ada_ad_art: "AD/ART (Ada/Tidak)",
  jumlah_pengurus: "Jumlah Pengurus",
  poktan_terlibat: "Jumlah Poktan Terlibat",
  modal_usaha_aset: "Modal Usaha / Aset (Rp)",
  nama_posluhdes: "Nama Posluhdes",
  nama_pimpinan: "Pimpinan Posluhdes",
  no_ba_pengukuhan: "No. BA / SK Pengukuhan",
  penyuluh_swadaya: "Penyuluh Swadaya",
  nama_penyuluh: "Nama Penyuluh Swadaya",
  tempat_tgl_lahir: "Tempat / Tgl Lahir",
  unit_kerja: "Unit Kerja (BPP)",
  wilayah_kerja: "Wilayah Kerja (Desa)",
  keterangan: "Keterangan",
  tanggal_uji: "Tanggal Uji",
  parameter_uji: "Parameter Uji",
  hasil_uji: "Hasil Uji Lab",
  no_registrasi: "No. Registrasi PDUK",
  nama_pedagang: "Nama Pedagang",
  ketersediaan_bersih_ton: "Ketersediaan Bersih (Ton)",
  kebutuhan_konsumsi_ton: "Kebutuhan Konsumsi (Ton)",
  neraca_ton: "Neraca (Ton)",
  status_neraca: "Status Neraca",
  nomor_indikator: "Nomor Indikator",
  nama_indikator: "Nama Indikator FSVA",
  nilai_capaian: "Nilai Capaian",
  standar_norma: "Standar Norma",
  status_data: "Status Data",
  sumber_opd: "Sumber OPD",
  pilar: "Pilar FSVA",
  lokasi_pasar: "Lokasi / Nama Pasar",
  perubahan_rp: "Perubahan Harga (Rp)",
  status_pantau: "Status Pantau",
  petugas_pencatat: "Petugas Pencatat",
  harga: "Harga per Satuan (Rp)",
  tanggal: "Tanggal Catat",
};

// Suffix kolom → satuan pada label
const SUFFIX_LABELS = { _pct: " (%)", _ton: " (Ton)", _kg: " (Kg)", _ha: " (Ha)", _m2: " (M²)", _ribu_rp: " (Ribu Rp)", _ekor: " (Ekor)" };

export const DOMAINS = {
  "bantuan-program": {
    label: "Bantuan — Program",
    desc: "Program bantuan pemerintah: nama, sumber dana, nominal, penerima, dan dampak.",
    sheets: [{ table: "bantuan_program", name: "Program", kecamatan: false, key: ["nama", "sumber_dana", "tahun_anggaran"], enums: { sumber_dana: ["APBD", "APBN"], dampak_level: ["Tinggi", "Sedang", "Rendah"] } }],
  },
  "bantuan-alokasi": {
    label: "Bantuan — Alokasi Tahunan",
    desc: "Alokasi anggaran bantuan APBD & APBN per tahun (miliar rupiah).",
    sheets: [{ table: "bantuan_alokasi", name: "Alokasi", kecamatan: false, key: ["tahun"] }],
  },
  "bantuan-korelasi": {
    label: "Bantuan — Korelasi Sektor",
    desc: "Korelasi nilai bantuan vs kenaikan produksi per sektor.",
    sheets: [{ table: "bantuan_korelasi", name: "Korelasi", kecamatan: false, key: ["sektor"] }],
  },
  padi: {
    label: "Padi",
    desc: "Produksi padi (sawah & ladang) per kecamatan per tahun.",
    sheets: [{ table: "padi_produksi", name: "Padi", kecamatan: true, key: ["kecamatan", "tahun", "jenis"] }],
  },
  palawija: {
    label: "Palawija",
    desc: "Produksi palawija per kecamatan, komoditas, dan tahun.",
    sheets: [{ table: "palawija_produksi", name: "Palawija", kecamatan: true, key: ["kecamatan", "tahun", "komoditas"] }],
  },
  hortikultura: {
    label: "Hortikultura",
    desc: "Luas & produksi hortikultura (sayuran/buah) per kecamatan dan agregat kabupaten.",
    sheets: [
      { table: "horti_luas", name: "Luas per Kecamatan", kecamatan: true, key: ["kecamatan", "kelompok", "komoditas", "tahun"] },
      { table: "horti_produksi", name: "Produksi per Kecamatan", kecamatan: true, key: ["kecamatan", "kelompok", "komoditas", "tahun"] },
      { table: "horti_luas_kabupaten", name: "Luas Kabupaten", kecamatan: false, key: ["kelompok", "komoditas", "tahun"] },
      { table: "horti_produksi_kabupaten", name: "Produksi Kabupaten", kecamatan: false, key: ["kelompok", "komoditas", "tahun"] },
    ],
  },
  perkebunan: {
    label: "Perkebunan",
    desc: "Areal & produksi perkebunan per kecamatan dan agregat kabupaten.",
    sheets: [
      { table: "perkebunan_areal", name: "Areal per Kecamatan", kecamatan: true, key: ["kecamatan", "tanaman", "tahun"] },
      { table: "perkebunan_produksi", name: "Produksi per Kecamatan", kecamatan: true, key: ["kecamatan", "tanaman", "tahun"] },
      { table: "perkebunan_produksi_kabupaten", name: "Produksi Kabupaten", kecamatan: false, key: ["tanaman", "tahun"] },
    ],
  },
  peternakan: {
    label: "Peternakan & Keswan",
    desc: "Populasi ternak, produksi daging/telur/susu/kulit terpilah, HPT, UMKM pakan, poultry shop, NKV, aliran ternak, dan pemotongan RPH.",
    sheets: [
      {
        table: "ternak_populasi",
        name: "Populasi",
        kecamatan: true,
        key: ["kecamatan", "kelompok", "jenis", "tahun"],
        enums: { jenis: ["Sapi Potong", "Sapi Perah", "Kerbau", "Kuda", "Kambing", "Domba", "Domba Batur", "Kelinci", "Babi", "Ayam Kampung", "Ayam Broiler", "Ayam Ras Layer", "Itik Biasa", "Itik Manila", "Burung Puyuh"] },
        labels: { jumlah_ekor: "Banyaknya Populasi (Ekor)" },
      },
      {
        table: "ternak_daging",
        name: "Daging",
        kecamatan: true,
        key: ["kecamatan", "kelompok", "jenis", "tahun"],
        enums: { jenis: ["Sapi", "Kerbau", "Kambing", "Domba", "Ayam Broiler", "Ayam Kampung", "Itik", "Puyuh", "Kelinci"] },
        labels: { produksi_kg: "Produksi (Kg)" },
      },
      {
        table: "ternak_telur",
        name: "Telur",
        kecamatan: true,
        key: ["kecamatan", "jenis", "tahun"],
        enums: { jenis: ["Ayam Ras Layer", "Ayam Kampung", "Itik", "Puyuh"] },
        labels: { produksi_kg: "Produksi (Butir / Kg)" },
      },
      {
        table: "ternak_susu_kulit",
        name: "Susu & Kulit",
        kecamatan: true,
        key: ["kecamatan", "jenis", "tahun"],
        enums: { jenis: ["Kulit Sapi", "Kulit Kerbau", "Kulit Kambing", "Kulit Domba", "Kulit Kelinci", "Susu Sapi Segar", "Susu Kambing", "Wol Domba Batur", "Tulang & Tanduk"] },
        labels: { nilai: "Banyaknya / Jumlah (Lembar / Liter / Kg)" },
      },
      {
        table: "ternak_hpt",
        name: "Lahan HPT",
        kecamatan: true,
        key: ["kecamatan", "jenis_hijauan", "tahun"],
        enums: { jenis_hijauan: ["Rumput Odot", "Rumput Gajah", "Pakchong", "Indigofera", "Zanzibar", "Lainnya"] },
        labels: { luas_ha: "Luas (Ha)", produksi_ton: "Produksi (Ton)", kapasitas_st: "Kapasitas (ST)" },
      },
      {
        table: "ternak_umkm_pakan",
        name: "UMKM Pakan Ternak",
        kecamatan: true,
        key: ["kecamatan", "nama_usaha", "tahun"],
        labels: { nama_usaha: "Nama Pelaku Usaha / Poktan", jenis_pakan: "Jenis Pakan (Silase/Konsentrat/Fermentasi)", kapasitas_ton_bulan: "Kapasitas (Ton/Bulan)" },
      },
      {
        table: "ternak_poultry_shop",
        name: "Toko & Poultry Shop",
        kecamatan: true,
        key: ["kecamatan", "nama_toko", "tahun"],
        labels: { nama_toko: "Nama Toko / Kios Sapronak", jenis_layanan: "Layanan (Pakan/Obat/Vaksin/Peralatan)", koordinat: "Titik Koordinat GPS" },
      },
      {
        table: "ternak_nkv",
        name: "Unit Usaha Ber-NKV",
        kecamatan: true,
        key: ["kecamatan", "nama_unit_usaha", "tahun"],
        labels: { nama_unit_usaha: "Nama Unit Usaha", nomor_nkv: "Nomor Sertifikat NKV", kategori: "Kategori (RPH/Kios/Budidaya)", status_verifikasi: "Status (Registrasi/Sertifikat Tingkat I-III)" },
      },
      { table: "ternak_flow", name: "Aliran Ternak", kecamatan: true, key: ["kecamatan", "arah", "jenis", "tahun"] },
      { table: "ternak_pemotongan", name: "Pemotongan RPH", kecamatan: true, key: ["kecamatan", "lokasi", "jenis", "tahun"] },
    ],
  },
  perikanan: {
    label: "Perikanan",
    desc: "Produksi tangkap/budidaya/benih, 10 jenis ikan definitif, ikan hias, luas kolam-waduk-minapadi, dan tempat pemeliharaan.",
    sheets: [
      {
        table: "ikan_tangkap",
        name: "Tangkap per Alat",
        kecamatan: true,
        key: ["kecamatan", "jenis_alat", "tahun"],
        enums: { jenis_alat: ["Jala Tebar", "Pancing", "Jaring Insang", "Bubu", "Lainnya"] },
      },
      { table: "ikan_tangkap_perairan_umum", name: "Tangkap Perairan Umum", kecamatan: true, key: ["kecamatan", "tahun"] },
      {
        table: "ikan_budidaya",
        name: "Budidaya",
        kecamatan: true,
        key: ["kecamatan", "jenis_budidaya", "tahun"],
        enums: { jenis_budidaya: ["Kolam Pembesaran", "Karamba Jaring Apung", "Mina Padi Tumpang Sari", "Mina Padi Penyelang"] },
      },
      {
        table: "ikan_produksi_jenis",
        name: "10 Jenis Ikan",
        kecamatan: false,
        key: ["tahun", "jenis_ikan"],
        enums: { jenis_ikan: ["Bawal", "Gurami", "Lele", "Ikan Mas", "Mujair", "Nila", "Nilem", "Patin", "Tambakan", "Tawes"] },
        labels: { nama_kecamatan: "Wilayah / Sentra", produksi_kg: "Produksi (Kg)", luas_ha: "Luas (Ha)", nilai_ekonomi_rp: "Nilai Ekonomi (Rp)" },
      },
      {
        table: "ikan_hias",
        name: "Ikan Hias",
        kecamatan: true,
        key: ["kecamatan", "varietas", "tahun"],
        enums: { varietas: ["Cupang", "Koi", "Koki", "Guppy", "Arwana", "Discus", "Manfish", "Louhan", "Komet", "Molly", "Platy", "Lainnya"] },
        labels: { volume_ekor: "Volume (Ekor)", luas_m2: "Luas (M²)", nilai_ekonomi: "Nilai Ekonomi (Rp)" },
      },
      {
        table: "ikan_benih",
        name: "Benih",
        kecamatan: true,
        key: ["kecamatan", "arah", "tahun"],
        enums: { arah: ["sendiri", "lain_daerah"] },
        labels: { arah: "Distribusi (sendiri/lain_daerah)", jumlah_ekor: "Jumlah (Ekor)", luas_ha: "Luas (Ha)" },
      },
      { table: "ikan_kolam", name: "Kolam", kecamatan: true, key: ["kecamatan", "tahun"] },
      { table: "ikan_waduk", name: "Waduk", kecamatan: true, key: ["kecamatan", "tahun"] },
      { table: "ikan_minapadi", name: "Mina Padi", kecamatan: true, key: ["kecamatan", "tahun"] },
      { table: "ikan_pemeliharaan", name: "Tempat Pemeliharaan", kecamatan: true, key: ["kecamatan", "tempat", "tahun"] },
      { table: "ikan_obyek_penangkapan", name: "Obyek Penangkapan", kecamatan: true, key: ["kecamatan", "obyek", "arah", "tahun"] },
    ],
  },
  lahan: {
    label: "Lahan",
    desc: "Penggunaan lahan kabupaten per kategori dan tahun (hektare).",
    sheets: [{ table: "lahan_penggunaan", name: "Penggunaan Lahan", kecamatan: false, key: ["kategori", "tahun"] }],
  },
  lumbung: {
    label: "Lumbung Pangan",
    desc: "Jumlah & kapasitas lumbung pangan dan gudang per kecamatan per tahun.",
    sheets: [{ table: "lumbung_pangan", name: "Lumbung Pangan", kecamatan: true, key: ["kecamatan", "tahun"] }],
  },
  ekonomi: {
    label: "Ekonomi",
    desc: "Inflasi tahunan, jumlah pasar, dan nilai ekonomi bidang (input Dinas — tahunan/triwulan; semester = gabungan triwulan).",
    sheets: [
      { table: "inflasi", name: "Inflasi", kecamatan: false, key: ["wilayah", "tahun"] },
      { table: "pasar", name: "Pasar", kecamatan: false, key: ["jenis", "tahun"] },
      {
        table: "nilai_ekonomi_tahunan",
        name: "Nilai Ekonomi",
        kecamatan: false,
        key: ["bidang", "komoditas", "tahun", "triwulan"],
        enums: { triwulan: ["1", "2", "3", "4"] },
      },
    ],
  },
  kelembagaan: {
    label: "Kelembagaan",
    desc: "Kelompok tani & kelompok tani hutan per desa per tahun (ST2023 basis).",
    sheets: [
      { table: "kelompok_tani", name: "Kelompok Tani", kecamatan: true, key: ["kecamatan", "desa", "tahun"] },
      { table: "kelompok_tani_hutan", name: "Kelompok Tani Hutan", kecamatan: true, key: ["kecamatan", "desa", "tahun"] },
    ],
  },
  st2023: {
    label: "ST2023 — Desa",
    desc: "Rumah tangga petani/ikan per desa (Sensus Pertanian 2023). Kolom ternak (JSON) tidak diedit via Excel.",
    sheets: [{ table: "st2023_desa", name: "ST2023 Desa", kecamatan: true, key: ["kecamatan", "desa"] }],
  },
  renstra: {
    label: "Renstra — Target",
    desc: "Target indikator Renstra Distankan (mis. Tabel 4.1 renstra.pdf).",
    sheets: [{ table: "renstra_target", name: "Target Renstra", kecamatan: false, key: ["indikator", "tahun_target"] }],
  },

  "ltt-katam": {
    label: "LTT — Luas Tambah Tanam & Kalender Tanam",
    desc: "Monitoring luas tambah tanam (LTT) dan kalender tanam (Katam) per kecamatan.",
    sheets: [{ table: "ltt_katam", name: "LTT & Katam", kecamatan: true, key: ["kecamatan", "komoditas", "jenis", "tahun"], enums: { jenis: ["LTT", "Katam"] } }],
  },
  "kelembagaan-pertanian": {
    label: "Kelembagaan — Pertanian (Poktan, Gapoktan, KWT)",
    desc: "Register kelembagaan pertanian: Poktan, Gapoktan, dan KWT (ID Simluhtan, SK Pengukuhan, kelas, komoditas, luas lahan).",
    sheets: [{
      table: "kelembagaan_pertanian",
      name: "Kelembagaan Pertanian",
      kecamatan: true,
      key: ["kecamatan", "nama_kelompok"],
      enums: {
        jenis_lembaga: ["Poktan", "Gapoktan", "KWT"],
        kelas_kemampuan: ["Pemula", "Lanjut", "Madya", "Utama", "Belum Dinilai"],
        subsektor_utama: ["Tanaman Pangan", "Hortikultura", "Perkebunan", "Peternakan", "Campuran"],
        status_aktif: ["Aktif", "Tidak Aktif", "Menunggu Verifikasi"]
      }
    }],
  },
  "kelembagaan-perikanan": {
    label: "Kelembagaan — Perikanan (Pokdakan, Poklahsar, Pokmaswas)",
    desc: "Register kelembagaan perikanan: Pokdakan, Poklahsar, dan Pokmaswas (ID KUSUKA KKP, SK Pengukuhan, kelas, jenis budidaya/olahan).",
    sheets: [{
      table: "kelembagaan_perikanan",
      name: "Kelembagaan Perikanan",
      kecamatan: true,
      key: ["kecamatan", "nama_kelompok"],
      enums: {
        jenis_lembaga: ["Pokdakan", "Poklahsar", "Pokmaswas"],
        kelas_kemampuan: ["Pemula", "Madya", "Utama", "Belum Dinilai"],
        status_aktif: ["Aktif", "Tidak Aktif"]
      }
    }],
  },
  "kelembagaan-pendukung": {
    label: "Kelembagaan — Pendukung (KEP, Posluhdes, PPS, JULEHA, P4S, UPJA)",
    desc: "Kelembagaan Ekonomi Petani (KEP), Pos Penyuluhan Desa (Posluhdes), Penyuluh Swadaya (PPS), JULEHA, P4S, dan UPJA.",
    sheets: [
      {
        table: "kelembagaan_kep",
        name: "KEP Ekonomi Petani",
        kecamatan: true,
        key: ["kecamatan", "nama_kep"],
        enums: {
          bentuk_kep: ["LKM", "LKMA", "Koperasi Tani", "KWT", "LUPM", "Lainnya"],
          ada_struktur: ["Ada", "Tidak"],
          ada_ad_art: ["Ada", "Tidak"],
          status_aktif: ["Aktif", "Tidak Aktif"]
        }
      },
      {
        table: "kelembagaan_posluhdes",
        name: "Posluhdes Desa",
        kecamatan: false,
        key: ["desa", "nama_posluhdes"],
      },
      {
        table: "kelembagaan_pps",
        name: "Penyuluh Swadaya PPS",
        kecamatan: false,
        key: ["nama_penyuluh", "unit_kerja"],
      },
      {
        table: "kelembagaan_juleha",
        name: "JULEHA Halal",
        kecamatan: true,
        key: ["kecamatan", "nama_lengkap"],
        enums: {
          status_sertifikasi: ["Tersertifikasi", "Dalam Pelatihan", "Masa Berlaku Habis"]
        }
      },
      {
        table: "kelembagaan_p4s",
        name: "P4S Pertanian",
        kecamatan: true,
        key: ["kecamatan", "nama_p4s"],
        enums: {
          klasifikasi_akreditasi: ["Pratama", "Madya", "Utama", "Belum Terakreditasi"]
        }
      },
      {
        table: "kelembagaan_upja",
        name: "UPJA Alsintan",
        kecamatan: true,
        key: ["kecamatan", "nama_upja"],
        enums: {
          status_operasional: ["Aktif Beroperasi", "Perlu Perbaikan", "Tidak Aktif"]
        }
      }
    ],
  },
  "harga-pasar": {
    label: "Harga Pasar — Komoditas Pangan",
    desc: "Pemantauan harga harian komoditas pangan pokok di pasar-pasar tradisional Banjarnegara.",
    sheets: [{
      table: "harga_pasar_banjarnegara",
      name: "Harga Pasar",
      kecamatan: false,
      key: ["tanggal", "lokasi_pasar", "komoditas"],
      labels: {
        lokasi_pasar: "Lokasi Pasar",
        perubahan_rp: "Perubahan Harga (Rp)",
        status_pantau: "Status Pantau (Stabil/Naik/Turun)",
        petugas_pencatat: "Petugas Pencatat",
        harga: "Harga per Satuan (Rp)"
      },
      enums: {
        status_pantau: ["Stabil", "Naik", "Turun"],
        satuan: ["kg", "butir", "liter"]
      }
    }],
  },
  "fsva-desa": {
    label: "FSVA — Ketahanan Pangan Desa (Bapanas)",
    desc: "16 Variabel Peta Ketahanan & Kerentanan Pangan (FSVA Bapanas) untuk 278 desa se-Kabupaten Banjarnegara.",
    sheets: [{
      table: "fsva_desa_indikator",
      name: "FSVA Desa",
      kecamatan: true,
      key: ["tahun", "kode_desa"],
      labels: {
        kode_desa: "Kode BPS Desa",
        nama_desa: "Nama Desa",
        luas_wilayah_ha: "Luas Wilayah (Ha)",
        jumlah_penduduk: "Penduduk (Jiwa)",
        jumlah_rt: "Jumlah RT",
        kepadatan_penduduk: "Kepadatan Penduduk",
        luas_lahan_ha: "Luas Lahan Baku Sawah (Ha)",
        sarpras_pangan_unit: "Sarpras Pangan (Unit)",
        penduduk_miskin_jiwa: "Penduduk Miskin DTKS (Jiwa)",
        tanpa_akses: "Tanpa Akses Roda 4 (1/0)",
        rt_tanpa_air_bersih: "RT Tanpa Air Bersih (Unit)",
        jumlah_nakes: "Tenaga Kesehatan (Orang)",
        ikp: "Indeks Ketahanan Pangan (IKP)",
        komposit: "Prioritas Komposit (1-6)",
        ikp_ranking: "Ranking IKP Kabupaten"
      }
    }],
  },
  "neraca-pangan": {
    label: "Neraca Pangan — Komposit Strategis",
    desc: "Neraca pangan komposit ketersediaan bersih vs kebutuhan konsumsi per komoditas strategis.",
    sheets: [{
      table: "neraca_pangan_komposit",
      name: "Neraca Komposit",
      kecamatan: false,
      key: ["tahun", "komoditas"],
      labels: {
        ketersediaan_bersih_ton: "Ketersediaan Bersih (Ton)",
        kebutuhan_konsumsi_ton: "Kebutuhan Konsumsi (Ton)",
        neraca_ton: "Surplus / Defisit (Ton)",
        status_neraca: "Status Neraca (Surplus/Defisit)",
        sumber_data: "Sumber Data"
      },
      enums: {
        status_neraca: ["Surplus", "Defisit", "Defisit Ringan / Impor Regional"]
      }
    }],
  },
  "psat-pduk": {
    label: "Keamanan Pangan — PSAT PDUK Pasar",
    desc: "Pengawasan keamanan pangan segar asal tumbuhan, hasil uji petik pasar, dan registrasi izin edar.",
    sheets: [{
      table: "psat_pduk",
      name: "PSAT PDUK",
      kecamatan: false,
      key: ["tanggal_uji", "lokasi_pasar", "komoditas", "nama_pedagang"],
      labels: {
        tanggal_uji: "Tanggal Uji (YYYY-MM-DD)",
        lokasi_pasar: "Lokasi Pasar",
        nama_pedagang: "Nama Pedagang",
        parameter_uji: "Parameter Uji (Pestisida/Formalin/dll)",
        hasil_uji: "Hasil Uji Lab",
        no_registrasi: "Nomor Registrasi PDUK",
        status: "Status (Memenuhi Syarat/Tidak Memenuhi Syarat)"
      },
      enums: {
        status: ["Memenuhi Syarat (Aman)", "Tidak Memenuhi Syarat", "Dalam Pengujian"]
      }
    }],
  },
  "komoditas-unggulan": {
    label: "Komoditas Unggulan — Sentra & Valuasi Sektoral",
    desc: "Daftar komoditas unggulan daerah per sektor (pangan, hortikultura, perkebunan, peternakan, perikanan), sentra kecamatan, dan estimasi nilai ekonomi.",
    sheets: [{
      table: "komoditas_unggulan",
      name: "Komoditas Unggulan",
      kecamatan: false,
      key: ["sektor", "nama_komoditas", "tahun"],
      labels: {
        sektor: "Sektor (pangan/hortikultura/perkebunan/peternakan/perikanan)",
        nama_komoditas: "Nama Komoditas",
        satuan: "Satuan (Ton/Kg/Ekor)",
        kecamatan_sentra: "Kecamatan Sentra",
        total_produksi: "Total Produksi",
        nilai_ekonomi_estimasi: "Estimasi Nilai Ekonomi (Rp)",
        tahun: "Tahun",
        is_unggulan: "Status Unggulan (1=Ya, 0=Tidak)",
      },
      enums: {
        sektor: ["pangan", "hortikultura", "perkebunan", "peternakan", "perikanan"],
      },
    }],
  },
  "harga-produsen": {
    label: "Harga Produsen — Valuasi Komoditas",
    desc: "Harga dasar komoditas di tingkat produsen/petani per satuan untuk acuan valuasi ekonomi sektoral.",
    sheets: [{
      table: "harga_produsen",
      name: "Harga Produsen",
      kecamatan: false,
      key: ["sektor", "komoditas", "tahun"],
      labels: {
        sektor: "Sektor (pangan/hortikultura/perkebunan/peternakan/perikanan)",
        komoditas: "Komoditas",
        satuan: "Satuan (Kg/Ton/Liter/Butir/Ekor)",
        harga_per_satuan: "Harga Produsen per Satuan (Rp)",
        tahun: "Tahun",
      },
      enums: {
        sektor: ["pangan", "hortikultura", "perkebunan", "peternakan", "perikanan"],
      },
    }],
  },
};

// ---------------------------------------------------------------------------
// Normalisasi nama — cermin database/import/lib.mjs (WAJIB identik!)
// ---------------------------------------------------------------------------

export const normStr = (v) => (v === null || v === undefined ? "" : String(v).replace(/\s+/g, " ").trim());
export const normKey = (v) => normStr(v).toLowerCase().replace(/[^a-z0-9]/g, "");
export const normDesa = (v) => normStr(v).toUpperCase();

const KEC_ALIASES = [
  ["Purwareja Klampok", ["purwarejaklampok", "purworejoklampok", "purworejoklp", "klampok"]],
  ["Purwanegara", ["purwanegara", "purwonegoro", "purwonegara", "purwongoro", "purwonegero"]],
  ["Wanadadi", ["wanadadi", "wonodadi", "wanodadi"]],
];

let kecCache = null; // { byKey: Map<normKey, {id, nama}>, names: string[] }

/** Muat daftar kecamatan resmi dari DB + siapkan resolver alias. */
export async function loadKecamatan() {
  if (kecCache) return kecCache;
  const rows = await q("SELECT id, nama FROM kecamatan ORDER BY nama");
  if (!rows.length) throw new Error("Tabel kecamatan kosong");
  const byKey = new Map();
  const names = [];
  for (const r of rows) {
    names.push(r.nama);
    byKey.set(normKey(r.nama), { id: r.id, nama: r.nama });
  }
  for (const [baku, aliases] of KEC_ALIASES) {
    const target = [...byKey.entries()].find(([k]) => k === normKey(baku))?.[1];
    if (!target) continue;
    for (const a of aliases) if (!byKey.has(a)) byKey.set(a, target);
  }
  kecCache = { byKey, names };
  return kecCache;
}

/** Resolve nama kecamatan bebas → { id, nama } baku, atau null. */
export function resolveKecamatan(kec, cache) {
  const key = normKey(kec);
  if (!key) return null;
  return cache.byKey.get(key) ?? null;
}

// ---------------------------------------------------------------------------
// Loader kolom dinamis
// ---------------------------------------------------------------------------

const colCache = new Map(); // table -> column meta (dari information_schema)

async function loadColumns(table) {
  if (colCache.has(table)) return colCache.get(table);
  const rows = await q(
    `SELECT column_name, data_type, column_type, is_nullable, column_default,
            generation_expression
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ?
     ORDER BY ordinal_position`,
    [table]
  );
  if (!rows.length) throw new Error(`Tabel tidak ditemukan: ${table}`);
  colCache.set(table, rows);
  return rows;
}

function labelFor(field) {
  if (LABELS[field]) return LABELS[field];
  for (const [suf, lab] of Object.entries(SUFFIX_LABELS)) {
    if (field.endsWith(suf)) {
      const base = LABELS[field.slice(0, -suf.length)] ?? titleCase(field.slice(0, -suf.length));
      return base + lab;
    }
  }
  return titleCase(field);
}
const titleCase = (s) => s.replace(/_/g, " ").replace(/\b\p{L}/gu, (c) => c.toUpperCase());

function parseEnum(columnType) {
  const m = /^enum\((.*)\)$/i.exec(columnType || "");
  if (!m) return null;
  const vals = m[1].split(",").map((v) => v.trim().replace(/^'|'$/g, ""));
  return vals.length ? vals : null;
}

/** Muat spesifikasi lengkap satu domain (kolom Excel + tipe + kunci upsert). */
export async function loadDomain(domainKey) {
  const domain = DOMAINS[domainKey];
  if (!domain) return null;
  const sheets = await Promise.all(
    domain.sheets.map(async (s) => {
      const hasNamaKecamatan = (await loadColumns(s.table)).some((c) => c.column_name === "nama_kecamatan");
      const colsRaw = (await loadColumns(s.table)).filter(
        (c) =>
          !SKIP_COLS.has(c.column_name) &&
          !SKIP_TYPES.has(c.data_type) &&
          !c.generation_expression &&
          !(s.kecamatan && c.column_name === "nama_kecamatan")
      );
      const hasSumber = (await loadColumns(s.table)).some((c) => c.column_name === "sumber");
      const hasDesaNorm = (await loadColumns(s.table)).some((c) => c.column_name === "desa_norm");
      const hasDesaId = (await loadColumns(s.table)).some((c) => c.column_name === "desa_id");
      const hasKodeKec = (await loadColumns(s.table)).some((c) => c.column_name === "kode_kec");
      const cols = colsRaw.map((c) => {
        const enumDb = parseEnum(c.column_type);
        const enumCfg = s.enums?.[c.column_name] ?? null;
        const isYear = /(^|_)tahun($|_)/.test(c.column_name);
        const numeric = ["int", "bigint", "smallint", "tinyint", "mediumint", "decimal", "double", "float"].includes(c.data_type);
        return {
          field: c.column_name,
          // Override label per-sheet (mis. ternak_telur: produksi_kg = butir).
          header: s.labels?.[c.column_name] ?? labelFor(c.column_name),
          type: isYear ? "year" : enumCfg || enumDb ? "enum" : numeric ? "number" : "text",
          required: c.is_nullable === "NO" && c.column_default === null,
          enumValues: enumCfg ?? enumDb,
        };
      });
      const out = {
        table: s.table,
        name: s.name,
        key: s.key,
        kecamatan: !!s.kecamatan,
        hasSumber,
        hasDesaNorm,
        hasDesaId,
        hasKodeKec,
        hasNamaKecamatan: !!(s.kecamatan && hasNamaKecamatan),
        cols: s.kecamatan
          ? [{ field: "kecamatan", header: "Kecamatan", type: "kecamatan", required: true, enumValues: null }, ...cols.filter((c) => c.field !== "kecamatan")]
          : cols,
      };
      return out;
    })
  );
  return { key: domainKey, label: domain.label, desc: domain.desc, sheets };
}

/** Ringkasan domain untuk UI dasbor (tanpa detail kolom). */
export async function listDomains() {
  const out = [];
  for (const [key, d] of Object.entries(DOMAINS)) {
    const sheets = d.sheets.map((s) => ({ name: s.name, table: s.table, key: s.key }));
    out.push({ domain: key, label: d.label, desc: d.desc, sheets });
  }
  return out;
}

/**
 * Audit kesiapan data (Readiness) per domain untuk dasbor super admin.
 * Menghitung jumlah baris aktual di MySQL dan mendeteksi ketersediaan file fallback disk.
 */
export async function getReadinessAudit() {
  const start = Date.now();
  const tableToDomains = new Map();
  for (const [dKey, d] of Object.entries(DOMAINS)) {
    for (const s of d.sheets) {
      if (!tableToDomains.has(s.table)) tableToDomains.set(s.table, new Set());
      tableToDomains.get(s.table).add(dKey);
    }
  }

  const tables = Array.from(tableToDomains.keys());
  const unionQueries = tables.map((t) => `SELECT '${t}' as tbl, COUNT(*) as cnt FROM \`${t}\``).join(" UNION ALL ");

  let tableCounts = new Map();
  try {
    const counts = await q(unionQueries);
    for (const r of counts) {
      tableCounts.set(r.tbl, Number(r.cnt) || 0);
    }
  } catch (err) {
    for (const t of tables) {
      try {
        const [res] = await q(`SELECT COUNT(*) as cnt FROM \`${t}\``);
        tableCounts.set(t, Number(res?.cnt) || 0);
      } catch {
        tableCounts.set(t, 0);
      }
    }
  }

  const fallbackMap = {
    lahan: ["dist/data/lahan-fallback.json"],
    kelembagaan: ["dist/data/kelompok-tani-fallback.json", "dist/data/kelompok-tani-hutan.json"],
    "kelembagaan-pertanian": ["dist/kelembagaan/data_kelembagaan_cleaned.json"],
    peternakan: ["dist/data/susu-kulit-fallback.json"],
    st2023: ["dist/data/st2023-desa-fallback.json"],
    "harga-pasar": ["dist/data/snapshots/anomali-harga-pangan.json"],
  };

  const domainAudits = [];
  let totalMandiri = 0;
  let totalPenyangga = 0;
  let totalKosong = 0;

  for (const [key, d] of Object.entries(DOMAINS)) {
    let domainTotalRows = 0;
    let latestYear = null;
    const sheetDetails = [];

    for (const s of d.sheets) {
      const rows = tableCounts.get(s.table) || 0;
      domainTotalRows += rows;
      sheetDetails.push({
        name: s.name,
        table: s.table,
        rows,
      });

      if (rows > 0) {
        try {
          const cols = await loadColumns(s.table);
          const colNames = cols.map((c) => c.column_name);
          let yVal = null;
          if (colNames.includes("tahun")) {
            const [r] = await q(`SELECT MAX(tahun) as y FROM \`${s.table}\``);
            yVal = r?.y;
          } else if (colNames.includes("tahun_anggaran")) {
            const [r] = await q(`SELECT MAX(tahun_anggaran) as y FROM \`${s.table}\``);
            yVal = r?.y;
          } else if (colNames.includes("tahun_target")) {
            const [r] = await q(`SELECT MAX(tahun_target) as y FROM \`${s.table}\``);
            yVal = r?.y;
          } else if (colNames.includes("tanggal")) {
            const [r] = await q(`SELECT YEAR(MAX(tanggal)) as y FROM \`${s.table}\``);
            yVal = r?.y;
          } else if (colNames.includes("created_at")) {
            const [r] = await q(`SELECT YEAR(MAX(created_at)) as y FROM \`${s.table}\``);
            yVal = r?.y;
          }
          if (yVal && (!latestYear || yVal > latestYear)) {
            latestYear = yVal;
          }
        } catch {}
      }
    }

    let hasFallback = false;
    const fallbacks = fallbackMap[key];
    if (fallbacks && fallbacks.length) {
      hasFallback = fallbacks.some((f) => fs.existsSync(f));
    }

    let status = "kosong";
    if (domainTotalRows > 0) {
      status = "mandiri";
      totalMandiri++;
    } else if (hasFallback) {
      status = "penyangga";
      totalPenyangga++;
    } else {
      status = "kosong";
      totalKosong++;
    }

    domainAudits.push({
      domain: key,
      label: d.label,
      desc: d.desc,
      status, // "mandiri" | "penyangga" | "kosong"
      totalRows: domainTotalRows,
      latestYear: latestYear ? Number(latestYear) : null,
      sheets: sheetDetails,
      hasFallback,
      keyColumns: d.sheets[0]?.key || [],
    });
  }

  const totalDomains = domainAudits.length;
  const readinessPercent = totalDomains > 0
    ? Math.round(((totalMandiri + totalPenyangga * 0.5) / totalDomains) * 100)
    : 0;

  return {
    status: "success",
    timestamp: new Date().toISOString(),
    executionMs: Date.now() - start,
    summary: {
      totalDomains,
      mandiri: totalMandiri,
      penyangga: totalPenyangga,
      kosong: totalKosong,
      readinessPercent,
    },
    domains: domainAudits,
  };
}
