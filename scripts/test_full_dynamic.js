import { getPool } from '../src/db.js';

async function generateDynamicKomoditas() {
  const pool = getPool();

  console.log('Generating dynamic komoditas unggulan for all sectors...');

  // 1. PETERNAKAN: Ambil dari ternak_populasi (ekor), ternak_daging (kg -> ton), ternak_telur (butir), ternak_susu_kulit
  const [populasiRows] = await pool.query(`
    SELECT 
      'Peternakan' AS bidang,
      p.jenis AS komoditas,
      CONCAT('Populasi ', UPPER(p.kelompok)) AS kategori,
      'Ekor' AS satuan,
      k.nama AS kecamatan_sentra,
      tot.total_produksi AS produksi,
      0 AS luas_lahan,
      0 AS produktivitas,
      'Tersedia' AS ketersediaan_benih,
      p.tahun
    FROM (
      SELECT tahun, jenis, MAX(jumlah_ekor) as max_val
      FROM ternak_populasi
      WHERE jumlah_ekor > 0
      GROUP BY tahun, jenis
    ) sub
    JOIN ternak_populasi p ON p.tahun = sub.tahun AND p.jenis = sub.jenis AND p.jumlah_ekor = sub.max_val
    JOIN kecamatan k ON p.kecamatan_id = k.id
    JOIN (
      SELECT tahun, jenis, SUM(jumlah_ekor) as total_produksi
      FROM ternak_populasi
      WHERE jumlah_ekor > 0
      GROUP BY tahun, jenis
    ) tot ON tot.tahun = sub.tahun AND tot.jenis = sub.jenis
    GROUP BY p.tahun, p.jenis
  `);

  const [dagingRows] = await pool.query(`
    SELECT 
      'Peternakan' AS bidang,
      CONCAT('Daging ', d.jenis) AS komoditas,
      'Produksi Daging' AS kategori,
      'Ton' AS satuan,
      k.nama AS kecamatan_sentra,
      ROUND(tot.total_produksi / 1000, 2) AS produksi,
      0 AS luas_lahan,
      0 AS produktivitas,
      'Tersedia' AS ketersediaan_benih,
      d.tahun
    FROM (
      SELECT tahun, jenis, MAX(produksi_kg) as max_val
      FROM ternak_daging
      WHERE produksi_kg > 0
      GROUP BY tahun, jenis
    ) sub
    JOIN ternak_daging d ON d.tahun = sub.tahun AND d.jenis = sub.jenis AND d.produksi_kg = sub.max_val
    JOIN kecamatan k ON d.kecamatan_id = k.id
    JOIN (
      SELECT tahun, jenis, SUM(produksi_kg) as total_produksi
      FROM ternak_daging
      WHERE produksi_kg > 0
      GROUP BY tahun, jenis
    ) tot ON tot.tahun = sub.tahun AND tot.jenis = sub.jenis
    GROUP BY d.tahun, d.jenis
  `);

  console.log('Peternakan populasi records:', populasiRows.length);
  console.log('Peternakan daging records:', dagingRows.length);

  // 2. PERIKANAN: 10 jenis ikan dari ikan_produksi_jenis + sentra dari ikan_budidaya
  const [topKecPerikanan] = await pool.query(`
    SELECT tahun, k.nama as sentra_kec
    FROM (
      SELECT tahun, kecamatan_id, MAX(tot_prod)
      FROM (
        SELECT tahun, kecamatan_id, SUM(produksi_kg) as tot_prod
        FROM ikan_budidaya
        WHERE produksi_kg > 0
        GROUP BY tahun, kecamatan_id
      ) t
      GROUP BY tahun
    ) m
    JOIN kecamatan k ON m.kecamatan_id = k.id
  `);
  const sentraPerikananMap = Object.fromEntries(topKecPerikanan.map(r => [r.tahun, r.sentra_kec]));

  const [ikanRows] = await pool.query(`
    SELECT 
      'Perikanan' AS bidang,
      jenis_ikan AS komoditas,
      'Budidaya Air Tawar' AS kategori,
      'Ton' AS satuan,
      ROUND(produksi_kg / 1000, 2) AS produksi,
      ROUND(luas_ha, 2) AS luas_lahan,
      ROUND(produksi_kg / 1000 / NULLIF(luas_ha, 0), 2) AS produktivitas,
      'Tersedia' AS ketersediaan_benih,
      tahun
    FROM ikan_produksi_jenis
    WHERE produksi_kg > 0
  `);

  const ikanProcessed = ikanRows.map(r => ({
    ...r,
    kecamatan: sentraPerikananMap[r.tahun] || 'Purwanegara / Banjarnegara'
  }));
  console.log('Perikanan processed records:', ikanProcessed.length);

  // 3. PANGAN: Padi & Palawija
  const [padiRows] = await pool.query(`
    SELECT 
      'Tanaman Pangan' AS bidang,
      p.komoditas,
      'Padi & Palawija' AS kategori,
      'Ton' AS satuan,
      k.nama AS kecamatan_sentra,
      ROUND(tot.total_produksi, 2) AS produksi,
      ROUND(tot.total_luas, 2) AS luas_lahan,
      ROUND(tot.total_produksi / NULLIF(tot.total_luas, 0) * 10, 2) AS produktivitas,
      'Tersedia' AS ketersediaan_benih,
      p.tahun
    FROM (
      SELECT tahun, komoditas, MAX(produksi_ton) as max_val
      FROM (
        SELECT tahun, 'Padi Sawah' as komoditas, produksi_ton, kecamatan_id FROM padi_produksi WHERE sub_tipe = 'sawah'
        UNION ALL
        SELECT tahun, 'Padi Ladang' as komoditas, produksi_ton, kecamatan_id FROM padi_produksi WHERE sub_tipe = 'ladang'
        UNION ALL
        SELECT tahun, komoditas, produksi_ton, kecamatan_id FROM palawija_produksi
      ) raw_p
      WHERE produksi_ton > 0
      GROUP BY tahun, komoditas
    ) sub
    JOIN (
      SELECT tahun, 'Padi Sawah' as komoditas, produksi_ton, luas_panen_ha, kecamatan_id FROM padi_produksi WHERE sub_tipe = 'sawah'
      UNION ALL
      SELECT tahun, 'Padi Ladang' as komoditas, produksi_ton, luas_panen_ha, kecamatan_id FROM padi_produksi WHERE sub_tipe = 'ladang'
      UNION ALL
      SELECT tahun, komoditas, produksi_ton, luas_panen_ha, kecamatan_id FROM palawija_produksi
    ) p ON p.tahun = sub.tahun AND p.komoditas = sub.komoditas AND p.produksi_ton = sub.max_val
    JOIN kecamatan k ON p.kecamatan_id = k.id
    JOIN (
      SELECT tahun, komoditas, SUM(produksi_ton) as total_produksi, SUM(luas_panen_ha) as total_luas
      FROM (
        SELECT tahun, 'Padi Sawah' as komoditas, produksi_ton, luas_panen_ha FROM padi_produksi WHERE sub_tipe = 'sawah'
        UNION ALL
        SELECT tahun, 'Padi Ladang' as komoditas, produksi_ton, luas_panen_ha FROM padi_produksi WHERE sub_tipe = 'ladang'
        UNION ALL
        SELECT tahun, komoditas, produksi_ton, luas_panen_ha FROM palawija_produksi
      ) raw_tot
      WHERE produksi_ton > 0
      GROUP BY tahun, komoditas
    ) tot ON tot.tahun = sub.tahun AND tot.komoditas = sub.komoditas
    GROUP BY p.tahun, p.komoditas
  `);
  console.log('Pangan records:', padiRows.length);

  // 4. HORTIKULTURA
  const [hortiRows] = await pool.query(`
    SELECT 
      'Hortikultura' AS bidang,
      h.komoditas,
      'Sayuran & Buah' AS kategori,
      'Ton' AS satuan,
      k.nama AS kecamatan_sentra,
      ROUND(tot.total_produksi, 2) AS produksi,
      ROUND(tot.total_luas, 2) AS luas_lahan,
      ROUND(tot.total_produksi / NULLIF(tot.total_luas, 0) * 10, 2) AS produktivitas,
      'Tersedia' AS ketersediaan_benih,
      h.tahun
    FROM (
      SELECT tahun, komoditas, MAX(nilai) as max_val
      FROM horti_produksi
      WHERE nilai > 0 AND satuan = 'ton'
      GROUP BY tahun, komoditas
    ) sub
    JOIN horti_produksi h ON h.tahun = sub.tahun AND h.komoditas = sub.komoditas AND h.nilai = sub.max_val AND h.satuan = 'ton'
    JOIN kecamatan k ON h.kecamatan_id = k.id
    JOIN (
      SELECT tahun, komoditas, SUM(nilai) as total_produksi, 0 as total_luas
      FROM horti_produksi
      WHERE nilai > 0 AND satuan = 'ton'
      GROUP BY tahun, komoditas
    ) tot ON tot.tahun = sub.tahun AND tot.komoditas = sub.komoditas
    GROUP BY h.tahun, h.komoditas
  `);
  console.log('Hortikultura records:', hortiRows.length);

  // 5. PERKEBUNAN
  const [kebunRows] = await pool.query(`
    SELECT 
      'Perkebunan' AS bidang,
      pk.tanaman AS komoditas,
      'Tanaman Perkebunan' AS kategori,
      'Ton' AS satuan,
      k.nama AS kecamatan_sentra,
      ROUND(tot.total_produksi, 2) AS produksi,
      ROUND(tot.total_luas, 2) AS luas_lahan,
      ROUND(tot.total_produksi / NULLIF(tot.total_luas, 0) * 10, 2) AS produktivitas,
      'Tersedia' AS ketersediaan_benih,
      pk.tahun
    FROM (
      SELECT tahun, tanaman, MAX(produksi_ton) as max_val
      FROM perkebunan_produksi
      WHERE produksi_ton > 0
      GROUP BY tahun, tanaman
    ) sub
    JOIN perkebunan_produksi pk ON pk.tahun = sub.tahun AND pk.tanaman = sub.tanaman AND pk.produksi_ton = sub.max_val
    JOIN kecamatan k ON pk.kecamatan_id = k.id
    JOIN (
      SELECT tahun, tanaman, SUM(produksi_ton) as total_produksi, SUM(luas_ha) as total_luas
      FROM perkebunan_produksi
      WHERE produksi_ton > 0
      GROUP BY tahun, tanaman
    ) tot ON tot.tahun = sub.tahun AND tot.tanaman = sub.tanaman
    GROUP BY pk.tahun, pk.tanaman
  `);
  console.log('Perkebunan records:', kebunRows.length);

  const totalAll = populasiRows.length + dagingRows.length + ikanProcessed.length + padiRows.length + hortiRows.length + kebunRows.length;
  console.log('TOTAL SEMUA KOMODITAS UNGGULAN DINAMIS:', totalAll);

  process.exit(0);
}

generateDynamicKomoditas().catch(console.error);
