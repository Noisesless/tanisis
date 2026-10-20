/**
 * Agricultural Offline Knowledge Base — SISPERTANI Banjarnegara
 * Menyimpan data profil komoditas khas, SOP teknis budidaya & penanganan hama,
 * serta panduan kelembagaan tani lokal Kabupaten Banjarnegara untuk dukungan offline RAG.
 */

export const OFFLINE_AGRICULTURE_KB = [
  // --- KOMODITAS UNGGULAN KHAS DAERAH ---
  {
    id: "kb_salak_pondoh",
    category: "komoditas",
    keywords: ["salak", "pondoh", "lumut", "madukara", "banjarmangu", "sigaluh", "buah"],
    title: "Profil & Budidaya Salak Pondoh dan Salak Lumut Banjarnegara",
    summary:
      "Salak Pondoh dan Salak Lumut merupakan komoditas buah hortikultura unggulan nomor satu di Kabupaten Banjarnegara dengan sentra produksi di Kecamatan Madukara, Banjarmangu, Sigaluh, dan Pagentan. Memiliki keunggulan daging buah tebal, renyah, manis sejak muda, dan kadar air seimbang.",
    guidance: [
      "Kondisi Agroklimat: Optimal di ketinggian 400–800 mdpl dengan curah hujan 2.000–3.000 mm/tahun serta tanah regosol vulkanik subur.",
      "Teknik Polinasi Buatan: Diperlukan penyerbukan buatan manual (mengibaskan serbuk sari bunga jantan ke bunga betina yang mekar) untuk memastikan persentase pembentukan buah mencapai >85%.",
      "Pascapanen & Nilai Tambah: Selain dijual segar, diolah menjadi keripik salak, dodol salak, dan sirup salak oleh kelompok wanita tani (KWT) lokal."
    ]
  },
  {
    id: "kb_kopi_robusta",
    category: "komoditas",
    keywords: ["kopi", "robusta", "karangkobar", "kalibening", "pagentan", "perkebunan"],
    title: "Profil & Pascapanen Kopi Robusta Banjarnegara",
    summary:
      "Kopi Robusta merupakan komoditas perkebunan utama Banjarnegara dengan produksi mencapai lebih dari 2.100 Ton per tahun. Kawasan sentra terkonsentrasi di lereng pegunungan bagian utara (Kecamatan Karangkobar, Kalibening, dan Pagentan).",
    guidance: [
      "Karakteristik Rasa: Memiliki body tebal, aroma cokelat rempah (spicy nutty), dan tingkat keasaman rendah yang disukai industri kopi olahan.",
      "Standar Petik Merah: Petani binaan diarahkan menerapkan petik merah (fine robusta) minimal 95% untuk mendongkrak harga jual di tingkat kelompok tani.",
      "Pengolahan: Didominasi proses Natural dan Honey untuk menghasilkan aroma khas pegunungan Banjarnegara."
    ]
  },
  {
    id: "kb_domba_batur",
    category: "komoditas",
    keywords: ["domba", "domba batur", "batur", "ternak", "pejawaran", "populasi", "peternakan"],
    title: "Profil Rumpun Ternak Asli Domba Batur Banjarnegara",
    summary:
      "Domba Batur (Dombat) adalah plasma nutfah asli Kabupaten Banjarnegara yang telah ditetapkan sebagai rumpun ternak lokal unggul oleh Kementerian Pertanian RI. Terkonsentrasi di dataran tinggi Kecamatan Batur dan Pejawaran.",
    guidance: [
      "Karakteristik Fisik: Bertubuh besar gempal, wol tebal menyelimuti hampir seluruh muka dan kaki, tidak bertanduk, dengan warna bulu putih bersih.",
      "Potensi Daging & Wol: Bobot jantan dewasa dapat mencapai 90–120 kg dan betina 60–80 kg. Menjadi sumber bibit unggul dan penghasil daging berkualitas tinggi.",
      "Manajemen Pakan di Dataran Tinggi: Memanfaatkan limbah sayuran hortikultura (daun kubis, wortel) yang dikombinasikan dengan rumput lapang dan konsentrat dedak."
    ]
  },
  {
    id: "kb_kentang_wortel_dieng",
    category: "komoditas",
    keywords: ["kentang", "wortel", "dieng", "batur", "sayuran", "hortikultura", "sayur"],
    title: "Profil Sayuran Dataran Tinggi Dieng (Kentang & Wortel)",
    summary:
      "Kawasan Dieng (Kecamatan Batur dan sekitarnya) adalah sentra hortikultura sayuran subtropis terbesar di Jawa Tengah. Produksi Wortel melampaui 48.000 Ton per tahun dan Kentang menjadi penggerak ekonomi utama masyarakat Dieng.",
    guidance: [
      "Ketinggian Lahan: Berada pada elevasi 1.600–2.200 mdpl dengan suhu udara sejuk 10–20°C.",
      "Konservasi Lahan Berlereng: Petani didorong menerapkan pola terasering guludan searah kontur dan penanaman rumput penguat tebing guna mencegah erosi tanah.",
      "Rotasi Tanam: Disarankan melakukan rotasi tanam berkala antara kentang, wortel, kubis, dan daun bawang untuk memutus siklus hidup nematoda sista kuning (Globodera rostochiensis)."
    ]
  },
  {
    id: "kb_kelapa_deres",
    category: "komoditas",
    keywords: ["kelapa", "gula semut", "gula kelapa", "susukan", "mandiraja", "purwanegara"],
    title: "Profil Kelapa Deres & Industri Gula Semut Banjarnegara",
    summary:
      "Kelapa Dalam/Deres merupakan komoditas perkebunan terluas di Banjarnegara dengan produksi melampaui 16.000 Ton. Nira kelapa menjadi bahan baku utama industri gula kelapa cetak dan gula semut organik yang telah menembus pasar ekspor.",
    guidance: [
      "Sentra Pengrajin Gula: Tersebar di wilayah selatan, khususnya Kecamatan Susukan, Mandiraja, Purwanegara, dan Bawang.",
      "Standarisasi Organik: Distankan KP terus membina kelompok tani penderes untuk menerapkan higienitas sadapan nira tanpa bahan pengawet kimia berbahaya (natrium metabisulfit)."
    ]
  },

  // --- SOP PENANGANAN HAMA & PENYAKIT TANAMAN ---
  {
    id: "kb_hama_wereng",
    category: "hama_penyakit",
    keywords: ["wereng", "wbc", "wereng coklat", "hama padi", "padi kerdil", "musuh alami"],
    title: "SOP Pengendalian Hama Wereng Batang Coklat (WBC) pada Padi",
    summary:
      "Wereng Batang Coklat (Nilaparvata lugens) merupakan hama utama tanaman padi yang dapat menyebabkan tanaman menguning, kering seperti terbakar (hopperburn), dan menularkan virus kerdil hampa.",
    guidance: [
      "Monitoring Dini: Amati pangkal rumpun padi minimal 1 minggu sekali sejak fase vegetatif hingga primordia.",
      "Pengaturan Jarak Tanam: Terapkan sistem tanam jajar legowo (2:1 atau 4:1) untuk menciptakan lorong aerasi dan sinar matahari yang menekan kelembapan mikro.",
      "Pengendalian Hayati: Manfaatkan agens pengendali hayati (APH) seperti jamur Beauveria bassiana saat populasi wereng masih di bawah ambang ekonomi (< 10 ekor per rumpun).",
      "Manajemen Pengairan: Lakukan pengeringan berkala (pengairan berselang / intermitten) agar pangkal batang padi tidak selalu lembap dan becek."
    ]
  },
  {
    id: "kb_penyakit_antraknosa",
    category: "hama_penyakit",
    keywords: ["antraknosa", "patek", "busuk buah", "cabai", "cabe", "tomat", "jamur"],
    title: "SOP Pengendalian Penyakit Antraknosa (Patek) pada Cabai & Tomat",
    summary:
      "Penyakit antraknosa yang disebabkan oleh cendawan Colletotrichum capsici menyerang buah cabai dan tomat, ditandai bercak melingkar cekung berwarna cokelat kehitaman hingga buah membusuk dan rontok.",
    guidance: [
      "Sanitasi Lahan: Petik dan musnahkan (kubur/bakar) buah yang terinfeksi agar spora jamur tidak menyebar tertiup angin atau percikan air hujan.",
      "Drainase Guludan: Tinggikan guludan bedengan dan gunakan mulsa plastik perak untuk menjaga kelembapan tanah tetap stabil.",
      "Perlindungan Preventif: Semprotkan fungisida kontak berbahan aktif tembaga hidroksida atau mankozeb berselingan dengan fungisida sistemik saat cuaca mendung/lembab tinggi."
    ]
  },
  {
    id: "kb_hama_tikus",
    category: "hama_penyakit",
    keywords: ["tikus", "gropyokan", "hama tikus", "tikus sawah", "rumpun padi"],
    title: "SOP Pengendalian Tikus Sawah Terpadu (PBT)",
    summary:
      "Tikus sawah (Rattus argentiventer) merupakan hama mamalia pengerat yang menyerang batang padi pada malam hari secara masif, mulai dari persemaian hingga panen.",
    guidance: [
      "Gropyokan Massal Awal Musim: Dilakukan serentak oleh gabungan kelompok tani (Gapoktan) sebelum musim tanam tiba pada lubang-lubang aktif tanggul.",
      "Sanitasi Tanggul: Pertahankan lebar pematang/tanggul tidak lebih dari 30 cm agar tidak dijadikan sarang tikus.",
      "Konservasi Burung Hantu (Tyto alba): Membangun Rumah Burung Hantu (Rubuha) di areal persawahan sebagai predator alami efektif (1 ekor burung hantu dapat memangsa 2–5 tikus/malam)."
    ]
  },

  // --- KELEMBAGAAN & LAYANAN DINAS ---
  {
    id: "kb_daftar_poktan",
    category: "kelembagaan",
    keywords: ["daftar poktan", "daftar kelompok tani", "simluhtan", "kwt", "gapoktan", "syarat kelompok"],
    title: "Prosedur & Syarat Pendaftaran Kelompok Tani (SIMLUHTAN)",
    summary:
      "Untuk dapat mengakses program pembinaan dinas, penyaluran benih, dan bantuan alsintan, kelompok tani (Poktan/KWT/Gapoktan) wajib terdaftar resmi dan memiliki nomor registrasi di SIMLUHTAN Distankan KP Banjarnegara.",
    guidance: [
      "Syarat Pembentukan: Beranggotakan minimal 20–25 petani yang memiliki hamparan lahan usaha tani di wilayah desa/kelurahan yang sama.",
      "Musyawarah & Berita Acara: Melaksanakan rapat pembentukan pengurus (Ketua, Sekretaris, Bendahara) dilengkapi daftar hadir dan Berita Acara Pembentukan.",
      "Surat Keputusan (SK): Mengajukan pengesahan Surat Keputusan (SK) Pengukuhan dari Kepala Desa/Lurah setempat.",
      "Registrasi BPP Kecamatan: Menyerahkan berkas ke Balai Penyuluhan Pertanian (BPP) di kecamatan masing-masing untuk diverifikasi oleh Penyuluh Pertanian Lapangan (PPL) dan diinput ke SIMLUHTAN Kementerian Pertanian."
    ]
  },
  {
    id: "kb_bantuan_alsintan",
    category: "kelembagaan",
    keywords: ["bantuan alsintan", "traktor", "pompa air", "cultivator", "proposal bantuan", "syarat bantuan"],
    title: "Alur Permohonan Bantuan Alat & Mesin Pertanian (Alsintan)",
    summary:
      "Pemerintah Kabupaten Banjarnegara melalui Distankan KP menyalurkan bantuan hibah alsintan (seperti traktor roda dua, pompa air, cultivator, dan handsprayer) kepada kelompok tani terdaftar.",
    guidance: [
      "Status Kelembagaan: Pemohon wajib berupa Kelompok Tani (Poktan), Gapoktan, atau UPJA yang sudah terdaftar aktif di SIMLUHTAN minimal 1 tahun.",
      "Penyusunan Proposal: Menyusun proposal permohonan bantuan alsintan yang memuat identitas kelompok, luasan hamparan lahan, kebutuhan alat, dan susunan pengurus.",
      "Verifikasi PPL & BPP: Proposal diketahui dan ditandatangani oleh PPL pendamping serta Koordinator BPP Kecamatan.",
      "Pengajuan ke Dinas: Berkas diserahkan ke Bidang Prasarana dan Sarana Pertanian (PSP) Distankan KP Banjarnegara untuk dimasukkan dalam perencanaan anggaran (APBD/APBN)."
    ]
  },
  {
    id: "kb_renstra_2025_2029",
    category: "perencanaan",
    keywords: ["renstra 2025", "2025-2029", "iku", "ikk", "target 2025", "arah kebijakan", "4 pilar", "transformasi"],
    title: "Arah Kebijakan & 4 Pilar Strategis Renstra Distankan KP 2025–2029",
    summary:
      "Renstra 2025–2029 memuat 9 Indikator Kinerja Utama (IKU) dan 18 Indikator Kinerja Kunci (IKK) yang berfokus pada transformasi agribisnis berkelanjutan dari on-farm menuju hilirisasi dan nilai tambah.",
    guidance: [
      "Pilar 1 - Ketahanan & Kemandirian Pangan: Menjaga skor PPH (target 94,03) dan penguatan IKP desa rentan pangan.",
      "Pilar 2 - Nilai Tambah & Hilirisasi Agro: Mendorong pertumbuhan PDRB pertanian (target 1–3%) melalui diversifikasi olahan salak, kopi robusta, dan hortikultura Dieng.",
      "Pilar 3 - Kelembagaan Tani Mandiri: Peningkatan kapasitas KWT, Gapoktan, dan Pokdakan berbasis korporasi petani dan kemitraan pasar.",
      "Pilar 4 - Tata Kelola Birokrasi Berdampak: Target nilai SAKIP dinas mencapai 73,20 dan Indeks Pelayanan Publik (IPP) mencapai 3,30 pada tahun 2029."
    ]
  },
  {
    id: "kb_renstra_2019_2022",
    category: "perencanaan",
    keywords: ["renstra 2019", "2019-2022", "target renstra", "sasaran renstra", "target 2019", "evaluasi renstra", "capaian 2019"],
    title: "Target Sasaran & Evaluasi Kinerja Renstra Distankan KP 2019–2022",
    summary:
      "Renstra 2019–2022 (Tabel 4.1 & Tabel 7.2 RPJMD) memuat 43 Sasaran dan 17 Program yang berorientasi pada peningkatan volume produksi komoditas pangan, hortikultura, perkebunan, dan peternakan.",
    guidance: [
      "Target Produksi Padi: Ditargetkan 159.662,89 Ton pada 2019 (realisasi tercatat 148.776 Ton atau 93,2% dari target).",
      "Target Hortikultura Unggulan: Target Kentang 128.700 Ton (realisasi 113.498,2 Ton) dan Salak Pondoh 254.323,23 Ton (realisasi melampaui target mencapai 260.114 Ton / 102,3%).",
      "Target Peternakan: Populasi Sapi Potong 31.695 Ekor (realisasi melampaui target mencapai 32.140 Ekor / 101,4%), Kambing/Domba 262.348 Ekor.",
      "Evaluasi Lapangan: Komoditas perkebunan dan peternakan mencatatkan keberhasilan melampaui target dokumen, sedangkan tanaman pangan padi mengalami tantangan kekeringan musiman."
    ]
  },
  {
    id: "kb_sensus_st2023",
    category: "perencanaan",
    keywords: ["st2023", "sensus pertanian", "petani gurem", "milenial", "bps banjarnegara"],
    title: "Ikhtisar Sensus Pertanian 2023 (ST2023 BPS) Banjarnegara",
    summary:
      "Hasil Sensus Pertanian 2023 oleh BPS memetakan struktur pelaku usaha tani di 278 desa Kabupaten Banjarnegara.",
    guidance: [
      "Karakteristik Usaha: Didominasi oleh Usaha Pertanian Perorangan (UTP) dengan komoditas hortikultura sayuran, perkebunan kelapa/kopi, dan ternak.",
      "Struktur Kelembagaan: Sebagian besar petani telah tergabung dalam kelompok tani binaan penyuluh BPP di masing-masing kecamatan.",
      "Regenerasi Tani: Distankan KP menggalakkan pelatihan P4S dan fasilitasi alsintan modern untuk meningkatkan minat generasi muda dalam agribisnis bernilai tinggi."
    ]
  }
];

/**
 * Mencari data pengetahuan agrikultur offline berdasarkan kata kunci pertanyaan pengguna.
 * @param {string} userQuery Teks pertanyaan pengguna
 * @returns {Array<object>} Daftar entri KB yang relevan (maksimal 2)
 */
export function lookupOfflineKB(userQuery) {
  if (!userQuery || typeof userQuery !== "string") return [];
  const qLower = userQuery.toLowerCase();

  const matches = [];
  for (const item of OFFLINE_AGRICULTURE_KB) {
    let score = 0;
    for (const kw of item.keywords) {
      if (qLower.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > 0) {
      matches.push({ item, score });
    }
  }

  // Urutkan berdasarkan skor kecocokan tertinggi
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 2).map((m) => m.item);
}
