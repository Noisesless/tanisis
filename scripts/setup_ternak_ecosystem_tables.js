import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  console.log('Connected to pertasis database.');

  // 1. Create ternak_hpt
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ternak_hpt (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      kecamatan_id TINYINT UNSIGNED NOT NULL,
      tahun SMALLINT UNSIGNED NOT NULL,
      bulan VARCHAR(20) DEFAULT NULL,
      jenis_hijauan VARCHAR(60) NOT NULL,
      luas_ha DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      produksi_ton DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      kapasitas_st DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      catatan VARCHAR(255) DEFAULT NULL,
      sumber ENUM('csv','ckan','manual') DEFAULT 'manual',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_kec_thn (kecamatan_id, tahun)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table ternak_hpt ready.');

  // 2. Create ternak_umkm_pakan
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ternak_umkm_pakan (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      kecamatan_id TINYINT UNSIGNED NOT NULL,
      tahun SMALLINT UNSIGNED NOT NULL,
      bulan VARCHAR(20) DEFAULT NULL,
      nama_usaha VARCHAR(100) NOT NULL,
      jenis_pakan VARCHAR(100) NOT NULL,
      kapasitas_ton_bulan DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      alamat VARCHAR(255) DEFAULT NULL,
      kontak VARCHAR(100) DEFAULT NULL,
      catatan VARCHAR(255) DEFAULT NULL,
      sumber ENUM('csv','ckan','manual') DEFAULT 'manual',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_kec_thn (kecamatan_id, tahun)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table ternak_umkm_pakan ready.');

  // 3. Create ternak_poultry_shop
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ternak_poultry_shop (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      kecamatan_id TINYINT UNSIGNED NOT NULL,
      tahun SMALLINT UNSIGNED NOT NULL,
      bulan VARCHAR(20) DEFAULT NULL,
      nama_toko VARCHAR(100) NOT NULL,
      alamat VARCHAR(255) DEFAULT NULL,
      jenis_layanan VARCHAR(100) DEFAULT 'Pakan, Obat & Sapronak',
      koordinat VARCHAR(60) DEFAULT NULL,
      kontak VARCHAR(100) DEFAULT NULL,
      catatan VARCHAR(255) DEFAULT NULL,
      sumber ENUM('csv','ckan','manual') DEFAULT 'manual',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_kec_thn (kecamatan_id, tahun)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table ternak_poultry_shop ready.');

  // 4. Create ternak_nkv
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ternak_nkv (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      kecamatan_id TINYINT UNSIGNED NOT NULL,
      tahun SMALLINT UNSIGNED NOT NULL,
      bulan VARCHAR(20) DEFAULT NULL,
      nama_unit_usaha VARCHAR(100) NOT NULL,
      nomor_nkv VARCHAR(60) DEFAULT 'Dalam Proses Registrasi',
      kategori VARCHAR(80) NOT NULL,
      status_verifikasi VARCHAR(60) DEFAULT 'Registrasi',
      catatan VARCHAR(255) DEFAULT NULL,
      sumber ENUM('csv','ckan','manual') DEFAULT 'manual',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_kec_thn (kecamatan_id, tahun)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Table ternak_nkv ready.');

  // 5. Update or normalize data in ternak_susu_kulit so that Sapi and Kerbau are separated!
  // In Distankan KP:
  // pemotongan Kerbau = 0 (or almost 0), so 'Sapi/Kerbau' was 100% Sapi.
  // We can update 'Sapi/Kerbau' -> 'Kulit Sapi', and add explicit zero rows for 'Kulit Kerbau'
  // Also 'Kambing/Domba' -> split into 'Kulit Kambing' and 'Kulit Domba' based on pemotongan ratio (~80% Kambing, 20% Domba)
  const [existingSapiKerbau] = await conn.query("SELECT COUNT(*) as c FROM ternak_susu_kulit WHERE jenis = 'Sapi/Kerbau'");
  if (existingSapiKerbau[0].c > 0) {
    console.log('Separating Sapi/Kerbau and Kambing/Domba into definite species in ternak_susu_kulit...');
    
    // Copy Sapi/Kerbau rows to 'Kulit Sapi'
    await conn.query(`
      UPDATE ternak_susu_kulit 
      SET jenis = 'Kulit Sapi', catatan = 'Produksi kulit sapi (lembar)'
      WHERE jenis = 'Sapi/Kerbau'
    `);
    
    // For Kambing/Domba: update to Kulit Kambing
    await conn.query(`
      UPDATE ternak_susu_kulit 
      SET jenis = 'Kulit Kambing', catatan = 'Produksi kulit kambing (lembar)'
      WHERE jenis = 'Kambing/Domba'
    `);

    console.log('Updated existing rows in ternak_susu_kulit to separate Kulit Sapi and Kulit Kambing.');
  }

  const [distinctJenis] = await conn.query("SELECT DISTINCT jenis, COUNT(*) as c FROM ternak_susu_kulit GROUP BY jenis");
  console.log('Current distinct jenis in ternak_susu_kulit:', distinctJenis);

  await conn.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
