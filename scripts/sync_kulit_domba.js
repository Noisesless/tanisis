import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  // Ambil data pemotongan domba riil
  const [luarRphDomba] = await conn.query(`
    SELECT kecamatan_id, tahun, jumlah_ekor FROM ternak_pemotongan 
    WHERE jenis = 'Domba' AND jumlah_ekor > 0
  `);

  for (const r of luarRphDomba) {
    // cek apakah sudah ada
    const [exist] = await conn.query(`
      SELECT id FROM ternak_susu_kulit WHERE kecamatan_id = ? AND tahun = ? AND jenis = 'Kulit Domba'
    `, [r.kecamatan_id, r.tahun]);
    if (exist.length === 0) {
      await conn.query(`
        INSERT INTO ternak_susu_kulit (kecamatan_id, jenis, tahun, nilai, catatan, sumber)
        VALUES (?, 'Kulit Domba', ?, ?, 'Produksi kulit domba riil (lembar)', 'manual')
      `, [r.kecamatan_id, r.tahun, r.jumlah_ekor]);
    }
  }
  console.log('Processed', luarRphDomba.length, 'records for Kulit Domba.');

  const [res] = await conn.query('SELECT DISTINCT jenis, COUNT(*) as c FROM ternak_susu_kulit GROUP BY jenis');
  console.log('Distinct jenis in ternak_susu_kulit:', res);

  await conn.end();
}

main().catch(console.error);
