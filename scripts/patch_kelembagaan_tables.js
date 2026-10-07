import { q } from "../src/db.js";

async function applyKelembagaanPatch() {
  console.log("Memulai patch skema database kelembagaan...");

  // 1. Alter tabel kelembagaan_pertanian (tambahkan kolom pendukung SIMLUHTAN)
  const cols = await q("SHOW COLUMNS FROM kelembagaan_pertanian");
  const colNames = new Set(cols.map(c => c.Field));

  if (!colNames.has("gapoktan_induk")) {
    console.log("Menambahkan kolom gapoktan_induk ke kelembagaan_pertanian...");
    await q("ALTER TABLE kelembagaan_pertanian ADD COLUMN gapoktan_induk VARCHAR(150) NULL AFTER nama_kelompok");
  }
  if (!colNames.has("luas_lahan_ha")) {
    console.log("Menambahkan kolom luas_lahan_ha ke kelembagaan_pertanian...");
    await q("ALTER TABLE kelembagaan_pertanian ADD COLUMN luas_lahan_ha DECIMAL(10,2) NULL DEFAULT 0.00 AFTER jumlah_anggota");
  }
  if (!colNames.has("penyuluh_pendamping")) {
    console.log("Menambahkan kolom penyuluh_pendamping ke kelembagaan_pertanian...");
    await q("ALTER TABLE kelembagaan_pertanian ADD COLUMN penyuluh_pendamping VARCHAR(100) NULL AFTER kontak_hp");
  }
  if (!colNames.has("penyuluh_hp")) {
    console.log("Menambahkan kolom penyuluh_hp ke kelembagaan_pertanian...");
    await q("ALTER TABLE kelembagaan_pertanian ADD COLUMN penyuluh_hp VARCHAR(30) NULL AFTER penyuluh_pendamping");
  }

  // 2. Buat tabel kelembagaan_kep (Kelembagaan Ekonomi Petani)
  console.log("Membuat tabel kelembagaan_kep...");
  await q(`
    CREATE TABLE IF NOT EXISTS kelembagaan_kep (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kecamatan VARCHAR(50) NOT NULL,
      bpp VARCHAR(100) NULL,
      nama_kep VARCHAR(150) NOT NULL,
      alamat VARCHAR(255) NULL,
      penyuluh_pendamping VARCHAR(100) NULL,
      penyuluh_hp VARCHAR(30) NULL,
      bentuk_kep VARCHAR(50) DEFAULT 'LKM',
      dasar_hukum VARCHAR(150) NULL,
      ada_struktur ENUM('Ada','Tidak') DEFAULT 'Tidak',
      ada_ad_art ENUM('Ada','Tidak') DEFAULT 'Tidak',
      komoditas VARCHAR(100) NULL,
      jenis_usaha VARCHAR(100) NULL,
      jumlah_pengurus INT DEFAULT 0,
      jumlah_anggota INT DEFAULT 0,
      poktan_terlibat INT DEFAULT 0,
      modal_usaha_aset DECIMAL(15,2) DEFAULT 0.00,
      status_aktif ENUM('Aktif','Tidak Aktif') DEFAULT 'Aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_kec (kecamatan),
      INDEX idx_bentuk (bentuk_kep)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 3. Buat tabel kelembagaan_posluhdes (Pos Penyuluhan Desa)
  console.log("Membuat tabel kelembagaan_posluhdes...");
  await q(`
    CREATE TABLE IF NOT EXISTS kelembagaan_posluhdes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kabupaten VARCHAR(50) DEFAULT 'Banjarnegara',
      bpp VARCHAR(100) NOT NULL,
      desa VARCHAR(100) NOT NULL,
      nama_posluhdes VARCHAR(150) NOT NULL,
      alamat VARCHAR(255) NULL,
      nama_pimpinan VARCHAR(100) NULL,
      no_ba_pengukuhan VARCHAR(150) NULL,
      penyuluh_swadaya VARCHAR(100) NULL,
      alamat_penyuluh VARCHAR(255) NULL,
      kontak_hp VARCHAR(30) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_bpp (bpp),
      INDEX idx_desa (desa)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 4. Buat tabel kelembagaan_pps (Penyuluh Pertanian Swadaya)
  console.log("Membuat tabel kelembagaan_pps...");
  await q(`
    CREATE TABLE IF NOT EXISTS kelembagaan_pps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama_penyuluh VARCHAR(100) NOT NULL,
      tempat_tgl_lahir VARCHAR(100) NULL,
      unit_kerja VARCHAR(100) NOT NULL,
      pendidikan VARCHAR(50) NULL,
      keahlian_tp TINYINT DEFAULT 0,
      keahlian_nak TINYINT DEFAULT 0,
      keahlian_bun TINYINT DEFAULT 0,
      keahlian_horti TINYINT DEFAULT 0,
      keahlian_lainnya TINYINT DEFAULT 0,
      wilayah_kerja VARCHAR(150) NULL,
      kontak_hp VARCHAR(30) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_unit (unit_kerja)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 5. Buat tabel kelembagaan_rekap_kecamatan (Rekapitulasi Validasi SK Kadistan)
  console.log("Membuat tabel kelembagaan_rekap_kecamatan...");
  await q(`
    CREATE TABLE IF NOT EXISTS kelembagaan_rekap_kecamatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      no_urut INT NOT NULL,
      kecamatan VARCHAR(100) NOT NULL UNIQUE,
      jumlah_desa INT NOT NULL DEFAULT 0,
      jumlah_gapoktan INT NOT NULL DEFAULT 0,
      jumlah_poktan INT NOT NULL DEFAULT 0,
      kelas_pemula INT NOT NULL DEFAULT 0,
      kelas_lanjut INT NOT NULL DEFAULT 0,
      kelas_madya INT NOT NULL DEFAULT 0,
      kelas_utama INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log("Skema database kelembagaan berhasil diperbarui!");
  process.exit(0);
}

applyKelembagaanPatch().catch(err => {
  console.error("Gagal menjalankan patch skema:", err);
  process.exit(1);
});
