import { getPool } from '../db.js';

/**
 * Mengambil data komoditas unggulan secara DINAMIS dari database operasional riil:
 * - Peternakan: ternak_populasi, ternak_daging, ternak_telur, ternak_susu_kulit
 * - Perikanan: ikan_produksi_jenis, ikan_budidaya
 * - Tanaman Pangan: padi_produksi, palawija_produksi
 * - Hortikultura: horti_produksi
 * - Perkebunan: perkebunan_produksi
 * - Plus data kustom dinas dari tabel komoditas_unggulan
 */
export async function getDynamicKomoditasUnggulan() {
  const pool = getPool();
  const results = [];

  try {
    // 1. PETERNAKAN: Populasi Ternak (Ekor) per spesies & kecamatan sentra
    const [peternakanPopulasi] = await pool.query(`
      SELECT 
        'Peternakan' AS bidang,
        p.jenis AS komoditas,
        CONCAT('Ternak ', UPPER(SUBSTRING(p.kelompok, 1, 1)), LOWER(SUBSTRING(p.kelompok, 2))) AS varietas,
        k.nama AS kecamatan,
        0 AS luas_lahan,
        0 AS produktivitas,
        ROUND(tot.total_produksi, 1) AS produksi,
        'Ekor' AS satuan,
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
    results.push(...peternakanPopulasi);

    // 2. PETERNAKAN: Produksi Daging (Ton)
    const [peternakanDaging] = await pool.query(`
      SELECT 
        'Peternakan' AS bidang,
        CONCAT('Daging ', d.jenis) AS komoditas,
        'Daging Karkas' AS varietas,
        k.nama AS kecamatan,
        0 AS luas_lahan,
        0 AS produktivitas,
        ROUND(tot.total_produksi / 1000, 2) AS produksi,
        'Ton' AS satuan,
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
    results.push(...peternakanDaging);

    // 3. PERIKANAN: 10 Jenis Ikan Air Tawar dari ikan_produksi_jenis & sentra dari ikan_budidaya
    const [topKecPerikanan] = await pool.query(`
      SELECT tahun, k.nama as sentra_kec
      FROM (
        SELECT tahun, kecamatan_id
        FROM (
          SELECT tahun, kecamatan_id, SUM(produksi_kg) as tot_prod
          FROM ikan_budidaya
          WHERE produksi_kg > 0
          GROUP BY tahun, kecamatan_id
          ORDER BY tot_prod DESC
        ) t
        GROUP BY tahun
      ) m
      JOIN kecamatan k ON m.kecamatan_id = k.id
    `);
    const sentraIkanMap = Object.fromEntries(topKecPerikanan.map(r => [r.tahun, r.sentra_kec]));

    const [perikananRows] = await pool.query(`
      SELECT 
        'Perikanan' AS bidang,
        jenis_ikan AS komoditas,
        'Air Tawar' AS varietas,
        ROUND(COALESCE(luas_ha, 0), 2) AS luas_lahan,
        ROUND(produksi_kg / 1000 / NULLIF(luas_ha, 0), 2) AS produktivitas,
        ROUND(produksi_kg / 1000, 2) AS produksi,
        'Ton' AS satuan,
        'Tersedia' AS ketersediaan_benih,
        tahun
      FROM ikan_produksi_jenis
      WHERE produksi_kg > 0
    `);

    for (const r of perikananRows) {
      results.push({
        ...r,
        kecamatan: sentraIkanMap[r.tahun] || 'Purwanegara / Banjarnegara'
      });
    }

    // 4. TANAMAN PANGAN: Padi & Palawija
    const [panganRows] = await pool.query(`
      SELECT 
        'Tanaman Pangan' AS bidang,
        p.komoditas,
        p.jenis AS varietas,
        k.nama AS kecamatan,
        ROUND(tot.total_luas, 2) AS luas_lahan,
        ROUND(tot.total_produksi / NULLIF(tot.total_luas, 0) * 10, 2) AS produktivitas,
        ROUND(tot.total_produksi, 2) AS produksi,
        'Ton' AS satuan,
        'Tersedia' AS ketersediaan_benih,
        p.tahun
      FROM (
        SELECT tahun, komoditas, MAX(produksi_ton) as max_val
        FROM (
          SELECT tahun, 'Padi' as komoditas, jenis, produksi_ton, kecamatan_id FROM padi_produksi
          UNION ALL
          SELECT tahun, komoditas, 'Lokal' as jenis, produksi_ton, kecamatan_id FROM palawija_produksi
        ) raw_p
        WHERE produksi_ton > 0
        GROUP BY tahun, komoditas
      ) sub
      JOIN (
        SELECT tahun, 'Padi' as komoditas, jenis, produksi_ton, luas_panen_ha, kecamatan_id FROM padi_produksi
        UNION ALL
        SELECT tahun, komoditas, 'Lokal' as jenis, produksi_ton, luas_panen_ha, kecamatan_id FROM palawija_produksi
      ) p ON p.tahun = sub.tahun AND p.komoditas = sub.komoditas AND p.produksi_ton = sub.max_val
      JOIN kecamatan k ON p.kecamatan_id = k.id
      JOIN (
        SELECT tahun, komoditas, SUM(produksi_ton) as total_produksi, SUM(luas_panen_ha) as total_luas
        FROM (
          SELECT tahun, 'Padi' as komoditas, produksi_ton, luas_panen_ha FROM padi_produksi
          UNION ALL
          SELECT tahun, komoditas, produksi_ton, luas_panen_ha FROM palawija_produksi
        ) raw_tot
        WHERE produksi_ton > 0
        GROUP BY tahun, komoditas
      ) tot ON tot.tahun = sub.tahun AND tot.komoditas = sub.komoditas
      GROUP BY p.tahun, p.komoditas
    `);
    results.push(...panganRows);

    // 5. HORTIKULTURA: Sayuran & Buah (Ton)
    const [hortiRows] = await pool.query(`
      SELECT 
        'Hortikultura' AS bidang,
        h.komoditas,
        CASE 
          WHEN h.kelompok = 'sayuran' THEN 'Sayuran'
          WHEN h.kelompok = 'buah_tahunan' THEN 'Buah-Buahan'
          ELSE 'Hortikultura'
        END AS varietas,
        k.nama AS kecamatan,
        0 AS luas_lahan,
        0 AS produktivitas,
        ROUND(tot.total_produksi, 2) AS produksi,
        'Ton' AS satuan,
        'Tersedia' AS ketersediaan_benih,
        h.tahun
      FROM (
        SELECT tahun, komoditas, MAX(nilai) as max_val
        FROM horti_produksi
        WHERE nilai > 0
        GROUP BY tahun, komoditas
      ) sub
      JOIN horti_produksi h ON h.tahun = sub.tahun AND h.komoditas = sub.komoditas AND h.nilai = sub.max_val
      JOIN kecamatan k ON h.kecamatan_id = k.id
      JOIN (
        SELECT tahun, komoditas, SUM(nilai) as total_produksi
        FROM horti_produksi
        WHERE nilai > 0
        GROUP BY tahun, komoditas
      ) tot ON tot.tahun = sub.tahun AND tot.komoditas = sub.komoditas
      GROUP BY h.tahun, h.komoditas
    `);
    results.push(...hortiRows);

    // 5b. HORTIKULTURA: Biofarmaka / Tanaman Obat (Jahe, Kunyit, Kencur, Laos - Tangkai/Kg)
    const [biofarmakaRows] = await pool.query(`
      SELECT 
        'Hortikultura' AS bidang,
        h.komoditas,
        'Biofarmaka / Tanaman Obat' AS varietas,
        k.nama AS kecamatan,
        0 AS luas_lahan,
        0 AS produktivitas,
        ROUND(tot.total_produksi, 1) AS produksi,
        'Tangkai/Kg' AS satuan,
        'Tersedia' AS ketersediaan_benih,
        h.tahun
      FROM (
        SELECT tahun, komoditas, MAX(nilai) as max_val
        FROM horti_produksi
        WHERE nilai > 0 AND kelompok = 'biofarmaka'
        GROUP BY tahun, komoditas
      ) sub
      JOIN horti_produksi h ON h.tahun = sub.tahun AND h.komoditas = sub.komoditas AND h.nilai = sub.max_val AND h.kelompok = 'biofarmaka'
      JOIN kecamatan k ON h.kecamatan_id = k.id
      JOIN (
        SELECT tahun, komoditas, SUM(nilai) as total_produksi
        FROM horti_produksi
        WHERE nilai > 0 AND kelompok = 'biofarmaka'
        GROUP BY tahun, komoditas
      ) tot ON tot.tahun = sub.tahun AND tot.komoditas = sub.komoditas
      GROUP BY h.tahun, h.komoditas
    `);
    results.push(...biofarmakaRows);

    // 5c. HORTIKULTURA: Tanaman Hias / Florikultura (Tangkai)
    const [tanamanHiasRows] = await pool.query(`
      SELECT 
        'Hortikultura' AS bidang,
        h.komoditas,
        'Tanaman Hias / Florikultura' AS varietas,
        k.nama AS kecamatan,
        0 AS luas_lahan,
        0 AS produktivitas,
        ROUND(tot.total_produksi, 1) AS produksi,
        'Tangkai' AS satuan,
        'Tersedia' AS ketersediaan_benih,
        h.tahun
      FROM (
        SELECT tahun, komoditas, MAX(nilai) as max_val
        FROM horti_produksi
        WHERE nilai > 0 AND kelompok = 'tanaman_hias'
        GROUP BY tahun, komoditas
      ) sub
      JOIN horti_produksi h ON h.tahun = sub.tahun AND h.komoditas = sub.komoditas AND h.nilai = sub.max_val AND h.kelompok = 'tanaman_hias'
      JOIN kecamatan k ON h.kecamatan_id = k.id
      JOIN (
        SELECT tahun, komoditas, SUM(nilai) as total_produksi
        FROM horti_produksi
        WHERE nilai > 0 AND kelompok = 'tanaman_hias'
        GROUP BY tahun, komoditas
      ) tot ON tot.tahun = sub.tahun AND tot.komoditas = sub.komoditas
      GROUP BY h.tahun, h.komoditas
    `);
    results.push(...tanamanHiasRows);

    // 6. PERKEBUNAN: Kopi, Teh, Kelapa, dll.
    const [perkebunanRows] = await pool.query(`
      SELECT 
        'Perkebunan' AS bidang,
        pk.tanaman AS komoditas,
        'Unggulan' AS varietas,
        k.nama AS kecamatan,
        ROUND(COALESCE(ar.total_luas, 0), 2) AS luas_lahan,
        ROUND(tot.total_produksi / NULLIF(ar.total_luas, 0) * 10, 2) AS produktivitas,
        ROUND(tot.total_produksi, 2) AS produksi,
        'Ton' AS satuan,
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
        SELECT tahun, tanaman, SUM(produksi_ton) as total_produksi
        FROM perkebunan_produksi
        WHERE produksi_ton > 0
        GROUP BY tahun, tanaman
      ) tot ON tot.tahun = sub.tahun AND tot.tanaman = sub.tanaman
      LEFT JOIN (
        SELECT tahun, tanaman, SUM(luas_ha) as total_luas
        FROM perkebunan_areal
        GROUP BY tahun, tanaman
      ) ar ON ar.tahun = sub.tahun AND ar.tanaman = sub.tanaman
      GROUP BY pk.tahun, pk.tanaman
    `);
    results.push(...perkebunanRows);

    // 7. KOMODITAS TAMBAHAN DARI TABEL komoditas_unggulan (jika ada entri manual dari admin yang belum ter-cover)
    const [kustomRows] = await pool.query(`
      SELECT 
        CASE 
          WHEN sektor = 'pangan' THEN 'Tanaman Pangan'
          WHEN sektor = 'hortikultura' THEN 'Hortikultura'
          WHEN sektor = 'perkebunan' THEN 'Perkebunan'
          WHEN sektor = 'peternakan' THEN 'Peternakan'
          WHEN sektor = 'perikanan' THEN 'Perikanan'
          ELSE sektor
        END AS bidang,
        nama_komoditas AS komoditas,
        COALESCE(varietas, 'Spesifik Dinas') AS varietas,
        COALESCE(kecamatan, sentra, 'Kabupaten Banjarnegara') AS kecamatan,
        COALESCE(luas_lahan, 0) AS luas_lahan,
        COALESCE(produktivitas, 0) AS produktivitas,
        ROUND(COALESCE(produksi, volume, 0), 2) AS produksi,
        COALESCE(satuan, 'Ton') AS satuan,
        COALESCE(ketersediaan_benih, 'Tersedia') AS ketersediaan_benih,
        tahun
      FROM komoditas_unggulan
      WHERE (produksi > 0 OR volume > 0)
    `);

    // Tambahkan entri kustom jika belum ada di results untuk bidang, komoditas, dan tahun yang sama
    for (const kr of kustomRows) {
      const exists = results.some(r => 
        r.bidang === kr.bidang && 
        r.komoditas.toLowerCase() === kr.komoditas.toLowerCase() && 
        Number(r.tahun) === Number(kr.tahun)
      );
      if (!exists) {
        results.push(kr);
      }
    }

  } catch (err) {
    console.error('Error fetching dynamic komoditas:', err);
  }

  return results;
}
