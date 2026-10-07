import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
  const raw = fs.readFileSync('dist/kelembagaan/rekapitulasi_cleaned.json', 'utf8');
  const items = JSON.parse(raw);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pertasis'
  });

  await conn.query('TRUNCATE TABLE kelembagaan_rekap_kecamatan');

  const rowsToInsert = items.map(d => [
    d.no,
    d.kecamatan,
    d.desa,
    d.gapoktan,
    d.poktan,
    d.pemula,
    d.lanjut,
    d.madya,
    d.utama
  ]);

  const sql = `
    INSERT INTO kelembagaan_rekap_kecamatan 
    (no_urut, kecamatan, jumlah_desa, jumlah_gapoktan, jumlah_poktan, kelas_pemula, kelas_lanjut, kelas_madya, kelas_utama)
    VALUES ?
  `;

  await conn.query(sql, [rowsToInsert]);
  console.log(`Berhasil insert ${rowsToInsert.length} data kecamatan ke kelembagaan_rekap_kecamatan.`);

  const [verify] = await conn.query('SELECT count(*) as total, sum(jumlah_desa) as total_desa, sum(jumlah_gapoktan) as total_gapoktan, sum(jumlah_poktan) as total_poktan, sum(kelas_pemula) as p, sum(kelas_lanjut) as l, sum(kelas_madya) as m, sum(kelas_utama) as u FROM kelembagaan_rekap_kecamatan');
  console.log('Verifikasi data:', verify[0]);

  await conn.end();
}

main().catch(err => {
  console.error("Error seeding rekap:", err);
  process.exit(1);
});
