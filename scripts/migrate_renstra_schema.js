import mysql from 'mysql2/promise';

async function migrate() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'pertasis';

  console.log(`[MIGRATE] Connecting to MySQL ${user}@${host}:${port}/${database}...`);
  const conn = await mysql.createConnection({ host, port, user, password, database });

  // 1. Backup existing table if exists and has data
  try {
    const [check] = await conn.query("SHOW TABLES LIKE 'renstra_target'");
    if (check.length > 0) {
      console.log('[MIGRATE] Backing up existing renstra_target to renstra_target_bak...');
      await conn.query("DROP TABLE IF EXISTS renstra_target_bak");
      await conn.query("CREATE TABLE renstra_target_bak AS SELECT * FROM renstra_target");
      console.log('[MIGRATE] Dropping old renstra_target table...');
      await conn.query("DROP TABLE renstra_target");
    }
  } catch (err) {
    console.warn('[MIGRATE] Backup warning:', err.message);
  }

  // 2. Create standard multi-year renstra_target table
  console.log('[MIGRATE] Creating updated renstra_target table...');
  const createSql = `
    CREATE TABLE IF NOT EXISTS \`renstra_target\` (
      \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`periode\` VARCHAR(20) NOT NULL COMMENT '2019-2022 atau 2025-2029',
      \`jenis_tabel\` ENUM('IKU', 'IKK', 'SASARAN_RENSTRA', 'PROGRAM_RPJMD') NOT NULL COMMENT 'Tingkatan indikator',
      \`kategori_sektor\` VARCHAR(50) NOT NULL COMMENT 'Pangan, Tanaman Pangan, Horti & Perkebunan, Peternakan, Perikanan, Tata Kelola',
      \`no_urut\` INT UNSIGNED NOT NULL,
      \`indikator\` VARCHAR(255) NOT NULL,
      \`satuan\` VARCHAR(50) NOT NULL,
      \`baseline_tahun\` INT UNSIGNED NOT NULL COMMENT '2017 atau 2024',
      \`baseline_nilai\` VARCHAR(50) NULL,
      \`t1\` VARCHAR(50) NULL COMMENT 'Target Th-1 (2018 atau 2025)',
      \`t2\` VARCHAR(50) NULL COMMENT 'Target Th-2 (2019 atau 2026)',
      \`t3\` VARCHAR(50) NULL COMMENT 'Target Th-3 (2020 atau 2027)',
      \`t4\` VARCHAR(50) NULL COMMENT 'Target Th-4 (2021 atau 2028)',
      \`t5\` VARCHAR(50) NULL COMMENT 'Target Th-5 (2022 atau 2029)',
      \`t6\` VARCHAR(50) NULL COMMENT 'Target Th-6 / Proyeksi Akhir (2030 jika ada)',
      \`sumber_tabel\` VARCHAR(50) NOT NULL COMMENT 'Tabel 4.1, Tabel 4.5, Tabel 4.7, Tabel 7.2',
      \`sumber_dokumen\` VARCHAR(150) NOT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_renstra_periode\` (\`periode\`),
      INDEX \`idx_renstra_sektor\` (\`kategori_sektor\`),
      INDEX \`idx_renstra_jenis\` (\`jenis_tabel\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  await conn.query(createSql);
  console.log('[MIGRATE] renstra_target table successfully created with multi-year schema.');

  const [desc] = await conn.query("DESCRIBE renstra_target");
  console.log('[MIGRATE] Current columns:', desc.map(d => d.Field));

  await conn.end();
  console.log('[MIGRATE] Done.');
}

migrate().catch(e => {
  console.error('[MIGRATE] Error:', e);
  process.exit(1);
});
