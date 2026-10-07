import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pertasis'
  });

  console.log("Membuat tabel kelembagaan_rekap_kecamatan...");
  await conn.query(`
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

  console.log("Tabel kelembagaan_rekap_kecamatan berhasil dipastikan.");
  await conn.end();
}

main().catch(err => {
  console.error("Error creating table:", err);
  process.exit(1);
});
