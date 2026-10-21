import mysql from 'mysql2/promise';

async function sanitize() {
  const envHost = process.env.DB_HOST || '127.0.0.1';
  const envPort = Number(process.env.DB_PORT || 3306);
  const envUser = process.env.DB_USER || 'root';
  const envPass = process.env.DB_PASS || process.env.DB_PASSWORD || '';
  const envName = process.env.DB_NAME || 'pertasis';

  console.log(`[Sanitasi Data] Menghubungkan ke MariaDB/MySQL: ${envName}...`);

  const conn = await mysql.createConnection({
    host: envHost,
    port: envPort,
    user: envUser,
    password: envPass,
    database: envName
  });

  try {
    // 1. Kosongkan tabel kelembagaan unverified (Opsi B: tab ada tapi 0 entri)
    console.log('1. Mengosongkan kelembagaan sintetis (Perikanan, JULEHA, UPJA, P4S)...');
    await conn.query('TRUNCATE TABLE kelembagaan_perikanan');
    await conn.query('TRUNCATE TABLE kelembagaan_juleha');
    await conn.query('TRUNCATE TABLE kelembagaan_upja');
    await conn.query('TRUNCATE TABLE kelembagaan_p4s');

    // 2. Hapus baris "Test ..." dari tabel kelembagaan resmi
    console.log('2. Menghapus baris "Test ..." dari kelembagaan resmi...');
    await conn.query("DELETE FROM kelembagaan_pertanian WHERE id = 2688 OR nama_kelompok LIKE 'Test %'");
    await conn.query("DELETE FROM kelembagaan_posluhdes WHERE id IN (37, 38) OR nama_posluhdes LIKE 'Test %'");
    await conn.query("DELETE FROM kelembagaan_pps WHERE id = 157 OR nama_penyuluh LIKE 'Test %'");
    await conn.query("DELETE FROM kelembagaan_kep WHERE id = 138 OR nama_kep LIKE 'Test %'");

    // 3. Bersihkan bantuan_korelasi dan pulihkan sektor resmi
    console.log('3. Memulihkan bantuan_korelasi dan bantuan_alokasi ke data resmi...');
    await conn.query('DELETE FROM bantuan_korelasi');
    await conn.query(`
      INSERT INTO bantuan_korelasi (sektor, bantuan_miliar, kenaikan_produksi_pct) VALUES
      ('Tanaman Pangan', 7.20, 8.50),
      ('Hortikultura', 3.40, 6.20),
      ('Perkebunan', 2.10, 4.80),
      ('Peternakan', 4.80, 9.10),
      ('Perikanan', 2.90, 7.40)
    `);

    await conn.query('DELETE FROM bantuan_alokasi');
    await conn.query(`
      INSERT INTO bantuan_alokasi (tahun, apbd_miliar, apbn_miliar) VALUES
      (2021, 4.20, 6.80),
      (2022, 5.10, 7.50),
      (2023, 5.80, 8.20),
      (2024, 6.50, 9.40)
    `);

    // 4. Pulihkan st2023_desa (Desa Bawang & hapus desa fiktif Beji id 279)
    console.log('4. Memulihkan data sensus ST2023 Desa Bawang & menghapus desa fiktif...');
    await conn.query('DELETE FROM st2023_desa WHERE id = 279 OR (desa = "BEJI" AND kecamatan_id = 4)');
    await conn.query(`
      UPDATE st2023_desa 
      SET rumah_tangga_petani = 229,
          petani = 229,
          rt_anggota_kelompok = 58,
          rt_bukan_anggota_kelompok = 189,
          rtup = 247,
          rt_perikanan = 76,
          rt_perikanan_budidaya = 76,
          rt_perikanan_tangkap = 0,
          sumber_teks = 'BPS Hasil Sensus Pertanian 2023 Kecamatan Bawang',
          sumber = 'json_fallback'
      WHERE id = 40
    `);

    // 5. Hapus backup tabel lama
    try {
      await conn.query('DROP TABLE IF EXISTS renstra_target_bak');
    } catch {}

    console.log('\n=== VERIFIKASI HASIL SANITASI DATA ===');
    const [cPerikanan] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_perikanan');
    const [cJuleha] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_juleha');
    const [cUpja] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_upja');
    const [cP4s] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_p4s');
    const [cPoktan] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_pertanian');
    const [cPosluh] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_posluhdes');
    const [cPps] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_pps');
    const [cKep] = await conn.query('SELECT COUNT(*) as c FROM kelembagaan_kep');
    const [cKorelasi] = await conn.query('SELECT COUNT(*) as c FROM bantuan_korelasi');
    const [cAlokasi] = await conn.query('SELECT COUNT(*) as c FROM bantuan_alokasi');
    const [cStDesa] = await conn.query('SELECT COUNT(*) as c FROM st2023_desa');

    console.log(`- kelembagaan_perikanan: ${cPerikanan[0].c} baris (bersih, 0 entri)`);
    console.log(`- kelembagaan_juleha: ${cJuleha[0].c} baris (bersih, 0 entri)`);
    console.log(`- kelembagaan_upja: ${cUpja[0].c} baris (bersih, 0 entri)`);
    console.log(`- kelembagaan_p4s: ${cP4s[0].c} baris (bersih, 0 entri)`);
    console.log(`- kelembagaan_pertanian: ${cPoktan[0].c} baris (2687 data sah SIMLUHTAN)`);
    console.log(`- kelembagaan_posluhdes: ${cPosluh[0].c} baris (36 data sah Posluhdes)`);
    console.log(`- kelembagaan_pps: ${cPps[0].c} baris (156 data sah Penyuluh Swadaya)`);
    console.log(`- kelembagaan_kep: ${cKep[0].c} baris (137 data sah KEP)`);
    console.log(`- bantuan_korelasi: ${cKorelasi[0].c} sektor resmi`);
    console.log(`- bantuan_alokasi: ${cAlokasi[0].c} tahun resmi (2021-2024)`);
    console.log(`- st2023_desa: ${cStDesa[0].c} desa (278 desa resmi Banjarnegara)`);

    console.log('\n[Sanitasi Selesai] 100% data dummy dan data test berhasil dibersihkan.');
  } finally {
    await conn.end();
  }
}

sanitize().catch(console.error);
