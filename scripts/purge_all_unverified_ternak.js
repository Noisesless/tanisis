import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pertasis'
  });

  await conn.query('DELETE FROM ternak_poultry_shop');
  await conn.query('DELETE FROM ternak_umkm_pakan');
  await conn.query('DELETE FROM ternak_nkv');

  const [countPoultry] = await conn.query('SELECT COUNT(*) as c FROM ternak_poultry_shop');
  const [countPakan] = await conn.query('SELECT COUNT(*) as c FROM ternak_umkm_pakan');
  const [countNkv] = await conn.query('SELECT COUNT(*) as c FROM ternak_nkv');

  console.log('Semua tabel ekosistem telah dikosongkan secara total:', {
    ternak_poultry_shop: countPoultry[0].c,
    ternak_umkm_pakan: countPakan[0].c,
    ternak_nkv: countNkv[0].c
  });

  await conn.end();
}

main().catch(console.error);
